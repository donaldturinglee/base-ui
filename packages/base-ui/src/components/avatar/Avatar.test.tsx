import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import Avatar from "./Avatar";

describe("Avatar", () => {
    it("renders an image element by default", () => {
        render(<Avatar src="primer.png" data-testid="avatar" />);
        expect(screen.getByTestId("avatar").tagName).toBe("IMG");
    });

    it("renders as the element passed to the as prop", () => {
        render(<Avatar as="span" data-testid="avatar" />);
        expect(screen.getByTestId("avatar").tagName).toBe("SPAN");
    });

    it("passes the src down to the image element", () => {
        render(<Avatar src="primer.png" data-testid="avatar" />);
        expect(screen.getByTestId("avatar")).toHaveAttribute("src", "primer.png");
    });

    it("renders a decorative image when no alt text is provided", () => {
        render(<Avatar src="primer.png" data-testid="avatar" />);
        expect(screen.getByTestId("avatar")).toHaveAttribute("alt", "");
    });

    it("passes the alt text down to the image element", () => {
        render(<Avatar src="primer.png" alt="mona" data-testid="avatar" />);
        expect(screen.getByTestId("avatar")).toHaveAttribute("alt", "mona");
    });

    it("renders a small avatar by default", () => {
        render(<Avatar src="primer.png" data-testid="avatar" />);
        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveAttribute("width", "20");
        expect(avatar).toHaveAttribute("height", "20");
        expect(avatar).toHaveStyle({ "--avatar-size-regular": "20px" });
    });

    it("respects the size prop", () => {
        render(<Avatar size={40} src="primer.png" data-testid="avatar" />);
        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveAttribute("width", "40");
        expect(avatar).toHaveAttribute("height", "40");
        expect(avatar).toHaveStyle({ "--avatar-size-regular": "40px" });
    });

    it("applies a custom property per range for a responsive size", () => {
        render(
            <Avatar
                size={{ narrow: 16, regular: 24, wide: 32 }}
                src="primer.png"
                data-testid="avatar"
            />,
        );
        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveAttribute("data-responsive", "true");
        expect(avatar).toHaveStyle({ "--avatar-size-narrow": "16px" });
        expect(avatar).toHaveStyle({ "--avatar-size-regular": "24px" });
        expect(avatar).toHaveStyle({ "--avatar-size-wide": "32px" });
    });

    it("drops the intrinsic dimensions for a responsive size", () => {
        render(<Avatar size={{ narrow: 16 }} src="primer.png" data-testid="avatar" />);
        const avatar = screen.getByTestId("avatar");
        expect(avatar).not.toHaveAttribute("width");
        expect(avatar).not.toHaveAttribute("height");
    });

    it("falls back to the default size when a responsive value leaves out a range", () => {
        render(<Avatar size={{ narrow: 16 }} src="primer.png" data-testid="avatar" />);
        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveStyle({ "--avatar-size-regular": "20px" });
        expect(avatar.style.getPropertyValue("--avatar-size-wide")).toBe("");
    });

    it("rounds the avatar into a circle by default", () => {
        render(<Avatar src="primer.png" data-testid="avatar" />);
        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveAttribute("data-shape", "circle");
        expect(avatar).toHaveClass("avatar-circle");
    });

    it("scales the corner radius with the avatar for the square shape", () => {
        render(<Avatar shape="square" src="primer.png" data-testid="avatar" />);
        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveAttribute("data-shape", "square");
        expect(avatar).toHaveClass("avatar-square");
        expect(avatar).not.toHaveClass("avatar-circle");
    });

    it("does not leak the shape prop onto the element", () => {
        render(<Avatar shape="square" src="primer.png" data-testid="avatar" />);
        expect(screen.getByTestId("avatar")).not.toHaveAttribute("shape");
    });

    it("leaves the responsive attribute unset by default", () => {
        render(<Avatar src="primer.png" data-testid="avatar" />);
        expect(screen.getByTestId("avatar")).not.toHaveAttribute("data-responsive");
    });

    it("merges a custom style onto the root element", () => {
        render(<Avatar src="primer.png" style={{ opacity: 0.5 }} data-testid="avatar" />);
        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveStyle({ opacity: "0.5" });
        expect(avatar).toHaveStyle({ "--avatar-size-regular": "20px" });
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(<Avatar src="primer.png" loading="lazy" data-testid="avatar" />);
        expect(screen.getByTestId("avatar")).toHaveAttribute("loading", "lazy");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Avatar src="primer.png" data-testid="avatar" />);
        expect(screen.getByTestId("avatar")).toHaveAttribute("data-component", "Avatar");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLImageElement>();
        render(<Avatar ref={ref} src="primer.png" data-testid="avatar" />);
        expect(ref.current).toBeInstanceOf(HTMLImageElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<Avatar className="custom" src="primer.png" data-testid="avatar" />);
        expect(screen.getByTestId("avatar")).toHaveClass("custom");
    });
});
