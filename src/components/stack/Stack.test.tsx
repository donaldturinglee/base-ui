import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Stack, StackItem } from ".";

describe("Stack", () => {
    it("renders a div element by default", () => {
        render(<Stack data-testid="stack" />);
        expect(screen.getByTestId("stack").tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(<Stack as="section" data-testid="stack" />);
        expect(screen.getByTestId("stack").tagName).toBe("SECTION");
    });

    it("renders its children", () => {
        render(
            <Stack>
                <span data-testid="children" />
            </Stack>,
        );
        expect(screen.getByTestId("children")).toBeInTheDocument();
    });

    it("lays its children out as a flex container", () => {
        render(<Stack data-testid="stack" />);
        expect(screen.getByTestId("stack")).toHaveClass("flex");
    });

    it("stacks vertically by default", () => {
        const stack = render(<Stack data-testid="stack" />).getByTestId("stack");
        expect(stack).toHaveAttribute("data-direction", "vertical");
        expect(stack).toHaveClass("flex-col");
    });

    it("stacks horizontally when the direction is horizontal", () => {
        render(<Stack direction="horizontal" data-testid="stack" />);
        const stack = screen.getByTestId("stack");
        expect(stack).toHaveAttribute("data-direction", "horizontal");
        expect(stack).toHaveClass("flex-row");
    });

    it("falls back to the normal gap when no gap is provided", () => {
        const stack = render(<Stack data-testid="stack" />).getByTestId("stack");
        expect(stack).not.toHaveAttribute("data-gap");
        expect(stack).toHaveClass("gap-[var(--stack-gap,var(--stack-gap-normal))]");
    });

    it("applies the gap scale as a custom property", () => {
        render(
            <>
                <Stack data-testid="none" gap="none" />
                <Stack data-testid="tight" gap="tight" />
                <Stack data-testid="condensed" gap="condensed" />
                <Stack data-testid="cozy" gap="cozy" />
                <Stack data-testid="normal" gap="normal" />
                <Stack data-testid="spacious" gap="spacious" />
            </>,
        );
        expect(screen.getByTestId("none")).toHaveClass("[--stack-gap:0]");
        expect(screen.getByTestId("tight")).toHaveClass("[--stack-gap:var(--base-size-4)]");
        expect(screen.getByTestId("condensed")).toHaveClass(
            "[--stack-gap:var(--stack-gap-condensed)]",
        );
        expect(screen.getByTestId("cozy")).toHaveClass("[--stack-gap:var(--base-size-12)]");
        expect(screen.getByTestId("normal")).toHaveClass("[--stack-gap:var(--stack-gap-normal)]");
        expect(screen.getByTestId("spacious")).toHaveClass(
            "[--stack-gap:var(--stack-gap-spacious)]",
        );
    });

    it("aligns items with stretch by default", () => {
        const stack = render(<Stack data-testid="stack" />).getByTestId("stack");
        expect(stack).toHaveAttribute("data-align", "stretch");
        expect(stack).toHaveClass("items-stretch");
    });

    it("applies the alignment passed to the align prop", () => {
        render(
            <>
                <Stack data-testid="start" align="start" />
                <Stack data-testid="center" align="center" />
                <Stack data-testid="end" align="end" />
                <Stack data-testid="baseline" align="baseline" />
            </>,
        );
        expect(screen.getByTestId("start")).toHaveClass("items-start");
        expect(screen.getByTestId("center")).toHaveClass("items-center");
        expect(screen.getByTestId("end")).toHaveClass("items-end");
        expect(screen.getByTestId("baseline")).toHaveClass("items-baseline");
    });

    it("justifies content from the start by default", () => {
        const stack = render(<Stack data-testid="stack" />).getByTestId("stack");
        expect(stack).toHaveAttribute("data-justify", "start");
        expect(stack).toHaveClass("justify-start");
    });

    it("applies the distribution passed to the justify prop", () => {
        render(
            <>
                <Stack data-testid="center" justify="center" />
                <Stack data-testid="end" justify="end" />
                <Stack data-testid="space-between" justify="space-between" />
                <Stack data-testid="space-evenly" justify="space-evenly" />
            </>,
        );
        expect(screen.getByTestId("center")).toHaveClass("justify-center");
        expect(screen.getByTestId("end")).toHaveClass("justify-end");
        expect(screen.getByTestId("space-between")).toHaveClass("justify-between");
        expect(screen.getByTestId("space-evenly")).toHaveClass("justify-evenly");
    });

    it("keeps items on a single line by default", () => {
        const stack = render(<Stack data-testid="stack" />).getByTestId("stack");
        expect(stack).toHaveAttribute("data-wrap", "nowrap");
        expect(stack).toHaveClass("flex-nowrap");
    });

    it("wraps items onto multiple lines when wrap is wrap", () => {
        render(<Stack wrap="wrap" data-testid="stack" />);
        expect(screen.getByTestId("stack")).toHaveClass("flex-wrap");
    });

    it("applies no padding by default", () => {
        const stack = render(<Stack data-testid="stack" />).getByTestId("stack");
        expect(stack).toHaveAttribute("data-padding", "none");
        expect(stack).toHaveClass("p-0");
    });

    it("applies the padding scale on both axes", () => {
        render(
            <>
                <Stack data-testid="tight" padding="tight" />
                <Stack data-testid="condensed" padding="condensed" />
                <Stack data-testid="cozy" padding="cozy" />
                <Stack data-testid="normal" padding="normal" />
                <Stack data-testid="spacious" padding="spacious" />
            </>,
        );
        expect(screen.getByTestId("tight")).toHaveClass("p-[var(--base-size-4)]");
        expect(screen.getByTestId("condensed")).toHaveClass("p-[var(--stack-padding-condensed)]");
        expect(screen.getByTestId("cozy")).toHaveClass("p-[var(--base-size-12)]");
        expect(screen.getByTestId("normal")).toHaveClass("p-[var(--stack-padding-normal)]");
        expect(screen.getByTestId("spacious")).toHaveClass("p-[var(--stack-padding-spacious)]");
    });

    it("applies the block padding to the block axis only", () => {
        render(<Stack paddingBlock="condensed" data-testid="stack" />);
        const stack = screen.getByTestId("stack");
        expect(stack).toHaveAttribute("data-padding-block", "condensed");
        expect(stack).toHaveClass("py-[var(--stack-padding-condensed)]");
    });

    it("applies the inline padding to the inline axis only", () => {
        render(<Stack paddingInline="spacious" data-testid="stack" />);
        const stack = screen.getByTestId("stack");
        expect(stack).toHaveAttribute("data-padding-inline", "spacious");
        expect(stack).toHaveClass("px-[var(--stack-padding-spacious)]");
    });

    it("keeps the single axis padding alongside the padding shorthand", () => {
        render(
            <Stack
                padding="normal"
                paddingBlock="condensed"
                paddingInline="spacious"
                data-testid="stack"
            />,
        );
        const stack = screen.getByTestId("stack");
        expect(stack).toHaveClass("p-[var(--stack-padding-normal)]");
        expect(stack).toHaveClass("py-[var(--stack-padding-condensed)]");
        expect(stack).toHaveClass("px-[var(--stack-padding-spacious)]");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(<Stack id="layout" data-testid="stack" />);
        expect(screen.getByTestId("stack")).toHaveAttribute("id", "layout");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Stack data-testid="stack" />);
        expect(screen.getByTestId("stack")).toHaveAttribute("data-component", "Stack");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Stack ref={ref} data-testid="stack" />);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<Stack className="custom" data-testid="stack" />);
        expect(screen.getByTestId("stack")).toHaveClass("custom");
    });

    it("exposes StackItem as Stack.Item", () => {
        expect(Stack.Item).toBe(StackItem);
    });
});

describe("StackItem", () => {
    it("renders a div element by default", () => {
        render(<StackItem data-testid="item" />);
        expect(screen.getByTestId("item").tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(<StackItem as="span" data-testid="item" />);
        expect(screen.getByTestId("item").tagName).toBe("SPAN");
    });

    it("renders its children", () => {
        render(
            <Stack>
                <StackItem data-testid="item">Content</StackItem>
            </Stack>,
        );
        expect(screen.getByTestId("item")).toHaveTextContent("Content");
    });

    it("keeps its own size by default", () => {
        const item = render(<StackItem data-testid="item" />).getByTestId("item");
        expect(item).toHaveClass("flex-initial");
        expect(item).not.toHaveAttribute("data-grow");
        expect(item).not.toHaveAttribute("data-shrink");
    });

    it("fills the available space when grow is true", () => {
        render(<StackItem grow data-testid="item" />);
        const item = screen.getByTestId("item");
        expect(item).toHaveAttribute("data-grow", "true");
        expect(item).toHaveClass("grow");
    });

    it("holds its size when grow is false", () => {
        render(<StackItem grow={false} data-testid="item" />);
        const item = screen.getByTestId("item");
        expect(item).toHaveAttribute("data-grow", "false");
        expect(item).toHaveClass("grow-0");
    });

    it("allows shrinking when shrink is true", () => {
        render(<StackItem shrink data-testid="item" />);
        const item = screen.getByTestId("item");
        expect(item).toHaveAttribute("data-shrink", "true");
        expect(item).toHaveClass("shrink");
    });

    it("holds its size when shrink is false", () => {
        render(<StackItem shrink={false} data-testid="item" />);
        const item = screen.getByTestId("item");
        expect(item).toHaveAttribute("data-shrink", "false");
        expect(item).toHaveClass("shrink-0");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(<StackItem id="sidebar" data-testid="item" />);
        expect(screen.getByTestId("item")).toHaveAttribute("id", "sidebar");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<StackItem data-testid="item" />);
        expect(screen.getByTestId("item")).toHaveAttribute("data-component", "StackItem");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<StackItem ref={ref} data-testid="item" />);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<StackItem className="custom" data-testid="item" />);
        expect(screen.getByTestId("item")).toHaveClass("custom");
    });
});
