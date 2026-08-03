import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import CounterLabel from "./CounterLabel";

describe("CounterLabel", () => {
    it("renders a span element by default", () => {
        render(<CounterLabel data-testid="counter">1234</CounterLabel>);
        expect(screen.getByTestId("counter").tagName).toBe("SPAN");
    });

    it("renders as the element passed to the as prop", () => {
        render(
            <CounterLabel as="div" data-testid="counter">
                1234
            </CounterLabel>,
        );
        expect(screen.getByTestId("counter").tagName).toBe("DIV");
    });

    it("renders the counter", () => {
        render(<CounterLabel data-testid="counter">12K</CounterLabel>);
        expect(screen.getByTestId("counter")).toHaveTextContent("12K");
    });

    it("hides the visible counter from assistive technology", () => {
        render(<CounterLabel data-testid="counter">1234</CounterLabel>);
        expect(screen.getByTestId("counter")).toHaveAttribute("aria-hidden", "true");
    });

    it("announces the count in a visually hidden sibling", () => {
        const { container } = render(<CounterLabel>1234</CounterLabel>);
        // A non-breaking space is used because browsers strip a standard leading space
        expect(container.children[1]).toHaveTextContent("(1234)");
        expect(container.children[1].textContent).toBe(" (1234)");
        expect(container.children[1]).toHaveClass("sr-only");
    });

    it("falls back to the secondary variant", () => {
        render(<CounterLabel data-testid="counter">1234</CounterLabel>);
        const counter = screen.getByTestId("counter");
        expect(counter).toHaveAttribute("data-variant", "secondary");
        expect(counter).toHaveClass("bg-[var(--counter-background-color-muted)]");
        expect(counter).toHaveClass("text-foreground-default");
    });

    it("respects the primary variant", () => {
        render(
            <CounterLabel variant="primary" data-testid="counter">
                1234
            </CounterLabel>,
        );
        const counter = screen.getByTestId("counter");
        expect(counter).toHaveAttribute("data-variant", "primary");
        expect(counter).toHaveClass("bg-[var(--counter-background-color-emphasis)]");
        expect(counter).toHaveClass("text-foreground-on-emphasis");
    });

    it("respects the secondary variant", () => {
        render(
            <CounterLabel variant="secondary" data-testid="counter">
                1234
            </CounterLabel>,
        );
        expect(screen.getByTestId("counter")).toHaveAttribute("data-variant", "secondary");
    });

    it("collapses the counter when there is nothing to count", () => {
        render(<CounterLabel data-testid="counter" />);
        expect(screen.getByTestId("counter")).toHaveClass("empty:hidden");
    });

    it("does not leak the variant prop onto the element", () => {
        render(
            <CounterLabel variant="primary" data-testid="counter">
                1234
            </CounterLabel>,
        );
        expect(screen.getByTestId("counter")).not.toHaveAttribute("variant");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <CounterLabel id="issues" data-testid="counter">
                1234
            </CounterLabel>,
        );
        expect(screen.getByTestId("counter")).toHaveAttribute("id", "issues");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<CounterLabel data-testid="counter">1234</CounterLabel>);
        expect(screen.getByTestId("counter")).toHaveAttribute("data-component", "CounterLabel");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(<CounterLabel ref={ref}>1234</CounterLabel>);
        expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("merges a custom className onto the root element", () => {
        render(
            <CounterLabel className="custom" data-testid="counter">
                1234
            </CounterLabel>,
        );
        expect(screen.getByTestId("counter")).toHaveClass("custom");
    });
});
