import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Divider } from ".";
import type { DividerOrientation, DividerVariant } from "./Divider.types";

const divider = () => screen.getByRole("separator");

describe("Divider", () => {
    it("renders a div element by default", () => {
        render(<Divider />);
        expect(divider().tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(<Divider as="hr" />);
        expect(divider().tagName).toBe("HR");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Divider />);
        expect(divider()).toHaveAttribute("data-component", "Divider");
    });

    it("reads as a separator between one section and the next", () => {
        render(<Divider />);
        expect(divider()).toHaveAttribute("role", "separator");
    });

    it("lets a caller take the line out of the accessibility tree", () => {
        render(<Divider role="presentation" data-testid="divider" />);
        expect(screen.queryByRole("separator")).toBeNull();
        expect(screen.getByTestId("divider")).toHaveAttribute("role", "presentation");
    });

    it("falls back to running horizontally", () => {
        render(<Divider />);
        expect(divider()).toHaveAttribute("data-orientation", "horizontal");
        expect(divider()).toHaveClass("w-full");
        expect(divider()).toHaveClass("h-[var(--border-width-thin)]");
    });

    it("leaves the orientation unstated where it is the one a separator assumes", () => {
        render(<Divider />);
        expect(divider()).not.toHaveAttribute("aria-orientation");
    });

    it("runs vertically where it is asked to", () => {
        render(<Divider orientation="vertical" />);
        expect(divider()).toHaveAttribute("data-orientation", "vertical");
        expect(divider()).toHaveAttribute("aria-orientation", "vertical");
        expect(divider()).toHaveClass("w-[var(--border-width-thin)]");
        expect(divider()).toHaveClass("self-stretch");
    });

    it("respects the orientation prop", () => {
        const orientations = {
            horizontal: "w-full",
            vertical: "self-stretch",
        } as const;

        for (const [orientation, expected] of Object.entries(orientations)) {
            const { unmount } = render(<Divider orientation={orientation as DividerOrientation} />);
            expect(divider()).toHaveAttribute("data-orientation", orientation);
            expect(divider()).toHaveClass(expected);
            unmount();
        }
    });

    it("falls back to the default variant", () => {
        render(<Divider />);
        expect(divider()).toHaveAttribute("data-variant", "default");
        expect(divider()).toHaveClass("[--divider-color:var(--border-color-default)]");
    });

    it("respects the variant prop", () => {
        const variants = {
            subtle: "[--divider-color:var(--border-color-muted)]",
            default: "[--divider-color:var(--border-color-default)]",
            emphasis: "[--divider-color:var(--border-color-emphasis)]",
        } as const;

        for (const [variant, expected] of Object.entries(variants)) {
            const { unmount } = render(<Divider variant={variant as DividerVariant} />);
            expect(divider()).toHaveAttribute("data-variant", variant);
            expect(divider()).toHaveClass(expected);
            unmount();
        }
    });

    it("draws the line as a fill rather than as a border", () => {
        // One set of rules then serves both orientations, and nothing can shrink the line
        // away in a flex row
        render(<Divider />);
        expect(divider()).toHaveClass("bg-[var(--divider-color)]");
        expect(divider()).toHaveClass("border-0");
        expect(divider()).toHaveClass("shrink-0");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Divider ref={ref} />);
        expect(ref.current).toBe(divider());
    });

    it("merges a custom className onto the root element", () => {
        render(<Divider className="custom" />);
        expect(divider()).toHaveClass("custom");
    });

    it("passes extra props onto the root element", () => {
        render(<Divider data-testid="divider" />);
        expect(screen.getByTestId("divider")).toBe(divider());
    });
});
