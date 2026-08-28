import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import { TimerContext } from "./TimerContext";
import type { TimerAction, TimerActionTriggerProps, TimerStatus } from "./Timer.types";

const classes = {
    root: "timer-action-trigger",
};

// Whether an action is there to be taken at all. A trigger that would do nothing is turned off
// rather than left to be pressed for no answer: starting a clock that is already going, holding
// one that is already held, or putting back a clock that is already where it started
const isAvailable: Record<TimerAction, (status: TimerStatus) => boolean> = {
    start: (status) => status !== "running",
    pause: (status) => status === "running",
    resume: (status) => status === "paused",
    reset: (status) => status !== "idle",
};

// What moves the clock. The trigger is named for what pressing it does rather than for what the
// clock is doing, so a start and a resume are two triggers rather than one that renames itself:
// a button that changed its name under the reader's finger would be offering something other than
// what they pressed.
//
// A caller who would rather have the one control lays out whichever of them the clock has a use
// for, and the other turns itself off
function TimerActionTrigger(
    props: TimerActionTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, action, disabled, onClick, children, ...rest } = props;
    const timer = React.useContext(TimerContext);

    // A trigger standing outside a timer has no clock to move, and reads as a clock that has not
    // been set going
    const status = timer.status ?? "idle";

    const run = {
        start: timer.start,
        pause: timer.pause,
        resume: timer.resume,
        reset: timer.reset,
    }[action];

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        // A caller that has answered the press itself is left to it
        if (event.defaultPrevented) {
            return;
        }

        run?.();
    };

    return (
        <Button
            ref={ref}
            disabled={disabled ?? !isAvailable[action](status)}
            onClick={handleClick}
            className={classNames(classes.root, className)}
            data-component="Timer.ActionTrigger"
            data-action={action}
            {...rest}
        >
            {children}
        </Button>
    );
}

TimerActionTrigger.displayName = "Timer.ActionTrigger";

export default fixedForwardRef(TimerActionTrigger);
