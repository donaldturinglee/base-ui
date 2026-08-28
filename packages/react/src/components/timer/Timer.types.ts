import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";
import type { ButtonContentProps, ButtonSize, ButtonVariant } from "../button";

// The units a length of time is read in, from the largest down. A timer is shown in whichever of
// them the caller lays out rather than in all of them, so a run of minutes is not made to carry
// two leading zeroes for days it will never reach
export type TimerUnit = "days" | "hours" | "minutes" | "seconds" | "milliseconds";

// What the clock is doing. Idle is before it has been set going and after it has been put back;
// completed is where it has arrived and stopped of its own accord, which is what tells a start
// from a resume
export type TimerStatus = "idle" | "running" | "paused" | "completed";

// The time on the clock, split into the units it is read in
export type TimerTime = Record<TimerUnit, number>;

// The same time written out, each unit padded to the width it is read at
export type TimerFormattedTime = Record<TimerUnit, string>;

// What pressing a trigger does. Start sets a run going from the beginning, resume picks up a run
// that was held, and reset puts the clock back without setting it going again
export type TimerAction = "start" | "pause" | "resume" | "reset";

// What is reported each time the clock is read again
export type TimerTickDetails = {
    // Where the clock stands, in milliseconds
    value: number;
    time: TimerTime;
    formattedTime: TimerFormattedTime;
};

// Where the clock starts, where it is headed and how often it is read. The timer and the hook
// behind it are set up the same way, so a clock built out of the parts and one drawn by hand are
// given the same run to keep
type TimerStoreProps = {
    // Counts down towards where it is headed rather than up away from where it began
    countdown?: boolean;
    // Where the clock stands before it is set going, and where it is put back to, in milliseconds
    startMs?: number;
    // Where the run ends, in milliseconds. A countdown given none is headed for nought; a run
    // counting up given none goes on for as long as it is left to
    targetMs?: number;
    // How often the clock is read again, in milliseconds. A run shown to the second is read once
    // a second; one showing the milliseconds is read often enough for them to move
    interval?: number;
    // Sets the run going as soon as it is drawn, rather than waiting to be started
    autoStart?: boolean;
};

type TimerCallbacks = {
    // Called each time the clock has been read again, with the time it now shows
    onTick?: (details: TimerTickDetails) => void;
    // Called once the run has arrived where it was headed. A run counting up with nowhere to
    // arrive never reaches this
    onComplete?: () => void;
};

export type UseTimerProps = TimerStoreProps & TimerCallbacks;

export type UseTimerReturn = {
    // Where the clock stands, in milliseconds
    value: number;
    // The same, split into the units it is read in
    time: TimerTime;
    // The same again, written out and padded
    formattedTime: TimerFormattedTime;
    status: TimerStatus;
    // Whether the clock is going, held, or has arrived. Read off the status, which is the one
    // thing that moves, so no two of them can disagree
    running: boolean;
    paused: boolean;
    completed: boolean;
    // Sets a run going from the beginning, whatever the clock was doing before
    start: () => void;
    // Holds the clock where it stands
    pause: () => void;
    // Picks the run up from where it was held
    resume: () => void;
    // Puts the clock back to where it started, stopped
    reset: () => void;
};

type TimerOwnProps = TimerStoreProps & {
    className?: string;
};

export type TimerProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    TimerOwnProps
> &
    TimerCallbacks;

// The same props at the element a timer renders by default, for reading inside the component
export type TimerElementProps = TimerProps<"div">;

// The face of the clock, which is the part a reader watches rather than the whole timer
export type TimerAreaProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type TimerItemProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        // Which unit of the time this one shows
        type: TimerUnit;
        className?: string;
    }
>;

// What stands between one unit and the next, a colon or a full stop. It is drawn rather than read
// out, since a reader is told the units by the words beside them
export type TimerSeparatorProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

// The row the triggers stand in
export type TimerControlProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

// A trigger takes its name from its children, the way any other button does, so there is nothing
// here to name it with. It lays a visual out around that name the way any other button does too,
// since a control that moves a clock is usually found by its arrow before its word
export type TimerActionTriggerProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "type" | "value"
> &
    ButtonContentProps & {
        // What pressing it does
        action: TimerAction;
        variant?: ButtonVariant;
        size?: ButtonSize;
        className?: string;
    };

export type TimerContextValue = Partial<UseTimerReturn>;
