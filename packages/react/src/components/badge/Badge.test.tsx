import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { TagRegular } from "@gamecrafters/base-ui-icons";
import Badge from "./Badge";

const leadingVisual = () => document.querySelector("[data-component='Badge.LeadingVisual']");

describe("Badge", () => {
    it("renders a span element by default", () => {
        render(<Badge>Default</Badge>);
        expect(screen.getByText("Default").tagName).toBe("SPAN");
    });

    it("renders the provided text content", () => {
        render(<Badge>Default</Badge>);
        expect(screen.getByText("Default")).toBeInTheDocument();
    });

    it("renders as the element passed to the as prop", () => {
        render(<Badge as="div">Default</Badge>);
        expect(screen.getByText("Default").tagName).toBe("DIV");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <Badge as="a" href="https://github.com">
                Default
            </Badge>,
        );
        expect(screen.getByText("Default")).toHaveAttribute("href", "https://github.com");
    });

    it("applies the small size by default", () => {
        render(<Badge>Default</Badge>);
        expect(screen.getByText("Default")).toHaveClass("badge-small");
    });

    it("applies the requested size", () => {
        render(<Badge size="large">Default</Badge>);
        expect(screen.getByText("Default")).toHaveClass("badge-large");
    });

    it("applies the default variant when no variant is provided", () => {
        render(<Badge>Default</Badge>);
        const badge = screen.getByText("Default");
        expect(badge).toHaveClass("badge");
        expect(badge).toHaveClass("badge-default");
    });

    it("applies the requested variant", () => {
        render(<Badge variant="danger">Danger</Badge>);
        expect(screen.getByText("Danger")).toHaveClass("badge-danger");
    });

    it("replaces the default variant when a colored variant is provided", () => {
        render(<Badge variant="accent">Accent</Badge>);
        const badge = screen.getByText("Accent");
        expect(badge).toHaveClass("badge-accent");
        expect(badge).not.toHaveClass("badge-default");
    });

    it("applies the outline variant", () => {
        render(<Badge variant="outline">Outline</Badge>);
        const badge = screen.getByText("Outline");
        expect(badge).toHaveClass("badge-outline");
        expect(badge).not.toHaveClass("badge-default");
    });

    it("applies the invisible variant", () => {
        render(<Badge variant="invisible">Invisible</Badge>);
        const badge = screen.getByText("Invisible");
        expect(badge).toHaveClass("badge-invisible");
        expect(badge).not.toHaveClass("badge-default");
    });

    it("applies the link variant", () => {
        render(<Badge variant="link">Link</Badge>);
        const badge = screen.getByText("Link");
        expect(badge).toHaveClass("badge-link");
        expect(badge).not.toHaveClass("badge-default");
    });

    it("keeps the link variant on the element it is drawn as", () => {
        render(
            <Badge as="a" href="https://github.com" variant="link">
                Link
            </Badge>,
        );
        const badge = screen.getByText("Link");
        expect(badge.tagName).toBe("A");
        expect(badge).toHaveClass("badge-link");
    });

    it("draws no dot for the filled appearance", () => {
        const { container } = render(<Badge>Default</Badge>);
        expect(container.querySelector(".badge-indicator")).toBeNull();
    });

    it("draws a dot for the dot appearance", () => {
        const { container } = render(<Badge appearance="dot">Healthy</Badge>);
        expect(container.querySelector(".badge-indicator")).toBeInTheDocument();
    });

    it("hides the dot from assistive technology", () => {
        const { container } = render(<Badge appearance="dot">Healthy</Badge>);
        expect(container.querySelector(".badge-indicator")).toHaveAttribute("aria-hidden", "true");
    });

    it("keeps the variant on the element for the dot appearance, so the dot is coloured by it", () => {
        render(
            <Badge variant="success" appearance="dot">
                Healthy
            </Badge>,
        );
        const badge = screen.getByText("Healthy");
        expect(badge).toHaveClass("badge-success");
        expect(badge).toHaveClass("badge-dot");
    });

    it("renders no leading visual unless it is given one", () => {
        render(<Badge>Default</Badge>);
        expect(leadingVisual()).not.toBeInTheDocument();
    });

    it("renders a leading visual given as a component", () => {
        render(<Badge leadingVisual={TagRegular}>Release</Badge>);
        expect(leadingVisual()).toBeInTheDocument();
    });

    it("renders a leading visual given as an element that is already built", () => {
        render(<Badge leadingVisual={<TagRegular data-testid="visual" />}>Release</Badge>);
        expect(screen.getByTestId("visual")).toBeInTheDocument();
    });

    it("stands the leading visual in place of the dot rather than beside it", () => {
        const { container } = render(
            <Badge appearance="dot" leadingVisual={TagRegular}>
                Release
            </Badge>,
        );
        expect(leadingVisual()).toBeInTheDocument();
        expect(container.querySelector(".badge-indicator")).toBeNull();
    });

    it("keeps the dot where the leading visual is explicitly nothing", () => {
        const { container } = render(
            <Badge appearance="dot" leadingVisual={null}>
                Release
            </Badge>,
        );
        expect(leadingVisual()).not.toBeInTheDocument();
        expect(container.querySelector(".badge-indicator")).toBeInTheDocument();
    });

    it("exposes the size through the data-size attribute", () => {
        render(<Badge size="large">Default</Badge>);
        expect(screen.getByText("Default")).toHaveAttribute("data-size", "large");
    });

    it("exposes the variant through the data-variant attribute", () => {
        render(<Badge variant="success">Success</Badge>);
        expect(screen.getByText("Success")).toHaveAttribute("data-variant", "success");
    });

    it("exposes the appearance through the data-appearance attribute", () => {
        render(<Badge appearance="dot">Healthy</Badge>);
        expect(screen.getByText("Healthy")).toHaveAttribute("data-appearance", "dot");
    });

    it("defaults the data attributes to the small filled default badge", () => {
        render(<Badge>Default</Badge>);
        const badge = screen.getByText("Default");
        expect(badge).toHaveAttribute("data-size", "small");
        expect(badge).toHaveAttribute("data-variant", "default");
        expect(badge).toHaveAttribute("data-appearance", "filled");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Badge>Default</Badge>);
        expect(screen.getByText("Default")).toHaveAttribute("data-component", "Badge");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(<Badge ref={ref}>Default</Badge>);
        expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<Badge className="custom">Default</Badge>);
        expect(screen.getByText("Default")).toHaveClass("custom");
    });
});
