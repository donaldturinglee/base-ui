import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Box } from ".";

const box = () => screen.getByTestId("box");

describe("Box", () => {
    it("renders a div element by default", () => {
        render(<Box data-testid="box" />);
        expect(box().tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(<Box as="section" data-testid="box" />);
        expect(box().tagName).toBe("SECTION");
    });

    it("renders its children", () => {
        render(
            <Box data-testid="box">
                <span data-testid="children" />
            </Box>,
        );
        expect(screen.getByTestId("children")).toBeInTheDocument();
    });

    it("holds anything that overflows to the room the box was given", () => {
        render(<Box data-testid="box" />);
        expect(box()).toHaveClass("box");
    });

    it("applies no padding by default", () => {
        render(<Box data-testid="box" />);
        expect(box()).toHaveAttribute("data-padding", "none");
        expect(box()).toHaveClass("box-padding-none");
    });

    it("applies the padding scale on both axes", () => {
        render(
            <>
                <Box data-testid="tight" padding="tight" />
                <Box data-testid="condensed" padding="condensed" />
                <Box data-testid="cozy" padding="cozy" />
                <Box data-testid="normal" padding="normal" />
                <Box data-testid="spacious" padding="spacious" />
            </>,
        );
        expect(screen.getByTestId("tight")).toHaveClass("box-padding-tight");
        expect(screen.getByTestId("condensed")).toHaveClass("box-padding-condensed");
        expect(screen.getByTestId("cozy")).toHaveClass("box-padding-cozy");
        expect(screen.getByTestId("normal")).toHaveClass("box-padding-normal");
        expect(screen.getByTestId("spacious")).toHaveClass("box-padding-spacious");
    });

    it("applies the block padding to the block axis only", () => {
        render(<Box paddingBlock="condensed" data-testid="box" />);
        expect(box()).toHaveAttribute("data-padding-block", "condensed");
        expect(box()).toHaveClass("box-padding-block-condensed");
    });

    it("applies the inline padding to the inline axis only", () => {
        render(<Box paddingInline="spacious" data-testid="box" />);
        expect(box()).toHaveAttribute("data-padding-inline", "spacious");
        expect(box()).toHaveClass("box-padding-inline-spacious");
    });

    it("keeps the single axis padding alongside the padding shorthand", () => {
        render(
            <Box
                padding="normal"
                paddingBlock="condensed"
                paddingInline="spacious"
                data-testid="box"
            />,
        );
        expect(box()).toHaveClass("box-padding-normal");
        expect(box()).toHaveClass("box-padding-block-condensed");
        expect(box()).toHaveClass("box-padding-inline-spacious");
    });

    it("draws no fill by default", () => {
        render(<Box data-testid="box" />);
        expect(box()).toHaveAttribute("data-background", "none");
        expect(box()).toHaveClass("box-background-none");
    });

    it("applies the fill passed to the background prop", () => {
        render(
            <>
                <Box data-testid="default" background="default" />
                <Box data-testid="muted" background="muted" />
                <Box data-testid="inset" background="inset" />
                <Box data-testid="emphasis" background="emphasis" />
            </>,
        );
        expect(screen.getByTestId("default")).toHaveClass("box-background-default");
        expect(screen.getByTestId("muted")).toHaveClass("box-background-muted");
        expect(screen.getByTestId("inset")).toHaveClass("box-background-inset");
        expect(screen.getByTestId("emphasis")).toHaveClass("box-background-emphasis");
    });

    it("draws no border by default", () => {
        render(<Box data-testid="box" />);
        expect(box()).toHaveAttribute("data-border", "none");
        expect(box()).toHaveClass("box-border-none");
    });

    it("applies the line passed to the border prop", () => {
        render(
            <>
                <Box data-testid="default" border="default" />
                <Box data-testid="muted" border="muted" />
            </>,
        );
        expect(screen.getByTestId("default")).toHaveClass("box-border-default");
        expect(screen.getByTestId("muted")).toHaveClass("box-border-muted");
    });

    it("leaves its corners square by default", () => {
        render(<Box data-testid="box" />);
        expect(box()).toHaveAttribute("data-radius", "none");
        expect(box()).toHaveClass("box-radius-none");
    });

    it("applies the radius scale", () => {
        render(
            <>
                <Box data-testid="small" radius="small" />
                <Box data-testid="medium" radius="medium" />
                <Box data-testid="large" radius="large" />
                <Box data-testid="full" radius="full" />
            </>,
        );
        expect(screen.getByTestId("small")).toHaveClass("box-radius-small");
        expect(screen.getByTestId("medium")).toHaveClass("box-radius-medium");
        expect(screen.getByTestId("large")).toHaveClass("box-radius-large");
        expect(screen.getByTestId("full")).toHaveClass("box-radius-full");
    });

    it("sits flat on the page by default", () => {
        render(<Box data-testid="box" />);
        expect(box()).toHaveAttribute("data-shadow", "none");
        expect(box()).toHaveClass("box-shadow-none");
    });

    it("applies the resting shadow scale", () => {
        render(
            <>
                <Box data-testid="xsmall" shadow="xsmall" />
                <Box data-testid="small" shadow="small" />
                <Box data-testid="medium" shadow="medium" />
            </>,
        );
        expect(screen.getByTestId("xsmall")).toHaveClass("box-shadow-xsmall");
        expect(screen.getByTestId("small")).toHaveClass("box-shadow-small");
        expect(screen.getByTestId("medium")).toHaveClass("box-shadow-medium");
    });

    it("lets what is inside spill past its edges by default", () => {
        render(<Box data-testid="box" />);
        expect(box()).toHaveAttribute("data-overflow", "visible");
        expect(box()).toHaveClass("box-overflow-visible");
    });

    it("crops what is inside to its corners when the overflow is hidden", () => {
        render(<Box overflow="hidden" data-testid="box" />);
        expect(box()).toHaveAttribute("data-overflow", "hidden");
        expect(box()).toHaveClass("box-overflow-hidden");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(<Box id="surface" data-testid="box" />);
        expect(box()).toHaveAttribute("id", "surface");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Box data-testid="box" />);
        expect(box()).toHaveAttribute("data-component", "Box");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Box ref={ref} data-testid="box" />);
        expect(ref.current).toBe(box());
    });

    it("merges a custom className onto the root element", () => {
        render(<Box className="custom" data-testid="box" />);
        expect(box()).toHaveClass("custom");
    });
});
