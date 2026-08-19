import type { StoryFn, Meta } from "@storybook/react-vite";
import { Text } from "../text";
import { Box } from ".";
import type { BoxProps } from "./Box.types";

export default {
    title: "Components/Box",
    component: Box,
} as Meta<typeof Box>;

export const Default: StoryFn<typeof Box> = () => (
    <Box padding="normal" background="muted" border="default" radius="medium">
        <Text>A box leaves room around what it holds and draws the surface it stands on</Text>
    </Box>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<BoxProps> = (args) => (
    <Box {...args}>
        <Text>A box leaves room around what it holds and draws the surface it stands on</Text>
    </Box>
);

Playground.args = {
    as: "div",
    padding: "normal",
    background: "muted",
    border: "default",
    radius: "medium",
    shadow: "none",
    overflow: "visible",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["div", "section", "article", "aside"],
        description: "HTML element to render",
    },
    padding: {
        control: {
            type: "inline-radio",
        },
        options: ["none", "tight", "condensed", "cozy", "normal", "spacious"],
        description: "The room left inside the box",
    },
    paddingBlock: {
        control: {
            type: "inline-radio",
        },
        options: ["none", "tight", "condensed", "cozy", "normal", "spacious"],
        description: "Block padding of the box, overriding the block axis of padding",
    },
    paddingInline: {
        control: {
            type: "inline-radio",
        },
        options: ["none", "tight", "condensed", "cozy", "normal", "spacious"],
        description: "Inline padding of the box, overriding the inline axis of padding",
    },
    background: {
        control: {
            type: "radio",
        },
        options: ["none", "default", "muted", "inset", "emphasis"],
        description: "The fill drawn behind whatever the box holds",
    },
    border: {
        control: {
            type: "radio",
        },
        options: ["none", "default", "muted"],
        description: "The line drawn around the box",
    },
    radius: {
        control: {
            type: "inline-radio",
        },
        options: ["none", "small", "medium", "large", "full"],
        description: "How far the corners are turned in",
    },
    shadow: {
        control: {
            type: "radio",
        },
        options: ["none", "xsmall", "small", "medium"],
        description: "How far the box is lifted off the page",
    },
    overflow: {
        control: {
            type: "radio",
        },
        options: ["visible", "hidden"],
        description: "Whether what is inside spills past the edges or is cropped to them",
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
