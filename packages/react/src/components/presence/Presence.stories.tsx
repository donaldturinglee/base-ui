import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { Button } from "../button";
import { Presence } from ".";
import type { PresenceProps } from "./Presence.types";

const classes = {
    // Stands the button that asks for the content above the content itself
    stack: "flex w-[var(--overlay-width-small)] flex-col items-start gap-[var(--base-size-8)]",
    // The box the content is drawn in. It fades and grows in as it arrives and fades and
    // shrinks out as it leaves, animating by the state the presence writes onto it, so that
    // leaving is seen through to its end before the box is hidden
    box: "flex h-40 w-full items-center justify-center rounded-md border border-border-default bg-background-muted text-foreground-default duration-short motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out motion-safe:data-[state=closed]:zoom-out-95",
};

export default {
    title: "Components/Presence",
    component: Presence,
} as Meta<typeof Presence>;

export const Default: StoryFn<typeof Presence> = () => {
    const [present, setPresent] = React.useState(false);

    return (
        <div className={classes.stack}>
            <Button onClick={() => setPresent((current) => !current)}>
                {present ? "Hide" : "Show"} the content
            </Button>
            <Presence className={classes.box} present={present}>
                Content
            </Presence>
        </div>
    );
};

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<PresenceProps> = (args) => (
    <div className={classes.stack}>
        <Presence {...args} className={classes.box}>
            Content
        </Presence>
    </div>
);

Playground.args = {
    present: true,
    lazyMount: false,
    unmountOnExit: false,
    skipAnimationOnMount: false,
    hideMode: "display-none",
};

Playground.argTypes = {
    present: {
        control: {
            type: "boolean",
        },
        description: "Whether the content is meant to be there",
    },
    lazyMount: {
        control: {
            type: "boolean",
        },
        description: "Leaves the content off the page until it is first present",
    },
    unmountOnExit: {
        control: {
            type: "boolean",
        },
        description: "Takes the content off the page once it has left",
    },
    skipAnimationOnMount: {
        control: {
            type: "boolean",
        },
        description: "Draws content that starts out present in place rather than animating it in",
    },
    hideMode: {
        control: {
            type: "radio",
        },
        options: ["display-none", "activity"],
        description: "How hidden content is kept out of sight",
    },
    onEnterComplete: {
        table: {
            disable: true,
        },
    },
    onExitComplete: {
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
