import type { StoryFn, Meta } from "@storybook/react-vite";
import { Highlight } from ".";
import type { HighlightProps } from "./Highlight.types";

export default {
    title: "Components/Highlight",
    component: Highlight,
} as Meta<typeof Highlight>;

export const Default: StoryFn<typeof Highlight> = () => (
    <Highlight match="request">Pull request</Highlight>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<HighlightProps> = (args) => <Highlight {...args} />;

Playground.args = {
    as: "span",
    children: "Pull request",
    match: "request",
    variant: "attention",
    caseSensitive: false,
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["span", "p", "div"],
        description: "HTML element to render",
    },
    children: {
        control: {
            type: "text",
        },
        description: "Text the terms are looked for in",
    },
    match: {
        control: {
            type: "text",
        },
        description: "Term to pick out of the text",
    },
    variant: {
        control: {
            type: "radio",
        },
        options: ["attention", "accent", "success", "danger", "neutral"],
        description: "Colour the runs are picked out in",
    },
    caseSensitive: {
        control: {
            type: "boolean",
        },
        description: "Whether a term only stands where the letters match in case as well",
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
