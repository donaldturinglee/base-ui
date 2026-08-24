import type { StoryFn, Meta } from "@storybook/react-vite";
import { Text } from "../text";
import { Collapsible } from ".";
import type { CollapsibleProps } from "./Collapsible.types";

const classes = {
    box: "w-[var(--overlay-width-small)]",
};

export default {
    title: "Components/Collapsible",
    component: Collapsible,
} as Meta<typeof Collapsible>;

export const Default: StoryFn<typeof Collapsible> = () => (
    <Collapsible className={classes.box}>
        <Collapsible.Trigger>What is a collapsible?</Collapsible.Trigger>
        <Collapsible.Panel>
            <Text>
                A disclosure standing on its own: something to press, and content that is only there
                once it has been pressed.
            </Text>
        </Collapsible.Panel>
    </Collapsible>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<CollapsibleProps> = (args) => (
    <Collapsible {...args} className={classes.box}>
        <Collapsible.Trigger>What is a collapsible?</Collapsible.Trigger>
        <Collapsible.Panel>
            <Text>
                A disclosure standing on its own: something to press, and content that is only there
                once it has been pressed.
            </Text>
        </Collapsible.Panel>
    </Collapsible>
);

Playground.args = {
    defaultOpen: false,
    disabled: false,
};

Playground.argTypes = {
    defaultOpen: {
        control: {
            type: "boolean",
        },
        description: "Whether the disclosure starts out open",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the disclosure being opened or closed",
    },
    open: {
        control: {
            type: "boolean",
        },
        description: "Whether the disclosure is open, where the caller keeps hold of the state",
    },
    children: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
