import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { AspectRatio } from ".";

const aspectRatio = () => screen.getByTestId("aspect-ratio");

describe("AspectRatio", () => {
    it("renders a div element by default", () => {
        render(<AspectRatio data-testid="aspect-ratio" />);
        expect(aspectRatio().tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(<AspectRatio as="section" data-testid="aspect-ratio" />);
        expect(aspectRatio().tagName).toBe("SECTION");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<AspectRatio data-testid="aspect-ratio" />);
        expect(aspectRatio()).toHaveAttribute("data-component", "AspectRatio");
    });

    it("renders its children", () => {
        render(
            <AspectRatio data-testid="aspect-ratio">
                <span>Child content</span>
            </AspectRatio>,
        );
        expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("falls back to a square box", () => {
        render(<AspectRatio data-testid="aspect-ratio" />);
        expect(aspectRatio()).toHaveStyle({ "--aspect-ratio": "1" });
    });

    it("respects the ratio prop", () => {
        const ratios = [16 / 9, 4 / 3, 3 / 4, 2];

        for (const ratio of ratios) {
            const { unmount } = render(<AspectRatio ratio={ratio} data-testid="aspect-ratio" />);
            expect(aspectRatio()).toHaveStyle({ "--aspect-ratio": String(ratio) });
            unmount();
        }
    });

    it("takes its height from the width it is given, and lays whatever is put inside over it", () => {
        render(<AspectRatio data-testid="aspect-ratio" />);
        expect(aspectRatio()).toHaveClass("aspect-ratio");
    });

    it("merges a custom style onto the root element", () => {
        render(<AspectRatio ratio={2} style={{ opacity: 0.5 }} data-testid="aspect-ratio" />);
        expect(aspectRatio()).toHaveStyle({ opacity: "0.5" });
        expect(aspectRatio()).toHaveStyle({ "--aspect-ratio": "2" });
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(<AspectRatio id="preview" data-testid="aspect-ratio" />);
        expect(aspectRatio()).toHaveAttribute("id", "preview");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<AspectRatio ref={ref} data-testid="aspect-ratio" />);
        expect(ref.current).toBe(aspectRatio());
    });

    it("merges a custom className onto the root element", () => {
        render(<AspectRatio className="custom" data-testid="aspect-ratio" />);
        expect(aspectRatio()).toHaveClass("custom");
    });
});
