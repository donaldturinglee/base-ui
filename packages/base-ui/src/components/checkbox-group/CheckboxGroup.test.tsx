import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Checkbox } from "../checkbox";
import { CheckboxGroup } from ".";

const choices = (
    <>
        <Checkbox value="one" aria-label="One" />
        <Checkbox value="two" aria-label="Two" />
        <Checkbox value="three" aria-label="Three" />
    </>
);

describe("CheckboxGroup", () => {
    it("renders a fieldset", () => {
        render(
            <CheckboxGroup data-testid="group">
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                {choices}
            </CheckboxGroup>,
        );
        expect(screen.getByTestId("group").tagName).toBe("FIELDSET");
    });

    it("names the group from its label", () => {
        render(
            <CheckboxGroup>
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                {choices}
            </CheckboxGroup>,
        );
        expect(screen.getByRole("group", { name: /Choices/ })).toBeInTheDocument();
    });

    it("renders the label in a legend so it names the whole group", () => {
        const { container } = render(
            <CheckboxGroup>
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                {choices}
            </CheckboxGroup>,
        );
        const legend = container.querySelector("legend");
        expect(legend?.querySelector('[data-component="CheckboxGroup.Label"]')).not.toBeNull();
    });

    it("tags the group and its parts with data-component attributes", () => {
        const { container } = render(
            <CheckboxGroup>
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                <CheckboxGroup.Caption>Pick as many as you like</CheckboxGroup.Caption>
                {choices}
                <CheckboxGroup.Validation variant="error">Pick one</CheckboxGroup.Validation>
            </CheckboxGroup>,
        );

        for (const name of [
            "CheckboxGroup",
            "CheckboxGroup.Label",
            "CheckboxGroup.Caption",
            "CheckboxGroup.Validation",
        ]) {
            expect(container.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("renders every checkbox given to it", () => {
        render(
            <CheckboxGroup>
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                {choices}
            </CheckboxGroup>,
        );
        expect(screen.getAllByRole("checkbox")).toHaveLength(3);
    });

    it("keeps the label out of the boxes", () => {
        const { container } = render(
            <CheckboxGroup>
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                {choices}
            </CheckboxGroup>,
        );
        const body = container.querySelector("fieldset > div");
        expect(body?.querySelectorAll("input")).toHaveLength(3);
        expect(body?.querySelector('[data-component="CheckboxGroup.Label"]')).toBeNull();
    });

    it("reports the values that are checked", () => {
        const onChange = jest.fn();
        render(
            <CheckboxGroup onChange={onChange}>
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                {choices}
            </CheckboxGroup>,
        );

        fireEvent.click(screen.getByRole("checkbox", { name: "Two" }));
        expect(onChange.mock.calls[0][0]).toEqual(["two"]);

        fireEvent.click(screen.getByRole("checkbox", { name: "One" }));
        expect(onChange.mock.calls[1][0]).toEqual(["two", "one"]);
    });

    it("drops a value again when its box is unchecked", () => {
        const onChange = jest.fn();
        render(
            <CheckboxGroup onChange={onChange}>
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                {choices}
            </CheckboxGroup>,
        );

        const two = screen.getByRole("checkbox", { name: "Two" });
        fireEvent.click(two);
        fireEvent.click(two);
        expect(onChange.mock.calls[1][0]).toEqual([]);
    });

    it("starts from the boxes that are already checked", () => {
        const onChange = jest.fn();
        render(
            <CheckboxGroup onChange={onChange}>
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                <Checkbox value="one" aria-label="One" defaultChecked />
                <Checkbox value="two" aria-label="Two" />
            </CheckboxGroup>,
        );

        fireEvent.click(screen.getByRole("checkbox", { name: "Two" }));
        expect(onChange.mock.calls[0][0]).toEqual(["one", "two"]);
    });

    it("finds the boxes however deeply they are wrapped", () => {
        const onChange = jest.fn();
        render(
            <CheckboxGroup onChange={onChange}>
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                <label>
                    <Checkbox value="one" defaultChecked /> One
                </label>
                <label>
                    <Checkbox value="two" aria-label="Two" /> Two
                </label>
            </CheckboxGroup>,
        );

        fireEvent.click(screen.getByRole("checkbox", { name: "Two" }));
        expect(onChange.mock.calls[0][0]).toEqual(["one", "two"]);
    });

    it("passes the change event along with the selection", () => {
        const onChange = jest.fn();
        render(
            <CheckboxGroup onChange={onChange}>
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                {choices}
            </CheckboxGroup>,
        );

        fireEvent.click(screen.getByRole("checkbox", { name: "One" }));
        expect(onChange.mock.calls[0][1]).toMatchObject({ type: "change" });
    });

    it("still calls a checkbox's own onChange", () => {
        const onGroupChange = jest.fn();
        const onBoxChange = jest.fn();
        render(
            <CheckboxGroup onChange={onGroupChange}>
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                <Checkbox value="one" aria-label="One" onChange={onBoxChange} />
            </CheckboxGroup>,
        );

        fireEvent.click(screen.getByRole("checkbox", { name: "One" }));
        expect(onGroupChange).toHaveBeenCalledTimes(1);
        expect(onBoxChange).toHaveBeenCalledTimes(1);
    });

    it("disables every box in the group", () => {
        render(
            <CheckboxGroup disabled data-testid="group">
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                {choices}
            </CheckboxGroup>,
        );

        // A disabled fieldset disables its controls natively
        expect(screen.getByTestId("group")).toBeDisabled();
        for (const checkbox of screen.getAllByRole("checkbox")) {
            expect(checkbox).toBeDisabled();
        }
    });

    it("dims the label of a disabled group", () => {
        const { container } = render(
            <CheckboxGroup disabled>
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                {choices}
            </CheckboxGroup>,
        );
        expect(container.querySelector('[data-component="CheckboxGroup.Label"]')).toHaveClass(
            "checkbox-group-label-disabled",
        );
    });

    it("marks a required group in its label", () => {
        const { container } = render(
            <CheckboxGroup required data-testid="group">
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                {choices}
            </CheckboxGroup>,
        );
        expect(screen.getByTestId("group")).toHaveAttribute("data-required", "true");
        expect(container.querySelector('[data-component="CheckboxGroup.Label"]')).toHaveAttribute(
            "title",
            "required field",
        );
        expect(screen.getByRole("group", { name: /required/ })).toBeInTheDocument();
    });

    it("hides the label from view while keeping it as the group's name", () => {
        const { container } = render(
            <CheckboxGroup>
                <CheckboxGroup.Label visuallyHidden>Choices</CheckboxGroup.Label>
                {choices}
            </CheckboxGroup>,
        );
        expect(container.querySelector('[data-component="CheckboxGroup.Label"]')).toHaveClass(
            "sr-only",
        );
        expect(screen.getByRole("group", { name: /Choices/ })).toBeInTheDocument();
    });

    it("describes the group with its caption and validation message", () => {
        render(
            <CheckboxGroup data-testid="group">
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                <CheckboxGroup.Caption>Pick as many as you like</CheckboxGroup.Caption>
                {choices}
                <CheckboxGroup.Validation variant="error">Pick one</CheckboxGroup.Validation>
            </CheckboxGroup>,
        );

        const describedBy = screen.getByTestId("group").getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();
        for (const id of (describedBy ?? "").split(" ")) {
            expect(document.getElementById(id)).not.toBeNull();
        }
    });

    it("colours the validation message by its variant", () => {
        const { container } = render(
            <CheckboxGroup>
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                {choices}
                <CheckboxGroup.Validation variant="success">Looks good</CheckboxGroup.Validation>
            </CheckboxGroup>,
        );
        const validation = container.querySelector('[data-component="CheckboxGroup.Validation"]');
        expect(validation).toHaveAttribute("data-validation-status", "success");
        expect(validation).toHaveClass("checkbox-group-validation-success");
        expect(validation?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    });

    it("names the group from another element when it has no label", () => {
        render(
            <>
                <span id="external">Choices</span>
                <CheckboxGroup aria-labelledby="external" data-testid="group">
                    {choices}
                </CheckboxGroup>
            </>,
        );
        expect(screen.getByRole("group", { name: "Choices" })).toBe(screen.getByTestId("group"));
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLFieldSetElement>();
        render(
            <CheckboxGroup ref={ref}>
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                {choices}
            </CheckboxGroup>,
        );
        expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
    });

    it("merges a custom className onto the root element", () => {
        render(
            <CheckboxGroup className="custom" data-testid="group">
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                {choices}
            </CheckboxGroup>,
        );
        expect(screen.getByTestId("group")).toHaveClass("custom");
    });
});
