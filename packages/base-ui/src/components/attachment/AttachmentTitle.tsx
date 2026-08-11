import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { AttachmentTitleProps } from "./Attachment.types";

const classes = {
    root: "attachment-title",
};

// What the file is called. A name longer than the room it has is cut rather than wrapped, so an
// attachment keeps to one line however it is named
function AttachmentTitle(
    props: AttachmentTitleProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <span
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Attachment.Title"
            {...rest}
        />
    );
}

AttachmentTitle.displayName = "Attachment.Title";

export default fixedForwardRef(AttachmentTitle);
