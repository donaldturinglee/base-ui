import TimerBase from "./Timer";
import TimerActionTrigger from "./TimerActionTrigger";
import TimerArea from "./TimerArea";
import TimerControl from "./TimerControl";
import TimerItem from "./TimerItem";
import TimerSeparator from "./TimerSeparator";

export const Timer = Object.assign(TimerBase, {
    // Named as the root in its own right as well as by the compound itself, so either reads the
    // same and a timer written out in full is written the way it is read
    Root: TimerBase,
    Area: TimerArea,
    Item: TimerItem,
    Separator: TimerSeparator,
    Control: TimerControl,
    ActionTrigger: TimerActionTrigger,
});

export { TimerArea, TimerItem, TimerSeparator, TimerControl, TimerActionTrigger };
export { TimerContext, useTimerContext } from "./TimerContext";
export { useTimer, DEFAULT_TIMER_INTERVAL } from "./useTimer";
export { splitTime, formatTime } from "./timerDuration";
export * from "./Timer.types";
