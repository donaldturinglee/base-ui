import type { StoryFn, Meta } from "@storybook/react-vite";
import { Heading } from "./Heading";
import type { HeadingProps } from "./Heading.types";

export default {
    title: "Components/Heading",
    component: Heading,
} as Meta<typeof Heading>;

export const Default: StoryFn<typeof Heading> = () => (
    <Heading size="large">Content heading</Heading>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<HeadingProps> = (args) => (
    <Heading {...args}>Content heading</Heading>
);

Playground.args = {
    as: "h2",
    size: "large",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["h1", "h2", "h3", "h4", "h5", "h6"],
        description: "HTML heading element to render",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["large", "medium", "small"],
        description: "Size variant of the heading",
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
