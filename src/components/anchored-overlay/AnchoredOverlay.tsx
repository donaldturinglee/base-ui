import * as React from "react";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { classNames, cva } from "../../utilities/classnames";
import { getResponsiveAttributes } from "../../utilities/responsive";
import { IconButton } from "../icon-button";
import { Portal } from "../portal";
import { getAnchoredPosition } from "../tooltip/anchoredPosition";
import type { AnchoredPosition } from "../tooltip/anchoredPosition";
import type {
    AnchoredOverlayHeight,
    AnchoredOverlayProps,
    AnchoredOverlayVariant,
    AnchoredOverlayWidth,
} from "./AnchoredOverlay.types";

const classes = {
    closeButtonContainer: "anchored-overlay-close-button-container",
    closeButton: "anchored-overlay-close-button",
};

const anchoredOverlayVariants = cva(
    [
        "anchored-overlay",
        // It arrives from the edge of the anchor it stands off, which says where it came from
        "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-short motion-safe:data-[side=outside-bottom]:slide-in-from-top-2 motion-safe:data-[side=outside-top]:slide-in-from-bottom-2 motion-safe:data-[side=outside-right]:slide-in-from-left-2 motion-safe:data-[side=outside-left]:slide-in-from-right-2",
    ],
    {
        variants: {
            width: {
                xsmall: "anchored-overlay-width-xsmall",
                small: "anchored-overlay-width-small",
                medium: "anchored-overlay-width-medium",
                large: "anchored-overlay-width-large",
                xlarge: "anchored-overlay-width-xlarge",
                auto: "anchored-overlay-width-auto",
            } satisfies Record<AnchoredOverlayWidth, string>,
            height: {
                small: "anchored-overlay-height-small",
                medium: "anchored-overlay-height-medium",
                large: "anchored-overlay-height-large",
                xlarge: "anchored-overlay-height-xlarge",
                auto: "anchored-overlay-height-auto",
            } satisfies Record<AnchoredOverlayHeight, string>,
            reflow: {
                true: "anchored-overlay-reflow",
                false: "",
            },
            fullscreen: {
                true: "anchored-overlay-fullscreen",
                false: "",
            },
            // Held back until it has been placed, so it is never seen where it does not belong
            unplaced: {
                true: "invisible",
                false: "",
            },
        },
    },
);

const defaultVariant: AnchoredOverlayVariant = { regular: "anchored", narrow: "anchored" };

// The keys that open an overlay from its anchor, which are the ones that would open a menu
const openKeys = ["ArrowDown", "ArrowUp", " ", "Enter"];

// Whether the overlay ended up where it already was, which is the only thing worth not
// rendering it again for
const isSamePosition = (one: AnchoredPosition, other: AnchoredPosition) =>
    one.top === other.top &&
    one.left === other.left &&
    one.anchorSide === other.anchorSide &&
    one.anchorAlign === other.anchorAlign;

// A floating surface that stands against an anchor rather than over the whole page. The
// anchor opens it, and it is dismissed by the anchor again, by Escape, or by a click that
// lands anywhere else
function AnchoredOverlay(props: AnchoredOverlayProps) {
    const {
        renderAnchor,
        anchorRef: externalAnchorRef,
        anchorId: externalAnchorId,
        children,
        open,
        onOpen,
        onClose,
        side = "outside-bottom",
        align = "start",
        anchorOffset,
        alignmentOffset,
        width = "auto",
        height = "auto",
        overlayProps,
        focusTrapSettings,
        preventOverflow = true,
        variant = defaultVariant,
        displayCloseButton = true,
        closeButtonProps,
        onPositionChange,
        className,
    } = props;

    const {
        ref: externalOverlayRef,
        className: overlayClassName,
        style: overlayStyle,
        portalContainerName,
        ...restOverlayProps
    } = overlayProps ?? {};

    const {
        className: closeButtonClassName,
        "aria-label": closeButtonLabel,
        ...restCloseButtonProps
    } = closeButtonProps ?? {};

    // A ref of the caller's own stands in for ours, so that they can reach the anchor as
    // well, or point at one that is nowhere near the overlay in the tree
    const internalAnchorRef = React.useRef<HTMLElement>(null);
    const anchorRef = externalAnchorRef ?? internalAnchorRef;
    const anchorId = useId(externalAnchorId);

    const overlayRef = React.useRef<HTMLDivElement>(null);
    const mergedOverlayRef = useMergedRefs(externalOverlayRef, overlayRef);

    // Where the overlay was last placed, kept beside the state so that placing it again can
    // be told apart from placing it somewhere new without waiting for a render
    const placedRef = React.useRef<AnchoredPosition | null>(null);
    const [position, setPosition] = React.useState<AnchoredPosition | null>(null);

    const updatePosition = React.useCallback(() => {
        const anchor = anchorRef.current;
        const overlay = overlayRef.current;

        if (!anchor || !overlay) {
            return;
        }

        const placed = getAnchoredPosition(overlay, anchor, {
            side,
            align,
            anchorOffset,
            alignmentOffset,
        });

        if (placedRef.current && isSamePosition(placedRef.current, placed)) {
            return;
        }

        placedRef.current = placed;
        setPosition(placed);
        onPositionChange?.({ position: placed });
    }, [anchorRef, side, align, anchorOffset, alignmentOffset, onPositionChange]);

    // Placed before the browser paints, so the overlay is never seen standing anywhere but
    // against its anchor
    useIsomorphicLayoutEffect(() => {
        if (!open) {
            // Forgotten, so that an overlay opened again is placed from scratch rather than
            // from wherever it was last time
            placedRef.current = null;
            setPosition(null);
            return;
        }

        updatePosition();

        // The anchor moves whenever the page is laid out again, and the overlay moves with
        // whatever it grows to hold
        const observer = new ResizeObserver(updatePosition);

        if (overlayRef.current) {
            observer.observe(overlayRef.current);
        }

        window.addEventListener("resize", updatePosition);
        // Caught on the way down, so that an overlay standing over a scrolling region
        // follows its anchor as the region is scrolled rather than only the page
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [open, updatePosition]);

    useFocusTrap({
        containerRef: overlayRef,
        // Focus goes back to the anchor, which is where it was before the overlay opened
        returnFocusRef: anchorRef,
        ...focusTrapSettings,
        // There is nothing to hold focus until the overlay has been placed, since one that
        // has not been is not yet on screen to be read
        disabled: !open || !position || Boolean(focusTrapSettings?.disabled),
    });

    useOnEscapePress((event) => {
        if (!open) {
            return;
        }

        // Taking the event keeps a layer this overlay was opened from standing
        event.preventDefault();
        onClose?.("escape");
    });

    // A press anywhere else dismisses the overlay, which is what a surface standing over
    // the page rather than in it needs
    React.useEffect(() => {
        if (!open) {
            return;
        }

        const handlePress = (event: MouseEvent | TouchEvent) => {
            const { target } = event;

            if (!(target instanceof Node)) {
                return;
            }

            // A press on the anchor is left to the anchor, which closes the overlay itself
            if (overlayRef.current?.contains(target) || anchorRef.current?.contains(target)) {
                return;
            }

            onClose?.("click-outside");
        };

        document.addEventListener("mousedown", handlePress);
        document.addEventListener("touchstart", handlePress);

        return () => {
            document.removeEventListener("mousedown", handlePress);
            document.removeEventListener("touchstart", handlePress);
        };
    }, [anchorRef, open, onClose]);

    const handleAnchorClick = (event: React.MouseEvent<HTMLElement>) => {
        // Only the primary button reaches for the overlay, and only where nothing else has
        // already answered the click
        if (event.defaultPrevented || event.button !== 0) {
            return;
        }

        if (open) {
            onClose?.("anchor-click");
        } else {
            onOpen?.("anchor-click");
        }
    };

    const handleAnchorKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.defaultPrevented || open || !openKeys.includes(event.key)) {
            return;
        }

        onOpen?.("anchor-key-press", event);
        // Taking the event keeps the page from scrolling away underneath the overlay
        event.preventDefault();
    };

    const isFullscreen = variant.narrow === "fullscreen";
    // A close button is only worth showing where the overlay fills the screen, since there
    // is nowhere left to click off it
    const showCloseButton = Boolean(onClose) && isFullscreen && displayCloseButton;

    return (
        <>
            {renderAnchor
                ? renderAnchor({
                      ref: anchorRef,
                      id: anchorId,
                      "aria-haspopup": "true",
                      "aria-expanded": open,
                      tabIndex: 0,
                      onClick: handleAnchorClick,
                      onKeyDown: handleAnchorKeyDown,
                  })
                : null}
            {open ? (
                <Portal containerName={portalContainerName}>
                    <div
                        ref={mergedOverlayRef}
                        // Focus has somewhere to land even where the overlay holds nothing
                        // that can take it, without adding a stop of its own to the page
                        tabIndex={-1}
                        className={classNames(
                            anchoredOverlayVariants({
                                width,
                                height,
                                reflow: !preventOverflow,
                                fullscreen: isFullscreen,
                                unplaced: !position,
                            }),
                            className,
                            overlayClassName,
                        )}
                        style={
                            {
                                ...overlayStyle,
                                "--anchored-overlay-top": `${position?.top ?? 0}px`,
                                "--anchored-overlay-left": `${position?.left ?? 0}px`,
                            } as React.CSSProperties
                        }
                        data-component="AnchoredOverlay"
                        data-side={position?.anchorSide ?? side}
                        data-align={position?.anchorAlign ?? align}
                        data-width={width}
                        data-height={height}
                        data-visibility={position ? "visible" : "hidden"}
                        {...getResponsiveAttributes("variant", variant)}
                        {...restOverlayProps}
                    >
                        {showCloseButton ? (
                            <div className={classes.closeButtonContainer}>
                                <IconButton
                                    icon={DismissRegular}
                                    variant="invisible"
                                    aria-label={closeButtonLabel ?? "Close"}
                                    onClick={() => onClose?.("close-button")}
                                    className={classNames(
                                        classes.closeButton,
                                        closeButtonClassName,
                                    )}
                                    data-component="AnchoredOverlay.CloseButton"
                                    {...restCloseButtonProps}
                                />
                            </div>
                        ) : null}
                        {children}
                    </div>
                </Portal>
            ) : null}
        </>
    );
}

AnchoredOverlay.displayName = "AnchoredOverlay";

export default AnchoredOverlay;
