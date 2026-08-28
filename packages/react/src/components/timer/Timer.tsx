import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TimerContext } from "./TimerContext";
import { useTimer } from "./useTimer";
import type { TimerElementProps, TimerProps } from "./Timer.types";

const classes = {
    root: "timer",
};

// A length of time laid out to be watched: the digits it is read in, and the controls that set it
// going, hold it and put it back.
//
//     <Timer countdown startMs={5 * 60 * 1000}>
//         <Timer.Area>
//             <Timer.Item type="minutes" />
//             <Timer.Separator>:</Timer.Separator>
//             <Timer.Item type="seconds" />
//         </Timer.Area>
//         <Timer.Control>
//             <Timer.ActionTrigger action="start">Start</Timer.ActionTrigger>
//             <Timer.ActionTrigger action="pause">Pause</Timer.ActionTrigger>
//         </Timer.Control>
//     </Timer>
//
// The run is named here rather than on the parts, since where the clock starts and where it is
// headed belong to the run rather than to any one unit of it, and the digits would otherwise each
// be keeping a clock of their own and drifting apart from one another.
//
// Which units are shown is left to the caller: a run of minutes laid out in days would carry two
// leading zeroes for days it will never reach, and a run of days shown to the second would move
// under a reader who has no reason to watch it
function Timer<As extends React.ElementType = "div">(
    props: TimerProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        countdown,
        startMs,
        targetMs,
        interval,
        autoStart,
        onTick,
        onComplete,
        children,
        ...rest
    } = props as unknown as TimerElementProps;

    const timer = useTimer({
        countdown,
        startMs,
        targetMs,
        interval,
        autoStart,
        onTick,
        onComplete,
    });

    return (
        <TimerContext.Provider value={timer}>
            <Component
                ref={ref}
                className={classNames(classes.root, className)}
                data-component="Timer"
                data-status={timer.status}
                {...rest}
            >
                {children}
            </Component>
        </TimerContext.Provider>
    );
}

Timer.displayName = "Timer";

export default fixedForwardRef(Timer);
