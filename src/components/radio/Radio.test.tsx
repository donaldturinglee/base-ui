import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import Radio from "./Radio";

describe("Radio", () => {
    it("renders a native radio", () => {
        render(<Radio aria-label="Choice" name="choices" value="one" />);
        const radio = screen.getByRole("radio", { name: "Choice" });
        expect(radio.tagName).toBe("INPUT");
        expect(radio).toHaveAttribute("type", "radio");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Radio aria-label="Choice" name="choices" value="one" />);
        expect(screen.getByRole("radio")).toHaveAttribute("data-component", "Radio");
    });

    it("checks on click", () => {
        render(<Radio aria-label="Choice" name="choices" value="one" />);
        const radio = screen.getByRole("radio");
        expect(radio).not.toBeChecked();

        fireEvent.click(radio);
        expect(radio).toBeChecked();
    });

    it("reports a change", () => {
        const onChange = jest.fn();
        render(<Radio aria-label="Choice" name="choices" value="one" onChange={onChange} />);

        fireEvent.click(screen.getByRole("radio"));
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("starts checked from defaultChecked", () => {
        render(<Radio aria-label="Choice" name="choices" value="one" defaultChecked />);
        expect(screen.getByRole("radio")).toBeChecked();
    });

    it("follows a controlled checked prop", () => {
        render(
            <Radio aria-label="Choice" name="choices" value="one" checked onChange={() => {}} />,
        );
        expect(screen.getByRole("radio")).toBeChecked();
    });

    it("leaves its checked state to the native mapping", () => {
        render(<Radio aria-label="Choice" name="choices" value="one" />);
        const radio = screen.getByRole("radio");

        // Nothing is set by hand, so the state cannot go stale when an uncontrolled radio is
        // clicked without re-rendering
        expect(radio).not.toHaveAttribute("aria-checked");
        fireEvent.click(radio);
        expect(radio).not.toHaveAttribute("aria-checked");
        expect(radio).toBeChecked();
    });

    it("lets only one radio of a name be checked at a time", () => {
        render(
            <>
                <Radio aria-label="One" name="choices" value="one" />
                <Radio aria-label="Two" name="choices" value="two" />
            </>,
        );

        const one = screen.getByRole("radio", { name: "One" });
        const two = screen.getByRole("radio", { name: "Two" });

        fireEvent.click(one);
        expect(one).toBeChecked();
        expect(two).not.toBeChecked();

        fireEvent.click(two);
        expect(one).not.toBeChecked();
        expect(two).toBeChecked();
    });

    it("stops responding when disabled", () => {
        render(<Radio aria-label="Choice" name="choices" value="one" disabled />);
        const radio = screen.getByRole("radio");

        // A click is left to the browser to refuse, so only the state and the styling that
        // goes with it are worth asserting here
        expect(radio).toBeDisabled();
        expect(radio).toHaveClass("radio-disabled");
    });

    it("marks itself required for assistive technology", () => {
        render(<Radio aria-label="Choice" name="choices" value="one" required />);
        const radio = screen.getByRole("radio");
        expect(radio).toBeRequired();
        expect(radio).toHaveAttribute("aria-required", "true");
    });

    it("marks itself invalid for the error status", () => {
        render(<Radio aria-label="Choice" name="choices" value="one" validationStatus="error" />);
        expect(screen.getByRole("radio")).toHaveAttribute("aria-invalid", "true");
    });

    it("does not mark itself invalid for the success status", () => {
        render(<Radio aria-label="Choice" name="choices" value="one" validationStatus="success" />);
        expect(screen.getByRole("radio")).not.toHaveAttribute("aria-invalid");
    });

    it("carries its name and value on submission", () => {
        render(<Radio aria-label="Choice" name="choices" value="one" />);
        const radio = screen.getByRole("radio");
        expect(radio).toHaveAttribute("value", "one");
        expect(radio).toHaveAttribute("name", "choices");
    });

    it("does not leak the styling props onto the element", () => {
        render(<Radio aria-label="Choice" name="choices" value="one" validationStatus="error" />);
        expect(screen.getByRole("radio")).not.toHaveAttribute("validationStatus");
    });

    it("forwards a ref to the input", () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<Radio ref={ref} aria-label="Choice" name="choices" value="one" />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("merges a custom className onto the input", () => {
        render(<Radio aria-label="Choice" name="choices" value="one" className="custom" />);
        expect(screen.getByRole("radio")).toHaveClass("custom");
    });
});
