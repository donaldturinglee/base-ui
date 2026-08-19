import type { Decorator, StoryFn, Meta } from "@storybook/react-vite";
import { FileUpload } from ".";
import type { FileUploadProps } from "./FileUpload.types";

const classes = {
    // A drop zone fills its container, so the stories give it one to fill
    container: "w-[var(--overlay-width-medium)] max-w-full",
};

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

export default {
    title: "Components/FileUpload",
    component: FileUpload,
    decorators: [withContainer],
} as Meta<typeof FileUpload>;

export const Default: StoryFn<typeof FileUpload> = () => (
    <FileUpload>
        <FileUpload.Icon />
        <FileUpload.Label>Drag and drop files here, or browse</FileUpload.Label>
        <FileUpload.Description>Any file type, up to 25 MB each</FileUpload.Description>
    </FileUpload>
);

export const Playground: StoryFn<FileUploadProps> = (args) => (
    <FileUpload {...args}>
        <FileUpload.Icon />
        <FileUpload.Label>Drag and drop files here, or browse</FileUpload.Label>
        <FileUpload.Description>Any file type, up to 25 MB each</FileUpload.Description>
        <FileUpload.List>
            <FileUpload.Item name="proposal.pdf" fileSize={248_320} onRemove={() => {}} />
        </FileUpload.List>
    </FileUpload>
);

Playground.args = {
    size: "medium",
    multiple: true,
    disabled: false,
    required: false,
};

Playground.argTypes = {
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "Which step of the control scale the drop zone stands at",
    },
    accept: {
        control: {
            type: "text",
        },
        description: "Which types the picker offers, applied to what is dropped as well",
    },
    multiple: {
        control: {
            type: "boolean",
        },
        description: "Takes more than one file at a time",
    },
    maxSize: {
        control: {
            type: "number",
        },
        description: "The most a single file may weigh, in bytes",
    },
    validationStatus: {
        control: {
            type: "radio",
        },
        options: [undefined, "error", "success"],
        description: "Draws the drop zone as invalid or as accepted",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the control being used",
    },
    required: {
        control: {
            type: "boolean",
        },
        description: "Makes a file needed before the form it stands in can be sent",
    },
};
