import * as React from "react";
import { Separator } from "react-resizable-panels";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ResizableResizeTriggerProps } from "./Resizable.types";

const classes = {
    root: "resizable-resize-trigger",
};

// What stands between one panel and the next, and what a reader takes hold of to move it. It is
// reached by the keyboard as well as by a pointer: the arrow keys move it a step at a time, Home
// and End take it as far as it will go either way, F6 steps from one trigger to the next, and Enter
// folds away a panel that may be collapsed and brings it back. Double-clicking a trigger puts the
// panel before it back to the size it started at.
//
// What it is drawn as is left to the caller, and put within it: a separator draws the line the
// panels are parted by, and an indicator the grip standing on that line. A trigger only meant to
// part two panels and one meant to be taken hold of are told apart by what they are given rather
// than by a prop.
//
// A trigger is not required between two panels, but a group without one can only be resized by
// dragging the edge where the panels meet, which leaves a keyboard with nothing to reach
function ResizableResizeTrigger(
    props: ResizableResizeTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <Separator
            elementRef={ref}
            className={classNames(classes.root, className)}
            data-component="Resizable.ResizeTrigger"
            {...rest}
        />
    );
}

ResizableResizeTrigger.displayName = "Resizable.ResizeTrigger";

export default fixedForwardRef(ResizableResizeTrigger);
