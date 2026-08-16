import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Portal } from "../portal";
import { useFloatingPanelContext } from "./FloatingPanelContext";
import type { FloatingPanelPositionerProps } from "./FloatingPanel.types";

const classes = {
    root: "floating-panel-positioner",
};

// Where the panel stands. The rect is carried in custom properties rather than written straight
// onto the element, so that a stage which fills the room it was given can lay the panel out from
// the stylesheet instead of having to be measured and worked out again here.
//
// A panel laid out against the viewport is portalled, so that an ancestor with its own clipping or
// stacking cannot cut it off or bury it. One laid out against a positioned ancestor stays where it
// was written, since that ancestor is the very thing it is measured against
function FloatingPanelPositioner<As extends React.ElementType = "div">(
    props: FloatingPanelPositionerProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        style,
        ...rest
    } = props as FloatingPanelPositionerProps<"div">;

    const { open, position, size, stage, strategy, dragging, resizing, contentId } =
        useFloatingPanelContext();

    if (!open) {
        return null;
    }

    const positioner = (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            style={
                {
                    ...style,
                    "--floating-panel-x": `${position.x}px`,
                    "--floating-panel-y": `${position.y}px`,
                    "--floating-panel-width": `${size.width}px`,
                    "--floating-panel-height": `${size.height}px`,
                } as React.CSSProperties
            }
            data-component="FloatingPanel.Positioner"
            data-strategy={strategy}
            data-stage={stage}
            data-dragging={dragging ? "" : undefined}
            data-resizing={resizing ? "" : undefined}
            // Named after the panel it stands, so that a caller looking for the positioner of a
            // particular panel has something to look it up by
            data-panel={contentId}
            {...rest}
        />
    );

    return strategy === "fixed" ? <Portal>{positioner}</Portal> : positioner;
}

FloatingPanelPositioner.displayName = "FloatingPanel.Positioner";

export default fixedForwardRef(FloatingPanelPositioner);
