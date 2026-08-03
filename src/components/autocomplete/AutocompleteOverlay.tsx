import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames, cva } from "../../utilities/classnames";
import { Portal } from "../portal";
import { getAnchoredPosition } from "../tooltip/anchoredPosition";
import { AutocompleteContext } from "./AutocompleteContext";
import type { AnchoredPosition } from "../tooltip/anchoredPosition";
import type {
    AutocompleteOverlayHeight,
    AutocompleteOverlayMaxHeight,
    AutocompleteOverlayProps,
    AutocompleteOverlayWidth,
} from "./Autocomplete.types";

const classes = {
    hidden: "sr-only",
};

const autocompleteOverlayVariants = cva(
    [
        "autocomplete-overlay",
        // It arrives from the edge of the field it stands off, which says where it came from
        "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-short motion-safe:data-[side=outside-bottom]:slide-in-from-top-2 motion-safe:data-[side=outside-top]:slide-in-from-bottom-2",
    ],
    {
        variants: {
            width: {
                xsmall: "autocomplete-overlay-width-xsmall",
                small: "autocomplete-overlay-width-small",
                medium: "autocomplete-overlay-width-medium",
                large: "autocomplete-overlay-width-large",
                xlarge: "autocomplete-overlay-width-xlarge",
                auto: "autocomplete-overlay-width-auto",
                anchor: "autocomplete-overlay-width-anchor",
            } satisfies Record<AutocompleteOverlayWidth, string>,
            height: {
                small: "autocomplete-overlay-height-small",
                medium: "autocomplete-overlay-height-medium",
                large: "autocomplete-overlay-height-large",
                xlarge: "autocomplete-overlay-height-xlarge",
                auto: "autocomplete-overlay-height-auto",
            } satisfies Record<AutocompleteOverlayHeight, string>,
            maxHeight: {
                small: "autocomplete-overlay-max-height-small",
                medium: "autocomplete-overlay-max-height-medium",
                large: "autocomplete-overlay-max-height-large",
                xlarge: "autocomplete-overlay-max-height-xlarge",
            } satisfies Record<AutocompleteOverlayMaxHeight, string>,
            // Held back until it has been placed, so it is never seen where it does not belong
            unplaced: {
                true: "invisible",
                false: "",
            },
        },
    },
);

// Where the surface was last placed, and how wide the field it was placed against was, since
// a surface that follows the field's width has to be drawn again when the field changes
type AutocompletePlacement = AnchoredPosition & { anchorWidth: number };

// Whether the surface ended up where it already was, which is the only thing worth not
// rendering it again for
const isSamePlacement = (one: AutocompletePlacement, other: AutocompletePlacement) =>
    one.top === other.top &&
    one.left === other.left &&
    one.anchorSide === other.anchorSide &&
    one.anchorAlign === other.anchorAlign &&
    one.anchorWidth === other.anchorWidth;

// The floating surface the list is drawn on. It never takes focus: the field keeps the caret
// throughout, so the surface is only ever somewhere for the list to stand
function AutocompleteOverlay(props: AutocompleteOverlayProps) {
    const {
        menuAnchorRef,
        side = "outside-bottom",
        align = "start",
        width = "anchor",
        height = "auto",
        maxHeight = "medium",
        portalContainerName,
        children,
        className,
        style,
        ...rest
    } = props;

    const { inputRef, scrollContainerRef, showMenu, setShowMenu } =
        React.useContext(AutocompleteContext);

    const overlayRef = React.useRef<HTMLDivElement>(null);
    const mergedOverlayRef = useMergedRefs(scrollContainerRef, overlayRef);

    // The list stands under the whole field rather than under the typing area inside it,
    // since a field holding a visual or an action is wider than the part that is typed into
    const anchorElement = React.useCallback(() => {
        const input = inputRef?.current ?? null;

        return (
            menuAnchorRef?.current ??
            input?.closest<HTMLElement>('[data-component="TextInput"]') ??
            input
        );
    }, [menuAnchorRef, inputRef]);

    const placedRef = React.useRef<AutocompletePlacement | null>(null);
    const [placement, setPlacement] = React.useState<AutocompletePlacement | null>(null);

    const updatePosition = React.useCallback(() => {
        const anchor = anchorElement();
        const overlay = overlayRef.current;

        if (!anchor || !overlay) {
            return;
        }

        const placed = {
            ...getAnchoredPosition(overlay, anchor, { side, align }),
            anchorWidth: anchor.getBoundingClientRect().width,
        };

        if (placedRef.current && isSamePlacement(placedRef.current, placed)) {
            return;
        }

        placedRef.current = placed;
        setPlacement(placed);
    }, [anchorElement, side, align]);

    // Placed before the browser paints, so the list is never seen standing anywhere but under
    // its field
    useIsomorphicLayoutEffect(() => {
        if (!showMenu) {
            // Forgotten, so that a list shown again is placed from scratch rather than from
            // wherever it was left last time
            placedRef.current = null;
            setPlacement(null);
            return;
        }

        updatePosition();

        // The field moves whenever the page is laid out again, and the list moves with
        // whatever it is left holding as it is filtered
        const observer = new ResizeObserver(updatePosition);
        const anchor = anchorElement();

        if (overlayRef.current) {
            observer.observe(overlayRef.current);
        }

        if (anchor) {
            observer.observe(anchor);
        }

        window.addEventListener("resize", updatePosition);
        // Caught on the way down, so that a field standing in a scrolling region keeps its
        // list with it as the region is scrolled rather than only the page
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [showMenu, updatePosition, anchorElement]);

    // A press anywhere else dismisses the list, which is what a surface standing over the
    // page rather than in it needs
    React.useEffect(() => {
        if (!showMenu) {
            return;
        }

        const handlePress = (event: MouseEvent | TouchEvent) => {
            const { target } = event;

            if (!(target instanceof Node)) {
                return;
            }

            // A press on the field is the field's own, which opens the list rather than
            // dismissing it
            if (overlayRef.current?.contains(target) || anchorElement()?.contains(target)) {
                return;
            }

            setShowMenu?.(false);
        };

        document.addEventListener("mousedown", handlePress);
        document.addEventListener("touchstart", handlePress);

        return () => {
            document.removeEventListener("mousedown", handlePress);
            document.removeEventListener("touchstart", handlePress);
        };
    }, [showMenu, setShowMenu, anchorElement]);

    return (
        <Portal containerName={portalContainerName}>
            <div
                ref={mergedOverlayRef}
                // A list that is not showing stays on the page with nothing drawn, so that
                // the order the options were left in, and what the caller has been told about
                // them, are still there when it opens again
                aria-hidden={showMenu ? undefined : "true"}
                className={classNames(
                    showMenu
                        ? autocompleteOverlayVariants({
                              width,
                              height,
                              maxHeight,
                              unplaced: !placement,
                          })
                        : classes.hidden,
                    className,
                )}
                style={
                    {
                        ...style,
                        "--autocomplete-overlay-top": `${placement?.top ?? 0}px`,
                        "--autocomplete-overlay-left": `${placement?.left ?? 0}px`,
                        "--autocomplete-overlay-anchor-width": `${placement?.anchorWidth ?? 0}px`,
                    } as React.CSSProperties
                }
                data-component="Autocomplete.Overlay"
                data-open={showMenu ? "" : undefined}
                data-side={placement?.anchorSide ?? side}
                data-align={placement?.anchorAlign ?? align}
                data-width={width}
                data-height={height}
                {...rest}
            >
                {children}
            </div>
        </Portal>
    );
}

AutocompleteOverlay.displayName = "Autocomplete.Overlay";

export default AutocompleteOverlay;
