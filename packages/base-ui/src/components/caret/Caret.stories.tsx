import type { Meta, StoryFn } from "@storybook/react-vite";
import { Caret } from ".";
import type { CaretProps } from "./Caret.types";

const classes = {
    // A caret is laid out against whichever ancestor is positioned, so the stories give it a
    // surface to point from. The room around that surface is what the point stands out into
    container: "p-[var(--base-size-24)]",
    surface:
        "relative flex h-[5rem] w-[12rem] items-center justify-center rounded-[var(--border-radius-medium)] border border-solid border-[var(--border-color-default)] bg-[var(--overlay-background-color)]",
};

export default {
    title: "Components/Caret",
    component: Caret,
} as Meta<typeof Caret>;

export const Default: StoryFn<typeof Caret> = () => (
    <div className={classes.container}>
        <div className={classes.surface}>
            Surface
            <Caret />
        </div>
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<CaretProps> = (args) => (
    <div className={classes.container}>
        <div className={classes.surface}>
            Surface
            <Caret {...args} />
        </div>
    </div>
);

Playground.args = {
    location: "bottom",
    size: 8,
};

Playground.argTypes = {
    location: {
        control: {
            type: "select",
        },
        options: [
            "top",
            "bottom",
            "left",
            "right",
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
            "left-top",
            "left-bottom",
            "right-top",
            "right-bottom",
        ],
        description: "Which edge the caret stands on, and where along that edge",
    },
    size: {
        control: {
            type: "number",
        },
        description: "How far the point stands out from the edge it is drawn against",
    },
    background: {
        control: {
            type: "color",
        },
        description: "What the caret is painted",
    },
    borderColor: {
        control: {
            type: "color",
        },
        description: "What the caret is outlined with",
    },
    borderWidth: {
        control: {
            type: "text",
        },
        description: "How thick that outline is drawn",
    },
};

Playground.parameters = {
    layout: "centered",
};
