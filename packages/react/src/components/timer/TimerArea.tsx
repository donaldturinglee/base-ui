import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TimerContext } from "./TimerContext";
import type { TimerAreaProps } from "./Timer.types";

const classes = {
    root: "timer-area",
};

// The face of the clock: the digits and whatever stands between them. Keeping it apart from the
// timer itself is what lets the controls be laid out under the face rather than beside the digits,
// and it is the only part that has to know how the units are set against each other.
//
// It is the timer proper as far as a screen reader is concerned, which is a live region that says
// nothing of its own accord: a clock that read itself out every second would talk over everything
// else on the page, and a reader who wants the time asks for it
function TimerArea<As extends React.ElementType = "div">(
    props: TimerAreaProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as TimerAreaProps<"div">;
    const { status } = React.useContext(TimerContext);

    return (
        <Component
            ref={ref}
            role="timer"
            className={classNames(classes.root, className)}
            data-component="Timer.Area"
            data-status={status}
            {...rest}
        />
    );
}

TimerArea.displayName = "Timer.Area";

export default fixedForwardRef(TimerArea);
