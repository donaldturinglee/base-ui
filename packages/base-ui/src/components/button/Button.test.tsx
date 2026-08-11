import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import Button from "./Button";

const Icon = () => <svg data-testid="icon" />;

describe("Button", () => {
    it("renders a button element by default", () => {
        render(<Button>Save</Button>);
        const button = screen.getByRole("button", { name: "Save" });
        expect(button.tagName).toBe("BUTTON");
        expect(button).toHaveAttribute("type", "button");
    });

    it("renders as the element passed to the as prop", () => {
        render(<Button as="summary">Save</Button>);
        expect(screen.getByText("Save").closest("summary")).not.toBeNull();
    });

    it("respects a type passed by the caller", () => {
        render(<Button type="submit">Save</Button>);
        expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("renders the label inside a text slot", () => {
        render(<Button>Save</Button>);
        const label = screen.getByText("Save");
        expect(label).toHaveAttribute("data-component", "text");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Button>Save</Button>);
        expect(screen.getByRole("button")).toHaveAttribute("data-component", "Button");
    });

    it("falls back to the default variant and the medium size", () => {
        render(<Button>Save</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-variant", "default");
        expect(button).toHaveAttribute("data-size", "medium");
        expect(button).toHaveClass("button-default");
    });

    it("respects the variant", () => {
        render(<Button variant="primary">Save</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-variant", "primary");
        expect(button).toHaveClass("button-primary");
    });

    it("respects the size", () => {
        render(<Button size="small">Save</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-size", "small");
        expect(button).toHaveClass("button-small");
    });

    it("drops the shape of a button for the link variant", () => {
        render(<Button variant="link">Save</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveClass("button-link");
        expect(button).toHaveClass("button-link-shape");
    });

    it("fills its container when block is set", () => {
        render(<Button block>Save</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-block", "block");
        expect(button).toHaveClass("button-block");
    });

    it("respects the content alignment", () => {
        render(<Button alignContent="start">Save</Button>);
        const content = screen.getByText("Save").parentElement;
        expect(content).toHaveAttribute("data-align", "start");
        expect(content).toHaveClass("justify-start");
    });

    it("lets a long label wrap", () => {
        render(<Button labelWrap>Save</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-label-wrap", "true");
        expect(button).toHaveClass("button-label-wrap");
        expect(screen.getByText("Save")).toHaveClass("button-label-wrap-label");
    });

    it("renders a leading visual given as a component", () => {
        render(<Button leadingVisual={Icon}>Save</Button>);
        expect(screen.getByTestId("icon")).toBeInTheDocument();
        expect(screen.getByTestId("icon").parentElement).toHaveAttribute(
            "data-component",
            "leadingVisual",
        );
    });

    it("renders a trailing visual given as an element", () => {
        render(<Button trailingVisual={<svg data-testid="chevron" />}>Save</Button>);
        expect(screen.getByTestId("chevron").parentElement).toHaveAttribute(
            "data-component",
            "trailingVisual",
        );
    });

    it("renders a trailing action outside the button content", () => {
        render(<Button trailingAction={Icon}>Save</Button>);
        const action = screen.getByTestId("icon").parentElement;
        expect(action).toHaveAttribute("data-component", "trailingAction");
        expect(action?.parentElement).toHaveAttribute("data-component", "Button");
    });

    it("marks a button that has no visuals", () => {
        render(<Button>Save</Button>);
        expect(screen.getByRole("button")).toHaveAttribute("data-no-visuals", "");
    });

    it("does not mark a button that has a visual", () => {
        render(<Button leadingVisual={Icon}>Save</Button>);
        expect(screen.getByRole("button")).not.toHaveAttribute("data-no-visuals");
    });

    it("renders a count as a trailing counter", () => {
        render(<Button count={8}>Watch</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-has-count", "true");
        const counter = button.querySelector("[data-component='ButtonCounter']");
        expect(counter).toHaveTextContent("8");
        expect(counter?.parentElement).toHaveAttribute("data-component", "trailingVisual");
    });

    it("gives way to a trailing visual when both a count and a visual are passed", () => {
        render(
            <Button count={8} trailingVisual={Icon}>
                Watch
            </Button>,
        );
        const button = screen.getByRole("button");
        expect(button.querySelector("[data-component='ButtonCounter']")).toBeNull();
        expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("condenses the padding for an icon with a count and no label", () => {
        render(<Button count={8} leadingVisual={Icon} aria-label="Watch" />);
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-icon-only-counter", "true");
        expect(button).toHaveClass("button-icon-only-counter-medium");
    });

    it("marks a loading button as unavailable without disabling it", () => {
        render(<Button loading>Save</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-loading", "true");
        expect(button).toHaveAttribute("aria-disabled", "true");
        expect(button).not.toBeDisabled();
    });

    it("does not fire a click while loading", () => {
        const onClick = vi.fn();
        render(
            <Button loading onClick={onClick}>
                Save
            </Button>,
        );
        fireEvent.click(screen.getByRole("button"));
        expect(onClick).not.toHaveBeenCalled();
    });

    it("fires a click when it is not loading", () => {
        const onClick = vi.fn();
        render(
            <Button loading={false} onClick={onClick}>
                Save
            </Button>,
        );
        fireEvent.click(screen.getByRole("button"));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("announces the wait and points the button at the announcement", () => {
        render(<Button loading>Save</Button>);
        const button = screen.getByRole("button");
        const announcement = screen.getByRole("status");
        expect(announcement).toHaveTextContent("Loading");
        expect(announcement).toHaveClass("sr-only");
        expect(button.getAttribute("aria-describedby")).toBe(announcement.getAttribute("id"));
    });

    it("respects a custom loading announcement", () => {
        render(
            <Button loading loadingAnnouncement="Saving your changes">
                Save
            </Button>,
        );
        expect(screen.getByRole("status")).toHaveTextContent("Saving your changes");
    });

    it("keeps the announcement in place while the button can load", () => {
        render(<Button loading={false}>Save</Button>);
        const announcement = screen.getByRole("status");
        expect(announcement).toBeEmptyDOMElement();
    });

    it("does not wrap a button that never loads", () => {
        const { container } = render(<Button>Save</Button>);
        expect(container.firstChild).toBe(screen.getByRole("button"));
    });

    it("hides the label behind the spinner when there is no visual to replace", () => {
        render(<Button loading>Save</Button>);
        expect(screen.getByText("Save")).toHaveClass("invisible");
        expect(
            screen.getByRole("button").querySelector("[data-component='loadingSpinner']"),
        ).not.toBeNull();
    });

    it("keeps the accessible name while loading", () => {
        render(<Button loading>Save</Button>);
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("replaces a leading visual with the spinner rather than the label", () => {
        render(
            <Button loading leadingVisual={Icon}>
                Save
            </Button>,
        );
        const button = screen.getByRole("button");
        expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
        expect(button.querySelector("[data-component='loadingSpinner']")).toBeNull();
        expect(screen.getByText("Save")).not.toHaveClass("invisible");
    });

    it("styles a disabled button as unavailable", () => {
        render(<Button disabled>Save</Button>);
        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
        expect(button).toHaveClass("button-disabled");
        expect(button).toHaveClass("button-default-disabled");
    });

    it("treats aria-disabled as unavailable", () => {
        render(<Button aria-disabled="true">Save</Button>);
        expect(screen.getByRole("button")).toHaveClass("button-disabled");
    });

    it("does not style a loading button as unavailable", () => {
        render(
            <Button loading aria-disabled="true">
                Save
            </Button>,
        );
        expect(screen.getByRole("button")).not.toHaveClass("button-disabled");
    });

    it("styles an inactive button", () => {
        render(<Button inactive>Save</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-inactive", "");
        expect(button).toHaveClass("button-inactive");
    });

    it("flattens the visual colour once the button is out of use", () => {
        render(
            <Button disabled leadingVisual={Icon}>
                Save
            </Button>,
        );
        expect(screen.getByTestId("icon").parentElement).toHaveClass("button-visual-muted");
    });

    it("does not leak its own props onto the element", () => {
        render(
            <Button variant="primary" size="large" alignContent="start" labelWrap block>
                Save
            </Button>,
        );
        const button = screen.getByRole("button");
        expect(button).not.toHaveAttribute("variant");
        expect(button).not.toHaveAttribute("size");
        expect(button).not.toHaveAttribute("alignContent");
        expect(button).not.toHaveAttribute("labelWrap");
        expect(button).not.toHaveAttribute("block");
    });

    it("forwards element specific props to the element", () => {
        render(<Button name="action">Save</Button>);
        expect(screen.getByRole("button")).toHaveAttribute("name", "action");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<Button ref={ref}>Save</Button>);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<Button className="custom">Save</Button>);
        expect(screen.getByRole("button")).toHaveClass("custom");
    });
});
