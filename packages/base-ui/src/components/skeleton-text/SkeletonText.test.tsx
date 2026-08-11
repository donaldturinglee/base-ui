import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import SkeletonText from "./SkeletonText";

describe("SkeletonText", () => {
    it("renders a single skeleton box by default", () => {
        const { container } = render(<SkeletonText />);
        expect(container.querySelectorAll("[data-size]")).toHaveLength(1);
    });

    it("renders a single skeleton box when a single line is requested", () => {
        const { container } = render(<SkeletonText lines={1} />);
        expect(container.querySelectorAll("[data-size]")).toHaveLength(1);
    });

    it("renders one skeleton box per line when several lines are requested", () => {
        const { container } = render(<SkeletonText lines={3} />);
        expect(container.querySelectorAll("[data-size]")).toHaveLength(3);
    });

    it("wraps the lines in the component root when several lines are requested", () => {
        const { container } = render(<SkeletonText lines={3} />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveAttribute("data-component", "SkeletonText");
        expect(root.children).toHaveLength(3);
    });

    it("defaults to the bodyMedium size", () => {
        render(<SkeletonText data-testid="text" />);
        expect(screen.getByTestId("text")).toHaveAttribute("data-size", "bodyMedium");
    });

    it("applies the requested size", () => {
        render(<SkeletonText size="titleLarge" data-testid="text" />);
        expect(screen.getByTestId("text")).toHaveAttribute("data-size", "titleLarge");
    });

    it("applies the requested size to every line", () => {
        const { container } = render(<SkeletonText lines={2} size="display" />);
        for (const line of container.querySelectorAll("[data-size]")) {
            expect(line).toHaveAttribute("data-size", "display");
        }
    });

    it("sizes the box to the font size of the text it replaces", () => {
        render(<SkeletonText data-testid="text" />);
        expect(screen.getByTestId("text")).toHaveStyle({
            "--skeleton-box-height": "var(--skeleton-text-font-size)",
        });
    });

    it("applies the max width to the root element", () => {
        render(<SkeletonText maxWidth="200px" data-testid="text" />);
        expect(screen.getByTestId("text")).toHaveStyle({ maxWidth: "200px" });
    });

    it("applies the max width to the root element when several lines are requested", () => {
        const { container } = render(<SkeletonText lines={3} maxWidth="200px" />);
        expect(container.firstChild).toHaveStyle({ maxWidth: "200px" });
    });

    it("merges a custom style onto the root element", () => {
        render(<SkeletonText maxWidth="200px" style={{ opacity: 0.5 }} data-testid="text" />);
        const text = screen.getByTestId("text");
        expect(text).toHaveStyle({ opacity: "0.5" });
        expect(text).toHaveStyle({ maxWidth: "200px" });
    });

    it("tags the root element with a data-component attribute", () => {
        render(<SkeletonText data-testid="text" />);
        expect(screen.getByTestId("text")).toHaveAttribute("data-component", "SkeletonText");
    });

    it("merges a custom className onto the root element", () => {
        render(<SkeletonText className="custom" data-testid="text" />);
        expect(screen.getByTestId("text")).toHaveClass("custom");
    });

    it("forwards element specific props to the root element", () => {
        render(<SkeletonText id="preview" data-testid="text" />);
        expect(screen.getByTestId("text")).toHaveAttribute("id", "preview");
    });
});
