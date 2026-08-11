import type { StoryFn, Meta } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import Hidden from "./Hidden";
import type { HiddenProps } from "./Hidden.types";

export default {
    title: "Components/Hidden",
    component: Hidden,
} as Meta<typeof Hidden>;

export const Default: StoryFn<typeof Hidden> = () => (
    <Stack gap="condensed">
        <Text>Resize the viewport to hide the content below.</Text>
        <Hidden when="narrow">
            <Text>Shown while the viewport is regular or wide</Text>
        </Hidden>
    </Stack>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<HiddenProps> = (args) => (
    <Hidden {...args}>
        <Text>Hidden while the viewport is {[args.when].flat().join(", ")}</Text>
    </Hidden>
);

Playground.args = {
    when: ["narrow"],
};

Playground.argTypes = {
    when: {
        control: {
            type: "multi-select",
        },
        options: ["narrow", "regular", "wide"],
        description: "Viewport ranges the children are hidden at",
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
