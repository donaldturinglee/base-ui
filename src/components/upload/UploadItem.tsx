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
    root: "flex items-center gap-[var(--stack-gap-condensed)] p-[var(--base-size-8)] rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-[color:var(--border-color-muted)] bg-[var(--background-color-default)]",
    icon: "flex shrink-0 items-center justify-center [color:var(--foreground-color-muted)] [&>svg]:size-[var(--upload-item-icon-size,var(--base-size-20))]",
    // The name is the one part of the row with no length of its own, so it is what gives when
    // the row runs out of room
    body: "grid flex-auto min-w-0 gap-[var(--base-size-4)]",
    heading: "flex items-baseline min-w-0 gap-[var(--base-size-8)]",
    name: "min-w-0 truncate [font-size:var(--text-body-size-small)]",
    fileSize:
        "shrink-0 [font-size:var(--text-body-size-small)] [color:var(--foreground-color-muted)]",
    description: "[font-size:var(--text-body-size-small)] [color:var(--foreground-color-muted)]",
    // What went wrong is drawn in the colour errors are drawn in elsewhere
    descriptionError: "[color:var(--foreground-color-danger)]",
    status: "flex shrink-0 items-center justify-center [&>svg]:size-[var(--base-size-16)]",
    statusSuccess: "[color:var(--foreground-color-success)]",
    statusError: "[color:var(--foreground-color-danger)]",
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
