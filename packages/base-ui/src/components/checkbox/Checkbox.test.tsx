import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import Checkbox from "./Checkbox";

describe("Checkbox", () => {
    it("renders a native checkbox", () => {
        render(<Checkbox aria-label="Choice" />);
        const checkbox = screen.getByRole("checkbox", { name: "Choice" });
        expect(checkbox.tagName).toBe("INPUT");
        expect(checkbox).toHaveAttribute("type", "checkbox");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Checkbox aria-label="Choice" />);
        expect(screen.getByRole("checkbox")).toHaveAttribute("data-component", "Checkbox");
    });

    it("checks and unchecks on click", () => {
        render(<Checkbox aria-label="Choice" />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).not.toBeChecked();

        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();

        fireEvent.click(checkbox);
        expect(checkbox).not.toBeChecked();
    });

    it("reports a change", () => {
        const onChange = jest.fn();
        render(<Checkbox aria-label="Choice" onChange={onChange} />);

        fireEvent.click(screen.getByRole("checkbox"));
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("starts checked from defaultChecked", () => {
        render(<Checkbox aria-label="Choice" defaultChecked />);
        expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("follows a controlled checked prop", () => {
        render(<Checkbox aria-label="Choice" checked onChange={() => {}} />);
        expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("leaves its checked state to the native mapping", () => {
        render(<Checkbox aria-label="Choice" />);
        const checkbox = screen.getByRole("checkbox");

        // Nothing is set by hand, so the state cannot go stale when an uncontrolled box is
        // clicked without re-rendering
        expect(checkbox).not.toHaveAttribute("aria-checked");
        fireEvent.click(checkbox);
        expect(checkbox).not.toHaveAttribute("aria-checked");
        expect(checkbox).toBeChecked();
    });

    it("reports a part checked box as mixed", () => {
        render(<Checkbox aria-label="Choice" indeterminate />);
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.indeterminate).toBe(true);
        expect(checkbox).toHaveAttribute("aria-checked", "mixed");
    });

    it("never leaves a part checked box also checked", () => {
        render(<Checkbox aria-label="Choice" indeterminate checked onChange={() => {}} />);
        expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("swaps the mark for a dash when part checked", () => {
        const { rerender } = render(<Checkbox aria-label="Choice" data-testid="box" />);
        const checkmark = screen.getByTestId("box").style.getPropertyValue("--checkbox-mark");
        expect(checkmark).toContain("data:image/svg+xml;base64,");

        rerender(<Checkbox aria-label="Choice" indeterminate data-testid="box" />);
        const dash = screen.getByTestId("box").style.getPropertyValue("--checkbox-mark");
        expect(dash).toContain("data:image/svg+xml;base64,");
        expect(dash).not.toBe(checkmark);
    });

    it("clears the part checked state when it is turned off", () => {
        const { rerender } = render(<Checkbox aria-label="Choice" indeterminate />);
        expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(true);

        rerender(<Checkbox aria-label="Choice" />);
        expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(false);
    });

    it("stops responding when disabled", () => {
        render(<Checkbox aria-label="Choice" disabled />);
        const checkbox = screen.getByRole("checkbox");

        // A click is left to the browser to refuse, so only the state and the styling that
        // goes with it are worth asserting here
        expect(checkbox).toBeDisabled();
        expect(checkbox).toHaveClass("checkbox-disabled");
    });

    it("marks itself required for assistive technology", () => {
        render(<Checkbox aria-label="Choice" required />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeRequired();
        expect(checkbox).toHaveAttribute("aria-required", "true");
    });

    it("marks itself invalid for the error status", () => {
        render(<Checkbox aria-label="Choice" validationStatus="error" />);
        expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("does not mark itself invalid for the success status", () => {
        render(<Checkbox aria-label="Choice" validationStatus="success" />);
        expect(screen.getByRole("checkbox")).not.toHaveAttribute("aria-invalid");
    });

    it("carries its value on submission", () => {
        render(<Checkbox aria-label="Choice" value="one" />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveAttribute("value", "one");
        expect(checkbox).toHaveAttribute("name", "one");
    });

    it("lets an explicit name win over the value", () => {
        render(<Checkbox aria-label="Choice" value="one" name="choices" />);
        expect(screen.getByRole("checkbox")).toHaveAttribute("name", "choices");
    });

    it("does not leak the styling props onto the element", () => {
        render(<Checkbox aria-label="Choice" indeterminate validationStatus="error" />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).not.toHaveAttribute("indeterminate");
        expect(checkbox).not.toHaveAttribute("validationStatus");
    });

    it("forwards a ref to the input", () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<Checkbox ref={ref} aria-label="Choice" />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("merges a custom className onto the input", () => {
        render(<Checkbox aria-label="Choice" className="custom" />);
        expect(screen.getByRole("checkbox")).toHaveClass("custom");
    });
});
