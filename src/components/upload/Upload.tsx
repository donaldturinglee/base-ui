import * as React from "react";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { triageFiles } from "./files";
import { UploadContext } from "./UploadContext";
import UploadDescription from "./UploadDescription";
import UploadIcon from "./UploadIcon";
import UploadLabel from "./UploadLabel";
import UploadList from "./UploadList";
import type { UploadProps, UploadSize, UploadSource, UploadValidationStatus } from "./Upload.types";

const classes = {
    // The control is what the picker opens from and what the reader tabs to, so it is taken
    // out of sight rather than out of the page
    input: "sr-only",
};

const uploadVariants = cva("upload", {
    variants: {
        // The size sets how much room the zone keeps and how big the pieces it is drawn from
        // are, and it is written on the root so that the list below the zone is sized by it too
        size: {
            small: "upload-small",
            medium: "upload-medium",
            large: "upload-large",
        } satisfies Record<UploadSize, string>,
    },
});

const uploadZoneVariants = cva("upload-zone", {
    variants: {
        dragging: {
            true: "upload-zone-dragging",
            false: "",
        },
        disabled: {
            true: "upload-zone-disabled",
            false: "upload-zone-interactive",
        },
        validation: {
            error: "upload-zone-error",
            success: "upload-zone-success",
        } satisfies Record<UploadValidationStatus, string>,
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
// somewhere, and Upload.List is where the files that arrived are shown
function Upload(
    props: UploadProps,
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
        icon: UploadIcon,
        label: UploadLabel,
        description: UploadDescription,
        list: UploadList,
    });

    // Whichever way the files arrived, the same rules are applied to them and the same two
    // callbacks are told about it
    const takeFiles = (files: File[], source: UploadSource) => {
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
        <UploadContext.Provider value={{ labelId, descriptionId }}>
            <div
                ref={ref}
                className={classNames(uploadVariants({ size }), className)}
                data-component="Upload"
                data-size={size}
                data-disabled={disabled}
                data-dragging={isDragging || undefined}
                data-validation={validationStatus}
                {...rest}
            >
                <label
                    className={classNames(
                        uploadZoneVariants({
                            dragging: isDragging,
                            disabled: Boolean(disabled),
                            validation: validationStatus,
                        }),
                    )}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    data-component="Upload.Zone"
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
                        data-component="Upload.Input"
                    />

                    {slots.icon}
                    {slots.label}
                    {slots.description}
                </label>

                {slots.list}
                {extras}
            </div>
        </UploadContext.Provider>
    );
}

Upload.displayName = "Upload";

export default fixedForwardRef(Upload);
