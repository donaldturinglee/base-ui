import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Blankslate } from ".";
import type { BlankslateSize } from "./Blankslate.types";

const TestIcon = () => <svg data-testid="test-icon" aria-hidden="true" />;

describe("Blankslate", () => {
    it("renders a div element by default", () => {
        render(<Blankslate data-testid="blankslate">Empty</Blankslate>);
        expect(screen.getByTestId("blankslate").tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(
            <Blankslate as="section" data-testid="blankslate">
                Empty
            </Blankslate>,
        );
        expect(screen.getByTestId("blankslate").tagName).toBe("SECTION");
    });

    it("renders its children", () => {
        render(
            <Blankslate>
                <Blankslate.Heading>Nothing here yet</Blankslate.Heading>
                <Blankslate.Description>Add something to get started.</Blankslate.Description>
            </Blankslate>,
        );
        expect(
            screen.getByRole("heading", { level: 2, name: "Nothing here yet" }),
        ).toBeInTheDocument();
        expect(screen.getByText("Add something to get started.")).toBeInTheDocument();
    });

    it("wraps itself in a query container so it can respond to the room it has", () => {
        render(<Blankslate data-testid="blankslate">Empty</Blankslate>);
        expect(screen.getByTestId("blankslate").parentElement).toHaveClass("blankslate-container");
    });

    it("tags the blankslate and its parts with data-component attributes", () => {
        const { container } = render(
            <Blankslate>
                <Blankslate.Visual>
                    <TestIcon />
                </Blankslate.Visual>
                <Blankslate.Heading>Heading</Blankslate.Heading>
                <Blankslate.Description>Description</Blankslate.Description>
                <Blankslate.PrimaryAction>
                    <button type="button">Create</button>
                </Blankslate.PrimaryAction>
                <Blankslate.SecondaryAction href="#">Learn more</Blankslate.SecondaryAction>
            </Blankslate>,
        );

        for (const name of [
            "Blankslate",
            "Blankslate.Visual",
            "Blankslate.Heading",
            "Blankslate.Description",
            "Blankslate.PrimaryAction",
            "Blankslate.SecondaryAction",
        ]) {
            expect(container.querySelector(`[data-component="${name}"]`)).toBeInstanceOf(
                HTMLElement,
            );
        }
    });

    it("falls back to the medium size", () => {
        render(<Blankslate data-testid="blankslate">Empty</Blankslate>);
        const blankslate = screen.getByTestId("blankslate");
        expect(blankslate).toHaveAttribute("data-size", "medium");
        expect(blankslate).toHaveClass("blankslate-medium");
        expect(blankslate).toHaveClass("blankslate-padding-medium");
    });

    it("respects the size prop", () => {
        const sizes: BlankslateSize[] = ["small", "medium", "large"];

        for (const size of sizes) {
            const { unmount } = render(
                <Blankslate size={size} data-testid="blankslate">
                    Empty
                </Blankslate>,
            );
            const blankslate = screen.getByTestId("blankslate");
            expect(blankslate).toHaveAttribute("data-size", size);
            expect(blankslate).toHaveClass(`blankslate-${size}`);
            unmount();
        }
    });

    it("gives the small size its own visual size", () => {
        render(
            <Blankslate size="small" data-testid="blankslate">
                Empty
            </Blankslate>,
        );
        expect(screen.getByTestId("blankslate")).toHaveClass("blankslate-small");
    });

    it("opens the padding up when spacious", () => {
        render(
            <Blankslate spacious data-testid="blankslate">
                Empty
            </Blankslate>,
        );
        const blankslate = screen.getByTestId("blankslate");
        expect(blankslate).toHaveAttribute("data-spacious", "true");
        expect(blankslate).toHaveClass("blankslate-padding-spacious-medium");
        expect(blankslate).not.toHaveClass("blankslate-padding-medium");
    });

    it("keeps a spacious small blankslate tighter than a spacious medium one", () => {
        render(
            <Blankslate size="small" spacious data-testid="blankslate">
                Empty
            </Blankslate>,
        );
        expect(screen.getByTestId("blankslate")).toHaveClass("blankslate-padding-spacious-small");
    });

    it("drops to the small type scale in a narrow container", () => {
        render(<Blankslate data-testid="blankslate">Empty</Blankslate>);
        const blankslate = screen.getByTestId("blankslate");
        expect(blankslate).toHaveClass("blankslate-tight-type");
        expect(blankslate).toHaveClass("blankslate-tight-padding-medium");
    });

    it("draws a border when bordered", () => {
        render(
            <Blankslate border data-testid="blankslate">
                Empty
            </Blankslate>,
        );
        const blankslate = screen.getByTestId("blankslate");
        expect(blankslate).toHaveAttribute("data-border", "true");
        expect(blankslate).toHaveClass("blankslate-border");
    });

    it("constrains and centres itself when narrow", () => {
        render(
            <Blankslate narrow data-testid="blankslate">
                Empty
            </Blankslate>,
        );
        const blankslate = screen.getByTestId("blankslate");
        expect(blankslate).toHaveAttribute("data-narrow", "true");
        expect(blankslate).toHaveClass("blankslate-narrow");
    });

    it("leaves the state attributes unset by default", () => {
        render(<Blankslate data-testid="blankslate">Empty</Blankslate>);
        const blankslate = screen.getByTestId("blankslate");
        expect(blankslate).not.toHaveAttribute("data-border");
        expect(blankslate).not.toHaveAttribute("data-narrow");
        expect(blankslate).not.toHaveAttribute("data-spacious");
    });

    it("renders the heading at the level passed to its as prop", () => {
        render(
            <Blankslate>
                <Blankslate.Heading as="h1">Heading</Blankslate.Heading>
            </Blankslate>,
        );
        expect(screen.getByRole("heading", { level: 1, name: "Heading" })).toBeInTheDocument();
    });

    it("renders the visual around its icon", () => {
        const { container } = render(
            <Blankslate>
                <Blankslate.Visual>
                    <TestIcon />
                </Blankslate.Visual>
            </Blankslate>,
        );
        const visual = container.querySelector('[data-component="Blankslate.Visual"]');
        expect(visual?.tagName).toBe("SPAN");
        expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });

    it("renders the control given to the primary action", () => {
        render(
            <Blankslate>
                <Blankslate.PrimaryAction>
                    <button type="button">Create the first page</button>
                </Blankslate.PrimaryAction>
            </Blankslate>,
        );
        expect(screen.getByRole("button", { name: "Create the first page" })).toBeInTheDocument();
    });

    it("turns an href on the secondary action into a link", () => {
        render(
            <Blankslate>
                <Blankslate.SecondaryAction href="/wikis">Learn more</Blankslate.SecondaryAction>
            </Blankslate>,
        );
        const link = screen.getByRole("link", { name: "Learn more" });
        expect(link).toHaveAttribute("href", "/wikis");
        expect(link).toHaveAttribute("data-component", "Link");
    });

    it("renders the secondary action children as given without an href", () => {
        render(
            <Blankslate>
                <Blankslate.SecondaryAction>
                    <button type="button">Dismiss</button>
                </Blankslate.SecondaryAction>
            </Blankslate>,
        );
        expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("carries the closing padding on the last action only", () => {
        const { container } = render(
            <Blankslate>
                <Blankslate.PrimaryAction>
                    <button type="button">Create</button>
                </Blankslate.PrimaryAction>
                <Blankslate.SecondaryAction href="#">Learn more</Blankslate.SecondaryAction>
            </Blankslate>,
        );

        for (const name of ["Blankslate.PrimaryAction", "Blankslate.SecondaryAction"]) {
            expect(container.querySelector(`[data-component="${name}"]`)).toHaveClass(
                "blankslate-action",
            );
        }
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <Blankslate id="empty-state" data-testid="blankslate">
                Empty
            </Blankslate>,
        );
        expect(screen.getByTestId("blankslate")).toHaveAttribute("id", "empty-state");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Blankslate ref={ref}>Empty</Blankslate>);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current).toHaveAttribute("data-component", "Blankslate");
    });

    it("merges a custom className onto the root element", () => {
        render(
            <Blankslate className="custom" data-testid="blankslate">
                Empty
            </Blankslate>,
        );
        expect(screen.getByTestId("blankslate")).toHaveClass("custom");
    });
});
