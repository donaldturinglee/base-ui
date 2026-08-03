import * as React from "react";
import {
    CheckmarkCircleRegular,
    DismissRegular,
    DocumentRegular,
    ErrorCircleRegular,
} from "@gamecrafters/base-ui-icons";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { ProgressBar } from "../progress-bar";
import { formatFileSize } from "./files";
import type { UploadItemProps } from "./Upload.types";

const classes = {
    root: "upload-item",
    icon: "upload-item-icon",
    body: "upload-item-body",
    heading: "upload-item-heading",
    name: "upload-item-name",
    fileSize: "upload-item-file-size",
    description: "upload-item-description",
    descriptionError: "upload-item-description-error",
    status: "upload-item-status",
    statusSuccess: "upload-item-status-success",
    statusError: "upload-item-status-error",
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
function UploadItem(
    props: UploadItemProps,
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
            data-component="Upload.Item"
            data-status={status}
            {...rest}
        >
            <span className={classes.icon} aria-hidden="true" data-component="Upload.Item.Icon">
                <Icon />
            </span>

            <span className={classes.body}>
                <span className={classes.heading}>
                    <span className={classes.name} data-component="Upload.Item.Name">
                        {name}
                    </span>
                    {fileSize === undefined ? null : (
                        <span className={classes.fileSize} data-component="Upload.Item.Size">
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
                        data-component="Upload.Item.Description"
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
                    data-component="Upload.Item.Status"
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
                    data-component="Upload.Item.RemoveButton"
                />
            ) : null}
        </li>
    );
}

UploadItem.displayName = "Upload.Item";

export default fixedForwardRef(UploadItem);
