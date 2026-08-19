import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Portal } from "../portal";
import { getAnchoredPosition } from "../tooltip/anchoredPosition";
import { ComboboxContext } from "./ComboboxContext";
import type { AnchoredPosition } from "../tooltip/anchoredPosition";
import type { ComboboxPositionerProps } from "./Combobox.types";

const comboboxPositionerVariants = cva(
    [
        "combobox-positioner",
        // It arrives from the edge of the field it stands off, which says where it came from
        "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-short motion-safe:data-[side=outside-bottom]:slide-in-from-top-2 motion-safe:data-[side=outside-top]:slide-in-from-bottom-2",
    ],
    {
        variants: {
            // Held back until it has been placed, so it is never seen where it does not belong
            unplaced: {
                true: "invisible",
                false: "",
            },
        },
    },
);

// Where the list was last placed, and how wide the control it was placed against was, since a
// list drawn to the width of its control has to be placed again when the control changes
type ComboboxPlacement = AnchoredPosition & { anchorWidth: number };

// Whether the list ended up where it already was, which is the only thing worth not rendering
// it again for
const isSamePlacement = (one: ComboboxPlacement, other: ComboboxPlacement) =>
    one.top === other.top &&
    one.left === other.left &&
    one.anchorSide === other.anchorSide &&
    one.anchorAlign === other.anchorAlign &&
    one.anchorWidth === other.anchorWidth;

// Where the list stands. It is drawn out of the page and laid out against the viewport, so that
// a field standing in a region that clips or scrolls still has its list drawn whole and over
// everything else
function ComboboxPositioner(
    props: ComboboxPositionerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        side = "outside-bottom",
        align = "start",
        portalContainerName,
        className,
        style,
        children,
        onMouseDown,
        ...rest
    } = props;

    const combobox = React.useContext(ComboboxContext);
    const open = combobox?.open ?? false;
    const anchorRef = combobox?.controlRef;
    const positionerRef = combobox?.contentRef;
    const mergedRef = useMergedRefs(ref, positionerRef ?? null);

    const placedRef = React.useRef<ComboboxPlacement | null>(null);
    const [placement, setPlacement] = React.useState<ComboboxPlacement | null>(null);

    const updatePosition = React.useCallback(() => {
        const anchor = anchorRef?.current;
        const positioner = positionerRef?.current;

        if (!anchor || !positioner) {
            return;
        }

        const placed = {
            ...getAnchoredPosition(positioner, anchor, { side, align }),
            anchorWidth: anchor.getBoundingClientRect().width,
        };

        if (placedRef.current && isSamePlacement(placedRef.current, placed)) {
            return;
        }

        placedRef.current = placed;
        setPlacement(placed);
    }, [align, anchorRef, positionerRef, side]);

    // Placed before the browser paints, so the list is never seen standing anywhere but under
    // its field
    useIsomorphicLayoutEffect(() => {
        if (!open) {
            // Forgotten, so that a list opened again is placed from scratch rather than from
            // wherever it was left last time
            placedRef.current = null;
            setPlacement(null);
            return;
        }

        updatePosition();

        // The field moves whenever the page is laid out again, and the list moves with
        // whatever it is left holding as it is narrowed
        const observer = new ResizeObserver(updatePosition);
        const anchor = anchorRef?.current;

        if (positionerRef?.current) {
            observer.observe(positionerRef.current);
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
    }, [anchorRef, open, positionerRef, updatePosition]);

    if (!combobox || !open) {
        return null;
    }

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        onMouseDown?.(event);

        // Pressing an item must not take the caret off the field, or the list would be
        // dismissed by the very press that was picking from it
        if (!event.defaultPrevented) {
            event.preventDefault();
        }
    };

    return (
        <Portal containerName={portalContainerName}>
            <div
                ref={mergedRef}
                className={classNames(
                    comboboxPositionerVariants({ unplaced: !placement }),
                    className,
                )}
                style={
                    {
                        ...style,
                        "--combobox-positioner-top": `${placement?.top ?? 0}px`,
                        "--combobox-positioner-left": `${placement?.left ?? 0}px`,
                        "--combobox-positioner-anchor-width": `${placement?.anchorWidth ?? 0}px`,
                    } as React.CSSProperties
                }
                onMouseDown={handleMouseDown}
                data-component="Combobox.Positioner"
                data-side={placement?.anchorSide ?? side}
                data-align={placement?.anchorAlign ?? align}
                {...rest}
            >
                {children}
            </div>
        </Portal>
    );
}

ComboboxPositioner.displayName = "Combobox.Positioner";

export default fixedForwardRef(ComboboxPositioner);
