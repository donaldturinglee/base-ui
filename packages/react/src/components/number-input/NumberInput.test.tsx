import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { NumberInput } from ".";
import { clampToRange, stepValue } from "./numberValue";
import type { NumberInputProps } from "./NumberInput.types";

const renderInput = (props: Partial<NumberInputProps> = {}) =>
    render(<NumberInput aria-label="Quantity" {...props} />);

const field = () => screen.getByRole("spinbutton", { name: "Quantity" }) as HTMLInputElement;

const increment = () => screen.getByRole("button", { name: "Increase" });

const decrement = () => screen.getByRole("button", { name: "Decrease" });

describe("NumberInput", () => {
    it("renders a native number field", () => {
        renderInput();

        expect(field().tagName).toBe("INPUT");
        expect(field()).toHaveAttribute("type", "number");
        expect(field()).toHaveAttribute("data-component", "NumberInput");
    });

    it("carries the ends and the step it was given, so the arrow keys move by the same amount", () => {
        renderInput({ min: 0, max: 10, step: 2 });

        expect(field()).toHaveAttribute("min", "0");
        expect(field()).toHaveAttribute("max", "10");
        expect(field()).toHaveAttribute("step", "2");
    });

    it("draws a stepper beside the field", () => {
        renderInput();

        expect(increment()).toBeInTheDocument();
        expect(decrement()).toBeInTheDocument();
        expect(
            document.querySelector("[data-component='NumberInput.Stepper']"),
        ).toBeInTheDocument();
    });

    it("names the halves of the stepper as the caller asks", () => {
        renderInput({ incrementLabel: "More", decrementLabel: "Fewer" });

        expect(screen.getByRole("button", { name: "More" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Fewer" })).toBeInTheDocument();
    });

    it("leaves the field to typing where the stepper is hidden", () => {
        renderInput({ hideStepper: true });

        expect(screen.queryByRole("button")).toBeNull();
        expect(field()).toBeInTheDocument();
    });

    it("keeps the stepper out of the tab order, since the arrow keys already do its job", () => {
        renderInput();

        expect(increment()).toHaveAttribute("tabindex", "-1");
        expect(decrement()).toHaveAttribute("tabindex", "-1");
    });

    describe("typing into the field", () => {
        it("reports the number that was typed", () => {
            const onChange = vi.fn();
            renderInput({ onChange });

            fireEvent.change(field(), { target: { value: "7" } });
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange.mock.calls[0][0]).toBe(7);
        });

        it("reports nothing at all for a field that has been emptied", () => {
            const onChange = vi.fn();
            renderInput({ defaultValue: 3, onChange });

            fireEvent.change(field(), { target: { value: "" } });
            expect(onChange.mock.calls[0][0]).toBeNull();
        });

        it("hands the event over alongside the number", () => {
            const onChange = vi.fn();
            renderInput({ onChange });

            fireEvent.change(field(), { target: { value: "7" } });
            expect(onChange.mock.calls[0][1]).toBeDefined();
        });
    });

    describe("stepping with the stepper", () => {
        it("moves up by a step", () => {
            renderInput({ defaultValue: 3 });

            fireEvent.click(increment());
            expect(field()).toHaveValue(4);
        });

        it("moves down by a step", () => {
            renderInput({ defaultValue: 3 });

            fireEvent.click(decrement());
            expect(field()).toHaveValue(2);
        });

        it("moves by the step it was given rather than by one", () => {
            renderInput({ defaultValue: 10, step: 5 });

            fireEvent.click(increment());
            expect(field()).toHaveValue(15);
        });

        it("reports the number it landed on, with no event to report", () => {
            const onChange = vi.fn();
            renderInput({ defaultValue: 3, onChange });

            fireEvent.click(increment());
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange.mock.calls[0][0]).toBe(4);
            expect(onChange.mock.calls[0][1]).toBeUndefined();
        });

        it("lands on the floor from a field with nothing in it", () => {
            renderInput({ min: 5 });

            fireEvent.click(increment());
            expect(field()).toHaveValue(5);
        });

        it("lands on zero from an empty field with no floor to land on", () => {
            renderInput();

            fireEvent.click(increment());
            expect(field()).toHaveValue(0);
        });

        it("leaves the reader on the field rather than on the arrow they pressed", () => {
            renderInput({ defaultValue: 3 });

            fireEvent.click(increment());
            expect(field()).toHaveFocus();
        });
    });

    describe("the ends the value is held between", () => {
        it("stops at the ceiling rather than running past it", () => {
            renderInput({ defaultValue: 9, max: 10, step: 5 });

            fireEvent.click(increment());
            expect(field()).toHaveValue(10);
        });

        it("stops at the floor rather than running past it", () => {
            renderInput({ defaultValue: 1, min: 0, step: 5 });

            fireEvent.click(decrement());
            expect(field()).toHaveValue(0);
        });

        it("draws the way up as closed once the value is at the ceiling", () => {
            renderInput({ defaultValue: 10, max: 10 });

            expect(increment()).toBeDisabled();
            expect(decrement()).toBeEnabled();
        });

        it("draws the way down as closed once the value is at the floor", () => {
            renderInput({ defaultValue: 0, min: 0 });

            expect(decrement()).toBeDisabled();
            expect(increment()).toBeEnabled();
        });

        it("leaves both open while the field is empty, since neither end has been reached", () => {
            renderInput({ min: 0, max: 10 });

            expect(increment()).toBeEnabled();
            expect(decrement()).toBeEnabled();
        });
    });

    describe("where the caller keeps hold of the value", () => {
        it("shows the value it was given", () => {
            renderInput({ value: 42, onChange: () => {} });
            expect(field()).toHaveValue(42);
        });

        it("shows an empty field for nothing at all", () => {
            renderInput({ value: null, onChange: () => {} });
            expect(field()).toHaveValue(null);
        });

        it("reports where it would step to without moving there itself", () => {
            const onChange = vi.fn();
            renderInput({ value: 3, onChange });

            fireEvent.click(increment());
            expect(onChange.mock.calls[0][0]).toBe(4);
            // The caller has not said otherwise, so the field still holds what it was given
            expect(field()).toHaveValue(3);
        });
    });

    describe("turned off", () => {
        it("closes the stepper along with the field", () => {
            renderInput({ defaultValue: 3, disabled: true });

            expect(field()).toBeDisabled();
            expect(increment()).toBeDisabled();
            expect(decrement()).toBeDisabled();
        });

        it("closes the stepper on a field that can only be read", () => {
            renderInput({ defaultValue: 3, readOnly: true });

            expect(increment()).toBeDisabled();
            expect(decrement()).toBeDisabled();
        });
    });

    it("marks the field invalid for the error status", () => {
        renderInput({ validationStatus: "error" });
        expect(field()).toHaveAttribute("aria-invalid", "true");
    });

    it("forwards a ref to the field", () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<NumberInput ref={ref} aria-label="Quantity" />);

        expect(ref.current).toBe(field());
    });

    it("merges a custom className onto the field it is built on", () => {
        const { container } = renderInput({ className: "custom" });
        const root = container.querySelector("[data-component='TextInput']");

        expect(root).toHaveClass("number-input", "custom");
    });
});

describe("the arithmetic the field steps by", () => {
    describe("clampToRange", () => {
        it("leaves a number inside the range where it is", () => {
            expect(clampToRange(5, 0, 10)).toBe(5);
        });

        it("pulls a number back to the end it passed", () => {
            expect(clampToRange(-1, 0, 10)).toBe(0);
            expect(clampToRange(11, 0, 10)).toBe(10);
        });

        it("leaves a number alone where there is no end to hold it to", () => {
            expect(clampToRange(1000)).toBe(1000);
        });
    });

    describe("stepValue", () => {
        it("moves by the step it is given", () => {
            expect(stepValue(3, 1, { step: 2 })).toBe(5);
            expect(stepValue(3, -1, { step: 2 })).toBe(1);
        });

        it("moves by one where it is given no step", () => {
            expect(stepValue(3, 1)).toBe(4);
        });

        it("lands on the floor from nothing at all", () => {
            expect(stepValue(null, 1, { min: 5 })).toBe(5);
            expect(stepValue(null, -1, { min: 5 })).toBe(5);
        });

        it("lands on zero from nothing at all where there is no floor", () => {
            expect(stepValue(null, 1)).toBe(0);
        });

        it("stops at either end", () => {
            expect(stepValue(9, 1, { step: 5, max: 10 })).toBe(10);
            expect(stepValue(1, -1, { step: 5, min: 0 })).toBe(0);
        });

        it("keeps a run of tenths from drifting into a tail of digits", () => {
            // 0.1 + 0.2 is 0.30000000000000004 before it is rounded back
            expect(stepValue(0.1, 1, { step: 0.2 })).toBe(0.3);
            expect(stepValue(0.3, -1, { step: 0.1 })).toBe(0.2);
        });
    });
});
