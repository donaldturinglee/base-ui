import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { AspectRatio } from ".";
import type { AspectRatioRatio } from "./AspectRatio.types";

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
        expect(aspectRatio()).toHaveAttribute("data-ratio", "1:1");
        expect(aspectRatio()).toHaveClass("[--aspect-ratio:1/1]");
    });

    it("respects the ratio prop", () => {
        const ratios = {
            "1:1": "[--aspect-ratio:1/1]",
            "16:9": "[--aspect-ratio:16/9]",
            "4:3": "[--aspect-ratio:4/3]",
        } as const;

        for (const [ratio, expected] of Object.entries(ratios)) {
            const { unmount } = render(
                <AspectRatio ratio={ratio as AspectRatioRatio} data-testid="aspect-ratio" />,
            );
            expect(aspectRatio()).toHaveAttribute("data-ratio", ratio);
            expect(aspectRatio()).toHaveClass(expected);
            unmount();
        }
    });

    it("works a custom ratio out from the width and height beside it", () => {
        render(<AspectRatio ratio="custom" width={16} height={10} data-testid="aspect-ratio" />);
        expect(aspectRatio()).toHaveAttribute("data-ratio", "custom");
        expect(aspectRatio()).toHaveStyle({ "--aspect-ratio": "16/10" });
    });

    it("falls back to a square where a custom ratio comes without a width or a height", () => {
        render(<AspectRatio ratio="custom" data-testid="aspect-ratio" />);
        expect(aspectRatio()).toHaveStyle({ "--aspect-ratio": "1/1" });
    });

    it("leaves the custom property to the class where the ratio is a named one", () => {
        render(<AspectRatio ratio="16:9" width={16} height={10} data-testid="aspect-ratio" />);
        expect(aspectRatio().style.getPropertyValue("--aspect-ratio")).toBe("");
    });

    it("takes its height from the width it is given", () => {
        render(<AspectRatio data-testid="aspect-ratio" />);
        expect(aspectRatio()).toHaveClass("aspect-[var(--aspect-ratio)]");
        expect(aspectRatio()).toHaveClass("relative");
        expect(aspectRatio()).toHaveClass("overflow-hidden");
    });

    it("lays whatever is put inside over the whole box", () => {
        render(<AspectRatio data-testid="aspect-ratio" />);
        expect(aspectRatio()).toHaveClass("[&>*]:absolute");
        expect(aspectRatio()).toHaveClass("[&>*]:inset-0");
        expect(aspectRatio()).toHaveClass("[&>*]:w-full");
        expect(aspectRatio()).toHaveClass("[&>*]:h-full");
        expect(aspectRatio()).toHaveClass("[&>*]:object-cover");
    });

    it("merges a custom style onto the root element", () => {
        render(
            <AspectRatio
                ratio="custom"
                width={4}
                height={3}
                style={{ opacity: 0.5 }}
                data-testid="aspect-ratio"
            />,
        );
        expect(aspectRatio()).toHaveStyle({ opacity: "0.5" });
        expect(aspectRatio()).toHaveStyle({ "--aspect-ratio": "4/3" });
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
