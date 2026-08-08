import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { AttachmentMediaProps, AttachmentMediaVariant } from "./Attachment.types";

const attachmentMediaVariants = cva("attachment-media", {
    variants: {
        variant: {
            icon: "",
            image: "attachment-media-image",
        } satisfies Record<AttachmentMediaVariant, string>,
    },
});

// The square at the leading edge of the attachment: an icon for the kind of file, a thumbnail of
// the file itself, or a progress ring while the file is still on its way
function AttachmentMedia(
    props: AttachmentMediaProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, variant = "icon", ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(attachmentMediaVariants({ variant }), className)}
            data-component="Attachment.Media"
            data-variant={variant}
            {...rest}
        />
    );
}

AttachmentMedia.displayName = "Attachment.Media";

export default fixedForwardRef(AttachmentMedia);
