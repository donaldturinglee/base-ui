import * as React from "react";
import {
    CheckmarkCircleRegular,
    DismissRegular,
    DocumentRegular,
    ErrorCircleRegular,
} from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { ProgressBar } from "../progress-bar";
import { formatFileSize } from "./files";
import type { FileUploadItemProps } from "./FileUpload.types";

const classes = {
    root: "file-upload-item",
    icon: "file-upload-item-icon",
    body: "file-upload-item-body",
    heading: "file-upload-item-heading",
    name: "file-upload-item-name",
    fileSize: "file-upload-item-file-size",
    description: "file-upload-item-description",
    descriptionError: "file-upload-item-description-error",
    status: "file-upload-item-status",
    statusSuccess: "file-upload-item-status-success",
    statusError: "file-upload-item-status-error",
};

// A file that has arrived and one that has gone wrong are marked at the end of the row. One
// that is still on its way is marked by the bar below its name instead, so the row is not
// saying the same thing twice, and one that has not started says nothing at all
const statusMarks = {
    success: { icon: CheckmarkCircleRegular, className: classes.statusSuccess },
    error: { icon: ErrorCircleRegular, className: classes.statusError },
};

// One file in the list under a drop zone: what it is called, what it weighs, how far it has
// got and a way of taking it back out
function FileUploadItem(
    props: FileUploadItemProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        name,
        fileSize,
        status = "pending",
        progress,
        description,
        icon: Icon = DocumentRegular,
        onRemove,
        removeLabel,
        children,
        ...rest
    } = props;

    const mark = status === "success" || status === "error" ? statusMarks[status] : undefined;
    const Mark = mark?.icon;

    return (
        <li
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="FileUpload.Item"
            data-status={status}
            {...rest}
        >
            <span className={classes.icon} aria-hidden="true" data-component="FileUpload.Item.Icon">
                <Icon />
            </span>

            <span className={classes.body}>
                <span className={classes.heading}>
                    <span className={classes.name} data-component="FileUpload.Item.Name">
                        {name}
                    </span>
                    {fileSize === undefined ? null : (
                        <span className={classes.fileSize} data-component="FileUpload.Item.Size">
                            {formatFileSize(fileSize)}
                        </span>
                    )}
                </span>

                {status === "uploading" ? (
                    <ProgressBar
                        progress={progress}
                        variant="accent"
                        size="small"
                        animated
                        aria-label={`Uploading ${name}`}
                    />
                ) : null}

                {description ? (
                    <span
                        className={classNames(
                            classes.description,
                            status === "error" && classes.descriptionError,
                        )}
                        data-component="FileUpload.Item.Description"
                    >
                        {description}
                    </span>
                ) : null}

                {children}
            </span>

            {Mark ? (
                <span
                    className={classNames(classes.status, mark?.className)}
                    aria-hidden="true"
                    data-component="FileUpload.Item.Status"
                >
                    <Mark />
                </span>
            ) : null}

            {onRemove ? (
                <IconButton
                    icon={DismissRegular}
                    variant="invisible"
                    size="small"
                    aria-label={removeLabel ?? `Remove ${name}`}
                    onClick={onRemove}
                    data-component="FileUpload.Item.RemoveButton"
                />
            ) : null}
        </li>
    );
}

FileUploadItem.displayName = "FileUpload.Item";

export default fixedForwardRef(FileUploadItem);
