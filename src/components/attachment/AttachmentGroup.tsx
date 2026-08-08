import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { AttachmentGroupProps } from "./Attachment.types";

const classes = {
    root: "attachment-group",
};

// A run of attachments laid along one line. More of them than there is room for are scrolled
// rather than wrapped, so the run keeps to the height of a single attachment however many it holds
function AttachmentGroup(
    props: AttachmentGroupProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Attachment.Group"
            {...rest}
        />
    );
}

AttachmentGroup.displayName = "Attachment.Group";

export default fixedForwardRef(AttachmentGroup);
