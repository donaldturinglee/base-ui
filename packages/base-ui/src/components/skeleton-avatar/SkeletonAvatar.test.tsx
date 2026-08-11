import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import SkeletonAvatar from "./SkeletonAvatar";

describe("SkeletonAvatar", () => {
    it("renders a div element by default", () => {
        render(<SkeletonAvatar data-testid="skeleton" />);
        expect(screen.getByTestId("skeleton").tagName).toBe("DIV");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<SkeletonAvatar data-testid="skeleton" />);
        expect(screen.getByTestId("skeleton")).toHaveAttribute("data-component", "SkeletonAvatar");
    });

    it("renders a small avatar by default", () => {
        render(<SkeletonAvatar data-testid="skeleton" />);
        expect(screen.getByTestId("skeleton")).toHaveStyle({ "--avatar-size-regular": "20px" });
    });

    it("respects the size prop", () => {
        render(<SkeletonAvatar size={48} data-testid="skeleton" />);
        expect(screen.getByTestId("skeleton")).toHaveStyle({ "--avatar-size-regular": "48px" });
    });

    it("drives the skeleton box dimensions from the avatar size", () => {
        render(<SkeletonAvatar size={48} data-testid="skeleton" />);
        const skeleton = screen.getByTestId("skeleton");
        expect(skeleton).toHaveStyle({ "--skeleton-box-width": "var(--avatar-size-regular)" });
        expect(skeleton).toHaveStyle({ "--skeleton-box-height": "var(--avatar-size-regular)" });
    });

    it("applies a custom property per range for a responsive size", () => {
        render(
            <SkeletonAvatar size={{ narrow: 16, regular: 24, wide: 32 }} data-testid="skeleton" />,
        );
        const skeleton = screen.getByTestId("skeleton");
        expect(skeleton).toHaveAttribute("data-responsive", "true");
        expect(skeleton).toHaveStyle({ "--avatar-size-narrow": "16px" });
        expect(skeleton).toHaveStyle({ "--avatar-size-regular": "24px" });
        expect(skeleton).toHaveStyle({ "--avatar-size-wide": "32px" });
        expect(skeleton).toHaveClass("skeleton-avatar-responsive");
    });

    it("falls back to the default size when a responsive value leaves out a range", () => {
        render(<SkeletonAvatar size={{ narrow: 16 }} data-testid="skeleton" />);
        const skeleton = screen.getByTestId("skeleton");
        expect(skeleton).toHaveStyle({ "--avatar-size-regular": "20px" });
        expect(skeleton.style.getPropertyValue("--avatar-size-wide")).toBe("");
    });

    it("leaves the responsive attribute unset for a fixed size", () => {
        render(<SkeletonAvatar data-testid="skeleton" />);
        const skeleton = screen.getByTestId("skeleton");
        expect(skeleton).not.toHaveAttribute("data-responsive");
        expect(skeleton).not.toHaveClass("skeleton-avatar-responsive");
    });

    it("rounds the avatar into a circle by default", () => {
        render(<SkeletonAvatar data-testid="skeleton" />);
        const skeleton = screen.getByTestId("skeleton");
        expect(skeleton).toHaveAttribute("data-shape", "circle");
        expect(skeleton).toHaveClass("skeleton-avatar-circle");
    });

    it("scales the corner radius with the avatar for the square shape", () => {
        render(<SkeletonAvatar shape="square" data-testid="skeleton" />);
        const skeleton = screen.getByTestId("skeleton");
        expect(skeleton).toHaveAttribute("data-shape", "square");
        expect(skeleton).toHaveClass("skeleton-avatar-square");
    });

    it("lays the avatar out inline, and rounds it, in place of what the box says", () => {
        render(<SkeletonAvatar data-testid="skeleton" />);
        const skeleton = screen.getByTestId("skeleton");
        expect(skeleton).toHaveClass("skeleton-box");
        expect(skeleton).toHaveClass("skeleton-avatar");
    });

    it("keeps the loading treatment from the skeleton box", () => {
        render(<SkeletonAvatar data-testid="skeleton" />);
        const skeleton = screen.getByTestId("skeleton");
        expect(skeleton).toHaveClass("skeleton-box");
        expect(skeleton).toHaveClass("motion-safe:shimmer");
    });

    it("merges a custom style onto the root element", () => {
        render(<SkeletonAvatar style={{ opacity: 0.5 }} data-testid="skeleton" />);
        const skeleton = screen.getByTestId("skeleton");
        expect(skeleton).toHaveStyle({ opacity: "0.5" });
        expect(skeleton).toHaveStyle({ "--avatar-size-regular": "20px" });
    });

    it("merges a custom className onto the root element", () => {
        render(<SkeletonAvatar className="custom" data-testid="skeleton" />);
        expect(screen.getByTestId("skeleton")).toHaveClass("custom");
    });

    it("spreads extra props onto the root element", () => {
        render(<SkeletonAvatar id="loading" data-testid="skeleton" />);
        expect(screen.getByTestId("skeleton")).toHaveAttribute("id", "loading");
    });
});
