import * as React from "react";
import { act, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { RelativeTime, formatRelativeTime } from ".";
import type { RelativeTimeSettings } from "./RelativeTime.types";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// A fixed point to measure from, built in local time so that the dates it produces do not
// move with the time zone the tests run in
const NOW = new Date(2024, 2, 7, 12, 0, 0).getTime();

const settings: RelativeTimeSettings = {
    format: "auto",
    tense: "auto",
    precision: "second",
    threshold: "P30D",
    prefix: "on",
    dateOptions: {},
    locale: "en",
};

const reading = (elapsed: number, overrides: Partial<RelativeTimeSettings> = {}) =>
    formatRelativeTime(new Date(NOW + elapsed), NOW, { ...settings, ...overrides });

const readingFor = (date: Date, overrides: Partial<RelativeTimeSettings> = {}) =>
    formatRelativeTime(date, NOW, { ...settings, ...overrides });

describe("formatRelativeTime", () => {
    it("reads a time that has only just been as now", () => {
        expect(reading(0).text).toBe("now");
    });

    it("counts a recent time in seconds", () => {
        expect(reading(-10 * SECOND).text).toBe("10 seconds ago");
    });

    it("rounds to the largest unit a time reaches", () => {
        expect(reading(-90 * MINUTE).text).toBe("2 hours ago");
        expect(reading(-3 * DAY).text).toBe("3 days ago");
        expect(reading(-14 * DAY).text).toBe("2 weeks ago");
    });

    it("reads a time still to come in the future", () => {
        expect(reading(5 * MINUTE).text).toBe("in 5 minutes");
        expect(reading(2 * HOUR).text).toBe("in 2 hours");
    });

    it("writes out a time further away than the threshold", () => {
        expect(reading(-60 * DAY).text).toBe("on Jan 7");
    });

    it("respects a threshold of its own", () => {
        expect(reading(-3 * DAY, { threshold: "P1D" }).text).toBe("on Mar 4");
        expect(reading(-3 * DAY, { threshold: "P1M" }).text).toBe("3 days ago");
    });

    it("falls back to the default threshold when it cannot be read", () => {
        expect(reading(-3 * DAY, { threshold: "soon" }).text).toBe("3 days ago");
        expect(reading(-60 * DAY, { threshold: "soon" }).text).toBe("on Jan 7");
    });

    it("says which year a date outside the one in progress falls in", () => {
        expect(readingFor(new Date(2024, 0, 7)).text).toBe("on Jan 7");
        expect(readingFor(new Date(2023, 0, 7)).text).toBe("on Jan 7, 2023");
    });

    it("respects the prefix", () => {
        expect(readingFor(new Date(2023, 0, 7), { prefix: "" }).text).toBe("Jan 7, 2023");
        expect(readingFor(new Date(2023, 0, 7), { prefix: "since" }).text).toBe(
            "since Jan 7, 2023",
        );
    });

    it("spells the date out the way it was asked to", () => {
        const dateOptions = { weekday: "long", day: "2-digit", month: "long" } as const;
        expect(readingFor(new Date(2023, 0, 7), { dateOptions }).text).toBe(
            "on Saturday, January 07, 2023",
        );
    });

    it("writes out a time that does not fall on the side of now that was asked for", () => {
        expect(reading(-3 * DAY, { tense: "past" }).text).toBe("3 days ago");
        expect(reading(-3 * DAY, { tense: "future" }).text).toBe("on Mar 4");
        expect(reading(3 * DAY, { tense: "future" }).text).toBe("in 3 days");
        expect(reading(3 * DAY, { tense: "past" }).text).toBe("on Mar 10");
    });

    it("cuts a time down to the terse form", () => {
        expect(reading(-3 * DAY, { format: "micro" }).text).toBe("3d");
        expect(reading(-90 * MINUTE, { format: "micro" }).text).toBe("2h");
        expect(reading(-30 * DAY, { format: "micro" }).text).toBe("1mo");
        expect(reading(2 * HOUR, { format: "micro" }).text).toBe("2h");
    });

    it("writes the terse form out in full once past the threshold", () => {
        expect(reading(-60 * DAY, { format: "micro" }).text).toBe("on Jan 7");
    });

    it("rounds anything under a minute up to a minute in the terse form", () => {
        expect(reading(-10 * SECOND, { format: "micro" }).text).toBe("1m");
        expect(reading(0, { format: "micro" }).text).toBe("1m");
    });

    it("lays an elapsed time out unit by unit", () => {
        const elapsed = -(2 * DAY + 3 * HOUR + 4 * MINUTE + 5 * SECOND);
        expect(reading(elapsed, { format: "elapsed" }).text).toBe("2d 3h 4m 5s");
    });

    it("leaves the units an elapsed time does not reach out", () => {
        expect(reading(-(3 * HOUR + 5 * SECOND), { format: "elapsed" }).text).toBe("3h 5s");
    });

    it("stops an elapsed time at the precision it was given", () => {
        const elapsed = -(2 * DAY + 3 * HOUR + 4 * MINUTE + 5 * SECOND);
        expect(reading(elapsed, { format: "elapsed", precision: "minute" }).text).toBe("2d 3h 4m");
        expect(reading(elapsed, { format: "elapsed", precision: "hour" }).text).toBe("2d 3h");
        expect(reading(elapsed, { format: "elapsed", precision: "day" }).text).toBe("2d");
    });

    it("shows a zero at the precision when an elapsed time has not started", () => {
        expect(reading(0, { format: "elapsed" }).text).toBe("0s");
        expect(reading(0, { format: "elapsed", precision: "minute" }).text).toBe("0m");
    });

    it("counts an elapsed time the same way either side of now", () => {
        expect(reading(3 * HOUR, { format: "elapsed" }).text).toBe("3h");
        expect(reading(-3 * HOUR, { format: "elapsed" }).text).toBe("3h");
    });

    it("ignores the threshold for an elapsed time", () => {
        expect(reading(-60 * DAY, { format: "elapsed", precision: "day" }).text).toBe("2mo");
    });

    it("looks again a unit at a time while the reading is relative", () => {
        expect(reading(-10 * SECOND).updateDelay).toBe(SECOND);
        expect(reading(-10 * MINUTE).updateDelay).toBe(MINUTE);
        expect(reading(-10 * HOUR).updateDelay).toBe(HOUR);
    });

    it("stops looking at a time already gone that is written out in full", () => {
        expect(reading(-60 * DAY).updateDelay).toBeNull();
    });

    it("looks again when a time still to come reaches the threshold", () => {
        expect(reading(60 * DAY).updateDelay).toBe(30 * DAY);
    });

    it("looks again when a time still to come slips into the past", () => {
        expect(reading(3 * DAY, { tense: "past" }).updateDelay).toBe(3 * DAY);
    });
});

describe("RelativeTime", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(NOW);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("renders a time element by default", () => {
        render(<RelativeTime date={new Date(NOW)} data-testid="time" />);
        expect(screen.getByTestId("time").tagName).toBe("TIME");
    });

    it("renders as the element passed to the as prop", () => {
        render(<RelativeTime as="span" date={new Date(NOW)} data-testid="time" />);
        expect(screen.getByTestId("time").tagName).toBe("SPAN");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<RelativeTime date={new Date(NOW)} data-testid="time" />);
        expect(screen.getByTestId("time")).toHaveAttribute("data-component", "RelativeTime");
    });

    it("reads the date relative to now", () => {
        render(<RelativeTime date={new Date(NOW - 3 * DAY)} data-testid="time" />);
        expect(screen.getByTestId("time")).toHaveTextContent("3 days ago");
    });

    it("takes the time from a datetime string", () => {
        const date = new Date(NOW - 3 * DAY);
        render(<RelativeTime datetime={date.toISOString()} data-testid="time" />);
        expect(screen.getByTestId("time")).toHaveTextContent("3 days ago");
    });

    it("prefers the date over the datetime string", () => {
        render(
            <RelativeTime
                date={new Date(NOW - 3 * DAY)}
                datetime={new Date(NOW - 2 * HOUR).toISOString()}
                data-testid="time"
            />,
        );
        expect(screen.getByTestId("time")).toHaveTextContent("3 days ago");
    });

    it("carries the machine readable date", () => {
        const date = new Date(NOW - 3 * DAY);
        render(<RelativeTime date={date} data-testid="time" />);
        expect(screen.getByTestId("time")).toHaveAttribute("datetime", date.toISOString());
    });

    it("renders nothing without a time to show", () => {
        render(<RelativeTime data-testid="time" />);
        const time = screen.getByTestId("time");
        expect(time).toBeEmptyDOMElement();
        expect(time).not.toHaveAttribute("datetime");
    });

    it("renders nothing for a datetime string it cannot read", () => {
        render(<RelativeTime datetime="the other day" data-testid="time" />);
        expect(screen.getByTestId("time")).toBeEmptyDOMElement();
    });

    it("renders children in place of the reading", () => {
        render(
            <RelativeTime date={new Date(NOW - 3 * DAY)} data-testid="time">
                the other day
            </RelativeTime>,
        );
        expect(screen.getByTestId("time")).toHaveTextContent("the other day");
    });

    it("carries a title saying which date it stands for", () => {
        render(<RelativeTime date={new Date(NOW - 3 * DAY)} data-testid="time" />);
        expect(screen.getByTestId("time")).toHaveAttribute("title");
    });

    it("drops the title when asked to", () => {
        render(<RelativeTime date={new Date(NOW - 3 * DAY)} noTitle data-testid="time" />);
        expect(screen.getByTestId("time")).not.toHaveAttribute("title");
    });

    it("leaves a title of its own alone", () => {
        render(
            <RelativeTime date={new Date(NOW - 3 * DAY)} title="Committed" data-testid="time" />,
        );
        expect(screen.getByTestId("time")).toHaveAttribute("title", "Committed");
    });

    it("tags the root element with the format and the tense", () => {
        render(
            <RelativeTime date={new Date(NOW)} format="micro" tense="past" data-testid="time" />,
        );
        const time = screen.getByTestId("time");
        expect(time).toHaveAttribute("data-format", "micro");
        expect(time).toHaveAttribute("data-tense", "past");
    });

    it("keeps the reading up to date as time passes", () => {
        render(<RelativeTime date={new Date(NOW - 58 * SECOND)} data-testid="time" />);
        expect(screen.getByTestId("time")).toHaveTextContent("58 seconds ago");

        act(() => {
            vi.advanceTimersByTime(SECOND);
        });
        expect(screen.getByTestId("time")).toHaveTextContent("59 seconds ago");

        act(() => {
            vi.advanceTimersByTime(SECOND);
        });
        expect(screen.getByTestId("time")).toHaveTextContent("1 minute ago");
    });

    it("leaves a time written out in full alone", () => {
        render(<RelativeTime date={new Date(NOW - 60 * DAY)} data-testid="time" />);
        expect(screen.getByTestId("time")).toHaveTextContent("on Jan 7");

        act(() => {
            vi.advanceTimersByTime(DAY);
        });
        expect(screen.getByTestId("time")).toHaveTextContent("on Jan 7");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(<RelativeTime id="committed" date={new Date(NOW)} data-testid="time" />);
        expect(screen.getByTestId("time")).toHaveAttribute("id", "committed");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLTimeElement>();
        render(<RelativeTime ref={ref} date={new Date(NOW)} data-testid="time" />);
        expect(ref.current).toBeInstanceOf(HTMLTimeElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<RelativeTime className="custom" date={new Date(NOW)} data-testid="time" />);
        expect(screen.getByTestId("time")).toHaveClass("custom");
    });
});
