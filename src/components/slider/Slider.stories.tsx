import type { StoryFn, Meta } from "@storybook/react-vite";
import { Slider } from ".";
import type { SliderProps } from "./Slider.types";

const classes = {
    box: "w-[var(--overlay-width-small)]",
};

export default {
    title: "Components/Slider",
    component: Slider,
} as Meta<typeof Slider>;

export const Default: StoryFn<typeof Slider> = () => (
    <div className={classes.box}>
        <Slider aria-label="Volume" defaultValue={50} block />
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<SliderProps> = (args) => (
    <div className={classes.box}>
        <Slider aria-label="Volume" {...args} />
    </div>
);

Playground.args = {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    size: "medium",
    block: true,
    disabled: false,
};

Playground.argTypes = {
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "Which step of the control scale the slider stands at",
    },
    min: {
        control: {
            type: "number",
        },
        description: "The lowest the slider goes",
    },
    max: {
        control: {
            type: "number",
        },
        description: "The highest the slider goes",
    },
    step: {
        control: {
            type: "number",
        },
        description: "How far the slider moves at a time",
    },
    defaultValue: {
        control: {
            type: "number",
        },
        description: "Where the slider starts out",
    },
    block: {
        control: {
            type: "boolean",
        },
        description: "Fills the width of whatever the slider stands in",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the slider being used",
    },
    value: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
