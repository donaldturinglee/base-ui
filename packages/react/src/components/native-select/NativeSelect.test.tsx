import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { NativeSelect } from ".";

const choices = (
    <>
        <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
        <NativeSelect.Option value="two">Choice two</NativeSelect.Option>
        <NativeSelect.Option value="three">Choice three</NativeSelect.Option>
    </>
);

describe("NativeSelect", () => {
    it("renders a native select", () => {
        render(<NativeSelect aria-label="Choice">{choices}</NativeSelect>);
        expect(screen.getByRole("combobox", { name: "Choice" }).tagName).toBe("SELECT");
    });

    it("renders its options", () => {
        render(<NativeSelect aria-label="Choice">{choices}</NativeSelect>);
        expect(screen.getAllByRole("option")).toHaveLength(3);
    });

    it("renders grouped options", () => {
        render(
            <NativeSelect aria-label="Choice">
                <NativeSelect.OptGroup label="Group one">
                    <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
                </NativeSelect.OptGroup>
                <NativeSelect.OptGroup label="Group two">
                    <NativeSelect.Option value="two">Choice two</NativeSelect.Option>
                </NativeSelect.OptGroup>
            </NativeSelect>,
        );
        expect(screen.getByRole("combobox").querySelectorAll("optgroup")).toHaveLength(2);
    });

    it("tags the field and its parts with data-component attributes", () => {
        const { container } = render(
            <NativeSelect aria-label="Choice" data-testid="native-select">
                <NativeSelect.OptGroup label="Group one">
                    <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
                </NativeSelect.OptGroup>
            </NativeSelect>,
        );

        for (const name of ["NativeSelect", "NativeSelect.OptGroup", "NativeSelect.Option"]) {
            expect(container.querySelector(`[data-component="${name}"]`)).toBeInstanceOf(
                HTMLElement,
            );
        }
    });

    it("renders an indicator that stays out of the accessibility tree", () => {
        const { container } = render(<NativeSelect aria-label="Choice">{choices}</NativeSelect>);
        const indicator = container.querySelector("svg");
        expect(indicator).toBeInstanceOf(SVGElement);
        expect(indicator).toHaveAttribute("aria-hidden", "true");
    });

    it("keeps a long choice clear of the indicator", () => {
        const { container } = render(
            <NativeSelect aria-label="Choice" data-testid="native-select">
                {choices}
            </NativeSelect>,
        );

        // The field owns the indicator's geometry, and the control reserves that much room
        // on its trailing edge so the two can never overlap
        const field = screen.getByTestId("native-select").parentElement;
        expect(field).toHaveClass("native-select");
        expect(container.querySelector("svg")).toHaveClass("native-select-indicator");
        expect(screen.getByTestId("native-select")).toHaveClass("native-select-control");
    });

    it("renders a placeholder option and selects it", () => {
        render(
            <NativeSelect aria-label="Choice" placeholder="Pick a choice">
                {choices}
            </NativeSelect>,
        );
        const placeholder = screen.getByRole("option", { name: "Pick a choice" });
        expect(placeholder).toHaveAttribute("data-component", "NativeSelect.Option");
        expect(placeholder).not.toHaveAttribute("disabled");
        expect(placeholder).not.toHaveAttribute("hidden");
        expect(screen.getByRole("combobox")).toHaveValue("");
    });

    it("takes a required placeholder out of the choices", () => {
        const { container } = render(
            <NativeSelect aria-label="Choice" placeholder="Pick a choice" required>
                {choices}
            </NativeSelect>,
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
        const { unmount } = render(<NativeSelect aria-label="Choice">{choices}</NativeSelect>);
        expect(screen.getByRole("combobox")).not.toHaveAttribute("data-has-placeholder");
        unmount();

        render(
            <NativeSelect aria-label="Choice" placeholder="Pick a choice">
                {choices}
            </NativeSelect>,
        );
        expect(screen.getByRole("combobox")).toHaveAttribute("data-has-placeholder", "true");
    });

    it("lets a default value win over the placeholder", () => {
        render(
            <NativeSelect aria-label="Choice" placeholder="Pick a choice" defaultValue="two">
                {choices}
            </NativeSelect>,
        );
        expect(screen.getByRole("combobox")).toHaveValue("two");
    });

    it("leaves a controlled select to its own value", () => {
        render(
            <NativeSelect aria-label="Choice" value="three" onChange={() => {}}>
                {choices}
            </NativeSelect>,
        );
        expect(screen.getByRole("combobox")).toHaveValue("three");
    });

    it("reports a change when an option is picked", () => {
        const onChange = vi.fn();
        render(
            <NativeSelect aria-label="Choice" onChange={onChange}>
                {choices}
            </NativeSelect>,
        );

        fireEvent.change(screen.getByRole("combobox"), { target: { value: "two" } });
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(screen.getByRole("combobox")).toHaveValue("two");
    });

    it("falls back to the medium size", () => {
        render(
            <NativeSelect aria-label="Choice" data-testid="native-select">
                {choices}
            </NativeSelect>,
        );
        const field = screen.getByTestId("native-select").parentElement;
        expect(field).toHaveAttribute("data-size", "medium");
        expect(field).toHaveClass("native-select-medium");
    });

    it("respects the size prop", () => {
        const heights = { small: "small", medium: "medium", large: "large" } as const;

        for (const size of Object.keys(heights) as (keyof typeof heights)[]) {
            const { unmount } = render(
                <NativeSelect aria-label="Choice" size={size} data-testid="native-select">
                    {choices}
                </NativeSelect>,
            );
            const field = screen.getByTestId("native-select").parentElement;
            expect(field).toHaveAttribute("data-size", size);
            expect(field).toHaveClass(`native-select-${size}`);
            unmount();
        }
    });

    it("fills its container when block", () => {
        render(
            <NativeSelect aria-label="Choice" block data-testid="native-select">
                {choices}
            </NativeSelect>,
        );
        const field = screen.getByTestId("native-select").parentElement;
        expect(field).toHaveAttribute("data-block", "true");
        expect(field).toHaveClass("native-select-block");
    });

    it("marks itself invalid for the error status", () => {
        render(
            <NativeSelect aria-label="Choice" validationStatus="error" data-testid="native-select">
                {choices}
            </NativeSelect>,
        );
        const select = screen.getByTestId("native-select");
        expect(select).toHaveAttribute("aria-invalid", "true");
        expect(select.parentElement).toHaveAttribute("data-validation", "error");
        expect(select.parentElement).toHaveClass("native-select-error");
    });

    it("does not mark itself invalid for the success status", () => {
        render(
            <NativeSelect
                aria-label="Choice"
                validationStatus="success"
                data-testid="native-select"
            >
                {choices}
            </NativeSelect>,
        );
        const select = screen.getByTestId("native-select");
        expect(select).not.toHaveAttribute("aria-invalid");
        expect(select.parentElement).toHaveAttribute("data-validation", "success");
    });

    it("disables the control and dims the field", () => {
        render(
            <NativeSelect aria-label="Choice" disabled data-testid="native-select">
                {choices}
            </NativeSelect>,
        );
        const select = screen.getByTestId("native-select");
        expect(select).toBeDisabled();
        expect(select.parentElement).toHaveAttribute("data-disabled", "true");
        expect(select.parentElement).toHaveClass("native-select-disabled");
    });

    it("leaves the state attributes unset by default", () => {
        render(
            <NativeSelect aria-label="Choice" data-testid="native-select">
                {choices}
            </NativeSelect>,
        );
        const field = screen.getByTestId("native-select").parentElement;
        expect(field).not.toHaveAttribute("data-block");
        expect(field).not.toHaveAttribute("data-disabled");
        expect(field).not.toHaveAttribute("data-validation");
    });

    it("does not leak the styling props onto the control", () => {
        render(
            <NativeSelect
                aria-label="Choice"
                size="small"
                block
                validationStatus="error"
                placeholder="Pick"
                data-testid="native-select"
            >
                {choices}
            </NativeSelect>,
        );
        const select = screen.getByTestId("native-select");
        expect(select).not.toHaveAttribute("size");
        expect(select).not.toHaveAttribute("block");
        expect(select).not.toHaveAttribute("validationStatus");
        expect(select).not.toHaveAttribute("placeholder");
    });

    it("forwards element specific props to the control", () => {
        render(
            <NativeSelect aria-label="Choice" name="choice" data-testid="native-select">
                {choices}
            </NativeSelect>,
        );
        expect(screen.getByTestId("native-select")).toHaveAttribute("name", "choice");
    });

    it("forwards a ref to the control", () => {
        const ref = React.createRef<HTMLSelectElement>();
        render(
            <NativeSelect ref={ref} aria-label="Choice">
                {choices}
            </NativeSelect>,
        );
        expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });

    it("merges a custom className onto the field", () => {
        render(
            <NativeSelect aria-label="Choice" className="custom" data-testid="native-select">
                {choices}
            </NativeSelect>,
        );
        expect(screen.getByTestId("native-select").parentElement).toHaveClass("custom");
    });
});
