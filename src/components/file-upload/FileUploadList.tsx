import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { FileUploadListProps } from "./FileUpload.types";

const classes = {
    // A list drawn without its markers is no longer read as one in every browser, so the role
    // below puts back what the styling takes away
    root: "file-upload-list",
};

function FileUploadList(
    props: FileUploadListProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;

    // Nothing to show, not even an empty list
    if (React.Children.toArray(children).length === 0) {
        return null;
    }

    return (
        <ul
            ref={ref}
            role="list"
            className={classNames(classes.root, className)}
            data-component="FileUpload.List"
            {...rest}
        >
            {children}
        </ul>
    );
}

FileUploadList.displayName = "FileUpload.List";

export default fixedForwardRef(FileUploadList);
