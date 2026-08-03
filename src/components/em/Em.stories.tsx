import type { StoryFn, Meta } from "@storybook/react-vite";
import { Em } from ".";
import type { EmProps } from "./Em.types";

export default {
    title: "Components/Em",
    component: Em,
} as Meta<typeof Em>;

export const Default: StoryFn<typeof Em> = () => <Em>Emphasised text</Em>;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<EmProps> = (args) => <Em {...args}>Emphasised text</Em>;

Playground.args = {
    as: "em",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["em", "i", "span"],
        description: "HTML element to render",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["large", "medium", "small"],
        description: "Size variant of the emphasis, which is inherited when left unset",
    },
    weight: {
        control: {
            type: "radio",
        },
        options: ["light", "normal", "medium", "semibold"],
        description: "Font weight of the emphasis, which is inherited when left unset",
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
