import * as React from "react";
import {
    ArrowCounterclockwiseRegular,
    PauseRegular,
    PlayRegular,
} from "@gamecrafters/base-ui-icons";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Text } from "../text";
import { Timer, useTimer } from ".";

const classes = {
    stack: "flex flex-col items-start gap-[var(--base-size-16)]",
    unit: "flex flex-col items-center",
    label: "text-caption text-[var(--foreground-color-muted)]",
};

export default {
    title: "Components/Timer/Features",
    parameters: {
        layout: "centered",
    },
};

// Where the units and the words naming them are the same face over and over, they are written the
// once and the unit asked for each time
const unit = (type: "days" | "hours" | "minutes" | "seconds" | "milliseconds", label: string) => (
    <div className={classes.unit}>
        <Timer.Item type={type} />
        <span className={classes.label}>{label}</span>
    </div>
);

const controls = (
    <Timer.Control>
        <Timer.ActionTrigger action="start" leadingVisual={PlayRegular}>
            Start
        </Timer.ActionTrigger>
        <Timer.ActionTrigger action="pause" leadingVisual={PauseRegular}>
            Pause
        </Timer.ActionTrigger>
        <Timer.ActionTrigger action="resume" leadingVisual={PlayRegular}>
            Resume
        </Timer.ActionTrigger>
        <Timer.ActionTrigger action="reset" leadingVisual={ArrowCounterclockwiseRegular}>
            Reset
        </Timer.ActionTrigger>
    </Timer.Control>
);

// Counting Down To Nought, which is where a countdown is headed when it is given nowhere else
export const Countdown: StoryFn<typeof Timer> = () => (
    <Timer countdown startMs={5 * 60 * 1000}>
        <Timer.Area>
            {unit("minutes", "minutes")}
            <Timer.Separator>:</Timer.Separator>
            {unit("seconds", "seconds")}
        </Timer.Area>
        {controls}
    </Timer>
);

// Counting Up To Somewhere, from where it began to where it is headed. The run stops on arrival
// rather than going past, so the face is left standing at the time it was headed for
export const CountUp: StoryFn<typeof Timer> = () => (
    <Timer startMs={40 * 60 * 1000} targetMs={60 * 60 * 1000}>
        <Timer.Area>
            {unit("hours", "hours")}
            <Timer.Separator>:</Timer.Separator>
            {unit("minutes", "minutes")}
            <Timer.Separator>:</Timer.Separator>
            {unit("seconds", "seconds")}
        </Timer.Area>
        {controls}
    </Timer>
);

// Read Often Enough For The Milliseconds To Move, since a clock read once a second would show the
// same three figures all the way down
export const Interval: StoryFn<typeof Timer> = () => (
    <Timer countdown startMs={30 * 1000} interval={50}>
        <Timer.Area>
            {unit("seconds", "seconds")}
            <Timer.Separator>.</Timer.Separator>
            {unit("milliseconds", "ms")}
        </Timer.Area>
        {controls}
    </Timer>
);

// Going As Soon As It Is Drawn, for a clock nobody has to press to set off
export const AutoStart: StoryFn<typeof Timer> = () => (
    <Timer autoStart countdown startMs={60 * 1000}>
        <Timer.Area>
            {unit("minutes", "minutes")}
            <Timer.Separator>:</Timer.Separator>
            {unit("seconds", "seconds")}
        </Timer.Area>
        {controls}
    </Timer>
);

// Reporting The Run, each time the clock is read again and once when it arrives
export const Events: StoryFn<typeof Timer> = () => {
    const [ticks, setTicks] = React.useState(0);
    const [arrivals, setArrivals] = React.useState(0);

    return (
        <Timer
            countdown
            startMs={10 * 1000}
            onTick={() => setTicks((count) => count + 1)}
            onComplete={() => setArrivals((count) => count + 1)}
        >
            <Timer.Area>{unit("seconds", "seconds")}</Timer.Area>
            {controls}
            <Text size="small">
                Read {ticks} times, arrived {arrivals} times
            </Text>
        </Timer>
    );
};

// One Session After Another, where arriving is what starts the next one. The run the clock is
// given changes as the sessions swap, and starting it again picks the new one up
export const Pomodoro: StoryFn<typeof Timer> = () => {
    const [isWorking, setIsWorking] = React.useState(true);
    const [sessions, setSessions] = React.useState(0);

    const handleComplete = () => {
        setIsWorking(!isWorking);

        if (!isWorking) {
            setSessions((count) => count + 1);
        }
    };

    return (
        <Timer
            countdown
            startMs={isWorking ? 25 * 60 * 1000 : 5 * 60 * 1000}
            onComplete={handleComplete}
        >
            <Text weight="semibold">{isWorking ? "Work session" : "Break"}</Text>
            <Timer.Area>
                {unit("minutes", "minutes")}
                <Timer.Separator>:</Timer.Separator>
                {unit("seconds", "seconds")}
            </Timer.Area>
            {controls}
            <Text size="small">Completed sessions: {sessions}</Text>
        </Timer>
    );
};

// A Clock Of The Caller's Own, drawn from the hook rather than from the parts. The run is the same
// one either way, so a face laid out by hand is no less a timer than one built out of the parts
export const WithHook: StoryFn<typeof Timer> = () => {
    const timer = useTimer({ countdown: true, startMs: 90 * 1000 });

    return (
        <div className={classes.stack}>
            <Text weight="semibold">
                {timer.formattedTime.minutes}:{timer.formattedTime.seconds}
            </Text>

            <Button
                onClick={timer.running ? timer.pause : timer.paused ? timer.resume : timer.start}
            >
                {timer.running ? "Hold" : timer.paused ? "Let go" : "Set going"}
            </Button>
        </div>
    );
};
