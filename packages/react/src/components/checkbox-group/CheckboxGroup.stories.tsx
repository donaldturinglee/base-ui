import type { StoryFn, Meta } from "@storybook/react-vite";
import { Text } from "../text";
import { Checkbox } from "../checkbox";
import { CheckboxGroup } from ".";
import type { CheckboxGroupProps } from "./CheckboxGroup.types";

const classes = {
    field: "flex items-start gap-[var(--base-size-8)]",
};

const choices = ["one", "two", "three"];

const boxes = choices.map((value) => (
    <div key={value} className={classes.field}>
        <Checkbox id={`choice-${value}`} value={value} />
        <Text as="label" htmlFor={`choice-${value}`}>
            Choice {value}
        </Text>
    </div>
));

export default {
    title: "Components/CheckboxGroup",
    component: CheckboxGroup,
} as Meta<typeof CheckboxGroup>;

export const Default: StoryFn<typeof CheckboxGroup> = () => (
    <CheckboxGroup>
        <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
        {boxes}
    </CheckboxGroup>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<CheckboxGroupProps> = (args) => (
    <CheckboxGroup {...args}>
        <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
        <CheckboxGroup.Caption>Pick as many as you like</CheckboxGroup.Caption>
        {boxes}
    </CheckboxGroup>
);

Playground.args = {
    disabled: false,
    required: false,
};

Playground.argTypes = {
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops every box in the group being used",
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
