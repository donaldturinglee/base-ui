import type { StoryFn, Meta } from "@storybook/react-vite";
import { ProgressCircle } from ".";
import type { ProgressCircleProps } from "./ProgressCircle.types";

export default {
    title: "Components/ProgressCircle",
    component: ProgressCircle,
} as Meta<typeof ProgressCircle>;

export const Default: StoryFn<typeof ProgressCircle> = () => (
    <ProgressCircle progress={66} aria-label="Upload test.png" />
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<ProgressCircleProps> = (args) => (
    <ProgressCircle {...args} aria-label="Upload test.png" />
);

Playground.args = {
    progress: 66,
    size: "large",
    variant: "success",
    children: "66%",
};

Playground.argTypes = {
    progress: {
        control: {
            type: "number",
            min: 0,
            max: 100,
            step: 1,
        },
        description: "Percentage of the ring that is filled in",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "Diameter of the ring",
    },
    variant: {
        control: {
            type: "select",
        },
        options: [
            "accent",
            "attention",
            "danger",
            "done",
            "neutral",
            "severe",
            "sponsors",
            "success",
        ],
        description: "Colour of the filled in arc",
    },
    children: {
        control: {
            type: "text",
        },
        description: "Words laid in the middle of the ring",
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
