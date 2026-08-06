import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Slider } from "../slider";
import { StatisticCard } from "../statistic-card";
import { Text } from "../text";
import { Meter } from ".";

const classes = {
    // A meter fills its container, so the stories give it one to fill
    container: "w-[var(--overlay-width-small)]",
    stack: "flex flex-col gap-[var(--stack-gap-normal)]",
    swatches: "flex flex-col gap-[var(--stack-gap-condensed)]",
};

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

export default {
    title: "Components/Meter/Features",
    decorators: [withContainer],
    parameters: {
        layout: "centered",
    },
};

// The Groove On Its Own, for a reading a run of them already says enough about
export const WithoutALabel: StoryFn<typeof Meter> = () => <Meter value={72} aria-label="Storage" />;

// Measured Between Ends Of Its Own, where the reading is a figure rather than a share of
// something. The written reading still says how far along it stands, since 340 says nothing until
// it is known what it was measured against
export const WithARange: StoryFn<typeof Meter> = () => (
    <Meter value={340} min={0} max={512}>
        <Meter.Label>Memory in use</Meter.Label>
        <Meter.Value />
    </Meter>
);

// Written As A Figure, where the shape it is written in is the caller's to name
export const Formatted: StoryFn<typeof Meter> = () => (
    <div className={classes.stack}>
        <Meter value={340} min={0} max={512} format={{ style: "unit", unit: "gigabyte" }}>
            <Meter.Label>Memory in use</Meter.Label>
            <Meter.Value />
        </Meter>

        <Meter
            value={1284}
            min={0}
            max={2000}
            variant="accent"
            format={{ style: "currency", currency: "GBP", maximumFractionDigits: 0 }}
        >
            <Meter.Label>Spent this month</Meter.Label>
            <Meter.Value />
        </Meter>
    </div>
);

// Written The Caller's Own Way, where what the eye reads is not what the shape would give it
export const WithACustomValue: StoryFn<typeof Meter> = () => (
    <Meter value={340} min={0} max={512}>
        <Meter.Label>Memory in use</Meter.Label>
        <Meter.Value>{({ value }) => `${value} of 512 MB`}</Meter.Value>
    </Meter>
);

// Sized, which is the same three heights a progress bar is drawn at
export const Sizes: StoryFn<typeof Meter> = () => (
    <div className={classes.stack}>
        <Meter value={72} size="small">
            <Meter.Label>Small</Meter.Label>
            <Meter.Value />
        </Meter>

        <Meter value={72}>
            <Meter.Label>Medium</Meter.Label>
            <Meter.Value />
        </Meter>

        <Meter value={72} size="large">
            <Meter.Label>Large</Meter.Label>
            <Meter.Value />
        </Meter>
    </div>
);

// Coloured, for a reading whose place in the range means something in itself
export const Variants: StoryFn<typeof Meter> = () => (
    <div className={classes.swatches}>
        {(
            [
                "success",
                "accent",
                "attention",
                "severe",
                "danger",
                "done",
                "sponsors",
                "neutral",
            ] as const
        ).map((variant) => (
            <Meter key={variant} value={62} variant={variant}>
                <Meter.Label>{variant}</Meter.Label>
                <Meter.Value />
            </Meter>
        ))}
    </div>
);

// Coloured By Where It Stands, which is what a meter is usually wanted for: the reading itself is
// the news, and the colour is what says whether it is good news
const quotaVariant = (percentage: number) => {
    if (percentage >= 90) {
        return "danger";
    }

    if (percentage >= 75) {
        return "attention";
    }

    return "success";
};

export const ColouredByReading: StoryFn<typeof Meter> = () => {
    const [used, setUsed] = React.useState(48);

    return (
        <div className={classes.stack}>
            <Meter value={used} variant={quotaVariant(used)}>
                <Meter.Label>Storage used</Meter.Label>
                <Meter.Value />
            </Meter>

            <Slider
                value={used}
                onChange={setUsed}
                aria-label="Move the reading"
                min={0}
                max={100}
                block
            />
        </div>
    );
};

// Built From Its Parts, where the groove is laid out by the caller rather than drawn for them
export const WithItsOwnTrack: StoryFn<typeof Meter> = () => (
    <Meter value={72}>
        <Meter.Label>Storage used</Meter.Label>
        <Meter.Value />
        <Meter.Track>
            <Meter.Indicator />
        </Meter.Track>
        <Text size="small">36 GB of 50 GB</Text>
    </Meter>
);

// Beside A Figure, where the card says what the reading is and the meter says how much of the
// range it has run to. The card already names it, so the meter is named after the same line
// rather than carrying a second copy of it
export const WithinACard: StoryFn<typeof Meter> = () => (
    <StatisticCard id="storage">
        <StatisticCard.Label>Storage used</StatisticCard.Label>
        <StatisticCard.Value>36 GB</StatisticCard.Value>
        <Meter value={36} max={50} size="small" aria-labelledby="storage-label" />
    </StatisticCard>
);
