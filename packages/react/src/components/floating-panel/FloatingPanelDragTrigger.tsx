import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useFloatingPanelContext } from "./FloatingPanelContext";
import type { FloatingPanelDragTriggerProps } from "./FloatingPanel.types";

const classes = {
    root: "floating-panel-drag-trigger",
};

// What the panel is taken hold of by, which is usually the header and everything in it.
//
// It is not focusable and carries no role of its own. A region that wraps a title and a row of
// buttons cannot honestly be called a button, and making it one would swallow the things inside it
// for anyone reading with a screen reader. Moving the panel from the keyboard is the content's,
// where the arrow keys can be answered without a tab stop of its own
function FloatingPanelDragTrigger<As extends React.ElementType = "div">(
    props: FloatingPanelDragTriggerProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        onPointerDown,
        ...rest
    } = props as FloatingPanelDragTriggerProps<"div">;

    const { startDrag, dragging, canDrag } = useFloatingPanelContext();

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerDown?.(event);

        if (event.defaultPrevented) {
            return;
        }

        // Only the primary button drags, so a right click asking for a context menu still opens
        // one rather than carrying the panel off with it
        if (event.button !== 0) {
            return;
        }

        // A press that landed on something in the header that answers presses of its own belongs
        // to that thing, so closing a panel by its button does not first drag it a few pixels
        const target = event.target as HTMLElement;

        if (target.closest("button, a, input, select, textarea")) {
            return;
        }

        startDrag(event);
    };

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            onPointerDown={handlePointerDown}
            data-component="FloatingPanel.DragTrigger"
            data-draggable={canDrag ? "" : undefined}
            data-dragging={dragging ? "" : undefined}
            {...rest}
        />
    );
}

FloatingPanelDragTrigger.displayName = "FloatingPanel.DragTrigger";

export default fixedForwardRef(FloatingPanelDragTrigger);
