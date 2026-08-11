import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { FileUploadContext } from "./FileUploadContext";
import type { FileUploadDescriptionProps } from "./FileUpload.types";

const classes = {
    root: "file-upload-description",
};

function FileUploadDescription(
    props: FileUploadDescriptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, id, ...rest } = props;
    const { descriptionId } = React.useContext(FileUploadContext);

    return (
        <span
            ref={ref}
            // The control is described by this line, so it takes the id the control is already
            // pointing at unless the caller has named one of their own
            id={id ?? descriptionId}
            className={classNames(classes.root, className)}
            data-component="FileUpload.Description"
            {...rest}
        />
    );
}

FileUploadDescription.displayName = "FileUpload.Description";

export default fixedForwardRef(FileUploadDescription);
