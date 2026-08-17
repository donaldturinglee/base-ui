import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Select } from ".";

const originalResizeObserver = window.ResizeObserver;

const choices = (
    <>
        <Select.Option value="one">Choice one</Select.Option>
        <Select.Option value="two">Choice two</Select.Option>
        <Select.Option value="three">Choice three</Select.Option>
    </>
);

const fruit = (
    <>
        <Select.Option value="apple">Apple</Select.Option>
        <Select.Option value="banana">Banana</Select.Option>
        <Select.Option value="cherry">Cherry</Select.Option>
    </>
);

const control = () => screen.getByRole("combobox", { name: "Choice" });

const open = () => {
    fireEvent.click(control());
};

describe("Select", () => {
    // jsdom has no ResizeObserver, and the list watches its own size so it can be placed
    // again as it grows
    beforeEach(() => {
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
        window.ResizeObserver = originalResizeObserver;
    });

    it("renders a button read as a combo box", () => {
        render(<Select aria-label="Choice">{choices}</Select>);
        expect(control().tagName).toBe("BUTTON");
        expect(control()).toHaveAttribute("type", "button");
        expect(control()).toHaveAttribute("aria-haspopup", "listbox");
    });

    it("keeps the list down until it is opened", () => {
        render(<Select aria-label="Choice">{choices}</Select>);

        expect(screen.queryByRole("listbox")).toBeNull();
        expect(control()).toHaveAttribute("aria-expanded", "false");
        expect(control()).not.toHaveAttribute("aria-controls");
    });

    it("opens the list from the field and renders its options", () => {
        render(<Select aria-label="Choice">{choices}</Select>);
        open();

        expect(screen.getByRole("listbox")).toBeInTheDocument();
        expect(screen.getAllByRole("option")).toHaveLength(3);
        expect(control()).toHaveAttribute("aria-expanded", "true");
    });

    it("closes the list from the field again", () => {
        render(<Select aria-label="Choice">{choices}</Select>);
        open();
        fireEvent.click(control());

        expect(screen.queryByRole("listbox")).toBeNull();
    });

    it("shows the placeholder until a choice is made", () => {
        render(
            <Select aria-label="Choice" placeholder="Pick a choice">
                {choices}
            </Select>,
        );

        expect(control()).toHaveTextContent("Pick a choice");
        expect(control()).toHaveAttribute("data-has-placeholder", "true");
    });

    it("shows the label of whatever is picked", () => {
        render(
            <Select aria-label="Choice" defaultValue="two" placeholder="Pick a choice">
                {choices}
            </Select>,
        );

        expect(control()).toHaveTextContent("Choice two");
        expect(control()).not.toHaveTextContent("Pick a choice");
    });

    it("reports a choice made with the pointer, and closes the list", () => {
        const onChange = vi.fn();
        render(
            <Select aria-label="Choice" onChange={onChange}>
                {choices}
            </Select>,
        );
        open();

        fireEvent.click(screen.getByRole("option", { name: "Choice two" }));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith("two");
        expect(screen.queryByRole("listbox")).toBeNull();
        expect(control()).toHaveTextContent("Choice two");
    });

    it("leaves a controlled select to its own value", () => {
        const onChange = vi.fn();
        render(
            <Select aria-label="Choice" value="three" onChange={onChange}>
                {choices}
            </Select>,
        );
        open();

        fireEvent.click(screen.getByRole("option", { name: "Choice one" }));

        expect(onChange).toHaveBeenCalledWith("one");
        expect(control()).toHaveTextContent("Choice three");
    });

    it("marks the option that is picked", () => {
        render(
            <Select aria-label="Choice" defaultValue="two">
                {choices}
            </Select>,
        );
        open();

        expect(screen.getByRole("option", { name: "Choice two" })).toHaveAttribute(
            "aria-selected",
            "true",
        );
        expect(screen.getByRole("option", { name: "Choice one" })).toHaveAttribute(
            "aria-selected",
            "false",
        );
    });

    it("renders grouped options under the name of their group", () => {
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
        open();

        expect(screen.getAllByRole("group")).toHaveLength(2);
        expect(screen.getByRole("group", { name: "Group one" })).toBeInTheDocument();
    });

    it("marks every option of a group that cannot be used", () => {
        render(
            <Select aria-label="Choice">
                <Select.OptGroup label="Group one" disabled>
                    <Select.Option value="one">Choice one</Select.Option>
                    <Select.Option value="two">Choice two</Select.Option>
                </Select.OptGroup>
            </Select>,
        );
        open();

        for (const option of screen.getAllByRole("option")) {
            expect(option).toHaveAttribute("aria-disabled", "true");
        }
    });

    it("opens on the arrow keys and rests on what is picked", () => {
        render(
            <Select id="choice" aria-label="Choice" defaultValue="two">
                {choices}
            </Select>,
        );

        fireEvent.keyDown(control(), { key: "ArrowDown" });

        expect(screen.getByRole("listbox")).toBeInTheDocument();
        expect(control()).toHaveAttribute("aria-activedescendant", "choice-list-option-1");
    });

    it("rests on the last option when it is opened upwards", () => {
        render(
            <Select id="choice" aria-label="Choice">
                {choices}
            </Select>,
        );

        fireEvent.keyDown(control(), { key: "ArrowUp" });

        expect(control()).toHaveAttribute("aria-activedescendant", "choice-list-option-2");
    });

    it("moves between the options with the keyboard", () => {
        render(
            <Select id="choice" aria-label="Choice">
                {choices}
            </Select>,
        );

        fireEvent.keyDown(control(), { key: "ArrowDown" });
        expect(control()).toHaveAttribute("aria-activedescendant", "choice-list-option-0");

        fireEvent.keyDown(control(), { key: "ArrowDown" });
        expect(control()).toHaveAttribute("aria-activedescendant", "choice-list-option-1");

        fireEvent.keyDown(control(), { key: "End" });
        expect(control()).toHaveAttribute("aria-activedescendant", "choice-list-option-2");

        // The ends are held rather than come round, which is how a select is stepped through
        fireEvent.keyDown(control(), { key: "ArrowDown" });
        expect(control()).toHaveAttribute("aria-activedescendant", "choice-list-option-2");

        fireEvent.keyDown(control(), { key: "Home" });
        expect(control()).toHaveAttribute("aria-activedescendant", "choice-list-option-0");
    });

    it("passes over an option that cannot be picked", () => {
        render(
            <Select id="choice" aria-label="Choice">
                <Select.Option value="one">Choice one</Select.Option>
                <Select.Option value="two" disabled>
                    Choice two
                </Select.Option>
                <Select.Option value="three">Choice three</Select.Option>
            </Select>,
        );

        fireEvent.keyDown(control(), { key: "ArrowDown" });
        fireEvent.keyDown(control(), { key: "ArrowDown" });

        expect(control()).toHaveAttribute("aria-activedescendant", "choice-list-option-2");
    });

    it("takes the option it is resting on with Enter", () => {
        const onChange = vi.fn();
        render(
            <Select aria-label="Choice" onChange={onChange}>
                {choices}
            </Select>,
        );

        fireEvent.keyDown(control(), { key: "ArrowDown" });
        fireEvent.keyDown(control(), { key: "ArrowDown" });
        fireEvent.keyDown(control(), { key: "Enter" });

        expect(onChange).toHaveBeenCalledWith("two");
        expect(screen.queryByRole("listbox")).toBeNull();
        expect(control()).toHaveTextContent("Choice two");
    });

    it("leaves the choice alone when the list is dismissed with Escape", () => {
        const onChange = vi.fn();
        render(
            <Select aria-label="Choice" onChange={onChange}>
                {choices}
            </Select>,
        );

        fireEvent.keyDown(control(), { key: "ArrowDown" });
        fireEvent.keyDown(document, { key: "Escape" });

        expect(screen.queryByRole("listbox")).toBeNull();
        expect(onChange).not.toHaveBeenCalled();
    });

    it("closes the list when focus is tabbed away", () => {
        render(<Select aria-label="Choice">{choices}</Select>);

        fireEvent.keyDown(control(), { key: "ArrowDown" });
        fireEvent.keyDown(control(), { key: "Tab" });

        expect(screen.queryByRole("listbox")).toBeNull();
    });

    it("closes the list on a press that lands anywhere else", () => {
        render(<Select aria-label="Choice">{choices}</Select>);
        open();

        fireEvent.mouseDown(document.body);

        expect(screen.queryByRole("listbox")).toBeNull();
    });

    it("moves onto the option typed for while the list is showing", () => {
        render(
            <Select id="choice" aria-label="Choice">
                {fruit}
            </Select>,
        );

        fireEvent.keyDown(control(), { key: "ArrowDown" });
        fireEvent.keyDown(control(), { key: "c" });

        expect(control()).toHaveAttribute("aria-activedescendant", "choice-list-option-2");
    });

    it("picks the option typed for while the list is closed", () => {
        const onChange = vi.fn();
        render(
            <Select aria-label="Choice" onChange={onChange}>
                {fruit}
            </Select>,
        );

        fireEvent.keyDown(control(), { key: "b" });

        expect(onChange).toHaveBeenCalledWith("banana");
        expect(screen.queryByRole("listbox")).toBeNull();
        expect(control()).toHaveTextContent("Banana");
    });

    it("reports whether the list is showing", () => {
        const onOpenChange = vi.fn();
        render(
            <Select aria-label="Choice" onOpenChange={onOpenChange}>
                {choices}
            </Select>,
        );

        open();
        expect(onOpenChange).toHaveBeenLastCalledWith(true);

        fireEvent.click(control());
        expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });

    it("leaves a select the caller is opening to its own state", () => {
        const onOpenChange = vi.fn();
        render(
            <Select aria-label="Choice" open onOpenChange={onOpenChange}>
                {choices}
            </Select>,
        );

        fireEvent.click(control());

        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("tags the field and its parts with data-component attributes", () => {
        render(
            <Select aria-label="Choice" data-testid="select">
                <Select.OptGroup label="Group one">
                    <Select.Option value="one">Choice one</Select.Option>
                </Select.OptGroup>
            </Select>,
        );
        open();

        for (const name of ["Select", "Select.List", "Select.OptGroup", "Select.Option"]) {
            expect(document.querySelector(`[data-component="${name}"]`)).toBeInstanceOf(
                HTMLElement,
            );
        }
    });

    it("renders an indicator that stays out of the accessibility tree", () => {
        const { container } = render(<Select aria-label="Choice">{choices}</Select>);
        const indicator = container.querySelector("svg");

        expect(indicator).toBeInstanceOf(SVGElement);
        expect(indicator).toHaveAttribute("aria-hidden", "true");
        expect(indicator).toHaveClass("select-indicator");
    });

    it("submits what is picked through a field of its own", () => {
        const { container } = render(
            <Select aria-label="Choice" name="choice" defaultValue="two">
                {choices}
            </Select>,
        );

        expect(container.querySelector('input[type="hidden"]')).toHaveAttribute("name", "choice");
        expect(container.querySelector('input[type="hidden"]')).toHaveValue("two");
    });

    it("carries no field of its own where it is not named", () => {
        const { container } = render(<Select aria-label="Choice">{choices}</Select>);
        expect(container.querySelector('input[type="hidden"]')).toBeNull();
    });

    it("says a choice has to be made", () => {
        render(
            <Select aria-label="Choice" required>
                {choices}
            </Select>,
        );
        expect(control()).toHaveAttribute("aria-required", "true");
    });

    it("falls back to the medium size", () => {
        render(
            <Select aria-label="Choice" data-testid="select">
                {choices}
            </Select>,
        );
        const field = screen.getByTestId("select").parentElement;

        expect(field).toHaveAttribute("data-size", "medium");
        expect(field).toHaveClass("select-medium");
    });

    it("respects the size prop", () => {
        for (const size of ["small", "medium", "large"] as const) {
            const { unmount } = render(
                <Select aria-label="Choice" size={size} data-testid="select">
                    {choices}
                </Select>,
            );
            const field = screen.getByTestId("select").parentElement;

            expect(field).toHaveAttribute("data-size", size);
            expect(field).toHaveClass(`select-${size}`);
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
        expect(field).toHaveClass("select-block");
    });

    it("marks itself invalid for the error status", () => {
        render(
            <Select aria-label="Choice" validationStatus="error" data-testid="select">
                {choices}
            </Select>,
        );
        const button = screen.getByTestId("select");

        expect(button).toHaveAttribute("aria-invalid", "true");
        expect(button.parentElement).toHaveAttribute("data-validation", "error");
        expect(button.parentElement).toHaveClass("select-error");
    });

    it("does not mark itself invalid for the success status", () => {
        render(
            <Select aria-label="Choice" validationStatus="success" data-testid="select">
                {choices}
            </Select>,
        );
        const button = screen.getByTestId("select");

        expect(button).not.toHaveAttribute("aria-invalid");
        expect(button.parentElement).toHaveAttribute("data-validation", "success");
    });

    it("disables the control and dims the field", () => {
        render(
            <Select aria-label="Choice" disabled data-testid="select">
                {choices}
            </Select>,
        );
        const button = screen.getByTestId("select");

        expect(button).toBeDisabled();
        expect(button.parentElement).toHaveAttribute("data-disabled", "true");
        expect(button.parentElement).toHaveClass("select-disabled");
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
        expect(field).not.toHaveAttribute("data-open");
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
        const button = screen.getByTestId("select");

        expect(button).not.toHaveAttribute("size");
        expect(button).not.toHaveAttribute("block");
        expect(button).not.toHaveAttribute("validationStatus");
        expect(button).not.toHaveAttribute("placeholder");
    });

    it("forwards element specific props to the control", () => {
        render(
            <Select aria-label="Choice" title="Choice" data-testid="select">
                {choices}
            </Select>,
        );
        expect(screen.getByTestId("select")).toHaveAttribute("title", "Choice");
    });

    it("forwards a ref to the control", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <Select ref={ref} aria-label="Choice">
                {choices}
            </Select>,
        );
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("merges a custom className onto the field", () => {
        render(
            <Select aria-label="Choice" className="custom" data-testid="select">
                {choices}
            </Select>,
        );
        // The field's own class has to survive the merge, since everything it is drawn with
        // hangs off it
        expect(screen.getByTestId("select").parentElement).toHaveClass("select", "custom");
    });
});
