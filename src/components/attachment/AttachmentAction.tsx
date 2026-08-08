import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import type { IconButtonElementProps, IconButtonProps } from "../icon-button";
import type { AttachmentActionProps } from "./Attachment.types";

const classes = {
    root: "attachment-action",
};

// One thing that can be done with the file. It is an icon button drawn without a ground of its
// own, since the attachment it stands on is already a surface
function AttachmentAction<As extends React.ElementType = "button">(
    props: AttachmentActionProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        variant = "invisible",
        size = "small",
        ...rest
    } = props as unknown as IconButtonElementProps;

    // An action is named through this component's own props, so the name has already been given
    // by the time what is left of them is handed on
    const iconButtonProps = rest as unknown as IconButtonProps;

    return (
        <IconButton
            ref={ref}
            variant={variant}
            size={size}
            className={classNames(classes.root, className)}
            data-component="Attachment.Action"
            {...iconButtonProps}
        />
    );
}

AttachmentAction.displayName = "Attachment.Action";

export default fixedForwardRef(AttachmentAction);
