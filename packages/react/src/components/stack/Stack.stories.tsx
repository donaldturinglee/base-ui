import type { StoryFn, Meta } from "@storybook/react-vite";
import { Placeholder } from "../placeholder";
import { Stack } from ".";
import type { StackProps } from "./Stack.types";

export default {
    title: "Components/Stack",
    component: Stack,
} as Meta<typeof Stack>;

export const Default: StoryFn<typeof Stack> = () => (
    <Stack>
        <Placeholder height="64px" label="First" />
        <Placeholder height="64px" label="Second" />
        <Placeholder height="64px" label="Third" />
    </Stack>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<StackProps> = (args) => (
    <Stack {...args}>
        <Placeholder height="64px" label="First" />
        <Placeholder height="64px" label="Second" />
        <Placeholder height="64px" label="Third" />
    </Stack>
);

Playground.args = {
    as: "div",
    gap: "normal",
    direction: "vertical",
    align: "stretch",
    wrap: "nowrap",
    justify: "start",
    padding: "none",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["div", "section", "ul"],
        description: "HTML element to render",
    },
    gap: {
        control: {
            type: "inline-radio",
        },
        options: ["none", "tight", "condensed", "cozy", "normal", "spacious"],
        description: "Gap between children in the stack",
    },
    direction: {
        control: {
            type: "radio",
        },
        options: ["horizontal", "vertical"],
        description: "Direction the children are stacked in",
    },
    align: {
        control: {
            type: "radio",
        },
        options: ["stretch", "start", "center", "end", "baseline"],
        description: "Alignment of the children on the cross axis",
    },
    wrap: {
        control: {
            type: "radio",
        },
        options: ["wrap", "nowrap"],
        description: "Whether the children wrap onto multiple lines",
    },
    justify: {
        control: {
            type: "radio",
        },
        options: ["start", "center", "end", "space-between", "space-evenly"],
        description: "Distribution of the children along the stacking direction",
    },
    padding: {
        control: {
            type: "inline-radio",
        },
        options: ["none", "tight", "condensed", "cozy", "normal", "spacious"],
        description: "Padding of the stack container",
    },
    paddingBlock: {
        control: {
            type: "inline-radio",
        },
        options: ["none", "tight", "condensed", "cozy", "normal", "spacious"],
        description: "Block padding of the stack container, overriding the block axis of padding",
    },
    paddingInline: {
        control: {
            type: "inline-radio",
        },
        options: ["none", "tight", "condensed", "cozy", "normal", "spacious"],
        description: "Inline padding of the stack container, overriding the inline axis of padding",
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
