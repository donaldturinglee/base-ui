import * as React from "react";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { triageFiles } from "./files";
import { FileUploadContext } from "./FileUploadContext";
import FileUploadDescription from "./FileUploadDescription";
import FileUploadIcon from "./FileUploadIcon";
import FileUploadLabel from "./FileUploadLabel";
import FileUploadList from "./FileUploadList";
import type {
    FileUploadProps,
    FileUploadSize,
    FileUploadSource,
    FileUploadValidationStatus,
} from "./FileUpload.types";

const classes = {
    // The control is what the picker opens from and what the reader tabs to, so it is taken
    // out of sight rather than out of the page
    input: "sr-only",
};

const fileUploadVariants = cva("file-upload", {
    variants: {
        // The size sets how much room the zone keeps and how big the pieces it is drawn from
        // are, and it is written on the root so that the list below the zone is sized by it too
        size: {
            small: "file-upload-small",
            medium: "file-upload-medium",
            large: "file-upload-large",
        } satisfies Record<FileUploadSize, string>,
    },
});

const fileUploadZoneVariants = cva("file-upload-zone", {
    variants: {
        dragging: {
            true: "file-upload-zone-dragging",
            false: "",
        },
        disabled: {
            true: "file-upload-zone-disabled",
            false: "file-upload-zone-interactive",
        },
        validation: {
            error: "file-upload-zone-error",
            success: "file-upload-zone-success",
        } satisfies Record<FileUploadValidationStatus, string>,
    },
});

// A drop lands on the control rather than in it, so what was dropped is written into the
// control as well. That leaves it holding what the reader can see, and leaves a form posting
// a dropped file the same way it posts a picked one. A browser without the constructor is
// left to the callback alone
const fillInput = (input: HTMLInputElement | null, files: File[]) => {
    if (!input || typeof DataTransfer === "undefined") {
        return;
    }

    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    input.files = transfer.files;
};

// A place to drop files on, or to open a file picker from. The native control does the
// picking, the naming and the keyboard; the zone around it is what makes a drop land
// somewhere, and FileUpload.List is where the files that arrived are shown
function FileUpload(
    props: FileUploadProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        size = "medium",
        accept,
        multiple,
        disabled,
        required,
        name,
        maxSize,
        validationStatus,
        onSelect,
        onReject,
        id,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-describedby": ariaDescribedBy,
        ...rest
    } = props;

    const inputRef = React.useRef<HTMLInputElement>(null);

    const inputId = useId(id);
    const labelId = useId();
    const descriptionId = useId();

    // Dragging over a child leaves the zone and enters it again, so the two are counted rather
    // than watched, and the zone only lets go once as much has left it as arrived
    const dragDepth = React.useRef(0);
    const [isDragging, setIsDragging] = React.useState(false);

    const [slots, extras] = useSlots(children, {
        icon: FileUploadIcon,
        label: FileUploadLabel,
        description: FileUploadDescription,
        list: FileUploadList,
    });

    // Whichever way the files arrived, the same rules are applied to them and the same two
    // callbacks are told about it
    const takeFiles = (files: File[], source: FileUploadSource) => {
        const { accepted, rejected } = triageFiles(files, { accept, maxSize, multiple });

        if (source === "drop" && accepted.length > 0) {
            fillInput(inputRef.current, accepted);
        }

        if (rejected.length > 0) {
            onReject?.(rejected, source);
        }

        if (accepted.length > 0) {
            onSelect?.(accepted, source);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        takeFiles(Array.from(event.target.files ?? []), "input");
    };

    const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
        if (disabled) {
            return;
        }

        event.preventDefault();
        dragDepth.current += 1;
        setIsDragging(true);
    };

    // Without this the page takes the drop and opens the file in place of the control
    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        if (disabled) {
            return;
        }

        event.preventDefault();

        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "copy";
        }
    };

    const handleDragLeave = () => {
        if (disabled) {
            return;
        }

        dragDepth.current = Math.max(dragDepth.current - 1, 0);

        if (dragDepth.current === 0) {
            setIsDragging(false);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        if (disabled) {
            return;
        }

        event.preventDefault();
        dragDepth.current = 0;
        setIsDragging(false);
        takeFiles(Array.from(event.dataTransfer?.files ?? []), "drop");
    };

    // The label names the control, so that the hint below it describes the control rather than
    // joining what it is called. A caller who has named the control themselves keeps that name
    const labelledBy = ariaLabelledBy ?? (slots.label && !ariaLabel ? labelId : undefined);

    const describedBy =
        [slots.description ? descriptionId : undefined, ariaDescribedBy]
            .filter(Boolean)
            .join(" ") || undefined;

    return (
        <FileUploadContext.Provider value={{ labelId, descriptionId }}>
            <div
                ref={ref}
                className={classNames(fileUploadVariants({ size }), className)}
                data-component="FileUpload"
                data-size={size}
                data-disabled={disabled}
                data-dragging={isDragging || undefined}
                data-validation={validationStatus}
                {...rest}
            >
                <label
                    className={classNames(
                        fileUploadZoneVariants({
                            dragging: isDragging,
                            disabled: Boolean(disabled),
                            validation: validationStatus,
                        }),
                    )}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    data-component="FileUpload.Zone"
                >
                    <input
                        ref={inputRef}
                        id={inputId}
                        type="file"
                        name={name}
                        accept={accept}
                        multiple={multiple}
                        disabled={disabled}
                        required={required}
                        onChange={handleChange}
                        className={classes.input}
                        aria-label={ariaLabel}
                        aria-labelledby={labelledBy}
                        aria-describedby={describedBy}
                        aria-invalid={validationStatus === "error" ? true : undefined}
                        data-component="FileUpload.Input"
                    />

                    {slots.icon}
                    {slots.label}
                    {slots.description}
                </label>

                {slots.list}
                {extras}
            </div>
        </FileUploadContext.Provider>
    );
}

FileUpload.displayName = "FileUpload";

export default fixedForwardRef(FileUpload);
