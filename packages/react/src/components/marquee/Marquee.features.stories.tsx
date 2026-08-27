import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Text } from "../text";
import { Marquee, useMarquee } from ".";

const classes = {
    container: "w-[var(--overlay-width-large)]",
    // A run reading down is given a window to read down, since a marquee is as tall as it is let
    // be and a run that fills the page has nowhere to travel
    column: "h-[var(--base-size-128)] w-[var(--overlay-width-medium)]",
    stack: "flex w-[var(--overlay-width-large)] flex-col gap-[var(--base-size-16)]",
    row: "flex items-center gap-[var(--base-size-8)]",
    item: "flex items-center gap-[var(--base-size-8)] whitespace-nowrap text-body-medium",
    logo: "text-title-medium",
};

const fruits = [
    { name: "Apple", logo: "🍎" },
    { name: "Banana", logo: "🍌" },
    { name: "Cherry", logo: "🍒" },
    { name: "Grape", logo: "🍇" },
    { name: "Watermelon", logo: "🍉" },
    { name: "Strawberry", logo: "🍓" },
];

const toItems = (list: typeof fruits) =>
    list.map((fruit) => (
        <span key={fruit.name} className={classes.item}>
            <span className={classes.logo}>{fruit.logo}</span>
            {fruit.name}
        </span>
    ));

const items = toItems(fruits);

export default {
    title: "Components/Marquee/Features",
    parameters: {
        layout: "centered",
    },
};

// The Other Way Along The Line, for a second run set under the first that reads against it
export const Reverse: StoryFn<typeof Marquee> = () => (
    <div className={classes.stack}>
        <Marquee>{items}</Marquee>
        <Marquee reverse>{items}</Marquee>
    </div>
);

// Reading Down Rather Than Across, which is named for the edge the run heads towards
export const Vertical: StoryFn<typeof Marquee> = () => (
    <div className={classes.column}>
        <Marquee side="bottom">{items}</Marquee>
    </div>
);

// At A Pace Of Its Own, in pixels a second, so that a longer run takes longer to go by rather
// than going by faster
export const Speed: StoryFn<typeof Marquee> = () => (
    <div className={classes.stack}>
        <Marquee speed={20}>{items}</Marquee>
        <Marquee speed={120}>{items}</Marquee>
    </div>
);

// Drawn Out To Fill The Window, for a run with too little in it to cover the width it is given.
// Without this the run travels with a gap behind it
export const AutoFill: StoryFn<typeof Marquee> = () => (
    <div className={classes.container}>
        <Marquee autoFill>{toItems(fruits.slice(0, 2))}</Marquee>
    </div>
);

// With A Gap Of Its Own between one thing and the next
export const Spacing: StoryFn<typeof Marquee> = () => (
    <div className={classes.container}>
        <Marquee spacing="var(--base-size-48)">{items}</Marquee>
    </div>
);

// Faded Out At Either End, so that something on its way in or out is not simply there and gone
export const Edges: StoryFn<typeof Marquee> = () => (
    <div className={classes.container}>
        <Marquee edges>{items}</Marquee>
    </div>
);

// Going Round A Set Number Of Times and reporting when it has finished, for a run that is an
// announcement rather than a backdrop
export const FiniteLoops: StoryFn<typeof Marquee> = () => {
    const [loops, setLoops] = React.useState(0);
    const [isDone, setIsDone] = React.useState(false);

    return (
        <div className={classes.stack}>
            <Marquee
                loopCount={3}
                speed={120}
                onLoopComplete={setLoops}
                onComplete={() => setIsDone(true)}
            >
                {items}
            </Marquee>

            <Text size="small">
                {isDone ? `Finished after ${loops} times round` : `${loops} times round`}
            </Text>
        </div>
    );
};

// Waiting Before It Sets Off, for a run that is not the first thing a reader is meant to read
export const Delay: StoryFn<typeof Marquee> = () => (
    <div className={classes.container}>
        <Marquee delay={2000}>{items}</Marquee>
    </div>
);

// Left Running Under The Pointer, where the run is a backdrop rather than something to be read
// on the way past
export const WithoutPauseOnInteraction: StoryFn<typeof Marquee> = () => (
    <div className={classes.container}>
        <Marquee pauseOnInteraction={false}>{items}</Marquee>
    </div>
);

// Held By A Control Of The Caller's Own, which is what a run of things worth reading is owed
export const Controlled: StoryFn<typeof Marquee> = () => {
    const marquee = useMarquee();

    return (
        <div className={classes.stack}>
            <Marquee paused={marquee.paused} pauseOnInteraction={false} edges>
                {items}
            </Marquee>

            <div className={classes.row}>
                <Button onClick={marquee.toggle}>{marquee.paused ? "Play" : "Pause"}</Button>
            </div>
        </div>
    );
};

// Starting Out Held, for a run that waits to be asked for
export const DefaultPaused: StoryFn<typeof Marquee> = () => (
    <div className={classes.container}>
        <Marquee defaultPaused>{items}</Marquee>
    </div>
);
