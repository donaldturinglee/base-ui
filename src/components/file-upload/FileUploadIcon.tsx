import * as React from "react";
import { ArrowUploadRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { FileUploadIconProps } from "./FileUpload.types";

const classes = {
    root: "file-upload-icon",
};

function FileUploadIcon(
    props: FileUploadIconProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { icon: Icon = ArrowUploadRegular, className, "aria-label": ariaLabel, ...rest } = props;

    return (
        <span
            ref={ref}
            // An unlabelled icon is decorative, so it stays out of the accessibility tree
            role={ariaLabel ? "img" : undefined}
            aria-label={ariaLabel}
            aria-hidden={ariaLabel ? undefined : true}
            className={classNames(classes.root, className)}
            data-component="FileUpload.Icon"
            {...rest}
        >
            <Icon />
        </span>
    );
}

FileUploadIcon.displayName = "FileUpload.Icon";

export default fixedForwardRef(FileUploadIcon);
