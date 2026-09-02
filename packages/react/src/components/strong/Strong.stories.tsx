import type { StoryFn, Meta } from "@storybook/react-vite";
import { Strong } from ".";
import type { StrongProps } from "./Strong.types";

export default {
    title: "Components/Strong",
    component: Strong,
} as Meta<typeof Strong>;

export const Default: StoryFn<typeof Strong> = () => <Strong>Important text</Strong>;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<StrongProps> = (args) => <Strong {...args}>Important text</Strong>;

Playground.args = {
    as: "strong",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["strong", "b", "span"],
        description: "HTML element to render",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["large", "medium", "small"],
        description: "Size variant of the words, which is inherited when left unset",
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
