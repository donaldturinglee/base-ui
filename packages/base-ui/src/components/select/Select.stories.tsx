import type { StoryFn, Meta } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Select } from ".";
import type { SelectProps } from "./Select.types";

const choices = (
    <>
        <Select.Option value="one">Choice one</Select.Option>
        <Select.Option value="two">Choice two</Select.Option>
        <Select.Option value="three">Choice three</Select.Option>
        <Select.Option value="four">Choice four</Select.Option>
    </>
);

export default {
    title: "Components/Select",
    component: Select,
} as Meta<typeof Select>;

export const Default: StoryFn<typeof Select> = () => (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="default-choice">
            Choice
        </Text>
        <Select id="default-choice" placeholder="Pick a choice">
            {choices}
        </Select>
    </Stack>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<SelectProps> = (args) => (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="playground-choice">
            Choice
        </Text>
        <Select {...args} id="playground-choice">
            {choices}
        </Select>
    </Stack>
);

Playground.args = {
    size: "medium",
    block: false,
    disabled: false,
    required: false,
    placeholder: "Pick a choice",
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
        description: "Stands in for the choice until one is made",
    },
    side: {
        control: {
            type: "radio",
        },
        options: ["outside-bottom", "outside-top"],
        description: "Which edge of the field the list stands off",
    },
    align: {
        control: {
            type: "radio",
        },
        options: ["start", "center", "end"],
        description: "Where along that edge the list lines up",
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
        description: "Says a choice has to be made",
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
