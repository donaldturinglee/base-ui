import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { AttachmentTriggerProps } from "./Attachment.types";

const classes = {
    root: "attachment-trigger",
};

// What makes the whole attachment answer to a press. It is laid over the attachment rather than
// wrapped around it, so the actions at the trailing edge stay buttons in their own right, and it
// is the one thing in the attachment a reader tabs to, which is why the ring is drawn for the
// attachment as a whole
function AttachmentTrigger<As extends React.ElementType = "button">(
    props: AttachmentTriggerProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "button",
        className,
        type,
        ...rest
    } = props as AttachmentTriggerProps<"button">;

    return (
        <Component
            ref={ref}
            // Only a real button carries a type, and one left unsaid submits whatever form the
            // attachment happens to be standing in
            type={Component === "button" ? (type ?? "button") : type}
            className={classNames(classes.root, className)}
            data-component="Attachment.Trigger"
            {...rest}
        />
    );
}

AttachmentTrigger.displayName = "Attachment.Trigger";

export default fixedForwardRef(AttachmentTrigger);
