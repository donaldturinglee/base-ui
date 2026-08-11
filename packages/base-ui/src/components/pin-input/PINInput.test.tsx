import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { PINInput } from ".";
import type { PINInputProps } from "./PINInput.types";

const renderInput = (props: Partial<PINInputProps> = {}) =>
    render(<PINInput aria-label="Verification code" {...props} />);

const boxes = () =>
    Array.from(document.querySelectorAll("[data-component='PINInput.Box']")) as HTMLInputElement[];

const box = (index: number) => boxes()[index];

// A box takes one character at a time, which is what typing into it looks like
const type = (index: number, text: string) => {
    fireEvent.change(box(index), { target: { value: text } });
};

const paste = (index: number, text: string) => {
    fireEvent.paste(box(index), { clipboardData: { getData: () => text } });
};

const codeOf = () =>
    boxes()
        .map((element) => element.value)
        .join("");

describe("PINInput", () => {
    it("tags the root element with a data-component attribute", () => {
        renderInput();
        expect(screen.getByRole("group")).toHaveAttribute("data-component", "PINInput");
    });

    it("draws six boxes by default", () => {
        renderInput();
        expect(boxes()).toHaveLength(6);
    });

    it("draws as many boxes as it is asked for", () => {
        renderInput({ length: 4 });
        expect(boxes()).toHaveLength(4);
    });

    it("names each box by where it stands in the code", () => {
        renderInput({ length: 3 });

        expect(box(0)).toHaveAccessibleName("Digit 1 of 3");
        expect(box(2)).toHaveAccessibleName("Digit 3 of 3");
    });

    it("names them the way the caller asks", () => {
        renderInput({ length: 3, boxLabel: "Character" });
        expect(box(0)).toHaveAccessibleName("Character 1 of 3");
    });

    it("groups the boxes only where there is a name to group them under", () => {
        const { container } = render(<PINInput length={3} />);
        expect(container.querySelector("[data-component='PINInput']")).not.toHaveAttribute("role");
    });

    it("shows the code it starts with, a character to a box", () => {
        renderInput({ length: 4, defaultValue: "1234" });

        expect(box(0)).toHaveValue("1");
        expect(box(3)).toHaveValue("4");
    });

    it("keeps only as much of the code as it has boxes for", () => {
        renderInput({ length: 3, defaultValue: "123456" });
        expect(codeOf()).toBe("123");
    });

    describe("typing the code in", () => {
        it("moves along to the next box as each character is taken", () => {
            renderInput({ length: 4 });

            type(0, "1");
            expect(box(0)).toHaveValue("1");
            expect(box(1)).toHaveFocus();
        });

        it("reports the code as it is typed", () => {
            const onChange = jest.fn();
            renderInput({ length: 4, onChange });

            type(0, "1");
            expect(onChange).toHaveBeenLastCalledWith("1");

            type(1, "2");
            expect(onChange).toHaveBeenLastCalledWith("12");
        });

        it("reports the code as finished once every box is filled", () => {
            const onComplete = jest.fn();
            renderInput({ length: 3, onComplete });

            type(0, "1");
            type(1, "2");
            expect(onComplete).not.toHaveBeenCalled();

            type(2, "3");
            expect(onComplete).toHaveBeenCalledWith("123");
        });

        it("stays on the last box once the code is full", () => {
            renderInput({ length: 2 });

            type(0, "1");
            type(1, "2");
            expect(box(1)).toHaveFocus();
        });

        it("turns away anything that is not a digit in a numeric code", () => {
            renderInput({ length: 4 });

            type(0, "a");
            expect(codeOf()).toBe("");
        });

        it("takes letters in an alphanumeric code", () => {
            renderInput({ length: 4, type: "alphanumeric" });

            type(0, "a");
            expect(box(0)).toHaveValue("a");
        });

        it("asks a phone for its number keyboard on a numeric code", () => {
            renderInput({ length: 2 });
            expect(box(0)).toHaveAttribute("inputmode", "numeric");
        });
    });

    describe("a code arriving all at once", () => {
        it("spreads what was pasted across the boxes", () => {
            renderInput({ length: 4 });

            paste(0, "1234");
            expect(codeOf()).toBe("1234");
        });

        it("keeps only as much of it as there are boxes left", () => {
            renderInput({ length: 4 });

            paste(0, "123456");
            expect(codeOf()).toBe("1234");
        });

        it("drops anything the code will not take", () => {
            renderInput({ length: 4 });

            paste(0, "12-34");
            expect(codeOf()).toBe("1234");
        });

        it("spreads a code the browser filled the first box with", () => {
            renderInput({ length: 4 });

            // A code arriving by message is written into the first box whole
            type(0, "1234");
            expect(codeOf()).toBe("1234");
        });

        it("offers the code to the first box alone", () => {
            renderInput({ length: 3, autoComplete: "one-time-code" });

            expect(box(0)).toHaveAttribute("autocomplete", "one-time-code");
            expect(box(1)).toHaveAttribute("autocomplete", "off");
        });
    });

    describe("taking the code back out", () => {
        it("empties the box it is on and stays there", () => {
            renderInput({ length: 4, defaultValue: "1234" });

            fireEvent.keyDown(box(2), { key: "Backspace" });
            expect(box(2)).not.toHaveFocus();
            expect(codeOf()).toBe("124");
        });

        it("hands back to the box before an empty one and empties that", () => {
            renderInput({ length: 4, defaultValue: "12" });

            fireEvent.keyDown(box(2), { key: "Backspace" });
            expect(codeOf()).toBe("1");
            expect(box(1)).toHaveFocus();
        });

        it("does nothing at the first box where there is nothing to take back", () => {
            const onChange = jest.fn();
            renderInput({ length: 4, onChange });

            fireEvent.keyDown(box(0), { key: "Backspace" });
            expect(onChange).not.toHaveBeenCalled();
        });

        it("empties the box it is on with Delete", () => {
            renderInput({ length: 3, defaultValue: "123" });

            fireEvent.keyDown(box(0), { key: "Delete" });
            expect(codeOf()).toBe("23");
        });
    });

    describe("moving between the boxes", () => {
        it("steps back and forward with the arrow keys", () => {
            renderInput({ length: 4, defaultValue: "1234" });

            fireEvent.keyDown(box(2), { key: "ArrowLeft" });
            expect(box(1)).toHaveFocus();

            fireEvent.keyDown(box(1), { key: "ArrowRight" });
            expect(box(2)).toHaveFocus();
        });

        it("goes to either end with Home and End", () => {
            renderInput({ length: 4, defaultValue: "1234" });

            fireEvent.keyDown(box(2), { key: "End" });
            expect(box(3)).toHaveFocus();

            fireEvent.keyDown(box(3), { key: "Home" });
            expect(box(0)).toHaveFocus();
        });

        it("puts a reader aiming past the end where the next character would go", () => {
            renderInput({ length: 4, defaultValue: "12" });

            act(() => box(3).focus());
            // The code can never be left with a hole in the middle of it
            expect(box(2)).toHaveFocus();
        });

        it("leaves a reader aiming inside the code where they aimed", () => {
            renderInput({ length: 4, defaultValue: "1234" });

            act(() => box(1).focus());
            expect(box(1)).toHaveFocus();
        });

        it("writes at the end of the code wherever the reader has moved to", () => {
            renderInput({ length: 4, defaultValue: "12" });

            // Arrow keys move freely, so the guard against holes is on the writing rather than
            // on where the reader is standing
            fireEvent.keyDown(box(2), { key: "ArrowRight" });
            type(3, "9");

            expect(codeOf()).toBe("129");
        });
    });

    describe("where the caller keeps hold of the code", () => {
        it("shows the code it is given", () => {
            renderInput({ length: 4, value: "12", onChange: () => {} });
            expect(codeOf()).toBe("12");
        });

        it("reports what was typed without taking it itself", () => {
            const onChange = jest.fn();
            renderInput({ length: 4, value: "", onChange });

            type(0, "1");
            expect(onChange).toHaveBeenCalledWith("1");
            expect(codeOf()).toBe("");
        });
    });

    describe("held back and turned off", () => {
        it("hides what has been typed where it is masked", () => {
            renderInput({ length: 3, mask: true, defaultValue: "123" });

            expect(box(0)).toHaveAttribute("type", "password");
        });

        it("shows what has been typed otherwise", () => {
            renderInput({ length: 3 });
            expect(box(0)).toHaveAttribute("type", "text");
        });

        it("turns every box off together", () => {
            renderInput({ length: 3, disabled: true });

            boxes().forEach((element) => expect(element).toBeDisabled());
        });

        it("takes nothing while it can only be read", () => {
            const onChange = jest.fn();
            renderInput({ length: 3, readOnly: true, defaultValue: "12", onChange });

            fireEvent.keyDown(box(1), { key: "Backspace" });
            expect(onChange).not.toHaveBeenCalled();
        });
    });

    it("marks every box invalid for the error status", () => {
        renderInput({ length: 2, validationStatus: "error" });

        expect(screen.getByRole("group")).toHaveAttribute("data-validation", "error");
        boxes().forEach((element) => expect(element).toHaveAttribute("aria-invalid", "true"));
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<PINInput ref={ref} aria-label="Verification code" length={2} />);

        expect(ref.current).toBe(screen.getByRole("group"));
    });

    it("merges a custom className onto the root element", () => {
        renderInput({ length: 2, className: "custom" });
        expect(screen.getByRole("group")).toHaveClass("pin-input", "custom");
    });
});
