import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Mark } from ".";
import type { MarkSize, MarkVariant, MarkWeight } from "./Mark.types";

const mark = () => screen.getByText("Marked text");

describe("Mark", () => {
    it("renders a mark element by default", () => {
        render(<Mark>Marked text</Mark>);
        expect(mark().tagName).toBe("MARK");
    });

    it("renders the provided text content", () => {
        render(<Mark>Marked text</Mark>);
        expect(mark()).toBeInTheDocument();
    });

    it("renders as the element passed to the as prop", () => {
        render(<Mark as="span">Marked text</Mark>);
        expect(mark().tagName).toBe("SPAN");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <Mark as="time" dateTime="2026-08-03">
                Marked text
            </Mark>,
        );
        expect(mark()).toHaveAttribute("datetime", "2026-08-03");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Mark>Marked text</Mark>);
        expect(mark()).toHaveAttribute("data-component", "Mark");
    });

    it("carries the highlight on the ground the text sits on", () => {
        render(<Mark>Marked text</Mark>);
        expect(mark()).toHaveClass("mark");
    });

    it("keeps the highlight when a size and a weight are asked for alongside it", () => {
        // The four classes answer four different things, so none of them displaces another on
        // the way through classNames
        render(
            <Mark size="large" weight="semibold">
                Marked text
            </Mark>,
        );
        expect(mark()).toHaveClass(
            "mark",
            "mark-attention",
            "mark-size-large",
            "mark-weight-semibold",
        );
    });

    it("falls back to the attention variant when none is provided", () => {
        render(<Mark>Marked text</Mark>);
        expect(mark()).toHaveAttribute("data-variant", "attention");
        expect(mark()).toHaveClass("mark-attention");
    });

    it("respects the variant prop", () => {
        const variants = {
            attention: "mark-attention",
            accent: "mark-accent",
            success: "mark-success",
            danger: "mark-danger",
            neutral: "mark-neutral",
        } as const;

        for (const [variant, expected] of Object.entries(variants)) {
            const { unmount } = render(<Mark variant={variant as MarkVariant}>Marked text</Mark>);
            expect(mark()).toHaveAttribute("data-variant", variant);
            expect(mark()).toHaveClass(expected);
            unmount();
        }
    });

    it("takes the size of the line it is read in when no size is provided", () => {
        render(<Mark>Marked text</Mark>);
        expect(mark()).not.toHaveAttribute("data-size");
        expect(mark().className).not.toMatch(/\bmark-size-/);
    });

    it("respects the size prop", () => {
        const sizes = {
            large: "mark-size-large",
            medium: "mark-size-medium",
            small: "mark-size-small",
        } as const;

        for (const [size, expected] of Object.entries(sizes)) {
            const { unmount } = render(<Mark size={size as MarkSize}>Marked text</Mark>);
            expect(mark()).toHaveAttribute("data-size", size);
            expect(mark()).toHaveClass(expected);
            unmount();
        }
    });

    it("takes the weight of the line it is read in when no weight is provided", () => {
        render(<Mark>Marked text</Mark>);
        expect(mark()).not.toHaveAttribute("data-weight");
        expect(mark().className).not.toMatch(/\bmark-weight-/);
    });

    it("respects the weight prop", () => {
        const weights = {
            light: "mark-weight-light",
            normal: "mark-weight-normal",
            medium: "mark-weight-medium",
            semibold: "mark-weight-semibold",
        } as const;

        for (const [weight, expected] of Object.entries(weights)) {
            const { unmount } = render(<Mark weight={weight as MarkWeight}>Marked text</Mark>);
            expect(mark()).toHaveAttribute("data-weight", weight);
            expect(mark()).toHaveClass(expected);
            unmount();
        }
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLElement>();
        render(<Mark ref={ref}>Marked text</Mark>);
        expect(ref.current).toBe(mark());
    });

    it("merges a custom className onto the root element", () => {
        render(<Mark className="custom">Marked text</Mark>);
        expect(mark()).toHaveClass("custom");
    });

    it("passes extra props onto the root element", () => {
        render(<Mark data-testid="mark">Marked text</Mark>);
        expect(screen.getByTestId("mark")).toBe(mark());
    });
});
