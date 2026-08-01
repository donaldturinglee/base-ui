import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { ImageRegular } from "@gamecrafters/base-ui-icons";
import { Text } from "../text";
import { Upload } from ".";
import { formatFileSize } from "./files";
import type { UploadRejection, UploadSize } from "./Upload.types";

const classes = {
    // A drop zone fills its container, so the stories give it one to fill
    container: "w-[var(--overlay-width-medium)] max-w-full",
    stack: "flex flex-col gap-[var(--stack-gap-normal)]",
    field: "flex flex-col gap-[var(--base-size-4)]",
    label: "[font-size:var(--text-body-size-medium)] [font-weight:var(--base-text-weight-semibold)]",
};

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

const sizes: UploadSize[] = ["small", "medium", "large"];

// What a reader is told about a file that was turned away
const reasons: Record<UploadRejection["reason"], string> = {
    type: "is not a type this control takes",
    size: "is too large",
    count: "was left out, since only one file is taken at a time",
};

export default {
    title: "Components/Upload/Features",
    decorators: [withContainer],
};

// Sizes, which set how much room the zone keeps and how big the pieces it is drawn from are
export const Sizes: StoryFn<typeof Upload> = () => (
    <div className={classes.stack}>
        {sizes.map((size) => (
            <div key={size} className={classes.field}>
                <span className={classes.label}>{size}</span>
                <Upload size={size}>
                    <Upload.Icon />
                    <Upload.Label>Drag and drop files here, or browse</Upload.Label>
                    <Upload.Description>Any file type, up to 25 MB each</Upload.Description>
                </Upload>
            </div>
        ))}
    </div>
);

// Taking One Type Only, which filters what the picker offers and what a drop is allowed to
// bring
export const WithAccept: StoryFn<typeof Upload> = () => (
    <Upload accept="image/*" multiple>
        <Upload.Icon icon={ImageRegular} />
        <Upload.Label>Drag and drop images here, or browse</Upload.Label>
        <Upload.Description>PNG, JPG or GIF</Upload.Description>
    </Upload>
);

// Taking One File At A Time, where anything dropped after the first is turned away rather
// than dropped quietly
export const SingleFile: StoryFn<typeof Upload> = () => (
    <Upload accept=".pdf">
        <Upload.Icon />
        <Upload.Label>Drag and drop a document here, or browse</Upload.Label>
        <Upload.Description>One PDF at a time</Upload.Description>
    </Upload>
);

// With A List Of Files, showing each one at a different point along the way
export const WithFileList: StoryFn<typeof Upload> = () => (
    <Upload multiple>
        <Upload.Icon />
        <Upload.Label>Drag and drop files here, or browse</Upload.Label>
        <Upload.Description>Any file type, up to 25 MB each</Upload.Description>
        <Upload.List>
            <Upload.Item name="waiting-its-turn.zip" fileSize={4_194_304} onRemove={() => {}} />
            <Upload.Item
                name="on-its-way.mp4"
                fileSize={18_874_368}
                status="uploading"
                progress={62}
                onRemove={() => {}}
            />
            <Upload.Item
                name="arrived.pdf"
                fileSize={248_320}
                status="success"
                onRemove={() => {}}
            />
            <Upload.Item
                name="went-wrong.psd"
                fileSize={73_400_320}
                status="error"
                description="Larger than the 25 MB this control takes"
                onRemove={() => {}}
            />
        </Upload.List>
    </Upload>
);

// Invalid, drawn the way a field that has been answered wrongly is drawn elsewhere
export const ValidationStatus: StoryFn<typeof Upload> = () => (
    <div className={classes.stack}>
        <Upload validationStatus="error">
            <Upload.Icon />
            <Upload.Label>Drag and drop a file here, or browse</Upload.Label>
            <Upload.Description>A file is needed before this form can be sent</Upload.Description>
        </Upload>
        <Upload validationStatus="success">
            <Upload.Icon />
            <Upload.Label>Drag and drop a file here, or browse</Upload.Label>
            <Upload.Description>Your file has been accepted</Upload.Description>
        </Upload>
    </div>
);

// Disabled, which stops the control being used and takes the answer out of the zone
export const Disabled: StoryFn<typeof Upload> = () => (
    <Upload disabled>
        <Upload.Icon />
        <Upload.Label>Uploading is turned off</Upload.Label>
        <Upload.Description>Ask an administrator to turn it back on</Upload.Description>
    </Upload>
);

// Holding The Files, where the caller keeps what has arrived and shows it below the zone
export const Controlled: StoryFn<typeof Upload> = () => {
    const [files, setFiles] = React.useState<File[]>([]);

    const remove = (name: string) => {
        setFiles((current) => current.filter((file) => file.name !== name));
    };

    return (
        <Upload multiple onSelect={(selected) => setFiles((current) => [...current, ...selected])}>
            <Upload.Icon />
            <Upload.Label>Drag and drop files here, or browse</Upload.Label>
            <Upload.Description>
                {files.length === 0
                    ? "Nothing chosen yet"
                    : `${files.length} ${files.length === 1 ? "file" : "files"} chosen`}
            </Upload.Description>
            <Upload.List>
                {files.map((file) => (
                    <Upload.Item
                        key={file.name}
                        name={file.name}
                        fileSize={file.size}
                        status="success"
                        onRemove={() => remove(file.name)}
                    />
                ))}
            </Upload.List>
        </Upload>
    );
};

// Turning Files Away, where the control says why the ones it would not take were left out
export const WithRejections: StoryFn<typeof Upload> = () => {
    const [rejections, setRejections] = React.useState<UploadRejection[]>([]);

    return (
        <div className={classes.stack}>
            <Upload accept="image/*" maxSize={1_048_576} multiple onReject={setRejections}>
                <Upload.Icon icon={ImageRegular} />
                <Upload.Label>Drag and drop images here, or browse</Upload.Label>
                <Upload.Description>PNG, JPG or GIF, up to 1 MB each</Upload.Description>
            </Upload>
            {rejections.map(({ file, reason }) => (
                <Text key={file.name} size="small">
                    {file.name} ({formatFileSize(file.size)}) {reasons[reason]}
                </Text>
            ))}
        </div>
    );
};

// Watching An Upload Along, where the bar follows a file that is still on its way
export const InProgress: StoryFn<typeof Upload> = () => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const interval = window.setInterval(() => {
            setProgress((current) => (current >= 100 ? 0 : current + 5));
        }, 300);

        return () => {
            window.clearInterval(interval);
        };
    }, []);

    return (
        <Upload multiple>
            <Upload.Icon />
            <Upload.Label>Drag and drop files here, or browse</Upload.Label>
            <Upload.Description>Any file type, up to 25 MB each</Upload.Description>
            <Upload.List>
                <Upload.Item
                    name="on-its-way.mp4"
                    fileSize={18_874_368}
                    status={progress >= 100 ? "success" : "uploading"}
                    progress={progress}
                />
            </Upload.List>
        </Upload>
    );
};
