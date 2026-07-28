import type { StoryFn, Meta } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import Divider from "./Divider";
import type { DividerProps } from "./Divider.types";

const classes = {
    // Gives the line a container to run the width of
    container: "w-[20rem]",
};

export default {
    title: "Components/Divider",
    component: Divider,
} as Meta<typeof Divider>;

export const Default: StoryFn<typeof Divider> = () => (
    <Stack gap="normal" className={classes.container}>
        <Text>Above the line</Text>
        <Divider />
        <Text>Below the line</Text>
    </Stack>
);

export const Playground: StoryFn<DividerProps> = (args) => (
    <Stack
        gap="normal"
        direction={args.orientation === "vertical" ? "horizontal" : "vertical"}
        align={args.orientation === "vertical" ? "center" : "stretch"}
        className={classes.container}
    >
        <Text>One side</Text>
        <Divider {...args} />
        <Text>The other</Text>
    </Stack>
);

Playground.args = {
    orientation: "horizontal",
    variant: "default",
};

Playground.argTypes = {
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
