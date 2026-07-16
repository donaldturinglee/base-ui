import * as React from "react";
import { render, screen } from "@testing-library/react";
import Heading from "./Heading";

describe("Heading", () => {
    it("renders an h2 element by default", () => {
        render(<Heading>Content heading</Heading>);
        expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });

    it("renders the provided text content", () => {
        render(<Heading>Content heading</Heading>);
        expect(screen.getByText("Content heading")).toBeInTheDocument();
    });

    it("renders as the element passed to the as prop", () => {
        render(<Heading as="h1">Content heading</Heading>);
        expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("applies the large size by default", () => {
        render(<Heading>Content heading</Heading>);
        expect(screen.getByRole("heading")).toHaveClass("[font:var(--text-title-shorthand-large)]");
    });

    it("applies the requested size", () => {
        render(<Heading size="small">Content heading</Heading>);
        expect(screen.getByRole("heading")).toHaveClass("[font:var(--text-title-shorthand-small)]");
    });

    it("exposes the size through the data-size attribute", () => {
        render(<Heading size="medium">Content heading</Heading>);
        expect(screen.getByRole("heading")).toHaveAttribute("data-size", "medium");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Heading>Content heading</Heading>);
        expect(screen.getByRole("heading")).toHaveAttribute("data-component", "Heading");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLHeadingElement>();
        render(<Heading ref={ref}>Content heading</Heading>);
        expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<Heading className="custom">Content heading</Heading>);
        expect(screen.getByRole("heading")).toHaveClass("custom");
    });
});
