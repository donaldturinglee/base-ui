import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import {
    PANE_MAX_WIDTH_DIFF,
    PANE_MAX_WIDTH_DIFF_BREAKPOINT,
    SIDEBAR_MAX_WIDTH_DIFF,
    SSR_DEFAULT_MAX_WIDTH,
    getDefaultPaneWidth,
    getMaxWidthDiffFromViewport,
    isCustomWidthOptions,
    paneWidthStorage,
    updateAriaValues,
} from "./paneUtils";
import type { UsePaneWidthOptions, UsePaneWidthResult } from "./PageLayout.types";

// Holds the width of a resizable pane: where it starts, what it is allowed to be, and where
// it is kept between visits
export const usePaneWidth = ({
    width,
    minWidth,
    resizable,
    widthStorageKey,
    paneRef,
    handleRef,
    contentWrapperRef,
    constrainToViewport = false,
    onResizeEnd,
    currentWidth: controlledWidth,
}: UsePaneWidthOptions): UsePaneWidthResult => {
    const isCustomWidth = isCustomWidthOptions(width);
    const minPaneWidth = isCustomWidth ? parseInt(width.min, 10) : minWidth;
    const customMaxWidth = isCustomWidth ? parseInt(width.max, 10) : null;
    const defaultWidth = React.useMemo(() => getDefaultPaneWidth(width), [width]);

    // The props a drag reads are held in refs, so the handlers stay the same between renders
    const widthStorageKeyRef = React.useRef(widthStorageKey);
    const onResizeEndRef = React.useRef(onResizeEnd);

    useIsomorphicLayoutEffect(() => {
        widthStorageKeyRef.current = widthStorageKey;
        onResizeEndRef.current = onResizeEnd;
    });

    // Cached rather than read back from the element, since reading would force the browser
    // to lay the page out again on every move
    const maxWidthDiffRef = React.useRef(
        constrainToViewport ? SIDEBAR_MAX_WIDTH_DIFF : PANE_MAX_WIDTH_DIFF,
    );

    const getMaxPaneWidth = React.useCallback(() => {
        const viewportWidth = window.innerWidth;
        const viewportMax =
            viewportWidth > 0
                ? Math.max(minPaneWidth, viewportWidth - maxWidthDiffRef.current)
                : minPaneWidth;

        if (customMaxWidth !== null) {
            return constrainToViewport ? Math.min(customMaxWidth, viewportMax) : customMaxWidth;
        }

        return viewportMax;
    }, [customMaxWidth, minPaneWidth, constrainToViewport]);

    // The width the pane opens at: the one it is held to, then the one it was left at, then
    // the one its size asks for
    const [widthState, setWidthState] = React.useState(() => {
        if (typeof controlledWidth === "number") {
            return controlledWidth;
        }

        const usesStorage =
            onResizeEnd === undefined && resizable === true && widthStorageKey !== undefined;

        if (usesStorage) {
            return paneWidthStorage.get(widthStorageKey) ?? defaultWidth;
        }

        return defaultWidth;
    });

    const [previousDefaultWidth, setPreviousDefaultWidth] = React.useState(defaultWidth);
    const [previousControlledWidth, setPreviousControlledWidth] = React.useState(controlledWidth);

    const controlledWidthChanged = controlledWidth !== previousControlledWidth;

    if (controlledWidthChanged) {
        setPreviousControlledWidth(controlledWidth);

        if (typeof controlledWidth === "number") {
            setWidthState(controlledWidth);
        } else if (previousControlledWidth !== undefined) {
            // The caller has let go of the width, so it falls back to the one its size asks
            // for
            setWidthState(defaultWidth);
        }
    }

    if (defaultWidth !== previousDefaultWidth) {
        setPreviousDefaultWidth(defaultWidth);

        if (controlledWidth === undefined && !controlledWidthChanged) {
            setWidthState(defaultWidth);
        }
    }

    const currentWidth = controlledWidth ?? widthState;
    const currentWidthRef = React.useRef(currentWidth);
    const [maxPaneWidth, setMaxPaneWidth] = React.useState(
        () => customMaxWidth ?? SSR_DEFAULT_MAX_WIDTH,
    );
    const maxPaneWidthRef = React.useRef(maxPaneWidth);

    useIsomorphicLayoutEffect(() => {
        currentWidthRef.current = currentWidth;
    }, [currentWidth]);

    const getDefaultWidth = React.useCallback(() => getDefaultPaneWidth(width), [width]);

    const saveWidth = React.useCallback(
        (value: number) => {
            // A fraction of a pixel means nothing to keep or to announce
            const rounded = Math.round(value);

            currentWidthRef.current = rounded;

            // The pane already shows the new width, so catching React up can wait
            React.startTransition(() => {
                setWidthState(rounded);
            });

            if (onResizeEndRef.current) {
                onResizeEndRef.current(rounded);
                return;
            }

            if (resizable && widthStorageKeyRef.current) {
                paneWidthStorage.save(widthStorageKeyRef.current, rounded);
            }
        },
        [resizable],
    );

    const getMaxPaneWidthRef = React.useRef(getMaxPaneWidth);

    useIsomorphicLayoutEffect(() => {
        getMaxPaneWidthRef.current = getMaxPaneWidth;
    });

    // Works out what the widest pane may be, on arrival and again as the viewport changes
    useIsomorphicLayoutEffect(() => {
        if (!resizable) {
            return;
        }

        let lastViewportWidth = window.innerWidth;

        const sync = () => {
            const viewportWidth = window.innerWidth;
            // The reserved width only changes at the one breakpoint, so it is worked out
            // again only where that has been crossed
            const crossedBreakpoint =
                lastViewportWidth < PANE_MAX_WIDTH_DIFF_BREAKPOINT !==
                viewportWidth < PANE_MAX_WIDTH_DIFF_BREAKPOINT;

            lastViewportWidth = viewportWidth;

            if (crossedBreakpoint) {
                maxWidthDiffRef.current = getMaxWidthDiffFromViewport();
            }

            const max = getMaxPaneWidthRef.current();

            paneRef.current?.style.setProperty("--pane-max-width", `${max}px`);

            const wasClamped = currentWidthRef.current > max;

            if (wasClamped) {
                currentWidthRef.current = max;
                paneRef.current?.style.setProperty("--pane-width", `${max}px`);
            }

            updateAriaValues(handleRef.current, { max, current: currentWidthRef.current });

            // A transition never bails out on an unchanged value, so the guard is here
            // rather than left to React
            if (max !== maxPaneWidthRef.current || wasClamped) {
                maxPaneWidthRef.current = max;

                React.startTransition(() => {
                    setMaxPaneWidth(max);

                    if (wasClamped) {
                        setWidthState(max);
                    }
                });
            }
        };

        maxWidthDiffRef.current = getMaxWidthDiffFromViewport();

        const initialMax = getMaxPaneWidthRef.current();

        maxPaneWidthRef.current = initialMax;
        paneRef.current?.style.setProperty("--pane-max-width", `${initialMax}px`);
        updateAriaValues(handleRef.current, {
            min: minPaneWidth,
            max: initialMax,
            current: currentWidthRef.current,
        });

        React.startTransition(() => {
            setMaxPaneWidth(initialMax);
        });

        // A width of the caller's own that is not held to the viewport never changes, so
        // there is nothing to listen for
        if (customMaxWidth !== null && !constrainToViewport) {
            return;
        }

        // One update a frame while the viewport moves, and the containment comes off once
        // it has settled
        const THROTTLE_MS = 16;
        const SETTLE_MS = 150;

        let lastUpdate = 0;
        let frame: number | null = null;
        let settle: ReturnType<typeof setTimeout> | null = null;
        let isResizing = false;

        const startResizing = () => {
            if (isResizing) {
                return;
            }

            isResizing = true;
            paneRef.current?.setAttribute("data-dragging", "true");
            contentWrapperRef?.current?.setAttribute("data-dragging", "true");
        };

        const endResizing = () => {
            if (!isResizing) {
                return;
            }

            isResizing = false;
            paneRef.current?.removeAttribute("data-dragging");
            contentWrapperRef?.current?.removeAttribute("data-dragging");
        };

        const handleResize = () => {
            startResizing();

            const now = performance.now();

            if (now - lastUpdate >= THROTTLE_MS) {
                lastUpdate = now;
                sync();
            } else if (frame === null) {
                frame = requestAnimationFrame(() => {
                    frame = null;
                    lastUpdate = performance.now();
                    sync();
                });
            }

            if (settle !== null) {
                clearTimeout(settle);
            }

            settle = setTimeout(endResizing, SETTLE_MS);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            if (frame !== null) {
                cancelAnimationFrame(frame);
            }

            if (settle !== null) {
                clearTimeout(settle);
            }

            endResizing();
            window.removeEventListener("resize", handleResize);
        };
    }, [
        resizable,
        customMaxWidth,
        constrainToViewport,
        minPaneWidth,
        paneRef,
        handleRef,
        contentWrapperRef,
    ]);

    return {
        currentWidth,
        currentWidthRef,
        minPaneWidth,
        maxPaneWidth,
        getMaxPaneWidth,
        getDefaultWidth,
        saveWidth,
    };
};
