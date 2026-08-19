import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import Label from "./Label";

describe("Label", () => {
    it("renders a span element by default", () => {
        render(<Label>Default</Label>);
        expect(screen.getByText("Default").tagName).toBe("SPAN");
    });

    it("renders the provided text content", () => {
        render(<Label>Default</Label>);
        expect(screen.getByText("Default")).toBeInTheDocument();
    });

    it("renders as the element passed to the as prop", () => {
        render(<Label as="div">Default</Label>);
        expect(screen.getByText("Default").tagName).toBe("DIV");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <Label as="a" href="https://github.com">
                Default
            </Label>,
        );
        expect(screen.getByText("Default")).toHaveAttribute("href", "https://github.com");
    });

    it("applies the small size by default", () => {
        render(<Label>Default</Label>);
        expect(screen.getByText("Default")).toHaveClass("label-small");
    });

    it("applies the requested size", () => {
        render(<Label size="large">Default</Label>);
        expect(screen.getByText("Default")).toHaveClass("label-large");
    });

    it("applies the medium size", () => {
        render(<Label size="medium">Default</Label>);
        const label = screen.getByText("Default");
        expect(label).toHaveClass("label-medium");
        expect(label).toHaveAttribute("data-size", "medium");
    });

    it("applies the default variant when no variant is provided", () => {
        render(<Label>Default</Label>);
        const label = screen.getByText("Default");
        expect(label).toHaveClass("label");
        expect(label).toHaveClass("label-default");
    });

    it("applies the requested variant", () => {
        render(<Label variant="danger">Danger</Label>);
        expect(screen.getByText("Danger")).toHaveClass("label-danger");
    });

    it("replaces the default foreground color when a colored variant is provided", () => {
        render(<Label variant="accent">Accent</Label>);
        const label = screen.getByText("Accent");
        expect(label).toHaveClass("label-accent");
        expect(label).not.toHaveClass("label-default");
    });

    it("keeps the default foreground color for the primary variant", () => {
        render(<Label variant="primary">Primary</Label>);
        expect(screen.getByText("Primary")).toHaveClass("label-primary");
    });

    it("exposes the size through the data-size attribute", () => {
        render(<Label size="large">Default</Label>);
        expect(screen.getByText("Default")).toHaveAttribute("data-size", "large");
    });

    it("exposes the variant through the data-variant attribute", () => {
        render(<Label variant="success">Success</Label>);
        expect(screen.getByText("Success")).toHaveAttribute("data-variant", "success");
    });

    it("defaults the data attributes to the small default label", () => {
        render(<Label>Default</Label>);
        const label = screen.getByText("Default");
        expect(label).toHaveAttribute("data-size", "small");
        expect(label).toHaveAttribute("data-variant", "default");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Label>Default</Label>);
        expect(screen.getByText("Default")).toHaveAttribute("data-component", "Label");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(<Label ref={ref}>Default</Label>);
        expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<Label className="custom">Default</Label>);
        expect(screen.getByText("Default")).toHaveClass("custom");
    });
});
