import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Button } from "../button";
import { ButtonGroup } from ".";

const getItems = (group: HTMLElement) =>
    Array.from(group.querySelectorAll("[data-component='ButtonGroup.Item']"));

describe("ButtonGroup", () => {
    it("renders a div element by default", () => {
        render(<ButtonGroup data-testid="group" />);
        expect(screen.getByTestId("group").tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(<ButtonGroup as="section" data-testid="group" />);
        expect(screen.getByTestId("group").tagName).toBe("SECTION");
    });

    it("lays its children out in a row of their own", () => {
        render(<ButtonGroup data-testid="group" />);
        const group = screen.getByTestId("group");
        expect(group).toHaveClass("button-group");
    });

    it("wraps each child in an item of its own", () => {
        render(
            <ButtonGroup data-testid="group">
                <Button>One</Button>
                <Button>Two</Button>
            </ButtonGroup>,
        );
        const items = getItems(screen.getByTestId("group"));
        expect(items).toHaveLength(2);
        expect(items[0]).toHaveTextContent("One");
        expect(items[1]).toHaveTextContent("Two");
    });

    it("overlaps the items so that neighbours share a border", () => {
        render(
            <ButtonGroup data-testid="group">
                <Button>One</Button>
                <Button>Two</Button>
            </ButtonGroup>,
        );
        for (const item of getItems(screen.getByTestId("group"))) {
            expect(item).toHaveClass("button-group-item");
        }
    });

    it("squares off the buttons and links it holds", () => {
        render(
            <ButtonGroup data-testid="group">
                <Button>One</Button>
                <Button as="a" href="#docs">
                    Two
                </Button>
            </ButtonGroup>,
        );
        for (const item of getItems(screen.getByTestId("group"))) {
            expect(item).toHaveClass("button-group-item");
        }
    });

    it("rounds the outer edges of the group only", () => {
        render(
            <ButtonGroup data-testid="group">
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
            </ButtonGroup>,
        );
        const [first, middle, last] = getItems(screen.getByTestId("group"));
        expect(first).toHaveClass("button-group-item-first");
        expect(first).not.toHaveClass("button-group-item-last");
        expect(middle).not.toHaveClass("button-group-item-first");
        expect(middle).not.toHaveClass("button-group-item-last");
        expect(last).toHaveClass("button-group-item-last");
        expect(last).not.toHaveClass("button-group-item-first");
    });

    it("rounds both edges of a group holding a single button", () => {
        render(
            <ButtonGroup data-testid="group">
                <Button>One</Button>
            </ButtonGroup>,
        );
        const [only] = getItems(screen.getByTestId("group"));
        expect(only).toHaveClass("button-group-item-first");
        expect(only).toHaveClass("button-group-item-last");
    });

    it("leaves out the children that are not there", () => {
        const showSecond = false;
        render(
            <ButtonGroup data-testid="group">
                <Button>One</Button>
                {showSecond && <Button>Two</Button>}
            </ButtonGroup>,
        );
        const items = getItems(screen.getByTestId("group"));
        expect(items).toHaveLength(1);
        expect(items[0]).toHaveClass("button-group-item-last");
    });

    it("respects the role", () => {
        render(<ButtonGroup role="toolbar" />);
        expect(screen.getByRole("toolbar")).toBeInTheDocument();
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(<ButtonGroup id="actions" data-testid="group" />);
        expect(screen.getByTestId("group")).toHaveAttribute("id", "actions");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<ButtonGroup data-testid="group" />);
        expect(screen.getByTestId("group")).toHaveAttribute("data-component", "ButtonGroup");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<ButtonGroup ref={ref} data-testid="group" />);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<ButtonGroup className="custom" data-testid="group" />);
        expect(screen.getByTestId("group")).toHaveClass("custom");
    });
});

describe("ButtonGroup as a toolbar", () => {
    const renderToolbar = (children?: React.ReactNode) =>
        render(
            <ButtonGroup role="toolbar" aria-label="Actions">
                {children ?? (
                    <>
                        <Button>One</Button>
                        <Button>Two</Button>
                        <Button>Three</Button>
                    </>
                )}
            </ButtonGroup>,
        );

    const button = (name: string) => screen.getByRole("button", { name });

    it("keeps a single tab stop", () => {
        renderToolbar();
        expect(button("One")).toHaveAttribute("tabindex", "0");
        expect(button("Two")).toHaveAttribute("tabindex", "-1");
        expect(button("Three")).toHaveAttribute("tabindex", "-1");
    });

    it("leaves the buttons in the tab order without the toolbar role", () => {
        render(
            <ButtonGroup>
                <Button>One</Button>
                <Button>Two</Button>
            </ButtonGroup>,
        );
        expect(button("One")).not.toHaveAttribute("tabindex");
        expect(button("Two")).not.toHaveAttribute("tabindex");
    });

    it("hands the tab stop to a button that is added later", () => {
        const { rerender } = render(
            <ButtonGroup role="toolbar">
                <Button>One</Button>
            </ButtonGroup>,
        );
        rerender(
            <ButtonGroup role="toolbar">
                <Button>One</Button>
                <Button>Two</Button>
            </ButtonGroup>,
        );
        expect(button("One")).toHaveAttribute("tabindex", "0");
        expect(button("Two")).toHaveAttribute("tabindex", "-1");
    });

    it("moves focus to the next button on ArrowRight", () => {
        renderToolbar();
        button("One").focus();
        fireEvent.keyDown(button("One"), { key: "ArrowRight" });
        expect(button("Two")).toHaveFocus();
    });

    it("moves focus to the previous button on ArrowLeft", () => {
        renderToolbar();
        button("Two").focus();
        fireEvent.keyDown(button("Two"), { key: "ArrowLeft" });
        expect(button("One")).toHaveFocus();
    });

    it("wraps focus around the ends of the group", () => {
        renderToolbar();
        button("One").focus();
        fireEvent.keyDown(button("One"), { key: "ArrowLeft" });
        expect(button("Three")).toHaveFocus();

        fireEvent.keyDown(button("Three"), { key: "ArrowRight" });
        expect(button("One")).toHaveFocus();
    });

    it("moves the tab stop to the button that takes focus", () => {
        renderToolbar();
        button("Two").focus();
        expect(button("Two")).toHaveAttribute("tabindex", "0");
        expect(button("One")).toHaveAttribute("tabindex", "-1");
        expect(button("Three")).toHaveAttribute("tabindex", "-1");
    });

    it("passes over the buttons that cannot be used", () => {
        renderToolbar(
            <>
                <Button>One</Button>
                <Button disabled>Two</Button>
                <Button>Three</Button>
            </>,
        );
        button("One").focus();
        fireEvent.keyDown(button("One"), { key: "ArrowRight" });
        expect(button("Three")).toHaveFocus();
    });

    it("moves between buttons and links alike", () => {
        renderToolbar(
            <>
                <Button>One</Button>
                <Button as="a" href="#docs">
                    Two
                </Button>
            </>,
        );
        button("One").focus();
        fireEvent.keyDown(button("One"), { key: "ArrowRight" });
        expect(screen.getByRole("link", { name: "Two" })).toHaveFocus();
    });

    it("leaves the arrow keys alone without the toolbar role", () => {
        render(
            <ButtonGroup>
                <Button>One</Button>
                <Button>Two</Button>
            </ButtonGroup>,
        );
        button("One").focus();
        fireEvent.keyDown(button("One"), { key: "ArrowRight" });
        expect(button("One")).toHaveFocus();
    });

    it("leaves the other keys alone", () => {
        renderToolbar();
        button("One").focus();
        fireEvent.keyDown(button("One"), { key: "ArrowDown" });
        expect(button("One")).toHaveFocus();
    });

    it("calls the handlers it was given", () => {
        const onKeyDown = vi.fn();
        const onFocus = vi.fn();
        render(
            <ButtonGroup role="toolbar" onKeyDown={onKeyDown} onFocus={onFocus}>
                <Button>One</Button>
                <Button>Two</Button>
            </ButtonGroup>,
        );
        button("One").focus();
        fireEvent.keyDown(button("One"), { key: "ArrowRight" });
        expect(onFocus).toHaveBeenCalled();
        expect(onKeyDown).toHaveBeenCalled();
    });

    it("puts the buttons back in the tab order once the role is dropped", () => {
        const { rerender } = render(
            <ButtonGroup role="toolbar">
                <Button>One</Button>
                <Button>Two</Button>
            </ButtonGroup>,
        );
        rerender(
            <ButtonGroup>
                <Button>One</Button>
                <Button>Two</Button>
            </ButtonGroup>,
        );
        expect(button("One")).not.toHaveAttribute("tabindex");
        expect(button("Two")).not.toHaveAttribute("tabindex");
    });
});
