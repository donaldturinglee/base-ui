import type { StoryFn, Meta } from "@storybook/react-vite";
import { Text } from "../text";
import { Radio } from "../radio";
import { RadioGroup } from ".";
import type { RadioGroupProps } from "./RadioGroup.types";

const classes = {
    field: "flex items-start gap-[var(--base-size-8)]",
};

const choices = ["one", "two", "three"];

const radios = choices.map((value) => (
    <div key={value} className={classes.field}>
        <Radio id={`choice-${value}`} value={value} />
        <Text as="label" htmlFor={`choice-${value}`}>
            Choice {value}
        </Text>
    </div>
));

export default {
    title: "Components/RadioGroup",
    component: RadioGroup,
} as Meta<typeof RadioGroup>;

export const Default: StoryFn<typeof RadioGroup> = () => (
    <RadioGroup name="choices">
        <RadioGroup.Label>Choices</RadioGroup.Label>
        {radios}
    </RadioGroup>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<RadioGroupProps> = (args) => (
    <RadioGroup {...args}>
        <RadioGroup.Label>Choices</RadioGroup.Label>
        <RadioGroup.Caption>Pick one</RadioGroup.Caption>
        {radios}
    </RadioGroup>
);

Playground.args = {
    name: "choices",
    disabled: false,
    required: false,
};

Playground.argTypes = {
    name: {
        control: {
            type: "text",
        },
        description: "Ties the radios together, so only one of them can be checked",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops every radio in the group being used",
    },
    required: {
        control: {
            type: "boolean",
        },
        description: "Requires a choice before the form can be submitted",
    },
    children: {
        table: {
            disable: true,
        },
    },
    ref: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
