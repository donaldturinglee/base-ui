import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useFloatingPanelContext } from "./FloatingPanelContext";
import { FLOATING_PANEL_STEP } from "./floatingPanelRect";
import type {
    FloatingPanelResizeAxis,
    FloatingPanelResizeTriggerProps,
} from "./FloatingPanel.types";

const classes = {
    root: "floating-panel-resize-trigger",
};

// What each edge and corner is called, so the trigger can name itself to a screen reader
const labels: Record<FloatingPanelResizeAxis, string> = {
    n: "top",
    e: "right",
    s: "bottom",
    w: "left",
    ne: "top right",
    nw: "top left",
    se: "bottom right",
    sw: "bottom left",
};

// How far one press of an arrow key moves the edge being held
const steps: Record<string, { x: number; y: number }> = {
    ArrowLeft: { x: -FLOATING_PANEL_STEP, y: 0 },
    ArrowRight: { x: FLOATING_PANEL_STEP, y: 0 },
    ArrowUp: { x: 0, y: -FLOATING_PANEL_STEP },
    ArrowDown: { x: 0, y: FLOATING_PANEL_STEP },
};

// One edge or corner of the panel, which resizes it when dragged. Each one is rendered by the
// caller rather than all eight being drawn for them, so a panel that should only grow sideways
// simply leaves the others out.
//
// It is a button and takes a tab stop, so the same edge can be moved with the arrow keys. That is
// also why they are not drawn for the caller: eight of them would be eight stops on the way past
// every panel on the page
function FloatingPanelResizeTrigger(
    props: FloatingPanelResizeTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { axis, className, onPointerDown, onKeyDown, ...rest } = props;
    const { startResize, resizeBy, resizing, canResize } = useFloatingPanelContext();

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerDown?.(event);

        if (event.defaultPrevented || event.button !== 0) {
            return;
        }

        startResize(event, axis);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);

        const step = steps[event.key];

        if (event.defaultPrevented || !step) {
            return;
        }

        // Taking the event keeps the arrow from scrolling the page out from under the panel
        event.preventDefault();
        resizeBy(axis, step);
    };

    return (
        <div
            ref={ref}
            role="button"
            tabIndex={canResize ? 0 : -1}
            aria-label={`Resize panel from the ${labels[axis]}`}
            aria-disabled={canResize ? undefined : true}
            className={classNames(classes.root, className)}
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
            data-component="FloatingPanel.ResizeTrigger"
            data-axis={axis}
            data-resizing={resizing ? "" : undefined}
            {...rest}
        />
    );
}

FloatingPanelResizeTrigger.displayName = "FloatingPanel.ResizeTrigger";

export default fixedForwardRef(FloatingPanelResizeTrigger);
