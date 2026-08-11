import type { StoryFn, Meta } from "@storybook/react-vite";
import { Mark } from ".";
import type { MarkProps } from "./Mark.types";

export default {
    title: "Components/Mark",
    component: Mark,
} as Meta<typeof Mark>;

export const Default: StoryFn<typeof Mark> = () => <Mark>Marked text</Mark>;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<MarkProps> = (args) => <Mark {...args}>Marked text</Mark>;

Playground.args = {
    as: "mark",
    variant: "attention",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["mark", "span"],
        description: "HTML element to render",
    },
    variant: {
        control: {
            type: "radio",
        },
        options: ["attention", "accent", "success", "danger", "neutral"],
        description: "Colour the highlight is painted in",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["large", "medium", "small"],
        description: "Size variant of the highlight, which is inherited when left unset",
    },
    weight: {
        control: {
            type: "radio",
        },
        options: ["light", "normal", "medium", "semibold"],
        description: "Font weight of the highlight, which is inherited when left unset",
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
