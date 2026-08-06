import type { StoryFn, Meta } from "@storybook/react-vite";
import { DirectionProvider, useDirection } from ".";
import type { DirectionProviderProps } from "./Direction.types";

const classes = {
    panel: "p-[var(--base-size-16)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default",
};

export default {
    title: "Components/DirectionProvider",
    component: DirectionProvider,
} as Meta<typeof DirectionProvider>;

const ActiveDirection = () => {
    const direction = useDirection();

    return (
        <div>
            Reading direction: {direction}
            <br />
            The text starts on the side the page is read from
        </div>
    );
};

export const Default: StoryFn<typeof DirectionProvider> = () => (
    <DirectionProvider className={classes.panel}>
        <ActiveDirection />
    </DirectionProvider>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<DirectionProviderProps> = (args) => (
    <DirectionProvider {...args} className={classes.panel}>
        <ActiveDirection />
    </DirectionProvider>
);

Playground.args = {
    direction: "ltr",
    contextOnly: false,
};

Playground.argTypes = {
    direction: {
        control: {
            type: "inline-radio",
        },
        options: ["ltr", "rtl"],
        description: "Which way the subtree is read",
    },
    contextOnly: {
        control: {
            type: "boolean",
        },
        description: "Hands the direction to descendants without wrapping them in an element",
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
