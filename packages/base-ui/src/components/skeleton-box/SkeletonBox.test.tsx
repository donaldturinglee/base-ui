import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import SkeletonBox from "./SkeletonBox";

describe("SkeletonBox", () => {
    it("renders a div element by default", () => {
        render(<SkeletonBox data-testid="skeleton" />);
        expect(screen.getByTestId("skeleton").tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(<SkeletonBox as="span" data-testid="skeleton" />);
        expect(screen.getByTestId("skeleton").tagName).toBe("SPAN");
    });

    it("applies the height as a custom property", () => {
        render(<SkeletonBox height="4rem" data-testid="skeleton" />);
        expect(screen.getByTestId("skeleton")).toHaveStyle({ "--skeleton-box-height": "4rem" });
    });

    it("applies the width as a custom property", () => {
        render(<SkeletonBox width="50%" data-testid="skeleton" />);
        expect(screen.getByTestId("skeleton")).toHaveStyle({ "--skeleton-box-width": "50%" });
    });

    it("leaves the dimension custom properties unset when no dimensions are provided", () => {
        render(<SkeletonBox data-testid="skeleton" />);
        const skeleton = screen.getByTestId("skeleton");
        expect(skeleton.style.getPropertyValue("--skeleton-box-width")).toBe("");
        expect(skeleton.style.getPropertyValue("--skeleton-box-height")).toBe("");
    });

    it("merges a custom style onto the root element", () => {
        render(<SkeletonBox height="64px" style={{ opacity: 0.5 }} data-testid="skeleton" />);
        const skeleton = screen.getByTestId("skeleton");
        expect(skeleton).toHaveStyle({ opacity: "0.5" });
        expect(skeleton).toHaveStyle({ "--skeleton-box-height": "64px" });
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(<SkeletonBox id="preview" data-testid="skeleton" />);
        expect(screen.getByTestId("skeleton")).toHaveAttribute("id", "preview");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<SkeletonBox data-testid="skeleton" />);
        expect(screen.getByTestId("skeleton")).toHaveAttribute("data-component", "SkeletonBox");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<SkeletonBox ref={ref} data-testid="skeleton" />);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<SkeletonBox className="custom" data-testid="skeleton" />);
        expect(screen.getByTestId("skeleton")).toHaveClass("custom");
    });
});
