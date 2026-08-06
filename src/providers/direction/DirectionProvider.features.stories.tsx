import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { DirectionProvider, useDirection, useIsRtl } from ".";
import type { TextDirection } from "./Direction.types";

const classes = {
    panel: "p-[var(--base-size-16)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default",
    nested: "mt-[var(--base-size-16)]",
    // Logical properties, so the marker moves to whichever side the reading starts from
    marker: "ps-[var(--base-size-12)] border-s-[length:var(--base-size-4)] border-solid border-border-accent-emphasis",
    button: "mt-[var(--base-size-16)] px-[var(--base-size-12)] py-[var(--base-size-4)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default",
};

const ActiveDirection = () => {
    const direction = useDirection();

    return (
        <div className={classes.marker}>
            Reading direction: {direction}
            <br />
            The marker sits on the side the page is read from
        </div>
    );
};

export default {
    title: "Components/DirectionProvider/Features",
};

// Right To Left
export const RightToLeft: StoryFn<typeof DirectionProvider> = () => (
    <DirectionProvider direction="rtl" className={classes.panel}>
        <ActiveDirection />
    </DirectionProvider>
);

// Nested
export const Nested: StoryFn<typeof DirectionProvider> = () => {
    // A provider that takes the opposite of whatever the one above it settled on
    const Inverse = () => {
        const direction = useDirection();

        return (
            <DirectionProvider
                direction={direction === "ltr" ? "rtl" : "ltr"}
                className={`${classes.panel} ${classes.nested}`}
            >
                Always the opposite of the direction above
                <ActiveDirection />
            </DirectionProvider>
        );
    };

    return (
        <DirectionProvider direction="rtl" className={classes.panel}>
            <ActiveDirection />
            {/* Says nothing of its own, so it is read the way the provider above it is */}
            <DirectionProvider className={`${classes.panel} ${classes.nested}`}>
                Inherited from the provider above
                <ActiveDirection />
            </DirectionProvider>
            <Inverse />
        </DirectionProvider>
    );
};

// Context Only
export const ContextOnly: StoryFn<typeof DirectionProvider> = () => (
    <DirectionProvider direction="rtl" className={classes.panel}>
        The wrapper here carries the `dir` attribute
        {/* Nothing is wrapped, so the attribute above still stands and only the value a
            component reads changes */}
        <DirectionProvider contextOnly direction="ltr">
            <ActiveDirection />
        </DirectionProvider>
    </DirectionProvider>
);

// Controlled, where the direction is the caller's to hold and change
export const Controlled: StoryFn<typeof DirectionProvider> = () => {
    const [direction, setDirection] = React.useState<TextDirection>("ltr");

    return (
        <DirectionProvider direction={direction} className={classes.panel}>
            <ActiveDirection />
            <button
                type="button"
                className={classes.button}
                onClick={() => setDirection(direction === "ltr" ? "rtl" : "ltr")}
            >
                Turn the page around
            </button>
        </DirectionProvider>
    );
};

// With Is Rtl, for the handful of cases a stylesheet cannot answer on its own
export const WithIsRtl: StoryFn<typeof DirectionProvider> = () => {
    // Which way "onwards" points is the reading direction's to say
    const Onwards = () => {
        const isRtl = useIsRtl();

        return <div className={classes.marker}>Onwards is {isRtl ? "←" : "→"}</div>;
    };

    return (
        <DirectionProvider direction="rtl" className={classes.panel}>
            <Onwards />
        </DirectionProvider>
    );
};
