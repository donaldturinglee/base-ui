import type { StoryFn, Meta } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import Checkbox from "./Checkbox";
import type { CheckboxProps } from "./Checkbox.types";

const classes = {
    field: "flex items-start gap-[var(--base-size-8)]",
};

export default {
    title: "Components/Checkbox",
    component: Checkbox,
} as Meta<typeof Checkbox>;

export const Default: StoryFn<typeof Checkbox> = () => (
    <Stack direction="horizontal" gap="condensed" align="start" className={classes.field}>
        <Checkbox id="default-choice" value="one" />
        <Text as="label" htmlFor="default-choice">
            Notify me about new releases
        </Text>
    </Stack>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<CheckboxProps> = (args) => (
    <Stack direction="horizontal" gap="condensed" align="start" className={classes.field}>
        <Checkbox {...args} id="playground-choice" />
        <Text as="label" htmlFor="playground-choice">
            Notify me about new releases
        </Text>
    </Stack>
);

Playground.args = {
    value: "one",
    indeterminate: false,
    disabled: false,
    required: false,
};

Playground.argTypes = {
    indeterminate: {
        control: {
            type: "boolean",
        },
        description: "Shows a dash rather than a tick, for a part checked group",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the box being used",
    },
    required: {
        control: {
            type: "boolean",
        },
        description: "Requires the box to be checked before the form can be submitted",
    },
    validationStatus: {
        control: {
            type: "radio",
        },
        options: [undefined, "error", "success"],
        description: "Only informs the ARIA attributes; the group carries the styling",
    },
    value: {
        control: {
            type: "text",
        },
        description: "Identifies the box on submission and in its group's selection",
    },
};

Playground.parameters = {
    layout: "centered",
};
