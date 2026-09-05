import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Text } from "../text";
import { Presence } from ".";
import type { PresenceHideMode } from "./Presence.types";

const classes = {
    // Stands the button that asks for the content above the content itself
    stack: "flex w-[var(--overlay-width-small)] flex-col items-start gap-[var(--base-size-8)]",
    // Two of the above side by side, for stories that set one way against another
    row: "flex items-start gap-[var(--base-size-24)]",
    // The box the content is drawn in. It fades and grows in as it arrives and fades and
    // shrinks out as it leaves, animating by the state the presence writes onto it, so that
    // leaving is seen through to its end before the box is hidden
    box: "flex h-40 w-full items-center justify-center rounded-md border border-border-default bg-background-muted text-foreground-default duration-short motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out motion-safe:data-[state=closed]:zoom-out-95",
};

export default {
    title: "Components/Presence/Features",
    parameters: {
        layout: "centered",
    },
};

// Drawn Only Once It Is Asked For, where the content is kept off the page until it is first
// present, and left there hidden once it has been
export const LazyMount: StoryFn<typeof Presence> = () => {
    const [present, setPresent] = React.useState(false);

    return (
        <div className={classes.stack}>
            <Button onClick={() => setPresent((current) => !current)}>
                {present ? "Hide" : "Show"} the content
            </Button>
            <Presence className={classes.box} present={present} lazyMount>
                Drawn once asked for
            </Presence>
        </div>
    );
};

// Taken Off Once It Leaves, where the content is drawn hidden to start with but taken off the
// page rather than hidden again once it has been shown and has left
export const UnmountOnExit: StoryFn<typeof Presence> = () => {
    const [present, setPresent] = React.useState(false);

    return (
        <div className={classes.stack}>
            <Button onClick={() => setPresent((current) => !current)}>
                {present ? "Hide" : "Show"} the content
            </Button>
            <Presence className={classes.box} present={present} unmountOnExit>
                Taken off once it leaves
            </Presence>
        </div>
    );
};

// Off The Page Whenever It Is Not Present, which is both of the above at once and what a
// dialog or a menu wants
export const LazyMountAndUnmountOnExit: StoryFn<typeof Presence> = () => {
    const [present, setPresent] = React.useState(false);

    return (
        <div className={classes.stack}>
            <Button onClick={() => setPresent((current) => !current)}>
                {present ? "Hide" : "Show"} the content
            </Button>
            <Presence className={classes.box} present={present} lazyMount unmountOnExit>
                Only ever on the page while present
            </Presence>
        </div>
    );
};

// Drawn In Place To Start With, where content that is present from the start is not animated
// in, and only what happens after that is
export const SkipAnimationOnMount: StoryFn<typeof Presence> = () => {
    const [present, setPresent] = React.useState(true);

    return (
        <div className={classes.stack}>
            <Button onClick={() => setPresent((current) => !current)}>
                {present ? "Hide" : "Show"} the content
            </Button>
            <Presence className={classes.box} present={present} skipAnimationOnMount>
                Drawn in place to start with
            </Presence>
        </div>
    );
};

// Counts up for as long as its effect is running, so whether the content it stands in has
// been paused can be seen
const Ticks = () => {
    const [ticks, setTicks] = React.useState(0);

    React.useEffect(() => {
        const interval = window.setInterval(() => setTicks((count) => count + 1), 200);

        return () => window.clearInterval(interval);
    }, []);

    return <Text>{ticks} ticks</Text>;
};

const HidePanel = ({ hideMode, note }: { hideMode: PresenceHideMode; note: string }) => {
    const [present, setPresent] = React.useState(true);

    return (
        <div className={classes.stack}>
            <Text size="small">{note}</Text>
            <Button onClick={() => setPresent((current) => !current)}>
                {present ? "Hide" : "Show"} with {hideMode}
            </Button>
            <Presence className={classes.box} present={present} hideMode={hideMode}>
                <Ticks />
            </Presence>
        </div>
    );
};

// How Hidden Content Is Held, which is off the page with its effects running by default, or
// handed to React to hold with its effects paused where the React the page runs on can
export const HideMode: StoryFn<typeof Presence> = () => (
    <div className={classes.row}>
        <HidePanel hideMode="display-none" note="Hidden, and still counting" />
        <HidePanel hideMode="activity" note="Held by React, and paused" />
    </div>
);

// Saying When It Has Arrived And Left, for a caller that has something to do once the
// animation is over rather than once it is asked for
export const AnimationCallbacks: StoryFn<typeof Presence> = () => {
    const [present, setPresent] = React.useState(false);
    const [lastEvent, setLastEvent] = React.useState("Nothing has happened yet");

    return (
        <div className={classes.stack}>
            <Button onClick={() => setPresent((current) => !current)}>
                {present ? "Hide" : "Show"} the content
            </Button>
            <Presence
                className={classes.box}
                present={present}
                onEnterComplete={() => setLastEvent("The content has arrived")}
                onExitComplete={() => setLastEvent("The content has left")}
            >
                Content
            </Presence>
            <Text size="small">{lastEvent}</Text>
        </div>
    );
};
