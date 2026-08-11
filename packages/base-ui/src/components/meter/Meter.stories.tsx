import type { StoryFn, Meta } from "@storybook/react-vite";
import { Meter } from ".";
import type { MeterProps } from "./Meter.types";

const classes = {
    // A meter fills its container, so the stories give it one to fill
    container: "w-[var(--overlay-width-small)]",
};

export default {
    title: "Components/Meter",
    component: Meter,
} as Meta<typeof Meter>;

export const Default: StoryFn<typeof Meter> = () => (
    <div className={classes.container}>
        <Meter value={72}>
            <Meter.Label>Storage used</Meter.Label>
            <Meter.Value />
        </Meter>
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<MeterProps> = (args) => (
    <div className={classes.container}>
        <Meter {...args}>
            <Meter.Label>Storage used</Meter.Label>
            <Meter.Value />
        </Meter>
    </div>
);

Playground.args = {
    value: 72,
    min: 0,
    max: 100,
    size: "medium",
    variant: "success",
};

Playground.argTypes = {
    value: {
        control: {
            type: "number",
        },
        description: "Where the reading stands",
    },
    min: {
        control: {
            type: "number",
        },
        description: "The end the range is measured from",
    },
    max: {
        control: {
            type: "number",
        },
        description: "The end it is measured to",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "How tall the groove is drawn",
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
        description: "What the indicator is painted",
    },
    format: {
        table: {
            disable: true,
        },
    },
    getAriaValueText: {
        table: {
            disable: true,
        },
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
