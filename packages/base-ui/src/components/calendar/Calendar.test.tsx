import * as React from "react";
import dayjs from "dayjs";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll, afterEach, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Calendar } from ".";
import type {
    CalendarBaseProps,
    CalendarPropsForARange,
    CalendarPropsForOneDay,
    CalendarRange,
} from "./Calendar.types";

// The mode settles what the rest of the props carry, so each of the two is rendered through a
// helper that already knows which of them it is
type SingleProps = Partial<CalendarBaseProps & CalendarPropsForOneDay>;

type RangeProps = Partial<CalendarBaseProps & CalendarPropsForARange>;

// Every reading of "today" is pinned, so that the month the calendar opens on and the day it
// marks as today are the same on every run. The 15th of June 2026 is a Monday
const TODAY = "2026-06-15";

// Only the clock is held still. Faking the timers themselves as well would leave React and the
// testing library waiting on ticks that never come
const CLOCK_ONLY = {
    doNotFake: [
        "cancelAnimationFrame",
        "cancelIdleCallback",
        "clearImmediate",
        "clearInterval",
        "clearTimeout",
        "hrtime",
        "nextTick",
        "performance",
        "queueMicrotask",
        "requestAnimationFrame",
        "requestIdleCallback",
        "setImmediate",
        "setInterval",
        "setTimeout",
    ],
} as Parameters<typeof jest.useFakeTimers>[0];

const renderCalendar = (props: SingleProps = {}) =>
    render(<Calendar defaultMonth={TODAY} {...props} />);

const renderRangeCalendar = (props: RangeProps = {}) =>
    render(<Calendar mode="range" defaultMonth={TODAY} {...props} />);

const calendar = () => screen.getByTestId("calendar");

const day = (key: string) =>
    document.querySelector(`[data-date='${key}']`) as HTMLButtonElement | null;

const days = () => Array.from(document.querySelectorAll("[data-component='Calendar.Day']"));

// Putting focus on a day takes the calendar's own note of where the reader is with it
const focusDay = (key: string) => {
    const element = day(key) as HTMLButtonElement;
    act(() => element.focus());

    return element;
};

const caption = () => document.querySelector("[data-component='Calendar.Caption']") as HTMLElement;

const grid = () => document.querySelector("[data-component='Calendar.Grid']") as HTMLElement;

const rows = () => Array.from(document.querySelectorAll("[data-component='Calendar.Week']"));

const button = (name: string) => screen.getByRole("button", { name });

describe("Calendar", () => {
    // The clock is held still once for the whole suite rather than put up and taken down
    // around every test, since nothing here ever moves it on
    beforeAll(() => {
        jest.useFakeTimers(CLOCK_ONLY);
        jest.setSystemTime(new Date(`${TODAY}T12:00:00`));
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    afterEach(() => {
        // Taken down while the clock is still held still, since the grid lets go of what it
        // was holding focus with as it goes
        cleanup();
    });

    it("tags the root element with a data-component attribute", () => {
        const { container } = renderCalendar();
        expect(container.firstChild).toHaveAttribute("data-component", "Calendar");
    });

    it("tags each of its parts with a data-component attribute", () => {
        renderCalendar({ "data-testid": "calendar" } as SingleProps);

        for (const part of [
            "Header",
            "Caption",
            "PreviousMonth",
            "NextMonth",
            "Grid",
            "Weekday",
            "Week",
            "Day",
        ]) {
            expect(
                calendar().querySelector(`[data-component='Calendar.${part}']`),
            ).toBeInTheDocument();
        }
    });

    it("writes the month above the grid", () => {
        renderCalendar();
        expect(caption()).toHaveTextContent("June 2026");
    });

    it("writes the month whichever way it is asked to", () => {
        renderCalendar({ monthFormat: "MMM YY" });
        expect(caption()).toHaveTextContent("Jun 26");
    });

    it("names the grid after the month it is showing", () => {
        renderCalendar();
        expect(screen.getByRole("table")).toHaveAccessibleName("June 2026");
    });

    it("lays out every day of the month", () => {
        renderCalendar();

        expect(day("2026-06-01")).toBeInTheDocument();
        expect(day("2026-06-30")).toBeInTheDocument();
        expect(day("2026-07-01")).toBeInTheDocument();
    });

    it("names a day to a screen reader with the whole date", () => {
        renderCalendar();
        expect(day("2026-06-15")).toHaveAccessibleName("June 15, 2026");
    });

    it("names a day whichever way it is asked to", () => {
        renderCalendar({ dayFormat: "dddd D MMMM" });
        expect(day("2026-06-15")).toHaveAccessibleName("Monday 15 June");
    });

    it("names the columns after the days of the week", () => {
        renderCalendar();

        const headers = screen.getAllByRole("columnheader");
        expect(headers).toHaveLength(7);
        expect(headers[0]).toHaveAccessibleName("Sunday");
        expect(headers[6]).toHaveAccessibleName("Saturday");
    });

    it("starts the week wherever it is told to", () => {
        renderCalendar({ weekStartsOn: 1 });

        const headers = screen.getAllByRole("columnheader");
        expect(headers[0]).toHaveAccessibleName("Monday");
        expect(headers[6]).toHaveAccessibleName("Sunday");
    });

    it("marks today", () => {
        renderCalendar();

        expect(day(TODAY)).toHaveAttribute("aria-current", "date");
        expect(day("2026-06-16")).not.toHaveAttribute("aria-current");
    });

    it("opens on this month where it was given none", () => {
        render(<Calendar />);
        expect(caption()).toHaveTextContent("June 2026");
    });

    it("opens on the month the day it was given falls in", () => {
        render(<Calendar defaultValue="2026-09-04" />);
        expect(caption()).toHaveTextContent("September 2026");
    });

    describe("picking a stretch of days", () => {
        // The two ends of the range as the calendar hands them back, written the one way so
        // that a whole range can be read at a glance
        const handedBack = (onChange: jest.Mock, call = 0) => {
            const range = onChange.mock.calls[call][0] as CalendarRange;

            return {
                from: range.from && dayjs(range.from).format("YYYY-MM-DD"),
                to: range.to && dayjs(range.to).format("YYYY-MM-DD"),
            };
        };

        it("takes two days, the first opening the stretch and the second closing it", () => {
            const onChange = jest.fn();
            renderRangeCalendar({ onChange });

            fireEvent.click(day("2026-06-10") as HTMLButtonElement);
            expect(handedBack(onChange, 0)).toEqual({ from: "2026-06-10", to: null });

            fireEvent.click(day("2026-06-14") as HTMLButtonElement);
            expect(handedBack(onChange, 1)).toEqual({ from: "2026-06-10", to: "2026-06-14" });
        });

        it("marks every day from one end of the stretch to the other", () => {
            renderRangeCalendar();

            fireEvent.click(day("2026-06-10") as HTMLButtonElement);
            fireEvent.click(day("2026-06-14") as HTMLButtonElement);

            for (const key of ["2026-06-10", "2026-06-11", "2026-06-14"]) {
                expect(day(key)).toHaveAttribute("aria-pressed", "true");
            }

            expect(day("2026-06-09")).toHaveAttribute("aria-pressed", "false");
            expect(day("2026-06-15")).toHaveAttribute("aria-pressed", "false");
        });

        it("says where each day falls in the stretch", () => {
            renderRangeCalendar();

            fireEvent.click(day("2026-06-10") as HTMLButtonElement);
            fireEvent.click(day("2026-06-14") as HTMLButtonElement);

            expect(day("2026-06-10")).toHaveAttribute("data-range", "start");
            expect(day("2026-06-12")).toHaveAttribute("data-range", "middle");
            expect(day("2026-06-14")).toHaveAttribute("data-range", "end");
            expect(day("2026-06-15")).not.toHaveAttribute("data-range");
        });

        it("puts the two ends the right way round where they were pressed backwards", () => {
            const onChange = jest.fn();
            renderRangeCalendar({ onChange });

            fireEvent.click(day("2026-06-14") as HTMLButtonElement);
            fireEvent.click(day("2026-06-10") as HTMLButtonElement);

            expect(handedBack(onChange, 1)).toEqual({ from: "2026-06-10", to: "2026-06-14" });
            expect(day("2026-06-10")).toHaveAttribute("data-range", "start");
            expect(day("2026-06-14")).toHaveAttribute("data-range", "end");
        });

        it("lets go of the day a stretch was started on when it is pressed again", () => {
            const onChange = jest.fn();
            renderRangeCalendar({ onChange });

            fireEvent.click(day("2026-06-10") as HTMLButtonElement);
            fireEvent.click(day("2026-06-10") as HTMLButtonElement);

            expect(handedBack(onChange, 1)).toEqual({ from: null, to: null });
            expect(day("2026-06-10")).toHaveAttribute("aria-pressed", "false");
        });

        it("starts over rather than letting go once the stretch has been closed", () => {
            const onChange = jest.fn();
            renderRangeCalendar({ onChange });

            fireEvent.click(day("2026-06-10") as HTMLButtonElement);
            fireEvent.click(day("2026-06-14") as HTMLButtonElement);
            fireEvent.click(day("2026-06-10") as HTMLButtonElement);

            expect(handedBack(onChange, 2)).toEqual({ from: "2026-06-10", to: null });
            expect(day("2026-06-10")).toHaveAttribute("aria-pressed", "true");
        });

        it("starts a new stretch on a third day being pressed", () => {
            const onChange = jest.fn();
            renderRangeCalendar({ onChange });

            fireEvent.click(day("2026-06-10") as HTMLButtonElement);
            fireEvent.click(day("2026-06-14") as HTMLButtonElement);
            fireEvent.click(day("2026-06-20") as HTMLButtonElement);

            expect(handedBack(onChange, 2)).toEqual({ from: "2026-06-20", to: null });
            expect(day("2026-06-12")).toHaveAttribute("aria-pressed", "false");
            expect(day("2026-06-20")).toHaveAttribute("aria-pressed", "true");
        });

        it("marks the stretch the caller is holding for it", () => {
            renderRangeCalendar({ value: { from: "2026-06-10", to: "2026-06-14" } });

            expect(day("2026-06-12")).toHaveAttribute("aria-pressed", "true");
            expect(day("2026-06-10")).toHaveAttribute("data-range", "start");
            expect(day("2026-06-14")).toHaveAttribute("data-range", "end");
        });

        it("leaves a stretch the caller is holding where it is", () => {
            const onChange = jest.fn();
            renderRangeCalendar({ value: { from: "2026-06-10", to: null }, onChange });

            fireEvent.click(day("2026-06-14") as HTMLButtonElement);

            expect(onChange).toHaveBeenCalled();
            expect(day("2026-06-14")).toHaveAttribute("aria-pressed", "false");
        });

        it("opens on the month the stretch it was given starts in", () => {
            render(<Calendar mode="range" defaultValue={{ from: "2026-09-04", to: null }} />);
            expect(caption()).toHaveTextContent("September 2026");
        });

        it("leaves a day that cannot be picked alone", () => {
            const onChange = jest.fn();
            renderRangeCalendar({ min: "2026-06-10", onChange });

            fireEvent.click(day("2026-06-09") as HTMLButtonElement);

            expect(onChange).not.toHaveBeenCalled();
        });

        it("shows the stretch under the pointer before the second day is pressed", () => {
            renderRangeCalendar();

            fireEvent.click(day("2026-06-10") as HTMLButtonElement);
            fireEvent.pointerEnter(day("2026-06-14") as HTMLButtonElement);

            expect(day("2026-06-12")).toHaveAttribute("data-range", "middle");
            // Shown rather than taken, so nothing about it has been picked yet
            expect(day("2026-06-12")).toHaveAttribute("aria-pressed", "false");
        });

        it("stops showing it once the pointer comes off the grid", () => {
            renderRangeCalendar();

            fireEvent.click(day("2026-06-10") as HTMLButtonElement);
            fireEvent.pointerEnter(day("2026-06-14") as HTMLButtonElement);
            fireEvent.pointerLeave(grid());

            expect(day("2026-06-12")).not.toHaveAttribute("data-range");
        });

        it("shows it as the reader moves through the grid with the keyboard", () => {
            renderRangeCalendar();

            fireEvent.click(day("2026-06-10") as HTMLButtonElement);
            fireEvent.keyDown(focusDay("2026-06-10"), { key: "ArrowRight" });

            expect(day("2026-06-11")).toHaveAttribute("data-range", "end");
        });

        it("shows nothing under the pointer where nothing has been started", () => {
            renderRangeCalendar();

            fireEvent.pointerEnter(day("2026-06-14") as HTMLButtonElement);

            expect(day("2026-06-14")).not.toHaveAttribute("data-range");
        });

        it("leaves a calendar picking one day at a time alone", () => {
            renderCalendar();

            fireEvent.click(day("2026-06-10") as HTMLButtonElement);
            fireEvent.click(day("2026-06-14") as HTMLButtonElement);

            expect(day("2026-06-10")).toHaveAttribute("aria-pressed", "false");
            expect(day("2026-06-12")).toHaveAttribute("aria-pressed", "false");
            expect(day("2026-06-14")).toHaveAttribute("aria-pressed", "true");
        });
    });

    describe("picking a day", () => {
        it("hands back the day that was picked", () => {
            const onChange = jest.fn();
            renderCalendar({ onChange });

            fireEvent.click(day("2026-06-11") as HTMLButtonElement);

            expect(onChange).toHaveBeenCalledTimes(1);
            const picked = onChange.mock.calls[0][0] as Date;
            expect(picked.getFullYear()).toBe(2026);
            expect(picked.getMonth()).toBe(5);
            expect(picked.getDate()).toBe(11);
        });

        it("marks the day it is holding itself", () => {
            renderCalendar();

            fireEvent.click(day("2026-06-11") as HTMLButtonElement);

            expect(day("2026-06-11")).toHaveAttribute("aria-pressed", "true");
            expect(day("2026-06-12")).toHaveAttribute("aria-pressed", "false");
        });

        it("marks the day the caller is holding for it", () => {
            renderCalendar({ value: "2026-06-20" });
            expect(day("2026-06-20")).toHaveAttribute("aria-pressed", "true");
        });

        it("leaves a day the caller is holding where it is", () => {
            const onChange = jest.fn();
            renderCalendar({ value: "2026-06-20", onChange });

            fireEvent.click(day("2026-06-11") as HTMLButtonElement);

            expect(onChange).toHaveBeenCalled();
            expect(day("2026-06-20")).toHaveAttribute("aria-pressed", "true");
            expect(day("2026-06-11")).toHaveAttribute("aria-pressed", "false");
        });

        it("brings the month of a day picked from the one either side into view", () => {
            renderCalendar();

            fireEvent.click(day("2026-07-01") as HTMLButtonElement);

            expect(caption()).toHaveTextContent("July 2026");
        });
    });

    describe("going from one month to the next", () => {
        it("steps back a month", () => {
            renderCalendar();

            fireEvent.click(button("Previous month"));

            expect(caption()).toHaveTextContent("May 2026");
        });

        it("steps on a month", () => {
            renderCalendar();

            fireEvent.click(button("Next month"));

            expect(caption()).toHaveTextContent("July 2026");
        });

        it("tells the caller which month it went to", () => {
            const onMonthChange = jest.fn();
            renderCalendar({ onMonthChange });

            fireEvent.click(button("Next month"));

            const month = onMonthChange.mock.calls[0][0] as Date;
            expect(month.getMonth()).toBe(6);
            expect(month.getDate()).toBe(1);
        });

        it("stays on the month the caller is holding for it", () => {
            const onMonthChange = jest.fn();
            renderCalendar({ month: "2026-06-01", onMonthChange });

            fireEvent.click(button("Next month"));

            expect(onMonthChange).toHaveBeenCalled();
            expect(caption()).toHaveTextContent("June 2026");
        });

        it("names the buttons something else where it is asked to", () => {
            renderCalendar({ previousMonthLabel: "Back", nextMonthLabel: "On" });

            expect(button("Back")).toBeInTheDocument();
            expect(button("On")).toBeInTheDocument();
        });
    });

    describe("the days that can be picked", () => {
        it("rules out everything before the earliest day", () => {
            renderCalendar({ min: "2026-06-10" });

            expect(day("2026-06-09")).toHaveAttribute("aria-disabled", "true");
            expect(day("2026-06-10")).not.toHaveAttribute("aria-disabled");
        });

        it("rules out everything after the latest day", () => {
            renderCalendar({ max: "2026-06-20" });

            expect(day("2026-06-21")).toHaveAttribute("aria-disabled", "true");
            expect(day("2026-06-20")).not.toHaveAttribute("aria-disabled");
        });

        it("rules out whatever the caller rules out", () => {
            renderCalendar({ isDateDisabled: (date) => date.getDay() === 0 });

            expect(day("2026-06-14")).toHaveAttribute("aria-disabled", "true");
            expect(day("2026-06-15")).not.toHaveAttribute("aria-disabled");
        });

        it("leaves a day that cannot be picked alone", () => {
            const onChange = jest.fn();
            renderCalendar({ min: "2026-06-10", onChange });

            fireEvent.click(day("2026-06-09") as HTMLButtonElement);

            expect(onChange).not.toHaveBeenCalled();
        });

        it("has nowhere to step back to below the earliest day", () => {
            renderCalendar({ min: "2026-06-01" });
            expect(button("Previous month")).toBeDisabled();
        });

        it("has nowhere to step on to above the latest day", () => {
            renderCalendar({ max: "2026-06-30" });
            expect(button("Next month")).toBeDisabled();
        });
    });

    describe("how the grid is laid out", () => {
        it("fills the weeks at both ends with the months either side", () => {
            renderCalendar();

            expect(day("2026-05-31")).toHaveAttribute("data-outside", "true");
            expect(day("2026-06-01")).not.toHaveAttribute("data-outside");
        });

        it("leaves the days of the months either side out where it is asked to", () => {
            renderCalendar({ showOutsideDays: false });

            expect(day("2026-05-31")).toBeNull();
            expect(day("2026-06-01")).toBeInTheDocument();
        });

        it("takes as many weeks as the month needs", () => {
            renderCalendar();
            expect(rows()).toHaveLength(5);
        });

        it("holds every month to six weeks where it is asked to", () => {
            renderCalendar({ fixedWeeks: true });

            expect(rows()).toHaveLength(6);
            expect(day("2026-07-11")).toBeInTheDocument();
        });

        it("writes the week of the year before each row where it is asked to", () => {
            renderCalendar({ showWeekNumbers: true });

            const numbers = document.querySelectorAll("[data-component='Calendar.WeekNumber']");
            expect(numbers).toHaveLength(5);
            expect(numbers[0]).toHaveTextContent("23");
        });
    });

    describe("moving around the grid", () => {
        it("leaves only one day for the tab key to reach", () => {
            renderCalendar();

            const tabbable = days().filter((element) => element.getAttribute("tabindex") === "0");
            expect(tabbable).toHaveLength(1);
            expect(tabbable[0]).toHaveAttribute("data-date", TODAY);
        });

        it("lands on the day that was picked rather than on today", () => {
            renderCalendar({ value: "2026-06-20" });

            expect(day("2026-06-20")).toHaveAttribute("tabindex", "0");
            expect(day(TODAY)).toHaveAttribute("tabindex", "-1");
        });

        it("lands on the first of the month where neither is in it", () => {
            renderCalendar({ defaultMonth: "2026-09-10" });
            expect(day("2026-09-01")).toHaveAttribute("tabindex", "0");
        });

        it.each([
            ["ArrowLeft", "2026-06-14"],
            ["ArrowRight", "2026-06-16"],
            ["ArrowUp", "2026-06-08"],
            ["ArrowDown", "2026-06-22"],
        ])("moves a day or a week with %s", (key, landing) => {
            renderCalendar();

            fireEvent.keyDown(focusDay(TODAY), { key });

            expect(day(landing)).toHaveFocus();
        });

        it("moves to the start and the end of the week", () => {
            renderCalendar();

            fireEvent.keyDown(focusDay(TODAY), { key: "Home" });
            expect(day("2026-06-14")).toHaveFocus();

            fireEvent.keyDown(day("2026-06-14") as HTMLButtonElement, { key: "End" });
            expect(day("2026-06-20")).toHaveFocus();
        });

        it("moves a month at a time with the page keys", () => {
            renderCalendar();

            fireEvent.keyDown(focusDay(TODAY), { key: "PageUp" });
            expect(caption()).toHaveTextContent("May 2026");
            expect(day("2026-05-15")).toHaveFocus();

            fireEvent.keyDown(day("2026-05-15") as HTMLButtonElement, { key: "PageDown" });
            expect(caption()).toHaveTextContent("June 2026");
        });

        it("moves a year at a time where the page keys are pressed with shift", () => {
            renderCalendar();

            fireEvent.keyDown(focusDay(TODAY), { key: "PageDown", shiftKey: true });

            expect(caption()).toHaveTextContent("June 2027");
            expect(day("2027-06-15")).toHaveFocus();
        });

        it("brings the next month into view on moving off the end of this one", () => {
            renderCalendar();

            fireEvent.keyDown(focusDay("2026-06-30"), { key: "ArrowRight" });

            expect(caption()).toHaveTextContent("July 2026");
            expect(day("2026-07-01")).toHaveFocus();
        });

        it("leaves a key pressed with a modifier to the page", () => {
            renderCalendar();

            fireEvent.keyDown(focusDay(TODAY), { key: "ArrowRight", ctrlKey: true });

            expect(day(TODAY)).toHaveFocus();
        });
    });
});
