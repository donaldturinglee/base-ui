import type { StoryFn, Meta } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import Radio from "./Radio";
import type { RadioProps } from "./Radio.types";

const classes = {
    field: "flex items-start gap-[var(--base-size-8)]",
};

export default {
    title: "Components/Radio",
    component: Radio,
} as Meta<typeof Radio>;

export const Default: StoryFn<typeof Radio> = () => (
    <Stack direction="horizontal" gap="condensed" align="start" className={classes.field}>
        <Radio id="default-choice" name="default-choices" value="one" />
        <Text as="label" htmlFor="default-choice">
            Notify me about new releases
        </Text>
    </Stack>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<RadioProps> = (args) => (
    <Stack direction="horizontal" gap="condensed" align="start" className={classes.field}>
        <Radio {...args} id="playground-choice" />
        <Text as="label" htmlFor="playground-choice">
            Notify me about new releases
        </Text>
    </Stack>
);

Playground.args = {
    name: "playground-choices",
    value: "one",
    disabled: false,
    required: false,
};

Playground.argTypes = {
    name: {
        control: {
            type: "text",
        },
        description: "Ties the radio to its siblings; taken from the group when it is left out",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the radio being used",
    },
    required: {
        control: {
            type: "boolean",
        },
        description: "Requires a choice before the form can be submitted",
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
        description: "Identifies the radio on submission and as its group's selection",
    },
};

Playground.parameters = {
    layout: "centered",
};
