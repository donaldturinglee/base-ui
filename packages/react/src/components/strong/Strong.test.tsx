import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Strong } from ".";
import type { StrongSize } from "./Strong.types";

const strong = () => screen.getByText("Important text");

describe("Strong", () => {
    it("renders a strong element by default", () => {
        render(<Strong>Important text</Strong>);
        expect(strong().tagName).toBe("STRONG");
    });

    it("renders the provided text content", () => {
        render(<Strong>Important text</Strong>);
        expect(strong()).toBeInTheDocument();
    });

    it("renders as the element passed to the as prop", () => {
        render(<Strong as="b">Important text</Strong>);
        expect(strong().tagName).toBe("B");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <Strong as="time" dateTime="2026-09-02">
                Important text
            </Strong>,
        );
        expect(strong()).toHaveAttribute("datetime", "2026-09-02");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Strong>Important text</Strong>);
        expect(strong()).toHaveAttribute("data-component", "Strong");
    });

    it("carries the weight the library keeps for importance", () => {
        render(<Strong>Important text</Strong>);
        expect(strong()).toHaveClass("strong");
    });

    it("keeps that weight when it is drawn as something other than a strong", () => {
        // The weight is the component's rather than the element's, so it is asked for by class
        // instead of being left to what the browser does with a `b` or a `span`
        render(<Strong as="span">Important text</Strong>);
        expect(strong()).toHaveClass("strong");
    });

    it("keeps the weight when a size is asked for alongside it", () => {
        // The two classes answer two different things, so neither displaces the other on the way
        // through classNames
        render(<Strong size="large">Important text</Strong>);
        expect(strong()).toHaveClass("strong", "strong-size-large");
    });

    it("takes the size of the line it is read in when no size is provided", () => {
        render(<Strong>Important text</Strong>);
        expect(strong()).not.toHaveAttribute("data-size");
        expect(strong().className).not.toMatch(/\bstrong-size-/);
    });

    it("respects the size prop", () => {
        const sizes = {
            large: "strong-size-large",
            medium: "strong-size-medium",
            small: "strong-size-small",
        } as const;

        for (const [size, expected] of Object.entries(sizes)) {
            const { unmount } = render(<Strong size={size as StrongSize}>Important text</Strong>);
            expect(strong()).toHaveAttribute("data-size", size);
            expect(strong()).toHaveClass(expected);
            unmount();
        }
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLElement>();
        render(<Strong ref={ref}>Important text</Strong>);
        expect(ref.current).toBe(strong());
    });

    it("merges a custom className onto the root element", () => {
        render(<Strong className="custom">Important text</Strong>);
        expect(strong()).toHaveClass("custom");
    });

    it("passes extra props onto the root element", () => {
        render(<Strong data-testid="strong">Important text</Strong>);
        expect(screen.getByTestId("strong")).toBe(strong());
    });
});
