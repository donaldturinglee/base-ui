import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Blockquote } from ".";
import type { BlockquoteSize, BlockquoteVariant } from "./Blockquote.types";

const blockquote = () => screen.getByText("Quoted text");

describe("Blockquote", () => {
    it("renders a blockquote element by default", () => {
        render(<Blockquote>Quoted text</Blockquote>);
        expect(blockquote().tagName).toBe("BLOCKQUOTE");
    });

    it("renders the provided text content", () => {
        render(<Blockquote>Quoted text</Blockquote>);
        expect(blockquote()).toBeInTheDocument();
    });

    it("renders as the element passed to the as prop", () => {
        render(<Blockquote as="figure">Quoted text</Blockquote>);
        expect(blockquote().tagName).toBe("FIGURE");
    });

    it("keeps the cite attribute a quotation names its source by", () => {
        render(<Blockquote cite="https://example.com/handbook">Quoted text</Blockquote>);
        expect(blockquote()).toHaveAttribute("cite", "https://example.com/handbook");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Blockquote>Quoted text</Blockquote>);
        expect(blockquote()).toHaveAttribute("data-component", "Blockquote");
    });

    it("falls back to the medium size", () => {
        render(<Blockquote>Quoted text</Blockquote>);
        expect(blockquote()).toHaveAttribute("data-size", "medium");
        expect(blockquote()).toHaveClass("blockquote-medium");
    });

    it("respects the size prop", () => {
        const sizes = {
            large: "blockquote-large",
            medium: "blockquote-medium",
            small: "blockquote-small",
        } as const;

        for (const [size, expected] of Object.entries(sizes)) {
            const { unmount } = render(
                <Blockquote size={size as BlockquoteSize}>Quoted text</Blockquote>,
            );
            expect(blockquote()).toHaveAttribute("data-size", size);
            expect(blockquote()).toHaveClass(expected);
            unmount();
        }
    });

    it("falls back to the default variant", () => {
        render(<Blockquote>Quoted text</Blockquote>);
        expect(blockquote()).toHaveAttribute("data-variant", "default");
        expect(blockquote()).toHaveClass("blockquote-default");
    });

    it("respects the variant prop", () => {
        const variants = {
            subtle: "blockquote-subtle",
            default: "blockquote-default",
            emphasis: "blockquote-emphasis",
        } as const;

        for (const [variant, expected] of Object.entries(variants)) {
            const { unmount } = render(
                <Blockquote variant={variant as BlockquoteVariant}>Quoted text</Blockquote>,
            );
            expect(blockquote()).toHaveAttribute("data-variant", variant);
            expect(blockquote()).toHaveClass(expected);
            unmount();
        }
    });

    it("draws the rule down the leading edge rather than down the left", () => {
        // The quotation then reads the same way round whichever way the text runs
        render(<Blockquote>Quoted text</Blockquote>);
        expect(blockquote()).toHaveClass("blockquote");
    });

    it("lets a caller repaint the rule through the custom property", () => {
        render(
            <Blockquote style={{ "--blockquote-border-color": "red" } as React.CSSProperties}>
                Quoted text
            </Blockquote>,
        );
        expect(blockquote()).toHaveStyle({ "--blockquote-border-color": "red" });
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLQuoteElement>();
        render(<Blockquote ref={ref}>Quoted text</Blockquote>);
        expect(ref.current).toBe(blockquote());
    });

    it("merges a custom className onto the root element", () => {
        render(<Blockquote className="custom">Quoted text</Blockquote>);
        expect(blockquote()).toHaveClass("custom");
    });

    it("passes extra props onto the root element", () => {
        render(<Blockquote data-testid="blockquote">Quoted text</Blockquote>);
        expect(screen.getByTestId("blockquote")).toBe(blockquote());
    });
});
