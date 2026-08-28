import * as React from "react";
import { formatTime, now, splitTime } from "./timerDuration";
import type { TimerStatus, UseTimerProps, UseTimerReturn } from "./Timer.types";

// How often the clock is read again where the caller has not said. A second, since that is the
// smallest unit an ordinary clock shows, and reading it more often than it moves is work nobody
// sees
export const DEFAULT_TIMER_INTERVAL = 1000;

// How long the run had been going at the last read. A clock is only looked at once an interval,
// so it stands at the last read rather than at the moment something else happens to ask it.
//
// Without this the part of an interval that has gone by since would be counted on top of the read
// already showing, and a length a shade under a whole unit is read as the unit below it. That is
// what makes a countdown look as though it has skipped: a run set going a millisecond before its
// first read lands has four minutes fifty-eight and a bit left of five minutes, and so goes from
// 05:00 straight to 04:58. The same millisecond is why a clock held between two reads would drop
// a unit as it was held
const toLastRead = (elapsed: number, interval: number) =>
    interval > 0 ? Math.floor(elapsed / interval) * interval : elapsed;

// Where the clock stands after a run of a given length: counted down from where it began, or up
// away from it. It is held at whichever end it was headed for, so a read that arrives late cannot
// carry the clock past the end of its own run
const readValue = (
    elapsed: number,
    startMs: number,
    bound: number | undefined,
    countdown: boolean,
) => {
    if (countdown) {
        return Math.max(startMs - elapsed, bound ?? 0);
    }

    return bound === undefined ? startMs + elapsed : Math.min(startMs + elapsed, bound);
};

// Everything a clock needs and nothing that draws one: where it stands, what it is doing, and the
// ways of moving it. The timer is built on this, so a caller who wants a clock of their own rather
// than the parts is working from the same run the parts are.
//
//     const timer = useTimer({ countdown: true, startMs: 60 * 1000 });
//
//     <Text>{timer.formattedTime.seconds}</Text>
//     <Button onClick={timer.start}>Start</Button>
export const useTimer = (props: UseTimerProps = {}): UseTimerReturn => {
    const {
        countdown = false,
        startMs = 0,
        targetMs,
        interval = DEFAULT_TIMER_INTERVAL,
        autoStart = false,
        onTick,
        onComplete,
    } = props;

    const [status, setStatus] = React.useState<TimerStatus>(autoStart ? "running" : "idle");

    // How long the run has been going, not counting the time it was held for. It is kept as it
    // really is rather than as the face shows it, since letting go of a clock has to pick it up
    // from where the reader stopped it rather than from the read before that
    const [elapsed, setElapsed] = React.useState(0);

    // The moment the run would have been set going had it never been held. The clock is worked out
    // against this rather than counted up a read at a time, so a read that arrives late — a tab
    // left in the background, a long paint — leaves the time right rather than a read behind
    const [startedAt, setStartedAt] = React.useState(now);

    // A countdown given nowhere to arrive is headed for nought; a run counting up given nowhere is
    // headed nowhere and goes on for as long as it is left to
    const bound = countdown ? (targetMs ?? 0) : targetMs;

    const value = readValue(toLastRead(elapsed, interval), startMs, bound, countdown);
    const time = splitTime(value);
    const formattedTime = formatTime(time);

    const hasArrived = bound !== undefined && (countdown ? value <= bound : value >= bound);

    // The clock is reported as it is read, and a handler written fresh each render would otherwise
    // set the reading up again on every pass; the latest one is held aside instead
    const onTickRef = React.useRef(onTick);
    const onCompleteRef = React.useRef(onComplete);

    React.useEffect(() => {
        onTickRef.current = onTick;
        onCompleteRef.current = onComplete;
    }, [onTick, onComplete]);

    React.useEffect(() => {
        if (status !== "running") {
            return;
        }

        const ticking = window.setInterval(() => {
            const nextElapsed = now().diff(startedAt);
            const nextValue = readValue(
                toLastRead(nextElapsed, interval),
                startMs,
                bound,
                countdown,
            );
            const nextTime = splitTime(nextValue);

            setElapsed(nextElapsed);
            onTickRef.current?.({
                value: nextValue,
                time: nextTime,
                formattedTime: formatTime(nextTime),
            });
        }, interval);

        return () => {
            window.clearInterval(ticking);
        };
    }, [status, interval, startedAt, startMs, bound, countdown]);

    // Arriving stops the run of its own accord, which is what tells a clock that has finished from
    // one that was held: the first is started over, the second picked up where it left off
    React.useEffect(() => {
        if (status !== "running" || !hasArrived) {
            return;
        }

        setStatus("completed");
        onCompleteRef.current?.();
    }, [status, hasArrived]);

    const start = () => {
        setStartedAt(now());
        setElapsed(0);
        setStatus("running");
    };

    const pause = () => {
        if (status !== "running") {
            return;
        }

        // Held at the time it was pressed rather than at the last read, so that letting go of a
        // clock picks it up from where the reader stopped it
        setElapsed(now().diff(startedAt));
        setStatus("paused");
    };

    const resume = () => {
        if (status !== "paused") {
            return;
        }

        // Set going again as far back as the run had already got, so that the time it was held
        // for is the only time the clock has not counted
        setStartedAt(now().subtract(elapsed, "millisecond"));
        setStatus("running");
    };

    const reset = () => {
        setStartedAt(now());
        setElapsed(0);
        setStatus("idle");
    };

    return {
        value,
        time,
        formattedTime,
        status,
        running: status === "running",
        paused: status === "paused",
        completed: status === "completed",
        start,
        pause,
        resume,
        reset,
    };
};
