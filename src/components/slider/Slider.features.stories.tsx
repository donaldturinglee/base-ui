import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Text } from "../text";
import { Slider } from ".";
import type { SliderSize } from "./Slider.types";

const classes = {
    stack: "flex w-[var(--overlay-width-small)] flex-col gap-[var(--base-size-16)]",
    field: "flex flex-col gap-[var(--base-size-4)]",
    label: "[font-size:var(--text-body-size-medium)] [font-weight:var(--base-text-weight-semibold)]",
    row: "flex items-center justify-between",
    // Sliders standing up are laid out along the row they are read across, each with whatever
    // names it beneath
    faders: "flex flex-row items-end gap-[var(--base-size-24)]",
    fader: "flex flex-col items-center gap-[var(--base-size-8)]",
    // Gives a slider standing up more room than it starts out with, so that filling the
    // height it stands in shows as more than the height it already had
    tall: "flex h-[12rem]",
};

const sizes: SliderSize[] = ["small", "medium", "large"];

export default {
    title: "Components/Slider/Features",
    parameters: {
        layout: "centered",
    },
};

// Sizes, which set how tall the track stands and how big the thumb is
export const Sizes: StoryFn<typeof Slider> = () => (
    <div className={classes.stack}>
        {sizes.map((size) => (
            <div key={size} className={classes.field}>
                <label htmlFor={`volume-${size}`} className={classes.label}>
                    {size}
                </label>
                <Slider id={`volume-${size}`} size={size} defaultValue={50} block />
            </div>
        ))}
    </div>
);

// Filling The Width Of What It Stands In
export const Block: StoryFn<typeof Slider> = () => (
    <div className={classes.stack}>
        <Slider aria-label="Keeps its own width" defaultValue={50} />
        <Slider aria-label="Fills the width" defaultValue={50} block />
    </div>
);

// Standing Up, which is filled from the bottom the way a fader is rather than from the top
export const Vertical: StoryFn<typeof Slider> = () => (
    <div className={classes.fader}>
        <Slider aria-label="Volume" orientation="vertical" defaultValue={60} />
        <Text size="small">Volume</Text>
    </div>
);

// Standing Up At Each Size, which sets how thick the track stands and how big the thumb is
// whichever way the slider runs
export const VerticalSizes: StoryFn<typeof Slider> = () => (
    <div className={classes.faders}>
        {sizes.map((size) => (
            <div key={size} className={classes.fader}>
                <Slider aria-label={size} orientation="vertical" size={size} defaultValue={50} />
                <Text size="small">{size}</Text>
            </div>
        ))}
    </div>
);

// Filling The Height Of What It Stands In, which is what filling means for a slider standing
// up
export const VerticalBlock: StoryFn<typeof Slider> = () => (
    <div className={classes.faders}>
        <div className={classes.tall}>
            <Slider aria-label="Keeps its own height" orientation="vertical" defaultValue={50} />
        </div>
        <div className={classes.tall}>
            <Slider aria-label="Fills the height" orientation="vertical" defaultValue={50} block />
        </div>
    </div>
);

// Over A Range Of Its Own, rather than the nought to a hundred it takes by default
export const CustomRange: StoryFn<typeof Slider> = () => (
    <div className={classes.field}>
        <label htmlFor="temperature" className={classes.label}>
            Temperature
        </label>
        <Slider id="temperature" min={16} max={30} defaultValue={21} block />
    </div>
);

// Moving In Steps, for a value that only makes sense at certain points along the range
export const WithSteps: StoryFn<typeof Slider> = () => (
    <div className={classes.field}>
        <label htmlFor="rating" className={classes.label}>
            Rating
        </label>
        <Slider id="rating" min={0} max={5} step={1} defaultValue={3} block />
    </div>
);

// Disabled, which fades the slider rather than draining the colour it is drawn in, so that
// where it stands can still be read off it
export const Disabled: StoryFn<typeof Slider> = () => (
    <div className={classes.field}>
        <label htmlFor="volume-disabled" className={classes.label}>
            Volume
        </label>
        <Slider id="volume-disabled" defaultValue={40} disabled block />
    </div>
);

// Controlled, where the caller holds the value and shows it beside the slider
export const Controlled: StoryFn<typeof Slider> = () => {
    const [value, setValue] = React.useState(40);

    return (
        <div className={classes.field}>
            <div className={classes.row}>
                <label htmlFor="controlled-volume" className={classes.label}>
                    Volume
                </label>
                <Text size="small">{value}%</Text>
            </div>
            <Slider
                id="controlled-volume"
                value={value}
                onChange={setValue}
                aria-valuetext={`${value} per cent`}
                block
            />
        </div>
    );
};

// Saying What The Value Stands For, where the number on its own would not say it
export const WithValueText: StoryFn<typeof Slider> = () => {
    const speeds = ["Slowest", "Slow", "Normal", "Fast", "Fastest"];
    const [value, setValue] = React.useState(2);

    return (
        <div className={classes.field}>
            <div className={classes.row}>
                <label htmlFor="speed" className={classes.label}>
                    Playback speed
                </label>
                <Text size="small">{speeds[value]}</Text>
            </div>
            <Slider
                id="speed"
                min={0}
                max={speeds.length - 1}
                value={value}
                onChange={setValue}
                aria-valuetext={speeds[value]}
                block
            />
        </div>
    );
};
