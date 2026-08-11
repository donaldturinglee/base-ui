import type { StoryFn, Meta } from "@storybook/react-vite";
import Label from "./Label";
import type { LabelProps } from "./Label.types";

export default {
    title: "Components/Label",
    component: Label,
} as Meta<typeof Label>;

export const Default: StoryFn<typeof Label> = () => <Label>Default</Label>;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<LabelProps> = (args) => <Label {...args}>Label</Label>;

Playground.args = {
    as: "span",
    variant: "default",
    size: "small",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["span", "div", "a"],
        description: "HTML element to render",
    },
    variant: {
        control: {
            type: "select",
        },
        options: [
            "default",
            "primary",
            "secondary",
            "accent",
            "success",
            "attention",
            "severe",
            "danger",
            "done",
            "sponsors",
        ],
        description: "Color variant of the label",
    },
    size: {
        control: {
            type: "inline-radio",
        },
        options: ["small", "medium", "large"],
        description: "Size variant of the label",
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
