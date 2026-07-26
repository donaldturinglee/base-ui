import type { StoryFn, Meta } from "@storybook/react-vite";
import { ProgressBar } from ".";
import type { ProgressBarProps } from "./ProgressBar.types";

const classes = {
    // A centered story shrinks to fit its content, so the track needs a width of its own
    track: "w-[20rem]",
    inlineTrack: "w-[6.25rem]",
};

export default {
    title: "Components/ProgressBar",
    component: ProgressBar,
} as Meta<typeof ProgressBar>;

export const Default: StoryFn<typeof ProgressBar> = () => (
    <ProgressBar progress={66} className={classes.track} aria-label="Upload test.png" />
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<ProgressBarProps> = (args) => (
    <ProgressBar
        {...args}
        className={args.inline ? classes.inlineTrack : classes.track}
        aria-label="Upload test.png"
    />
);

Playground.args = {
    progress: 66,
    size: "medium",
    variant: "success",
    inline: false,
    animated: false,
};

Playground.argTypes = {
    progress: {
        control: {
            type: "number",
            min: 0,
            max: 100,
            step: 1,
        },
        description: "Percentage of the track that is filled in",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "Height of the track",
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
        description: "Colour of the filled in area",
    },
    inline: {
        control: {
            type: "boolean",
        },
        description: "Lays the track out inline instead of as a block",
    },
    animated: {
        control: {
            type: "boolean",
        },
        description: "Sweeps a shimmer across the filled in area",
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
