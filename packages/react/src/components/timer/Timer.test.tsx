import * as React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Timer, useTimer, formatTime, splitTime } from ".";
import type { TimerProps, UseTimerProps } from "./Timer.types";

type TestProps = Partial<TimerProps> & Partial<Record<`data-${string}`, string>>;

const face = (
    <Timer.Area>
        <Timer.Item type="minutes" />
        <Timer.Separator>:</Timer.Separator>
        <Timer.Item type="seconds" />
    </Timer.Area>
);

const controls = (
    <Timer.Control>
        <Timer.ActionTrigger action="start">Start</Timer.ActionTrigger>
        <Timer.ActionTrigger action="pause">Pause</Timer.ActionTrigger>
        <Timer.ActionTrigger action="resume">Resume</Timer.ActionTrigger>
        <Timer.ActionTrigger action="reset">Reset</Timer.ActionTrigger>
    </Timer.Control>
);

const timer = (props: TestProps = {}, extras?: React.ReactNode) => (
    <Timer {...props}>
        {face}
        {controls}
        {extras}
    </Timer>
);

const root = () => document.querySelector('[data-component="Timer"]') as HTMLElement;

const area = () => document.querySelector('[data-component="Timer.Area"]') as HTMLElement;

const separator = () => document.querySelector('[data-component="Timer.Separator"]') as HTMLElement;

const control = () => document.querySelector('[data-component="Timer.Control"]') as HTMLElement;

const item = (unit: string) =>
    document.querySelector(`[data-component="Timer.Item"][data-unit="${unit}"]`) as HTMLElement;

const trigger = (name: string) => screen.getByRole("button", { name });

// The clock is worked out against the wall clock, so the two are moved on together
const advance = (ms: number) => {
    act(() => {
        vi.advanceTimersByTime(ms);
    });
};

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
});

describe("Timer", () => {
    it("renders a plain box by default", () => {
        render(timer());
        expect(root().tagName).toBe("DIV");
    });

    it("renders as whatever it is told to", () => {
        render(<Timer as="section">{face}</Timer>);
        expect(root().tagName).toBe("SECTION");
    });

    it("tags the timer and its parts with data-component attributes", () => {
        render(timer());

        expect(root()).toBeInTheDocument();
        expect(area()).toBeInTheDocument();
        expect(separator()).toBeInTheDocument();
        expect(control()).toBeInTheDocument();
        expect(item("minutes")).toBeInTheDocument();
        expect(item("seconds")).toBeInTheDocument();
    });

    it("lets the caller name the root element something else", () => {
        render(timer({ "data-component": "SessionTimer" }));
        expect(document.querySelector('[data-component="SessionTimer"]')).toBeInTheDocument();
    });

    it("keeps the class it was given alongside its own", () => {
        render(timer({ className: "session" }));
        expect(root()).toHaveClass("timer", "session");
    });

    it("gives every part a class of its own", () => {
        render(timer());

        expect(area()).toHaveClass("timer-area");
        expect(item("seconds")).toHaveClass("timer-item");
        expect(separator()).toHaveClass("timer-separator");
        expect(control()).toHaveClass("timer-control");
        expect(trigger("Start")).toHaveClass("timer-action-trigger");
    });

    it("lets a part be drawn as whatever it is told to", () => {
        render(
            <Timer>
                <Timer.Area as="output">
                    <Timer.Item as="span" type="seconds" />
                </Timer.Area>
            </Timer>,
        );

        expect(area().tagName).toBe("OUTPUT");
        expect(item("seconds").tagName).toBe("SPAN");
    });

    it("reports what the clock is doing", () => {
        render(timer({ countdown: true, startMs: 60 * 1000 }));

        expect(root()).toHaveAttribute("data-status", "idle");

        fireEvent.click(trigger("Start"));
        expect(root()).toHaveAttribute("data-status", "running");
    });

    describe("the face", () => {
        it("is a live region that says nothing of its own accord", () => {
            render(timer());
            expect(screen.getByRole("timer")).toBe(area());
        });

        it("says nothing to a reader who cannot see what stands between the units", () => {
            render(timer());
            expect(separator()).toHaveAttribute("aria-hidden", "true");
        });

        it("shows the time the clock starts at, padded to the width it is read at", () => {
            render(timer({ countdown: true, startMs: 5 * 60 * 1000 }));

            expect(item("minutes")).toHaveTextContent("05");
            expect(item("seconds")).toHaveTextContent("00");
        });

        it("reads a unit as what is left over from the one above it", () => {
            render(timer({ countdown: true, startMs: 90 * 1000 }));

            expect(item("minutes")).toHaveTextContent("01");
            expect(item("seconds")).toHaveTextContent("30");
        });

        it("shows whatever it is given in place of the unit", () => {
            render(
                <Timer countdown startMs={60 * 1000}>
                    <Timer.Area>
                        <Timer.Item type="seconds">soon</Timer.Item>
                    </Timer.Area>
                </Timer>,
            );

            expect(item("seconds")).toHaveTextContent("soon");
        });

        it("shows nothing where a unit stands outside a timer", () => {
            render(<Timer.Item type="seconds" />);
            expect(item("seconds")).toBeEmptyDOMElement();
        });
    });

    describe("running the clock", () => {
        it("stands still until it is set going", () => {
            render(timer({ countdown: true, startMs: 60 * 1000 }));

            advance(3000);
            expect(item("seconds")).toHaveTextContent("00");
        });

        it("sets off as soon as it is drawn where it is told to", () => {
            render(timer({ autoStart: true, countdown: true, startMs: 60 * 1000 }));

            advance(3000);
            expect(item("seconds")).toHaveTextContent("57");
        });

        it("counts down towards where it is headed", () => {
            render(timer({ countdown: true, startMs: 60 * 1000 }));

            fireEvent.click(trigger("Start"));
            advance(5000);

            expect(item("minutes")).toHaveTextContent("00");
            expect(item("seconds")).toHaveTextContent("55");
        });

        it("counts up away from where it began", () => {
            render(timer({ startMs: 60 * 1000 }));

            fireEvent.click(trigger("Start"));
            advance(5000);

            expect(item("minutes")).toHaveTextContent("01");
            expect(item("seconds")).toHaveTextContent("05");
        });

        it("is read as often as it is told to be", () => {
            render(timer({ countdown: true, startMs: 60 * 1000, interval: 100 }));

            fireEvent.click(trigger("Start"));
            advance(100);

            expect(item("seconds")).toHaveTextContent("59");
        });

        it("is read once a second where it was told nothing", () => {
            render(timer({ countdown: true, startMs: 60 * 1000 }));

            fireEvent.click(trigger("Start"));

            advance(999);
            expect(item("seconds")).toHaveTextContent("00");

            advance(1);
            expect(item("seconds")).toHaveTextContent("59");
        });

        it("holds the clock where it stands", () => {
            render(timer({ countdown: true, startMs: 60 * 1000 }));

            fireEvent.click(trigger("Start"));
            advance(3000);
            fireEvent.click(trigger("Pause"));
            advance(5000);

            expect(root()).toHaveAttribute("data-status", "paused");
            expect(item("seconds")).toHaveTextContent("57");
        });

        it("picks the run up from where it was held", () => {
            render(timer({ countdown: true, startMs: 60 * 1000 }));

            fireEvent.click(trigger("Start"));
            advance(3000);
            fireEvent.click(trigger("Pause"));
            advance(5000);
            fireEvent.click(trigger("Resume"));
            advance(2000);

            expect(root()).toHaveAttribute("data-status", "running");
            expect(item("seconds")).toHaveTextContent("55");
        });

        // A reader presses part of the way through a second rather than on the stroke of one, and
        // a clock that answered with the part of a second gone by since its last read would drop a
        // second as it was held
        it("stands where it was last read while it is held", () => {
            render(timer({ countdown: true, startMs: 60 * 1000 }));

            fireEvent.click(trigger("Start"));
            advance(1000);
            expect(item("seconds")).toHaveTextContent("59");

            advance(400);
            fireEvent.click(trigger("Pause"));

            expect(item("seconds")).toHaveTextContent("59");
        });

        // Letting go part of the way through a second sets the reads off out of step with the
        // second they are counting, which is the same footing a run is set going on: a clock that
        // counted from where the read landed rather than from the read itself would skip a second
        it("goes on a second at a time after it has been let go", () => {
            render(timer({ countdown: true, startMs: 60 * 1000 }));

            fireEvent.click(trigger("Start"));
            advance(1000);
            advance(400);
            fireEvent.click(trigger("Pause"));
            fireEvent.click(trigger("Resume"));

            advance(1000);
            expect(item("seconds")).toHaveTextContent("58");

            advance(1000);
            expect(item("seconds")).toHaveTextContent("57");
        });

        it("stands on whole reads where it is read more often than once a second", () => {
            render(
                <Timer countdown startMs={10 * 1000} interval={250}>
                    <Timer.Area>
                        <Timer.Item type="seconds" />
                        <Timer.Separator>.</Timer.Separator>
                        <Timer.Item type="milliseconds" />
                    </Timer.Area>
                    {controls}
                </Timer>,
            );

            fireEvent.click(trigger("Start"));
            advance(250);
            advance(100);
            fireEvent.click(trigger("Pause"));

            expect(item("seconds")).toHaveTextContent("09");
            expect(item("milliseconds")).toHaveTextContent("750");
        });

        it("sets a run going again from the beginning", () => {
            render(timer({ countdown: true, startMs: 60 * 1000 }));

            fireEvent.click(trigger("Start"));
            advance(3000);
            fireEvent.click(trigger("Pause"));
            fireEvent.click(trigger("Start"));

            expect(root()).toHaveAttribute("data-status", "running");
            expect(item("seconds")).toHaveTextContent("00");
        });

        // Against a real clock rather than the made-up one the rest of these run on, which is the
        // whole point of it: a made-up clock hands a read the very instant it was due, and it is
        // the moment or two between a run being set going and its first read landing that a clock
        // counting from the read rather than from the run would drop a second over
        it("does not drop a second between being set going and its first read", async () => {
            vi.useRealTimers();

            const seen: string[] = [];

            render(
                timer({
                    autoStart: true,
                    countdown: true,
                    startMs: 60 * 1000,
                    onTick: (details) => seen.push(details.formattedTime.seconds),
                }),
            );

            await waitFor(() => expect(seen.length).toBeGreaterThan(0), { timeout: 5000 });

            expect(seen[0]).toBe("59");
        });

        it("puts the clock back without setting it going again", () => {
            render(timer({ countdown: true, startMs: 60 * 1000 }));

            fireEvent.click(trigger("Start"));
            advance(3000);
            fireEvent.click(trigger("Reset"));

            expect(root()).toHaveAttribute("data-status", "idle");
            expect(item("seconds")).toHaveTextContent("00");
            expect(item("minutes")).toHaveTextContent("01");
        });
    });

    describe("arriving", () => {
        it("stops a countdown at the end of its run", () => {
            render(timer({ autoStart: true, countdown: true, startMs: 3000 }));

            advance(3000);

            expect(root()).toHaveAttribute("data-status", "completed");
            expect(item("seconds")).toHaveTextContent("00");
        });

        it("holds a run counting up at the time it was headed for", () => {
            render(timer({ autoStart: true, startMs: 0, targetMs: 3000 }));

            advance(9000);

            expect(root()).toHaveAttribute("data-status", "completed");
            expect(item("seconds")).toHaveTextContent("03");
        });

        it("reports the arrival once and no more", () => {
            const onComplete = vi.fn();
            render(timer({ autoStart: true, countdown: true, startMs: 3000, onComplete }));

            advance(9000);

            expect(onComplete).toHaveBeenCalledTimes(1);
        });

        it("goes on for as long as it is left to where it is headed nowhere", () => {
            const onComplete = vi.fn();
            render(timer({ autoStart: true, startMs: 0, onComplete }));

            advance(10 * 1000);

            expect(root()).toHaveAttribute("data-status", "running");
            expect(item("seconds")).toHaveTextContent("10");
            expect(onComplete).not.toHaveBeenCalled();
        });
    });

    describe("reporting the run", () => {
        it("reports the time each time the clock is read again", () => {
            const onTick = vi.fn();
            render(timer({ autoStart: true, countdown: true, startMs: 60 * 1000, onTick }));

            advance(2000);

            expect(onTick).toHaveBeenCalledTimes(2);
            expect(onTick).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    value: 58 * 1000,
                    time: expect.objectContaining({ minutes: 0, seconds: 58 }),
                    formattedTime: expect.objectContaining({ seconds: "58" }),
                }),
            );
        });

        it("says nothing more once the run has been held", () => {
            const onTick = vi.fn();
            render(timer({ autoStart: true, countdown: true, startMs: 60 * 1000, onTick }));

            advance(1000);
            fireEvent.click(trigger("Pause"));
            advance(5000);

            expect(onTick).toHaveBeenCalledTimes(1);
        });
    });

    describe("the controls", () => {
        it("offers only what a clock that has not been set going has to offer", () => {
            render(timer({ countdown: true, startMs: 60 * 1000 }));

            expect(trigger("Start")).toBeEnabled();
            expect(trigger("Pause")).toBeDisabled();
            expect(trigger("Resume")).toBeDisabled();
            expect(trigger("Reset")).toBeDisabled();
        });

        it("offers only what a clock that is going has to offer", () => {
            render(timer({ countdown: true, startMs: 60 * 1000 }));

            fireEvent.click(trigger("Start"));

            expect(trigger("Start")).toBeDisabled();
            expect(trigger("Pause")).toBeEnabled();
            expect(trigger("Resume")).toBeDisabled();
            expect(trigger("Reset")).toBeEnabled();
        });

        it("offers only what a clock that is held has to offer", () => {
            render(timer({ countdown: true, startMs: 60 * 1000 }));

            fireEvent.click(trigger("Start"));
            fireEvent.click(trigger("Pause"));

            expect(trigger("Start")).toBeEnabled();
            expect(trigger("Pause")).toBeDisabled();
            expect(trigger("Resume")).toBeEnabled();
            expect(trigger("Reset")).toBeEnabled();
        });

        it("takes the caller's word for it where it is told whether to offer the action", () => {
            render(
                <Timer countdown startMs={60 * 1000}>
                    <Timer.ActionTrigger action="pause" disabled={false}>
                        Pause
                    </Timer.ActionTrigger>
                </Timer>,
            );

            expect(trigger("Pause")).toBeEnabled();
        });

        it("still tells the caller about the press it was handed", () => {
            const onClick = vi.fn();
            render(
                <Timer countdown startMs={60 * 1000}>
                    {face}
                    <Timer.ActionTrigger action="start" onClick={onClick}>
                        Start
                    </Timer.ActionTrigger>
                </Timer>,
            );

            fireEvent.click(trigger("Start"));

            expect(onClick).toHaveBeenCalledTimes(1);
            expect(root()).toHaveAttribute("data-status", "running");
        });

        it("leaves a press the caller has already answered alone", () => {
            render(
                <Timer countdown startMs={60 * 1000}>
                    {face}
                    <Timer.ActionTrigger action="start" onClick={(event) => event.preventDefault()}>
                        Start
                    </Timer.ActionTrigger>
                </Timer>,
            );

            fireEvent.click(trigger("Start"));

            expect(root()).toHaveAttribute("data-status", "idle");
        });

        it("reads a trigger standing outside a timer as a clock that has not been set going", () => {
            render(
                <>
                    <Timer.ActionTrigger action="start">Start</Timer.ActionTrigger>
                    <Timer.ActionTrigger action="pause">Pause</Timer.ActionTrigger>
                </>,
            );

            expect(trigger("Start")).toBeEnabled();
            expect(trigger("Pause")).toBeDisabled();

            fireEvent.click(trigger("Start"));
            expect(trigger("Start")).toBeEnabled();
        });
    });
});

describe("useTimer", () => {
    const Clock = (props: UseTimerProps) => {
        const clock = useTimer(props);

        return (
            <>
                <output>
                    {clock.formattedTime.minutes}:{clock.formattedTime.seconds}
                </output>
                <span data-testid="status">{clock.status}</span>
                <button type="button" onClick={clock.start}>
                    Start
                </button>
                <button type="button" onClick={clock.pause}>
                    Hold
                </button>
                <button type="button" onClick={clock.resume}>
                    Let go
                </button>
                <button type="button" onClick={clock.reset}>
                    Put back
                </button>
            </>
        );
    };

    const shown = () => screen.getByRole("status").textContent;

    const status = () => screen.getByTestId("status").textContent;

    it("stands where it was told to start, stopped", () => {
        render(<Clock countdown startMs={90 * 1000} />);

        expect(shown()).toBe("01:30");
        expect(status()).toBe("idle");
    });

    it("holds the clock and picks it up again", () => {
        render(<Clock countdown startMs={90 * 1000} />);

        fireEvent.click(trigger("Start"));
        advance(10 * 1000);
        fireEvent.click(trigger("Hold"));
        advance(30 * 1000);

        expect(shown()).toBe("01:20");

        fireEvent.click(trigger("Let go"));
        advance(5000);

        expect(shown()).toBe("01:15");
    });

    it("puts the clock back where it started", () => {
        render(<Clock countdown startMs={90 * 1000} />);

        fireEvent.click(trigger("Start"));
        advance(10 * 1000);
        fireEvent.click(trigger("Put back"));

        expect(shown()).toBe("01:30");
        expect(status()).toBe("idle");
    });

    it("leaves a clock that is not going where it is", () => {
        render(<Clock countdown startMs={90 * 1000} />);

        fireEvent.click(trigger("Hold"));
        fireEvent.click(trigger("Let go"));

        expect(status()).toBe("idle");
    });

    it("stops of its own accord once it has arrived", () => {
        const onComplete = vi.fn();
        render(<Clock autoStart countdown startMs={3000} onComplete={onComplete} />);

        advance(3000);

        expect(status()).toBe("completed");
        expect(onComplete).toHaveBeenCalledTimes(1);
    });
});

describe("reading a length of time", () => {
    it("splits a length into the units it is read in", () => {
        expect(splitTime(90 * 1000 + 250)).toEqual({
            days: 0,
            hours: 0,
            minutes: 1,
            seconds: 30,
            milliseconds: 250,
        });
    });

    it("gives each unit what is left over from the one above it", () => {
        const time = splitTime(((25 * 60 + 30) * 60 + 15) * 1000);

        expect(time).toEqual({
            days: 1,
            hours: 1,
            minutes: 30,
            seconds: 15,
            milliseconds: 0,
        });
    });

    it("never reads a length below nought", () => {
        expect(splitTime(-5000)).toEqual({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
        });
    });

    // Day.js settles a duration into months and years before it reaches the days, which would
    // read a run of a hundred days as three months and change and leave the hours wrong with it
    it("counts the days a run has been going rather than the calendar it has crossed", () => {
        expect(splitTime(100 * 24 * 60 * 60 * 1000)).toEqual({
            days: 100,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
        });
    });

    it("pads each unit to the width it is read at", () => {
        expect(formatTime(splitTime(5 * 1000 + 7))).toEqual({
            days: "00",
            hours: "00",
            minutes: "00",
            seconds: "05",
            milliseconds: "007",
        });
    });

    it("lets the days grow past the width they are padded to", () => {
        expect(formatTime(splitTime(100 * 24 * 60 * 60 * 1000)).days).toBe("100");
    });
});
