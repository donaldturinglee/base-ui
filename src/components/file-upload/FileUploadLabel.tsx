import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { FileUploadContext } from "./FileUploadContext";
import type { FileUploadLabelProps } from "./FileUpload.types";

const classes = {
    root: "file-upload-label",
};

function FileUploadLabel(
    props: FileUploadLabelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, id, ...rest } = props;
    const { labelId } = React.useContext(FileUploadContext);

    return (
        <span
            ref={ref}
            // The control is named after this line, so it takes the id the control is already
            // pointing at unless the caller has named one of their own
            id={id ?? labelId}
            className={classNames(classes.root, className)}
            data-component="FileUpload.Label"
            {...rest}
        />
    );
}

FileUploadLabel.displayName = "FileUpload.Label";

export default fixedForwardRef(FileUploadLabel);
