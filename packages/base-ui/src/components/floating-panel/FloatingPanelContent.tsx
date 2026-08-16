import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useFloatingPanelContext } from "./FloatingPanelContext";
import { FLOATING_PANEL_LARGE_STEP, FLOATING_PANEL_STEP } from "./floatingPanelRect";
import type { FloatingPanelContentProps } from "./FloatingPanel.types";

const classes = {
    root: "floating-panel-content",
};

// Which way each arrow moves the panel, in steps of one
const directions: Record<string, { x: number; y: number }> = {
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
};

// The surface itself: what is drawn, what is named to a screen reader, and what fills the rect the
// positioner settled. It is a dialog rather than a region, but a non-modal one, since a floating
// panel is meant to be worked alongside rather than answered before anything else can happen
function FloatingPanelContent<As extends React.ElementType = "div">(
    props: FloatingPanelContentProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        onKeyDown,
        ...rest
    } = props as FloatingPanelContentProps<"div">;

    const { stage, dragging, resizing, disabled, contentId, titleId, moveBy } =
        useFloatingPanelContext();

    // Moving the panel from the keyboard. It is answered here rather than on the drag trigger,
    // which cannot honestly be a button, and only when the press landed on the panel itself: an
    // arrow pressed inside a field or a list within the panel belongs to whatever holds it
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);

        const direction = directions[event.key];

        if (event.defaultPrevented || !direction || event.target !== event.currentTarget) {
            return;
        }

        const step = event.shiftKey ? FLOATING_PANEL_LARGE_STEP : FLOATING_PANEL_STEP;

        // Taking the event keeps the arrow from scrolling the page out from under the panel
        event.preventDefault();
        moveBy({ x: direction.x * step, y: direction.y * step });
    };

    return (
        <Component
            ref={ref}
            role="dialog"
            id={contentId}
            aria-labelledby={titleId}
            tabIndex={-1}
            className={classNames(classes.root, className)}
            onKeyDown={handleKeyDown}
            data-component="FloatingPanel.Content"
            data-stage={stage}
            data-dragging={dragging ? "" : undefined}
            data-resizing={resizing ? "" : undefined}
            data-disabled={disabled ? "" : undefined}
            {...rest}
        />
    );
}

FloatingPanelContent.displayName = "FloatingPanel.Content";

export default fixedForwardRef(FloatingPanelContent);
