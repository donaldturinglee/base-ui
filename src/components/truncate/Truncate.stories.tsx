import type { StoryFn, Meta } from "@storybook/react-vite";
import Truncate, { DEFAULT_TRUNCATE_MAX_WIDTH } from "./Truncate";
import type { TruncateProps } from "./Truncate.types";

export default {
    title: "Components/Truncate",
    component: Truncate,
} as Meta<typeof Truncate>;

export const Default: StoryFn<typeof Truncate> = () => (
    <Truncate title="Some example text that runs past the end of the line">
        Some example text that runs past the end of the line
    </Truncate>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<TruncateProps> = (args) => (
    <Truncate {...args}>{args.title}</Truncate>
);

Playground.args = {
    title: "Some example text that runs past the end of the line",
    maxWidth: DEFAULT_TRUNCATE_MAX_WIDTH,
    inline: false,
    expandable: false,
};

Playground.argTypes = {
    title: {
        control: {
            type: "text",
        },
        description: "Full text, shown on hover and read out in place of the clipped text",
    },
    maxWidth: {
        control: {
            type: "number",
        },
        description: "Width the text is clipped at, in pixels unless given as a CSS length",
    },
    inline: {
        control: {
            type: "boolean",
        },
        description: "Sits inline with the surrounding text instead of taking the parent display",
    },
    expandable: {
        control: {
            type: "boolean",
        },
        description: "Opens up to the full text on hover",
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
