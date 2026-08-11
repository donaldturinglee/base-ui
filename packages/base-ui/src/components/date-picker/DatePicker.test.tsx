import * as React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll, afterEach, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import dayjs from "dayjs";
import { DatePicker } from ".";
import type { CalendarRange } from "../calendar";
import type {
    DatePickerBaseProps,
    DatePickerPropsForARange,
    DatePickerPropsForOneDay,
} from "./DatePicker.types";

// The mode settles what the rest of the props carry, so each of the two is rendered through a
// helper that already knows which of them it is
type SingleProps = Partial<DatePickerBaseProps & DatePickerPropsForOneDay>;

type RangeProps = Partial<DatePickerBaseProps & DatePickerPropsForARange>;

// Every reading of "today" is pinned, so that the month the calendar opens on is the same on
// every run. The 15th of June 2026 is a Monday
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

const originalResizeObserver = window.ResizeObserver;

const renderPicker = (props: SingleProps = {}) =>
    render(<DatePicker aria-label="Starts on" {...props} />);

const renderRangePicker = (props: RangeProps = {}) =>
    render(<DatePicker mode="range" aria-label="Starts on" {...props} />);

const field = () => screen.getByRole("textbox", { name: "Starts on" });

const calendarButton = () => screen.getByRole("button", { name: "Choose a date" });

const calendar = () => screen.queryByRole("dialog", { name: "Choose a date" });

const day = (key: string) =>
    document.querySelector(`[data-date='${key}']`) as HTMLButtonElement | null;

describe("DatePicker", () => {
    // The clock is held still once for the whole suite rather than put up and taken down
    // around every test, since nothing here ever moves it on
    beforeAll(() => {
        jest.useFakeTimers(CLOCK_ONLY);
        jest.setSystemTime(new Date(`${TODAY}T12:00:00`));

        // jsdom has no ResizeObserver, and the overlay watches its own size so that it stays
        // against the field as it grows
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    });

    afterAll(() => {
        jest.useRealTimers();
        window.ResizeObserver = originalResizeObserver;
    });

    afterEach(() => {
        // Taken down while the clock and the stub are still standing, since the overlay lets
        // go of what it was watching the page with as it goes
        cleanup();
    });

    it("tags the root element with a data-component attribute", () => {
        const { container } = renderPicker();
        expect(container.firstChild).toHaveAttribute("data-component", "DatePicker");
    });

    it("renders a field with a button that brings the calendar out", () => {
        renderPicker();

        expect(field()).toBeInTheDocument();
        expect(calendarButton()).toBeInTheDocument();
        expect(calendar()).not.toBeInTheDocument();
    });

    it("stands the form the date is written in in the empty field", () => {
        renderPicker();
        expect(field()).toHaveAttribute("placeholder", "YYYY-MM-DD");
    });

    it("takes a placeholder of the caller's own instead", () => {
        renderPicker({ placeholder: "When does it start?" });
        expect(field()).toHaveAttribute("placeholder", "When does it start?");
    });

    it("writes out the day it was given", () => {
        renderPicker({ defaultValue: "2026-06-20" });
        expect(field()).toHaveValue("2026-06-20");
    });

    it("writes it out whichever way it was asked to", () => {
        renderPicker({ defaultValue: "2026-06-20", format: "DD/MM/YYYY" });
        expect(field()).toHaveValue("20/06/2026");
    });

    describe("typing a date", () => {
        it("takes what was typed once the whole of it reads as a date", () => {
            const onChange = jest.fn();
            renderPicker({ onChange });

            fireEvent.change(field(), { target: { value: "2026-06-20" } });

            expect(onChange).toHaveBeenCalledTimes(1);
            const picked = onChange.mock.calls[0][0] as Date;
            expect(picked.getFullYear()).toBe(2026);
            expect(picked.getMonth()).toBe(5);
            expect(picked.getDate()).toBe(20);
        });

        it("leaves half a date alone", () => {
            const onChange = jest.fn();
            renderPicker({ onChange });

            fireEvent.change(field(), { target: { value: "2026-06" } });

            expect(onChange).not.toHaveBeenCalled();
            expect(field()).toHaveValue("2026-06");
        });

        it("leaves something that is not a date at all alone", () => {
            const onChange = jest.fn();
            renderPicker({ onChange });

            fireEvent.change(field(), { target: { value: "next tuesday" } });

            expect(onChange).not.toHaveBeenCalled();
        });

        it("reads what was typed against the form it was asked for", () => {
            const onChange = jest.fn();
            renderPicker({ format: "DD/MM/YYYY", onChange });

            fireEvent.change(field(), { target: { value: "2026-06-20" } });
            expect(onChange).not.toHaveBeenCalled();

            fireEvent.change(field(), { target: { value: "20/06/2026" } });
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        it("hands back nothing where the field is emptied", () => {
            const onChange = jest.fn();
            renderPicker({ defaultValue: "2026-06-20", onChange });

            fireEvent.change(field(), { target: { value: "" } });

            expect(onChange).toHaveBeenCalledWith(null);
            expect(field()).toHaveValue("");
        });

        it("writes the day back out again on leaving the field", () => {
            renderPicker({ defaultValue: "2026-06-20" });

            fireEvent.change(field(), { target: { value: "2026-06" } });
            fireEvent.blur(field());

            expect(field()).toHaveValue("2026-06-20");
        });

        it("leaves a day the caller is holding where it is", () => {
            const onChange = jest.fn();
            renderPicker({ value: "2026-06-20", onChange });

            fireEvent.change(field(), { target: { value: "2026-07-04" } });
            fireEvent.blur(field());

            expect(onChange).toHaveBeenCalled();
            expect(field()).toHaveValue("2026-06-20");
        });

        it("leaves a day outside the range it was given alone", () => {
            const onChange = jest.fn();
            renderPicker({ min: "2026-06-10", max: "2026-06-30", onChange });

            fireEvent.change(field(), { target: { value: "2026-07-04" } });

            expect(onChange).not.toHaveBeenCalled();
        });
    });

    describe("the calendar", () => {
        it("comes out when the button is pressed", () => {
            renderPicker();

            fireEvent.click(calendarButton());

            expect(calendar()).toBeInTheDocument();
            expect(calendarButton()).toHaveAttribute("aria-expanded", "true");
        });

        it("goes away again when the button is pressed a second time", () => {
            renderPicker();

            fireEvent.click(calendarButton());
            fireEvent.click(calendarButton());

            expect(calendar()).not.toBeInTheDocument();
        });

        it("stands open where it was asked to", () => {
            renderPicker({ defaultOpen: true });
            expect(calendar()).toBeInTheDocument();
        });

        it("says it brings out a dialog", () => {
            renderPicker();
            expect(calendarButton()).toHaveAttribute("aria-haspopup", "dialog");
        });

        it("names it something else where it is asked to", () => {
            renderPicker({
                defaultOpen: true,
                calendarLabel: "Start date",
                calendarButtonLabel: "Pick a start date",
            });

            expect(screen.getByRole("dialog", { name: "Start date" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Pick a start date" })).toBeInTheDocument();
        });

        it("opens on the month the day that was picked falls in", () => {
            renderPicker({ defaultValue: "2026-09-04", defaultOpen: true });

            expect(day("2026-09-04")).toHaveAttribute("aria-pressed", "true");
        });

        it("opens on this month where nothing has been picked", () => {
            renderPicker({ defaultOpen: true });
            expect(day(TODAY)).toHaveAttribute("aria-current", "date");
        });

        it("holds every month to six weeks, so that it keeps its height", () => {
            renderPicker({ defaultOpen: true });

            const weeks = document.querySelectorAll("[data-component='Calendar.Week']");
            expect(weeks).toHaveLength(6);
        });

        it("passes the range it was given on to the calendar", () => {
            renderPicker({ defaultOpen: true, min: "2026-06-10" });

            expect(day("2026-06-09")).toHaveAttribute("aria-disabled", "true");
            expect(day("2026-06-10")).not.toHaveAttribute("aria-disabled");
        });

        it("writes the day that was picked into the field and closes", () => {
            const onChange = jest.fn();
            renderPicker({ defaultOpen: true, onChange });

            fireEvent.click(day("2026-06-11") as HTMLButtonElement);

            expect(field()).toHaveValue("2026-06-11");
            expect(calendar()).not.toBeInTheDocument();
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        it("hands focus back to the field once it closes", () => {
            renderPicker({ defaultOpen: true });

            fireEvent.click(day("2026-06-11") as HTMLButtonElement);

            expect(field()).toHaveFocus();
        });

        it("goes away when escape is pressed", () => {
            renderPicker({ defaultOpen: true });

            fireEvent.keyDown(document, { key: "Escape" });

            expect(calendar()).not.toBeInTheDocument();
        });

        it("goes away when a press lands anywhere else", () => {
            renderPicker({ defaultOpen: true });

            fireEvent.mouseDown(document.body);

            expect(calendar()).not.toBeInTheDocument();
        });

        it("tells the caller what opened and closed it", () => {
            const onOpenChange = jest.fn();
            renderPicker({ onOpenChange });

            fireEvent.click(calendarButton());
            expect(onOpenChange).toHaveBeenLastCalledWith(true, "button");

            fireEvent.keyDown(document, { key: "Escape" });
            expect(onOpenChange).toHaveBeenLastCalledWith(false, "escape");
        });

        it("stays as the caller is holding it", () => {
            const onOpenChange = jest.fn();
            renderPicker({ open: false, onOpenChange });

            fireEvent.click(calendarButton());

            expect(onOpenChange).toHaveBeenCalledWith(true, "button");
            expect(calendar()).not.toBeInTheDocument();
        });
    });

    describe("picking a stretch of days", () => {
        // The two ends of the range as the picker hands them back, written the one way so that
        // a whole range can be read at a glance
        const handedBack = (onChange: jest.Mock, call = 0) => {
            const range = onChange.mock.calls[call][0] as CalendarRange;

            return {
                from: range.from && dayjs(range.from).format("YYYY-MM-DD"),
                to: range.to && dayjs(range.to).format("YYYY-MM-DD"),
            };
        };

        it("stands the form both ends are written in in the empty field", () => {
            renderRangePicker();
            expect(field()).toHaveAttribute("placeholder", "YYYY-MM-DD - YYYY-MM-DD");
        });

        it("writes out the stretch it was given", () => {
            renderRangePicker({ defaultValue: { from: "2026-06-10", to: "2026-06-14" } });
            expect(field()).toHaveValue("2026-06-10 - 2026-06-14");
        });

        it("writes out only the end it has where the stretch is half picked", () => {
            renderRangePicker({ defaultValue: { from: "2026-06-10", to: null } });
            expect(field()).toHaveValue("2026-06-10");
        });

        it("stands open on the first day being picked and closes on the second", () => {
            const onChange = jest.fn();
            renderRangePicker({ defaultOpen: true, onChange });

            fireEvent.click(day("2026-06-10") as HTMLButtonElement);

            expect(handedBack(onChange, 0)).toEqual({ from: "2026-06-10", to: null });
            expect(calendar()).toBeInTheDocument();

            fireEvent.click(day("2026-06-14") as HTMLButtonElement);

            expect(handedBack(onChange, 1)).toEqual({ from: "2026-06-10", to: "2026-06-14" });
            expect(calendar()).not.toBeInTheDocument();
            expect(field()).toHaveValue("2026-06-10 - 2026-06-14");
        });

        it("lets go of the day a stretch was started on when it is pressed again", () => {
            const onChange = jest.fn();
            renderRangePicker({ defaultOpen: true, onChange });

            fireEvent.click(day("2026-06-10") as HTMLButtonElement);
            fireEvent.click(day("2026-06-10") as HTMLButtonElement);

            expect(handedBack(onChange, 1)).toEqual({ from: null, to: null });
            expect(field()).toHaveValue("");
            // There is nothing left to close on, so the calendar is left standing for the
            // reader to start again in
            expect(calendar()).toBeInTheDocument();
        });

        it("marks every day from one end of the stretch to the other in the calendar", () => {
            renderRangePicker({
                defaultOpen: true,
                defaultValue: { from: "2026-06-10", to: "2026-06-14" },
            });

            expect(day("2026-06-12")).toHaveAttribute("aria-pressed", "true");
            expect(day("2026-06-10")).toHaveAttribute("data-range", "start");
            expect(day("2026-06-14")).toHaveAttribute("data-range", "end");
        });

        it("takes both ends typed either side of the separator", () => {
            const onChange = jest.fn();
            renderRangePicker({ onChange });

            fireEvent.change(field(), { target: { value: "2026-06-10 - 2026-06-14" } });

            expect(handedBack(onChange, 0)).toEqual({ from: "2026-06-10", to: "2026-06-14" });
        });

        it("takes one end on its own as a stretch still being picked", () => {
            const onChange = jest.fn();
            renderRangePicker({ onChange });

            fireEvent.change(field(), { target: { value: "2026-06-10" } });

            expect(handedBack(onChange, 0)).toEqual({ from: "2026-06-10", to: null });
        });

        it("puts the two ends the right way round where they were typed backwards", () => {
            const onChange = jest.fn();
            renderRangePicker({ onChange });

            fireEvent.change(field(), { target: { value: "2026-06-14 - 2026-06-10" } });

            expect(handedBack(onChange, 0)).toEqual({ from: "2026-06-10", to: "2026-06-14" });
        });

        it("leaves half a stretch alone", () => {
            const onChange = jest.fn();
            renderRangePicker({ onChange });

            fireEvent.change(field(), { target: { value: "2026-06-10 - 2026-06" } });

            expect(onChange).not.toHaveBeenCalled();
        });

        it("hands back nothing at either end where the field is emptied", () => {
            const onChange = jest.fn();
            renderRangePicker({
                defaultValue: { from: "2026-06-10", to: "2026-06-14" },
                onChange,
            });

            fireEvent.change(field(), { target: { value: "" } });

            expect(handedBack(onChange, 0)).toEqual({ from: null, to: null });
            expect(field()).toHaveValue("");
        });

        it("writes the stretch back out again on leaving the field", () => {
            renderRangePicker({ defaultValue: { from: "2026-06-10", to: "2026-06-14" } });

            fireEvent.change(field(), { target: { value: "2026-06-10 - 2026" } });
            fireEvent.blur(field());

            expect(field()).toHaveValue("2026-06-10 - 2026-06-14");
        });

        it("takes a separator of the caller's own", () => {
            const onChange = jest.fn();
            renderRangePicker({ rangeSeparator: " to ", onChange });

            expect(field()).toHaveAttribute("placeholder", "YYYY-MM-DD to YYYY-MM-DD");

            fireEvent.change(field(), { target: { value: "2026-06-10 to 2026-06-14" } });

            expect(handedBack(onChange, 0)).toEqual({ from: "2026-06-10", to: "2026-06-14" });
        });

        it("leaves an end outside the range it was given alone", () => {
            const onChange = jest.fn();
            renderRangePicker({ min: "2026-06-10", max: "2026-06-30", onChange });

            fireEvent.change(field(), { target: { value: "2026-06-10 - 2026-07-04" } });

            expect(onChange).not.toHaveBeenCalled();
        });

        it("leaves a stretch the caller is holding where it is", () => {
            const onChange = jest.fn();
            renderRangePicker({
                value: { from: "2026-06-10", to: "2026-06-14" },
                defaultOpen: true,
                onChange,
            });

            fireEvent.click(day("2026-06-20") as HTMLButtonElement);

            expect(onChange).toHaveBeenCalled();
            expect(field()).toHaveValue("2026-06-10 - 2026-06-14");
        });

        it("closes on the one day picked where a picker takes one at a time", () => {
            renderPicker({ defaultOpen: true });

            fireEvent.click(day("2026-06-10") as HTMLButtonElement);

            expect(calendar()).not.toBeInTheDocument();
            expect(field()).toHaveValue("2026-06-10");
        });
    });

    describe("as a form field", () => {
        it("passes the name and the id on to the field", () => {
            renderPicker({ name: "starts-on", id: "starts-on" });

            expect(field()).toHaveAttribute("name", "starts-on");
            expect(field()).toHaveAttribute("id", "starts-on");
        });

        it("stops both the field and the button being used where it is disabled", () => {
            renderPicker({ disabled: true });

            expect(field()).toBeDisabled();
            expect(calendarButton()).toBeDisabled();
        });

        it("says it is invalid where it is", () => {
            renderPicker({ validationStatus: "error" });
            expect(field()).toHaveAttribute("aria-invalid", "true");
        });
    });
});
