import { createContext, useContext } from "react";
import type { TimerContextValue } from "./Timer.types";

export const TimerContext = createContext<TimerContextValue>({});

// What the timer around a part is showing, for a control of the caller's own standing among the
// parts: where the clock stands, what it is doing, and the ways of moving it. A control standing
// on its own has no timer to read, and reaches for useTimer
export const useTimerContext = () => useContext(TimerContext);
