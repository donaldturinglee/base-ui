import {
    ArrowCounterclockwiseRegular,
    PauseRegular,
    PlayRegular,
} from "@gamecrafters/base-ui-icons";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { Timer } from ".";
import type { TimerProps } from "./Timer.types";

const classes = {
    // The word naming a unit stands under its digits rather than beside them, so the face reads
    // as a row of units rather than as one long number
    unit: "flex flex-col items-center",
    label: "text-caption text-[var(--foreground-color-muted)]",
};

export default {
    title: "Components/Timer",
    component: Timer,
} as Meta<typeof Timer>;

export const Default: StoryFn<typeof Timer> = () => (
    <Timer countdown startMs={5 * 60 * 1000}>
        <Timer.Area>
            <div className={classes.unit}>
                <Timer.Item type="minutes" />
                <span className={classes.label}>minutes</span>
            </div>
            <Timer.Separator>:</Timer.Separator>
            <div className={classes.unit}>
                <Timer.Item type="seconds" />
                <span className={classes.label}>seconds</span>
            </div>
        </Timer.Area>

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
    </Timer>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<TimerProps> = (args) => (
    <Timer {...args}>
        <Timer.Area>
            <div className={classes.unit}>
                <Timer.Item type="hours" />
                <span className={classes.label}>hours</span>
            </div>
            <Timer.Separator>:</Timer.Separator>
            <div className={classes.unit}>
                <Timer.Item type="minutes" />
                <span className={classes.label}>minutes</span>
            </div>
            <Timer.Separator>:</Timer.Separator>
            <div className={classes.unit}>
                <Timer.Item type="seconds" />
                <span className={classes.label}>seconds</span>
            </div>
        </Timer.Area>

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
    </Timer>
);

Playground.args = {
    countdown: false,
    startMs: 0,
    interval: 1000,
    autoStart: false,
};

Playground.argTypes = {
    countdown: {
        control: {
            type: "boolean",
        },
        description:
            "Counts down towards where it is headed rather than up away from where it began",
    },
    startMs: {
        control: {
            type: "number",
            min: 0,
            max: 24 * 60 * 60 * 1000,
            step: 60 * 1000,
        },
        description: "Where the clock stands before it is set going, and where it is put back to",
    },
    targetMs: {
        control: {
            type: "number",
            min: 0,
            max: 24 * 60 * 60 * 1000,
            step: 60 * 1000,
        },
        description: "Where the run ends. A countdown given none is headed for nought",
    },
    interval: {
        control: {
            type: "number",
            min: 10,
            max: 5000,
            step: 10,
        },
        description: "How often the clock is read again, in milliseconds",
    },
    autoStart: {
        control: {
            type: "boolean",
        },
        description: "Sets the run going as soon as it is drawn",
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
