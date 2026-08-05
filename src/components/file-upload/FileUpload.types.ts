import type * as React from "react";

export type FileUploadSize = "small" | "medium" | "large";

export type FileUploadValidationStatus = "error" | "success";

// Where the files came from, so a caller can tell a drop apart from a trip through the picker
export type FileUploadSource = "input" | "drop";

// Why a file was turned away: it is not one of the types the control takes, it weighs more
// than the control allows, or the control only takes one file and already had one
export type FileUploadRejectionReason = "type" | "size" | "count";

export type FileUploadRejection = {
    file: File;
    reason: FileUploadRejectionReason;
};

// How far along a file in the list is
export type FileUploadItemStatus = "pending" | "uploading" | "success" | "error";

// `onSelect` is dropped because the native handler reports a text selection rather than a
// choice of files
export type FileUploadProps = Omit<React.ComponentPropsWithoutRef<"div">, "onSelect"> & {
    size?: FileUploadSize;
    // Which types the picker offers, applied to what is dropped on the control as well
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    // The most a single file may weigh, in bytes
    maxSize?: number;
    validationStatus?: FileUploadValidationStatus;
    // Called with the files the control has taken. Files it turned away go to `onReject`
    // instead, so neither is ever called with nothing
    onSelect?: (files: File[], source: FileUploadSource) => void;
    onReject?: (rejections: FileUploadRejection[], source: FileUploadSource) => void;
    className?: string;
};

export type FileUploadIconProps = React.ComponentPropsWithoutRef<"span"> & {
    icon?: React.ElementType;
    className?: string;
};

export type FileUploadLabelProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type FileUploadDescriptionProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type FileUploadListProps = React.ComponentPropsWithoutRef<"ul"> & {
    className?: string;
};

export type FileUploadItemProps = React.ComponentPropsWithoutRef<"li"> & {
    // What the file is called, and what it weighs in bytes
    name: string;
    fileSize?: number;
    status?: FileUploadItemStatus;
    // How far the upload has got, drawn while the file is uploading
    progress?: number;
    // A line below the name: what went wrong, or anything else worth saying about the file
    description?: React.ReactNode;
    icon?: React.ElementType;
    // Draws a button that takes the file back out of the list
    onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    removeLabel?: string;
    className?: string;
};

// The ids the control is already pointing at, so that the label and the description below it
// take them rather than naming ids of their own
export type FileUploadContextValue = {
    labelId?: string;
    descriptionId?: string;
};
