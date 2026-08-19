import type { StoryFn, Meta } from "@storybook/react-vite";
import { Code } from ".";
import type { CodeProps } from "./Code.types";

export default {
    title: "Components/Code",
    component: Code,
} as Meta<typeof Code>;

export const Default: StoryFn<typeof Code> = () => <Code>npm install</Code>;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<CodeProps> = (args) => <Code {...args}>npm install</Code>;

Playground.args = {
    as: "code",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["code", "span", "kbd", "samp"],
        description: "HTML element to render",
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
