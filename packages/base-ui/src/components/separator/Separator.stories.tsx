import type { StoryFn, Meta } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Separator } from ".";
import type { SeparatorProps } from "./Separator.types";

const classes = {
    // Gives the line a container to run the width of
    container: "w-[20rem]",
};

export default {
    title: "Components/Separator",
    component: Separator,
} as Meta<typeof Separator>;

export const Default: StoryFn<typeof Separator> = () => (
    <Stack gap="normal" className={classes.container}>
        <Text>Above the line</Text>
        <Separator />
        <Text>Below the line</Text>
    </Stack>
);

export const Playground: StoryFn<SeparatorProps> = (args) => (
    <Stack
        gap="normal"
        direction={args.orientation === "vertical" ? "horizontal" : "vertical"}
        align={args.orientation === "vertical" ? "center" : "stretch"}
        className={classes.container}
    >
        <Text>One side</Text>
        <Separator {...args} />
        <Text>The other</Text>
    </Stack>
);

Playground.args = {
    as: "div",
    orientation: "horizontal",
    variant: "default",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["div", "hr"],
        description: "HTML element to render",
    },
    orientation: {
        control: {
            type: "radio",
        },
        options: ["horizontal", "vertical"],
        description: "Which way the line runs",
    },
    variant: {
        control: {
            type: "radio",
        },
        options: ["subtle", "default", "emphasis"],
        description: "How much weight the line carries",
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
