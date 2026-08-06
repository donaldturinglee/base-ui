import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { SplitterResizeTriggerSeparatorProps } from "./Splitter.types";

const classes = {
    root: "splitter-resize-trigger-separator",
};

// The line one panel is parted from the next by. It fills the trigger it is put in rather than
// standing anywhere of its own, so a trigger given nothing else is drawn as a line and no more
function SplitterResizeTriggerSeparator(
    props: SplitterResizeTriggerSeparatorProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <span
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Splitter.ResizeTriggerSeparator"
            aria-hidden="true"
            {...rest}
        />
    );
}

SplitterResizeTriggerSeparator.displayName = "Splitter.ResizeTriggerSeparator";

export default fixedForwardRef(SplitterResizeTriggerSeparator);
