import type { StoryFn, Meta } from "@storybook/react-vite";
import Placeholder from "./Placeholder";
import type { PlaceholderProps } from "./Placeholder.types";

export default {
    title: "Components/Placeholder",
    component: Placeholder,
} as Meta<typeof Placeholder>;

export const Default: StoryFn<typeof Placeholder> = () => (
    <Placeholder height="64px" label="Placeholder" />
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<PlaceholderProps> = (args) => <Placeholder {...args} />;

Playground.args = {
    as: "div",
    width: "320px",
    height: "64px",
    label: "Placeholder",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["div", "section", "span"],
        description: "HTML element to render",
    },
    width: {
        control: {
            type: "text",
        },
        description: "Width of the placeholder as a CSS length",
    },
    height: {
        control: {
            type: "text",
        },
        description: "Height of the placeholder as a CSS length",
    },
    label: {
        control: {
            type: "text",
        },
        description: "Label rendered inside the placeholder",
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
