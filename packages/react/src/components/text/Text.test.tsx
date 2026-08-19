import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import Text from "./Text";

describe("Text", () => {
    it("renders a span element by default", () => {
        render(<Text>Body text</Text>);
        expect(screen.getByText("Body text").tagName).toBe("SPAN");
    });

    it("renders the provided text content", () => {
        render(<Text>Body text</Text>);
        expect(screen.getByText("Body text")).toBeInTheDocument();
    });

    it("renders as the element passed to the as prop", () => {
        render(<Text as="p">Body text</Text>);
        expect(screen.getByText("Body text").tagName).toBe("P");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <Text as="label" htmlFor="name">
                Body text
            </Text>,
        );
        expect(screen.getByText("Body text")).toHaveAttribute("for", "name");
    });

    it("applies the medium size by default", () => {
        render(<Text>Body text</Text>);
        expect(screen.getByText("Body text")).toHaveClass("text-size-medium");
    });

    it("applies the requested size", () => {
        render(<Text size="small">Body text</Text>);
        expect(screen.getByText("Body text")).toHaveClass("text-size-small");
    });

    it("applies the default body weight when no weight is provided", () => {
        render(<Text>Body text</Text>);
        const text = screen.getByText("Body text");
        expect(text).toHaveClass("text");
        expect(text.className).not.toMatch(/\btext-weight-/);
    });

    it("replaces the default body weight when a weight is provided", () => {
        render(<Text weight="semibold">Body text</Text>);
        expect(screen.getByText("Body text")).toHaveClass("text-weight-semibold");
    });

    it("applies the requested white space handling", () => {
        render(<Text whiteSpace="pre-line">Body text</Text>);
        expect(screen.getByText("Body text")).toHaveClass("whitespace-pre-line");
    });

    it("exposes the size through the data-size attribute", () => {
        render(<Text size="large">Body text</Text>);
        expect(screen.getByText("Body text")).toHaveAttribute("data-size", "large");
    });

    it("exposes the weight through the data-weight attribute", () => {
        render(<Text weight="medium">Body text</Text>);
        expect(screen.getByText("Body text")).toHaveAttribute("data-weight", "medium");
    });

    it("exposes the white space through the data-white-space attribute", () => {
        render(<Text whiteSpace="nowrap">Body text</Text>);
        expect(screen.getByText("Body text")).toHaveAttribute("data-white-space", "nowrap");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Text>Body text</Text>);
        expect(screen.getByText("Body text")).toHaveAttribute("data-component", "Text");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(<Text ref={ref}>Body text</Text>);
        expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<Text className="custom">Body text</Text>);
        expect(screen.getByText("Body text")).toHaveClass("custom");
    });
});
