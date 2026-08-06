import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { SplitterResizeTriggerIndicatorProps } from "./Splitter.types";

const classes = {
    root: "splitter-resize-trigger-indicator",
};

// The grip standing in the middle of the trigger, which says the line it sits on is something to
// take hold of rather than one only there to part two panels. It is thicker than the line and
// stands out either side of it, so the line stays a line everywhere the grip is not
function SplitterResizeTriggerIndicator(
    props: SplitterResizeTriggerIndicatorProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <span
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Splitter.ResizeTriggerIndicator"
            aria-hidden="true"
            {...rest}
        />
    );
}

SplitterResizeTriggerIndicator.displayName = "Splitter.ResizeTriggerIndicator";

export default fixedForwardRef(SplitterResizeTriggerIndicator);
