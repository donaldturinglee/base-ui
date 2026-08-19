import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Radio } from "../radio";
import { RadioGroup } from ".";

const choices = (
    <>
        <Radio value="one" aria-label="One" />
        <Radio value="two" aria-label="Two" />
        <Radio value="three" aria-label="Three" />
    </>
);

describe("RadioGroup", () => {
    it("renders a fieldset", () => {
        render(
            <RadioGroup name="choices" data-testid="group">
                <RadioGroup.Label>Choices</RadioGroup.Label>
                {choices}
            </RadioGroup>,
        );
        expect(screen.getByTestId("group").tagName).toBe("FIELDSET");
    });

    it("names the group from its label", () => {
        render(
            <RadioGroup name="choices">
                <RadioGroup.Label>Choices</RadioGroup.Label>
                {choices}
            </RadioGroup>,
        );
        expect(screen.getByRole("group", { name: /Choices/ })).toBeInTheDocument();
    });

    it("renders the label in a legend so it names the whole group", () => {
        const { container } = render(
            <RadioGroup name="choices">
                <RadioGroup.Label>Choices</RadioGroup.Label>
                {choices}
            </RadioGroup>,
        );
        const legend = container.querySelector("legend");
        expect(legend?.querySelector('[data-component="RadioGroup.Label"]')).not.toBeNull();
    });

    it("tags the group and its parts with data-component attributes", () => {
        const { container } = render(
            <RadioGroup name="choices">
                <RadioGroup.Label>Choices</RadioGroup.Label>
                <RadioGroup.Caption>Pick one</RadioGroup.Caption>
                {choices}
                <RadioGroup.Validation variant="error">Pick one</RadioGroup.Validation>
            </RadioGroup>,
        );

        for (const name of [
            "RadioGroup",
            "RadioGroup.Label",
            "RadioGroup.Caption",
            "RadioGroup.Validation",
        ]) {
            expect(container.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("renders every radio given to it", () => {
        render(
            <RadioGroup name="choices">
                <RadioGroup.Label>Choices</RadioGroup.Label>
                {choices}
            </RadioGroup>,
        );
        expect(screen.getAllByRole("radio")).toHaveLength(3);
    });

    it("keeps the label out of the radios", () => {
        const { container } = render(
            <RadioGroup name="choices">
                <RadioGroup.Label>Choices</RadioGroup.Label>
                {choices}
            </RadioGroup>,
        );
        const body = container.querySelector("fieldset > div");
        expect(body?.querySelectorAll("input")).toHaveLength(3);
        expect(body?.querySelector('[data-component="RadioGroup.Label"]')).toBeNull();
    });

    it("names every radio in the group", () => {
        render(
            <RadioGroup name="choices">
                <RadioGroup.Label>Choices</RadioGroup.Label>
                {choices}
            </RadioGroup>,
        );

        for (const radio of screen.getAllByRole("radio")) {
            expect(radio).toHaveAttribute("name", "choices");
        }
    });

    it("lets a radio keep a name of its own", () => {
        render(
            <RadioGroup name="choices">
                <RadioGroup.Label>Choices</RadioGroup.Label>
                <Radio value="one" aria-label="One" name="other" />
            </RadioGroup>,
        );
        expect(screen.getByRole("radio", { name: "One" })).toHaveAttribute("name", "other");
    });

    it("reports the value that is now checked", () => {
        const onChange = vi.fn();
        render(
            <RadioGroup name="choices" onChange={onChange}>
                <RadioGroup.Label>Choices</RadioGroup.Label>
                {choices}
            </RadioGroup>,
        );

        fireEvent.click(screen.getByRole("radio", { name: "Two" }));
        expect(onChange.mock.calls[0][0]).toBe("two");

        fireEvent.click(screen.getByRole("radio", { name: "One" }));
        expect(onChange.mock.calls[1][0]).toBe("one");
    });

    it("reports nothing for the radio the browser clears", () => {
        const onChange = vi.fn();
        render(
            <RadioGroup name="choices" onChange={onChange}>
                <RadioGroup.Label>Choices</RadioGroup.Label>
                {choices}
            </RadioGroup>,
        );

        fireEvent.click(screen.getByRole("radio", { name: "One" }));
        fireEvent.click(screen.getByRole("radio", { name: "Two" }));

        // Only ever the newly checked radio, never the one it replaced
        expect(onChange).toHaveBeenCalledTimes(2);
        expect(onChange.mock.calls.map((call) => call[0])).toEqual(["one", "two"]);
    });

    it("passes the change event along with the selection", () => {
        const onChange = vi.fn();
        render(
            <RadioGroup name="choices" onChange={onChange}>
                <RadioGroup.Label>Choices</RadioGroup.Label>
                {choices}
            </RadioGroup>,
        );

        fireEvent.click(screen.getByRole("radio", { name: "One" }));
        expect(onChange.mock.calls[0][1]).toMatchObject({ type: "change" });
    });

    it("still calls a radio's own onChange", () => {
        const onGroupChange = vi.fn();
        const onRadioChange = vi.fn();
        render(
            <RadioGroup name="choices" onChange={onGroupChange}>
                <RadioGroup.Label>Choices</RadioGroup.Label>
                <Radio value="one" aria-label="One" onChange={onRadioChange} />
            </RadioGroup>,
        );

        fireEvent.click(screen.getByRole("radio", { name: "One" }));
        expect(onGroupChange).toHaveBeenCalledTimes(1);
        expect(onRadioChange).toHaveBeenCalledTimes(1);
    });

    it("disables every radio in the group", () => {
        render(
            <RadioGroup name="choices" disabled data-testid="group">
                <RadioGroup.Label>Choices</RadioGroup.Label>
                {choices}
            </RadioGroup>,
        );

        // A disabled fieldset disables its controls natively
        expect(screen.getByTestId("group")).toBeDisabled();
        for (const radio of screen.getAllByRole("radio")) {
            expect(radio).toBeDisabled();
        }
    });

    it("dims the label of a disabled group", () => {
        const { container } = render(
            <RadioGroup name="choices" disabled>
                <RadioGroup.Label>Choices</RadioGroup.Label>
                {choices}
            </RadioGroup>,
        );
        expect(container.querySelector('[data-component="RadioGroup.Label"]')).toHaveClass(
            "radio-group-label-disabled",
        );
    });

    it("marks a required group in its label", () => {
        const { container } = render(
            <RadioGroup name="choices" required data-testid="group">
                <RadioGroup.Label>Choices</RadioGroup.Label>
                {choices}
            </RadioGroup>,
        );
        expect(screen.getByTestId("group")).toHaveAttribute("data-required", "true");
        expect(container.querySelector('[data-component="RadioGroup.Label"]')).toHaveAttribute(
            "title",
            "required field",
        );
        expect(screen.getByRole("group", { name: /required/ })).toBeInTheDocument();
    });

    it("hides the label from view while keeping it as the group's name", () => {
        const { container } = render(
            <RadioGroup name="choices">
                <RadioGroup.Label visuallyHidden>Choices</RadioGroup.Label>
                {choices}
            </RadioGroup>,
        );
        expect(container.querySelector('[data-component="RadioGroup.Label"]')).toHaveClass(
            "sr-only",
        );
        expect(screen.getByRole("group", { name: /Choices/ })).toBeInTheDocument();
    });

    it("describes the group with its caption and validation message", () => {
        render(
            <RadioGroup name="choices" data-testid="group">
                <RadioGroup.Label>Choices</RadioGroup.Label>
                <RadioGroup.Caption>Pick one</RadioGroup.Caption>
                {choices}
                <RadioGroup.Validation variant="error">Pick one</RadioGroup.Validation>
            </RadioGroup>,
        );

        const describedBy = screen.getByTestId("group").getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();
        for (const id of (describedBy ?? "").split(" ")) {
            expect(document.getElementById(id)).not.toBeNull();
        }
    });

    it("colours the validation message by its variant", () => {
        const { container } = render(
            <RadioGroup name="choices">
                <RadioGroup.Label>Choices</RadioGroup.Label>
                {choices}
                <RadioGroup.Validation variant="success">Looks good</RadioGroup.Validation>
            </RadioGroup>,
        );
        const validation = container.querySelector('[data-component="RadioGroup.Validation"]');
        expect(validation).toHaveAttribute("data-validation-status", "success");
        expect(validation).toHaveClass("radio-group-validation-success");
        expect(validation?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    });

    it("names the group from another element when it has no label", () => {
        render(
            <>
                <span id="external">Choices</span>
                <RadioGroup name="choices" aria-labelledby="external" data-testid="group">
                    {choices}
                </RadioGroup>
            </>,
        );
        expect(screen.getByRole("group", { name: "Choices" })).toBe(screen.getByTestId("group"));
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLFieldSetElement>();
        render(
            <RadioGroup name="choices" ref={ref}>
                <RadioGroup.Label>Choices</RadioGroup.Label>
                {choices}
            </RadioGroup>,
        );
        expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
    });

    it("merges a custom className onto the root element", () => {
        render(
            <RadioGroup name="choices" className="custom" data-testid="group">
                <RadioGroup.Label>Choices</RadioGroup.Label>
                {choices}
            </RadioGroup>,
        );
        expect(screen.getByTestId("group")).toHaveClass("custom");
    });
});
