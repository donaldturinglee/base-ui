import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { AttachmentActionsProps } from "./Attachment.types";

const classes = {
    root: "attachment-actions",
};

// What can be done with the file, kept at the trailing edge of the attachment. It stands above
// the trigger laid over the attachment, so a button here is pressed rather than the attachment
function AttachmentActions(
    props: AttachmentActionsProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Attachment.Actions"
            {...rest}
        />
    );
}

AttachmentActions.displayName = "Attachment.Actions";

export default fixedForwardRef(AttachmentActions);
