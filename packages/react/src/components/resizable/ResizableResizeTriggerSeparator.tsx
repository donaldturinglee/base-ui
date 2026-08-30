import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ResizableResizeTriggerSeparatorProps } from "./Resizable.types";

const classes = {
    root: "resizable-resize-trigger-separator",
};

// The line one panel is parted from the next by. It fills the trigger it is put in rather than
// standing anywhere of its own, so a trigger given nothing else is drawn as a line and no more
function ResizableResizeTriggerSeparator(
    props: ResizableResizeTriggerSeparatorProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <span
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Resizable.ResizeTriggerSeparator"
            aria-hidden="true"
            {...rest}
        />
    );
}

ResizableResizeTriggerSeparator.displayName = "Resizable.ResizeTriggerSeparator";

export default fixedForwardRef(ResizableResizeTriggerSeparator);
