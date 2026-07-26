import type { StoryFn, Meta } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Textarea } from ".";
import type { TextareaProps } from "./Textarea.types";

export default {
    title: "Components/Textarea",
    component: Textarea,
} as Meta<typeof Textarea>;

export const Default: StoryFn<typeof Textarea> = () => (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="default-notes">
            Notes
        </Text>
        <Textarea id="default-notes" />
    </Stack>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<TextareaProps> = (args) => (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="playground-notes">
            Notes
        </Text>
        <Textarea {...args} id="playground-notes" />
    </Stack>
);

Playground.args = {
    rows: 7,
    cols: 30,
    resize: "both",
    block: false,
    contrast: false,
    disabled: false,
    required: false,
};

Playground.argTypes = {
    resize: {
        control: {
            type: "radio",
        },
        options: ["none", "both", "horizontal", "vertical"],
        description: "Which axes the reader can resize the field along",
    },
    validationStatus: {
        control: {
            type: "radio",
        },
        options: [undefined, "error", "success"],
        description: "Colours the border, and marks the control invalid for an error",
    },
    characterLimit: {
        control: {
            type: "number",
        },
        description: "Shows a counter below the field, and reports an error once it is passed",
    },
    rows: {
        control: {
            type: "number",
        },
        description: "Visible height of the field, in lines",
    },
    cols: {
        control: {
            type: "number",
        },
        description: "Visible width of the field, in characters",
    },
    block: {
        control: {
            type: "boolean",
        },
        description: "Fills the width of its container",
    },
    contrast: {
        control: {
            type: "boolean",
        },
        description: "Recesses the field against the page",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the field being used",
    },
    required: {
        control: {
            type: "boolean",
        },
        description: "Requires the field before the form can be submitted",
    },
};

Playground.parameters = {
    layout: "centered",
};
