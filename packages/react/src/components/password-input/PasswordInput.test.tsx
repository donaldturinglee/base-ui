import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { PasswordInput } from ".";
import type { PasswordInputProps } from "./PasswordInput.types";

const renderInput = (props: Partial<PasswordInputProps> = {}) =>
    render(<PasswordInput aria-label="Password" data-testid="password" {...props} />);

const field = () => screen.getByTestId("password") as HTMLInputElement;

const toggle = () => screen.getByRole("button");

describe("PasswordInput", () => {
    it("renders a field that holds its contents back", () => {
        renderInput();

        expect(field().tagName).toBe("INPUT");
        expect(field()).toHaveAttribute("type", "password");
        expect(field()).toHaveAttribute("data-component", "PasswordInput");
    });

    it("draws a toggle beside the field", () => {
        renderInput();

        expect(toggle()).toBeInTheDocument();
        expect(toggle()).toHaveAttribute("data-component", "PasswordInput.Toggle");
    });

    it("gives the toggle a type, so it does not send the form it stands in", () => {
        renderInput();
        expect(toggle()).toHaveAttribute("type", "button");
    });

    describe("showing what has been typed", () => {
        it("asks for plain text once the toggle has been pressed", () => {
            renderInput();
            expect(field()).toHaveAttribute("type", "password");

            fireEvent.click(toggle());
            expect(field()).toHaveAttribute("type", "text");
        });

        it("holds it back again on a second press", () => {
            renderInput();

            fireEvent.click(toggle());
            fireEvent.click(toggle());
            expect(field()).toHaveAttribute("type", "password");
        });

        it("starts out shown where it is asked to", () => {
            renderInput({ defaultVisible: true });
            expect(field()).toHaveAttribute("type", "text");
        });

        it("keeps what has been typed either way", () => {
            renderInput({ defaultValue: "hunter2" });

            fireEvent.click(toggle());
            expect(field()).toHaveValue("hunter2");
        });
    });

    describe("what the toggle is called", () => {
        it("says what pressing it would do next rather than where it stands", () => {
            renderInput();
            expect(toggle()).toHaveAccessibleName("Show password");

            fireEvent.click(toggle());
            expect(toggle()).toHaveAccessibleName("Hide password");
        });

        it("is not also marked as pressed, which would say the same thing twice", () => {
            renderInput();

            expect(toggle()).not.toHaveAttribute("aria-pressed");
            fireEvent.click(toggle());
            expect(toggle()).not.toHaveAttribute("aria-pressed");
        });

        it("takes the names the caller gives it", () => {
            renderInput({ showLabel: "Reveal", hideLabel: "Conceal" });

            expect(toggle()).toHaveAccessibleName("Reveal");
            fireEvent.click(toggle());
            expect(toggle()).toHaveAccessibleName("Conceal");
        });
    });

    it("leaves the reader on the toggle rather than moving them into the field", () => {
        renderInput();

        toggle().focus();
        fireEvent.click(toggle());

        // The field focuses its typing area on a press anywhere in it; a press on the toggle is
        // kept from reaching that
        expect(toggle()).toHaveFocus();
    });

    it("leaves the field with no toggle where it is asked to", () => {
        renderInput({ hideToggle: true });

        expect(screen.queryByRole("button")).toBeNull();
        expect(field()).toHaveAttribute("type", "password");
    });

    describe("where the caller keeps hold of the toggle", () => {
        it("shows what it is told to rather than what was pressed", () => {
            const onVisibilityChange = vi.fn();
            renderInput({ visible: false, onVisibilityChange });

            fireEvent.click(toggle());

            expect(field()).toHaveAttribute("type", "password");
            expect(onVisibilityChange).toHaveBeenCalledWith(true);
        });

        it("shows the contents while it is held open", () => {
            renderInput({ visible: true, onVisibilityChange: () => {} });
            expect(field()).toHaveAttribute("type", "text");
        });

        it("reports the change either way", () => {
            const onVisibilityChange = vi.fn();
            renderInput({ onVisibilityChange });

            fireEvent.click(toggle());
            expect(onVisibilityChange).toHaveBeenLastCalledWith(true);

            fireEvent.click(toggle());
            expect(onVisibilityChange).toHaveBeenLastCalledWith(false);
        });
    });

    describe("turned off", () => {
        it("closes the toggle along with the field", () => {
            renderInput({ disabled: true });

            expect(field()).toBeDisabled();
            expect(toggle()).toBeDisabled();
        });
    });

    it("carries whatever the caller tells the browser to fill it with", () => {
        renderInput({ autoComplete: "new-password" });
        expect(field()).toHaveAttribute("autocomplete", "new-password");
    });

    it("marks the field invalid for the error status", () => {
        renderInput({ validationStatus: "error" });
        expect(field()).toHaveAttribute("aria-invalid", "true");
    });

    it("reports what is typed into it", () => {
        const onChange = vi.fn();
        renderInput({ onChange });

        fireEvent.change(field(), { target: { value: "hunter2" } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("forwards a ref to the field", () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<PasswordInput ref={ref} aria-label="Password" data-testid="password" />);

        expect(ref.current).toBe(field());
    });

    it("merges a custom className onto the field it is built on", () => {
        const { container } = renderInput({ className: "custom" });
        const root = container.querySelector("[data-component='TextInput']");

        expect(root).toHaveClass("password-input", "custom");
    });
});
