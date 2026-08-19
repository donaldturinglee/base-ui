import * as React from "react";
import {
    CheckmarkRegular,
    DismissRegular,
    PauseRegular,
    PlayRegular,
    Speaker_2Regular,
    SpeakerOffRegular,
    WeatherMoonRegular,
    WeatherSunnyRegular,
} from "@gamecrafters/base-ui-icons";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { Text } from "../text";
import { Swap } from ".";
import type { SwapTransition } from "./Swap.types";

const classes = {
    row: "flex items-center gap-[var(--stack-gap-normal)]",
    stack: "flex flex-col items-start gap-[var(--stack-gap-condensed)]",
};

export default {
    title: "Components/Swap/Features",
    parameters: {
        layout: "centered",
    },
};

// A swap with something to press around it, which is how most of them are read. The button is what
// holds whether it is on, and is named for what pressing it will do rather than for what it shows
const Toggle = ({
    transition,
    label,
    on,
    off,
}: {
    transition?: SwapTransition;
    label: string;
    on: React.ReactNode;
    off: React.ReactNode;
}) => {
    const [swapped, setSwapped] = React.useState(false);

    return (
        <IconButton
            aria-label={label}
            aria-pressed={swapped}
            onClick={() => setSwapped((previous) => !previous)}
            icon={
                <Swap swap={swapped} transition={transition}>
                    <Swap.Indicator type="on">{on}</Swap.Indicator>
                    <Swap.Indicator type="off">{off}</Swap.Indicator>
                </Swap>
            }
        />
    );
};

// Fading, which is what a swap does when it is told nothing else. It says the least of the four,
// which is what a pair of icons that mean opposite things usually wants
export const Fade: StoryFn = () => (
    <Toggle label="Accept" on={<CheckmarkRegular />} off={<DismissRegular />} />
);

// Turning right over about the upright axis, for a pair read as two sides of the one control
export const Flip: StoryFn = () => (
    <Toggle transition="flip" label="Play" on={<PauseRegular />} off={<PlayRegular />} />
);

// Turning a quarter round, both the same way, so the pair reads as one dial being moved on
export const Rotate: StoryFn = () => (
    <Toggle
        transition="rotate"
        label="Switch theme"
        on={<WeatherMoonRegular />}
        off={<WeatherSunnyRegular />}
    />
);

// Growing into place, for a swap that is worth noticing
export const Scale: StoryFn = () => (
    <Toggle transition="scale" label="Mute" on={<SpeakerOffRegular />} off={<Speaker_2Regular />} />
);

// Cutting straight from one to the other, for a swap that reports something rather than moves
export const WithoutTransition: StoryFn = () => (
    <Toggle transition="none" label="Mute" on={<SpeakerOffRegular />} off={<Speaker_2Regular />} />
);

// The four side by side, which is the only way the differences between them read
export const Transitions: StoryFn = () => (
    <div className={classes.row}>
        <Toggle label="Accept" on={<CheckmarkRegular />} off={<DismissRegular />} />
        <Toggle transition="flip" label="Play" on={<PauseRegular />} off={<PlayRegular />} />
        <Toggle
            transition="rotate"
            label="Switch theme"
            on={<WeatherMoonRegular />}
            off={<WeatherSunnyRegular />}
        />
        <Toggle
            transition="scale"
            label="Mute"
            on={<SpeakerOffRegular />}
            off={<Speaker_2Regular />}
        />
    </div>
);

// Holding words rather than icons. The swap keeps the width of the longer of the two, so a button
// that says what it will do next does not change size as it is pressed
export const WithText: StoryFn = () => {
    const [following, setFollowing] = React.useState(false);

    return (
        <Button onClick={() => setFollowing((previous) => !previous)}>
            <Swap swap={following}>
                <Swap.Indicator type="on">Following</Swap.Indicator>
                <Swap.Indicator type="off">Follow</Swap.Indicator>
            </Swap>
        </Button>
    );
};

// Standing on its own, where nothing is pressed and the swap simply reports what something else
// settled
export const Controlled: StoryFn = () => {
    const [connected, setConnected] = React.useState(false);

    return (
        <div className={classes.stack}>
            <div className={classes.row}>
                <Swap swap={connected} transition="scale">
                    <Swap.Indicator type="on">
                        <CheckmarkRegular />
                    </Swap.Indicator>
                    <Swap.Indicator type="off">
                        <DismissRegular />
                    </Swap.Indicator>
                </Swap>

                <Text size="small">{connected ? "Connected" : "Offline"}</Text>
            </div>

            <Button size="small" onClick={() => setConnected((previous) => !previous)}>
                {connected ? "Disconnect" : "Connect"}
            </Button>
        </div>
    );
};
