import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Separator } from ".";
import type { SeparatorOrientation, SeparatorVariant } from "./Separator.types";

const separator = () => screen.getByRole("separator");

describe("Separator", () => {
    it("renders a div element by default", () => {
        render(<Separator />);
        expect(separator().tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(<Separator as="hr" />);
        expect(separator().tagName).toBe("HR");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Separator />);
        expect(separator()).toHaveAttribute("data-component", "Separator");
    });

    it("reads as a separator between one group of things and the next", () => {
        render(<Separator />);
        expect(separator()).toHaveAttribute("role", "separator");
    });

    it("lets a caller take the line out of the accessibility tree", () => {
        render(<Separator role="presentation" data-testid="separator" />);
        expect(screen.queryByRole("separator")).toBeNull();
        expect(screen.getByTestId("separator")).toHaveAttribute("role", "presentation");
    });

    it("falls back to running horizontally", () => {
        render(<Separator />);
        expect(separator()).toHaveAttribute("data-orientation", "horizontal");
        expect(separator()).toHaveClass("separator-horizontal");
    });

    it("says which way it runs whichever way that is", () => {
        for (const orientation of ["horizontal", "vertical"] as const) {
            const { unmount } = render(<Separator orientation={orientation} />);
            expect(separator()).toHaveAttribute("aria-orientation", orientation);
            unmount();
        }
    });

    it("respects the orientation prop", () => {
        const orientations = {
            horizontal: "separator-horizontal",
            vertical: "separator-vertical",
        } as const;

        for (const [orientation, expected] of Object.entries(orientations)) {
            const { unmount } = render(
                <Separator orientation={orientation as SeparatorOrientation} />,
            );
            expect(separator()).toHaveAttribute("data-orientation", orientation);
            expect(separator()).toHaveClass(expected);
            unmount();
        }
    });

    it("keeps a vertical line standing where nothing stretches it", () => {
        render(<Separator orientation="vertical" />);
        expect(separator()).toHaveClass("separator-vertical");
    });

    it("falls back to the default variant", () => {
        render(<Separator />);
        expect(separator()).toHaveAttribute("data-variant", "default");
        expect(separator()).toHaveClass("separator-default");
    });

    it("respects the variant prop", () => {
        const variants = {
            subtle: "separator-subtle",
            default: "separator-default",
            emphasis: "separator-emphasis",
        } as const;

        for (const [variant, expected] of Object.entries(variants)) {
            const { unmount } = render(<Separator variant={variant as SeparatorVariant} />);
            expect(separator()).toHaveAttribute("data-variant", variant);
            expect(separator()).toHaveClass(expected);
            unmount();
        }
    });

    it("draws the line as a fill rather than as a border", () => {
        // One set of rules then serves both orientations, and nothing can shrink the line
        // away in a flex row
        render(<Separator />);
        expect(separator()).toHaveClass("separator");
    });

    it("lets a caller repaint the line through the custom property", () => {
        render(<Separator style={{ "--separator-color": "red" } as React.CSSProperties} />);
        expect(separator()).toHaveStyle({ "--separator-color": "red" });
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Separator ref={ref} />);
        expect(ref.current).toBe(separator());
    });

    it("merges a custom className onto the root element", () => {
        render(<Separator className="custom" />);
        expect(separator()).toHaveClass("custom");
    });

    it("passes extra props onto the root element", () => {
        render(<Separator data-testid="separator" />);
        expect(screen.getByTestId("separator")).toBe(separator());
    });
});
