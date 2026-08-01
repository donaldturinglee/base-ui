import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { UploadContext } from "./UploadContext";
import type { UploadDescriptionProps } from "./Upload.types";

const classes = {
    root: "[font-size:var(--upload-description-size,var(--text-body-size-small))] [line-height:var(--text-body-line-height-medium)] [color:var(--upload-muted-color,var(--foreground-color-muted))]",
};

function UploadDescription(
    props: UploadDescriptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, id, ...rest } = props;
    const { descriptionId } = React.useContext(UploadContext);

    return (
        <span
            ref={ref}
            // The control is described by this line, so it takes the id the control is already
            // pointing at unless the caller has named one of their own
            id={id ?? descriptionId}
            className={classNames(classes.root, className)}
            data-component="Upload.Description"
            {...rest}
        />
    );
}

UploadDescription.displayName = "Upload.Description";

export default fixedForwardRef(UploadDescription);
