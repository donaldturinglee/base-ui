import type { StoryFn, Meta } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { NativeSelect } from ".";
import type { NativeSelectProps } from "./NativeSelect.types";

const choices = (
    <>
        <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
        <NativeSelect.Option value="two">Choice two</NativeSelect.Option>
        <NativeSelect.Option value="three">Choice three</NativeSelect.Option>
        <NativeSelect.Option value="four">Choice four</NativeSelect.Option>
    </>
);

export default {
    title: "Components/NativeSelect",
    component: NativeSelect,
} as Meta<typeof NativeSelect>;

export const Default: StoryFn<typeof NativeSelect> = () => (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="default-choice">
            Choice
        </Text>
        <NativeSelect id="default-choice">{choices}</NativeSelect>
    </Stack>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<NativeSelectProps> = (args) => (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="playground-choice">
            Choice
        </Text>
        <NativeSelect {...args} id="playground-choice">
            {choices}
        </NativeSelect>
    </Stack>
);

Playground.args = {
    size: "medium",
    block: false,
    disabled: false,
    required: false,
    placeholder: "",
};

Playground.argTypes = {
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "Height and type scale of the field",
    },
    validationStatus: {
        control: {
            type: "radio",
        },
        options: [undefined, "error", "success"],
        description: "Colours the border, and marks the control invalid for an error",
    },
    placeholder: {
        control: {
            type: "text",
        },
        description: "Stands in until a choice is made, as the first option",
    },
    block: {
        control: {
            type: "boolean",
        },
        description: "Fills the width of its container",
    },
    required: {
        control: {
            type: "boolean",
        },
        description: "Requires a choice, taking the placeholder out of the options",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the field being used",
    },
    children: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
