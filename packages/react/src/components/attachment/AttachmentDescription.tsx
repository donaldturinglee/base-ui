import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { AttachmentDescriptionProps } from "./Attachment.types";

const classes = {
    root: "attachment-description",
};

// The line below the name: what the file weighs, how far it has got, or what went wrong with it
function AttachmentDescription(
    props: AttachmentDescriptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <span
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Attachment.Description"
            {...rest}
        />
    );
}

AttachmentDescription.displayName = "Attachment.Description";

export default fixedForwardRef(AttachmentDescription);
