import type { StoryFn, Meta } from "@storybook/react-vite";
import { Blockquote } from ".";
import type { BlockquoteProps } from "./Blockquote.types";

const classes = {
    // Gives the quotation a column to wrap within
    container: "w-[20rem]",
};

const quotation =
    "A quotation stands apart from the page around it, so a reader can see at once that the words were taken from somewhere else.";

export default {
    title: "Components/Blockquote",
    component: Blockquote,
} as Meta<typeof Blockquote>;

export const Default: StoryFn<typeof Blockquote> = () => (
    <Blockquote className={classes.container}>{quotation}</Blockquote>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<BlockquoteProps> = (args) => (
    <Blockquote {...args} className={classes.container}>
        {quotation}
    </Blockquote>
);

Playground.args = {
    as: "blockquote",
    size: "medium",
    variant: "default",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["blockquote", "figure", "div"],
        description: "HTML element to render",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["large", "medium", "small"],
        description: "Size variant of the quotation",
    },
    variant: {
        control: {
            type: "radio",
        },
        options: ["subtle", "default", "emphasis"],
        description: "How much weight the rule carries",
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
