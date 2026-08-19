import type { StoryFn, Meta } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { TextInput } from ".";
import type { TextInputProps } from "./TextInput.types";

export default {
    title: "Components/TextInput",
    component: TextInput,
} as Meta<typeof TextInput>;

export const Default: StoryFn<typeof TextInput> = () => (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="default-name">
            Name
        </Text>
        <TextInput id="default-name" />
    </Stack>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<TextInputProps> = (args) => (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="playground-name">
            Name
        </Text>
        <TextInput {...args} id="playground-name" />
    </Stack>
);

Playground.args = {
    type: "text",
    size: "medium",
    placeholder: "Ada Lovelace",
    block: false,
    contrast: false,
    monospace: false,
    disabled: false,
    required: false,
    loading: false,
    loaderPosition: "auto",
};

Playground.argTypes = {
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "Which step of the control scale the field stands at",
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
    loading: {
        control: {
            type: "boolean",
        },
        description: "Shows a spinner inside the field while it is waiting on something",
    },
    loaderPosition: {
        control: {
            type: "radio",
        },
        options: ["auto", "leading", "trailing"],
        description: "Which end of the field the spinner stands at",
    },
    loaderText: {
        control: {
            type: "text",
        },
        description: "What a screen reader is told while the field is waiting",
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
    monospace: {
        control: {
            type: "boolean",
        },
        description: "Sets the typing area in the monospace stack",
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
    leadingVisual: {
        table: {
            disable: true,
        },
    },
    trailingVisual: {
        table: {
            disable: true,
        },
    },
    trailingAction: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
