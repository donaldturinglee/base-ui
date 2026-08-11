import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { AttachmentContentProps } from "./Attachment.types";

const classes = {
    root: "attachment-content",
};

// The column of words beside the media. It is the one part of the attachment with no length of
// its own, so it is what gives when the attachment runs out of room
function AttachmentContent(
    props: AttachmentContentProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Attachment.Content"
            {...rest}
        />
    );
}

AttachmentContent.displayName = "Attachment.Content";

export default fixedForwardRef(AttachmentContent);
