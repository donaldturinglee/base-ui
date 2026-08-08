import type { StoryFn, Meta } from "@storybook/react-vite";
import { DismissRegular, DocumentPdfRegular } from "@gamecrafters/base-ui-icons";
import { Attachment } from ".";
import type { AttachmentProps } from "./Attachment.types";

export default {
    title: "Components/Attachment",
    component: Attachment,
} as Meta<typeof Attachment>;

export const Default: StoryFn<typeof Attachment> = () => (
    <Attachment>
        <Attachment.Media>
            <DocumentPdfRegular />
        </Attachment.Media>
        <Attachment.Content>
            <Attachment.Title>quarterly-report.pdf</Attachment.Title>
            <Attachment.Description>1.2 MB</Attachment.Description>
        </Attachment.Content>
        <Attachment.Actions>
            <Attachment.Action icon={DismissRegular} aria-label="Remove quarterly-report.pdf" />
        </Attachment.Actions>
    </Attachment>
);

export const Playground: StoryFn<AttachmentProps> = (args) => (
    <Attachment {...args}>
        <Attachment.Media>
            <DocumentPdfRegular />
        </Attachment.Media>
        <Attachment.Content>
            <Attachment.Title>quarterly-report.pdf</Attachment.Title>
            <Attachment.Description>1.2 MB</Attachment.Description>
        </Attachment.Content>
        <Attachment.Actions>
            <Attachment.Action icon={DismissRegular} aria-label="Remove quarterly-report.pdf" />
        </Attachment.Actions>
    </Attachment>
);

Playground.args = {
    state: "done",
    size: "medium",
    orientation: "horizontal",
};

Playground.argTypes = {
    state: {
        control: {
            type: "radio",
        },
        options: ["idle", "uploading", "processing", "error", "done"],
        description: "How far the file has got",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "Which step of the scale the attachment is drawn at",
    },
    orientation: {
        control: {
            type: "radio",
        },
        options: ["horizontal", "vertical"],
        description: "Laid out as a row in a list, or as a tile in a gallery",
    },
    as: {
        control: {
            type: "text",
        },
        description: "Which element the attachment is drawn as",
    },
    children: {
        table: {
            disable: true,
        },
    },
};
