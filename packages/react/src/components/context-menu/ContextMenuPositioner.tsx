import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Portal } from "../portal";
import { getAnchoredPosition } from "../tooltip/anchoredPosition";
import { useContextMenu } from "./useContextMenu";
import type { AnchoredPosition, AnchoredPositionAnchor } from "../tooltip/anchoredPosition";
import type { ContextMenuPoint, ContextMenuPositionerProps } from "./ContextMenu.types";

const classes = {
    root: "context-menu-positioner",
};

// The press held up as something the menu can be measured against: it stands where the press
// landed, and is as big as whatever made it
const getPointAnchor = ({ x, y, size }: ContextMenuPoint): AnchoredPositionAnchor => ({
    getBoundingClientRect: () => ({
        top: y,
        right: x + size,
        bottom: y + size,
        left: x,
        width: size,
        height: size,
    }),
});

// Whether the menu ended up where it already was, which is the only thing worth not
// rendering it again for
const isSamePosition = (one: AnchoredPosition, other: AnchoredPosition) =>
    one.top === other.top &&
    one.left === other.left &&
    one.anchorSide === other.anchorSide &&
    one.anchorAlign === other.anchorAlign;

// The frame the menu is placed in, laid out against the viewport at the press that opened
// it. It is rendered into a portal, so the menu stands over the page rather than inside
// whatever the area it was opened from is laid out in
function ContextMenuPositioner(
    props: ContextMenuPositionerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, style, ...rest } = props;

    const { open, point, portalContainerName } = useContextMenu();

    const positionerRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(ref, positionerRef);

    // Where the menu was last placed, kept beside the state so that placing it again can be
    // told apart from placing it somewhere new without waiting for a render
    const placedRef = React.useRef<AnchoredPosition | null>(null);
    const [position, setPosition] = React.useState<AnchoredPosition | null>(null);

    const updatePosition = React.useCallback(() => {
        const positioner = positionerRef.current;

        if (!positioner) {
            return;
        }

        // The menu stands at the press itself, rather than clear of it the way it would stand
        // clear of an anchor it would otherwise cover
        const placed = getAnchoredPosition(positioner, getPointAnchor(point), {
            side: "outside-bottom",
            align: "start",
            anchorOffset: 0,
        });

        if (placedRef.current && isSamePosition(placedRef.current, placed)) {
            return;
        }

        placedRef.current = placed;
        setPosition(placed);
    }, [point]);

    // Placed before the browser paints, so the menu is never seen standing anywhere but at
    // the press that opened it. It is not hidden while it waits to be placed: the menu takes
    // focus as soon as it is drawn, and a hidden element cannot be given it
    useIsomorphicLayoutEffect(() => {
        if (!open) {
            // Forgotten, so that a menu opened again is placed from scratch rather than from
            // wherever it was last time
            placedRef.current = null;
            setPosition(null);
            return;
        }

        updatePosition();

        // The menu moves with whatever it grows to hold, and with the viewport it stands in
        const observer = new ResizeObserver(updatePosition);

        if (positionerRef.current) {
            observer.observe(positionerRef.current);
        }

        window.addEventListener("resize", updatePosition);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updatePosition);
        };
    }, [open, updatePosition]);

    if (!open) {
        return null;
    }

    return (
        <Portal containerName={portalContainerName}>
            <div
                ref={mergedRef}
                className={classNames(classes.root, className)}
                style={
                    {
                        ...style,
                        "--context-menu-top": `${position?.top ?? 0}px`,
                        "--context-menu-left": `${position?.left ?? 0}px`,
                    } as React.CSSProperties
                }
                data-component="ContextMenu.Positioner"
                data-side={position?.anchorSide ?? "outside-bottom"}
                data-align={position?.anchorAlign ?? "start"}
                {...rest}
            >
                {children}
            </div>
        </Portal>
    );
}

ContextMenuPositioner.displayName = "ContextMenu.Positioner";

export default fixedForwardRef(ContextMenuPositioner);
