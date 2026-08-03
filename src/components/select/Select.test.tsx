import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Select } from ".";

const choices = (
    <>
        <Select.Option value="one">Choice one</Select.Option>
        <Select.Option value="two">Choice two</Select.Option>
        <Select.Option value="three">Choice three</Select.Option>
    </>
);

describe("Select", () => {
    it("renders a native select", () => {
        render(<Select aria-label="Choice">{choices}</Select>);
        expect(screen.getByRole("combobox", { name: "Choice" }).tagName).toBe("SELECT");
    });

    it("renders its options", () => {
        render(<Select aria-label="Choice">{choices}</Select>);
        expect(screen.getAllByRole("option")).toHaveLength(3);
    });

    it("renders grouped options", () => {
        render(
            <Select aria-label="Choice">
                <Select.OptGroup label="Group one">
                    <Select.Option value="one">Choice one</Select.Option>
                </Select.OptGroup>
                <Select.OptGroup label="Group two">
                    <Select.Option value="two">Choice two</Select.Option>
                </Select.OptGroup>
            </Select>,
        );
        expect(screen.getByRole("combobox").querySelectorAll("optgroup")).toHaveLength(2);
    });

    it("tags the field and its parts with data-component attributes", () => {
        const { container } = render(
            <Select aria-label="Choice" data-testid="select">
                <Select.OptGroup label="Group one">
                    <Select.Option value="one">Choice one</Select.Option>
                </Select.OptGroup>
            </Select>,
        );

        for (const name of ["Select", "Select.OptGroup", "Select.Option"]) {
            expect(container.querySelector(`[data-component="${name}"]`)).toBeInstanceOf(
                HTMLElement,
            );
        }
    });

    it("renders an indicator that stays out of the accessibility tree", () => {
        const { container } = render(<Select aria-label="Choice">{choices}</Select>);
        const indicator = container.querySelector("svg");
        expect(indicator).toBeInstanceOf(SVGElement);
        expect(indicator).toHaveAttribute("aria-hidden", "true");
    });

    it("keeps a long choice clear of the indicator", () => {
        const { container } = render(
            <Select aria-label="Choice" data-testid="select">
                {choices}
            </Select>,
        );

        // The field owns the indicator's geometry, and the control reserves that much room
        // on its trailing edge so the two can never overlap
        const field = screen.getByTestId("select").parentElement;
        expect(field).toHaveClass(
            "[--select-indicator-size:var(--base-size-16)]",
            "[--select-indicator-inset:var(--base-size-4)]",
        );
        expect(container.querySelector("svg")).toHaveClass(
            "right-[var(--select-indicator-inset)]",
            "size-[var(--select-indicator-size)]",
        );
        expect(screen.getByTestId("select")).toHaveClass(
            "pr-[calc(var(--select-indicator-inset)_+_var(--select-indicator-size)_+_var(--base-size-4))]",
        );
    });

    it("renders a placeholder option and selects it", () => {
        render(
            <Select aria-label="Choice" placeholder="Pick a choice">
                {choices}
            </Select>,
        );
        const placeholder = screen.getByRole("option", { name: "Pick a choice" });
        expect(placeholder).toHaveAttribute("data-component", "Select.Option");
        expect(placeholder).not.toHaveAttribute("disabled");
        expect(placeholder).not.toHaveAttribute("hidden");
        expect(screen.getByRole("combobox")).toHaveValue("");
    });

    it("takes a required placeholder out of the choices", () => {
        const { container } = render(
            <Select aria-label="Choice" placeholder="Pick a choice" required>
                {choices}
            </Select>,
        );
        // A hidden, disabled option is no longer exposed with the option role, so it is
        // reached through the DOM instead
        const placeholder = container.querySelector('option[value=""]');
        expect(screen.getByRole("combobox")).toBeRequired();
        expect(placeholder).toHaveTextContent("Pick a choice");
        expect(placeholder).toHaveAttribute("disabled");
        expect(placeholder).toHaveAttribute("hidden");
    });

    it("records whether it has a placeholder", () => {
        const { unmount } = render(<Select aria-label="Choice">{choices}</Select>);
        expect(screen.getByRole("combobox")).not.toHaveAttribute("data-has-placeholder");
        unmount();

        render(
            <Select aria-label="Choice" placeholder="Pick a choice">
                {choices}
            </Select>,
        );
        expect(screen.getByRole("combobox")).toHaveAttribute("data-has-placeholder", "true");
    });

    it("lets a default value win over the placeholder", () => {
        render(
            <Select aria-label="Choice" placeholder="Pick a choice" defaultValue="two">
                {choices}
            </Select>,
        );
        expect(screen.getByRole("combobox")).toHaveValue("two");
    });

    it("leaves a controlled select to its own value", () => {
        render(
            <Select aria-label="Choice" value="three" onChange={() => {}}>
                {choices}
            </Select>,
        );
        expect(screen.getByRole("combobox")).toHaveValue("three");
    });

    it("reports a change when an option is picked", () => {
        const onChange = jest.fn();
        render(
            <Select aria-label="Choice" onChange={onChange}>
                {choices}
            </Select>,
        );

        fireEvent.change(screen.getByRole("combobox"), { target: { value: "two" } });
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(screen.getByRole("combobox")).toHaveValue("two");
    });

    it("falls back to the medium size", () => {
        render(
            <Select aria-label="Choice" data-testid="select">
                {choices}
            </Select>,
        );
        const field = screen.getByTestId("select").parentElement;
        expect(field).toHaveAttribute("data-size", "medium");
        expect(field).toHaveClass("min-h-[var(--control-medium-size)]");
    });

    it("respects the size prop", () => {
        const heights = { small: "small", medium: "medium", large: "large" } as const;

        for (const size of Object.keys(heights) as (keyof typeof heights)[]) {
            const { unmount } = render(
                <Select aria-label="Choice" size={size} data-testid="select">
                    {choices}
                </Select>,
            );
            const field = screen.getByTestId("select").parentElement;
            expect(field).toHaveAttribute("data-size", size);
            expect(field).toHaveClass(`min-h-[var(--control-${size}-size)]`);
            unmount();
        }
    });

    it("fills its container when block", () => {
        render(
            <Select aria-label="Choice" block data-testid="select">
                {choices}
            </Select>,
        );
        const field = screen.getByTestId("select").parentElement;
        expect(field).toHaveAttribute("data-block", "true");
        expect(field).toHaveClass("w-full");
    });

    it("marks itself invalid for the error status", () => {
        render(
            <Select aria-label="Choice" validationStatus="error" data-testid="select">
                {choices}
            </Select>,
        );
        const select = screen.getByTestId("select");
        expect(select).toHaveAttribute("aria-invalid", "true");
        expect(select.parentElement).toHaveAttribute("data-validation", "error");
        expect(select.parentElement).toHaveClass("border-border-danger-emphasis");
    });

    it("does not mark itself invalid for the success status", () => {
        render(
            <Select aria-label="Choice" validationStatus="success" data-testid="select">
                {choices}
            </Select>,
        );
        const select = screen.getByTestId("select");
        expect(select).not.toHaveAttribute("aria-invalid");
        expect(select.parentElement).toHaveAttribute("data-validation", "success");
    });

    it("disables the control and dims the field", () => {
        render(
            <Select aria-label="Choice" disabled data-testid="select">
                {choices}
            </Select>,
        );
        const select = screen.getByTestId("select");
        expect(select).toBeDisabled();
        expect(select.parentElement).toHaveAttribute("data-disabled", "true");
        expect(select.parentElement).toHaveClass("[&_select]:cursor-not-allowed");
    });

    it("leaves the state attributes unset by default", () => {
        render(
            <Select aria-label="Choice" data-testid="select">
                {choices}
            </Select>,
        );
        const field = screen.getByTestId("select").parentElement;
        expect(field).not.toHaveAttribute("data-block");
        expect(field).not.toHaveAttribute("data-disabled");
        expect(field).not.toHaveAttribute("data-validation");
    });

    it("does not leak the styling props onto the control", () => {
        render(
            <Select
                aria-label="Choice"
                size="small"
                block
                validationStatus="error"
                placeholder="Pick"
                data-testid="select"
            >
                {choices}
            </Select>,
        );
        const select = screen.getByTestId("select");
        expect(select).not.toHaveAttribute("size");
        expect(select).not.toHaveAttribute("block");
        expect(select).not.toHaveAttribute("validationStatus");
        expect(select).not.toHaveAttribute("placeholder");
    });

    it("forwards element specific props to the control", () => {
        render(
            <Select aria-label="Choice" name="choice" data-testid="select">
                {choices}
            </Select>,
        );
        expect(screen.getByTestId("select")).toHaveAttribute("name", "choice");
    });

    it("forwards a ref to the control", () => {
        const ref = React.createRef<HTMLSelectElement>();
        render(
            <Select ref={ref} aria-label="Choice">
                {choices}
            </Select>,
        );
        expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });

    it("merges a custom className onto the field", () => {
        render(
            <Select aria-label="Choice" className="custom" data-testid="select">
                {choices}
            </Select>,
        );
        expect(screen.getByTestId("select").parentElement).toHaveClass("custom");
    });
});
