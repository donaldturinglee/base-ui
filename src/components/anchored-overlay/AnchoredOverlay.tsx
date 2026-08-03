import * as React from "react";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { classNames } from "../../utilities/classnames";
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
    // The overlay is laid out against the viewport, because that is what the anchor it
    // stands against is measured against. Where it ends up is carried in variables rather
    // than written straight onto the element, so that a narrow viewport can put it
    // somewhere else. Nothing on it is transitioned: it is measured as it opens, and a
    // transition would carry it into place from the corner it was first rendered in rather
    // than let it appear where it belongs
    root: "fixed transition-none top-[var(--anchored-overlay-top)] left-[var(--anchored-overlay-left)] overflow-auto min-w-[var(--overlay-width-xsmall)] max-h-[100dvh] bg-[var(--overlay-background-color)] rounded-[var(--border-radius-large)] [box-shadow:var(--shadow-floating-small)] focus:outline-none forced-colors:outline-solid forced-colors:outline-1 forced-colors:outline-[color:transparent]",
    // It arrives from the edge of the anchor it stands off, which says where it came from
    animation:
        "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-short motion-safe:data-[side=outside-bottom]:slide-in-from-top-2 motion-safe:data-[side=outside-top]:slide-in-from-bottom-2 motion-safe:data-[side=outside-right]:slide-in-from-left-2 motion-safe:data-[side=outside-left]:slide-in-from-right-2",
    // Held back until it has been placed, so it is never seen where it does not belong
    unplaced: "invisible",
    // Narrowed to what the viewport has room for, rather than standing at its own width
    reflow: "max-w-[calc(100dvw_-_var(--base-size-32))]",
    width: {
        xsmall: "w-[var(--overlay-width-xsmall)]",
        small: "w-[var(--overlay-width-small)]",
        medium: "w-[var(--overlay-width-medium)]",
        large: "w-[var(--overlay-width-large)]",
        xlarge: "w-[var(--overlay-width-xlarge)]",
        auto: "w-auto",
    } satisfies Record<AnchoredOverlayWidth, string>,
    height: {
        small: "h-[var(--overlay-height-small)]",
        medium: "h-[var(--overlay-height-medium)]",
        large: "h-[var(--overlay-height-large)]",
        xlarge: "h-[var(--overlay-height-xlarge)]",
        auto: "h-auto",
    } satisfies Record<AnchoredOverlayHeight, string>,
    // A narrow viewport gives the overlay the whole screen, since there is no room left to
    // stand beside the anchor
    fullscreen:
        "max-medium:top-0 max-medium:left-0 max-medium:w-dvw max-medium:max-w-none max-medium:h-dvh max-medium:max-h-none max-medium:rounded-none",
    closeButtonContainer: "relative",
    // The button is only there on the screens the overlay fills, since anywhere else it is
    // closed by clicking off it
    closeButton:
        "hidden absolute top-[var(--base-size-8)] right-[var(--base-size-8)] max-medium:inline-grid",
};

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
                            classes.root,
                            classes.animation,
                            classes.width[width],
                            classes.height[height],
                            !preventOverflow && classes.reflow,
                            isFullscreen && classes.fullscreen,
                            !position && classes.unplaced,
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
