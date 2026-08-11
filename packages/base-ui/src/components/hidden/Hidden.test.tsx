import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import Hidden from "./Hidden";

describe("Hidden", () => {
    it("renders a div element by default", () => {
        render(
            <Hidden when="narrow" data-testid="hidden">
                Content
            </Hidden>,
        );
        expect(screen.getByTestId("hidden").tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(
            <Hidden as="span" when="narrow" data-testid="hidden">
                Content
            </Hidden>,
        );
        expect(screen.getByTestId("hidden").tagName).toBe("SPAN");
    });

    it("renders its children", () => {
        render(<Hidden when="narrow">Content</Hidden>);
        expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("hides the content below the medium breakpoint for the narrow viewport", () => {
        render(
            <Hidden when="narrow" data-testid="hidden">
                Content
            </Hidden>,
        );
        expect(screen.getByTestId("hidden")).toHaveClass("hidden-narrow");
    });

    it("hides the content between the medium and xxlarge breakpoints for the regular viewport", () => {
        render(
            <Hidden when="regular" data-testid="hidden">
                Content
            </Hidden>,
        );
        expect(screen.getByTestId("hidden")).toHaveClass("hidden-regular");
    });

    it("hides the content from the xxlarge breakpoint up for the wide viewport", () => {
        render(
            <Hidden when="wide" data-testid="hidden">
                Content
            </Hidden>,
        );
        expect(screen.getByTestId("hidden")).toHaveClass("hidden-wide");
    });

    it("hides the content at every viewport passed as an array", () => {
        render(
            <Hidden when={["narrow", "wide"]} data-testid="hidden">
                Content
            </Hidden>,
        );
        const hidden = screen.getByTestId("hidden");
        expect(hidden).toHaveClass("hidden-narrow", "hidden-wide");
        expect(hidden).not.toHaveClass("hidden-regular");
    });

    it("records the viewports in a data attribute", () => {
        render(
            <Hidden when={["narrow", "wide"]} data-testid="hidden">
                Content
            </Hidden>,
        );
        expect(screen.getByTestId("hidden")).toHaveAttribute("data-when", "narrow wide");
    });

    it("records a single viewport in the data attribute", () => {
        render(
            <Hidden when="regular" data-testid="hidden">
                Content
            </Hidden>,
        );
        expect(screen.getByTestId("hidden")).toHaveAttribute("data-when", "regular");
    });

    it("does not leak the when prop onto the element", () => {
        render(
            <Hidden when="narrow" data-testid="hidden">
                Content
            </Hidden>,
        );
        expect(screen.getByTestId("hidden")).not.toHaveAttribute("when");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <Hidden when="narrow" id="banner" data-testid="hidden">
                Content
            </Hidden>,
        );
        expect(screen.getByTestId("hidden")).toHaveAttribute("id", "banner");
    });

    it("tags the root element with a data-component attribute", () => {
        render(
            <Hidden when="narrow" data-testid="hidden">
                Content
            </Hidden>,
        );
        expect(screen.getByTestId("hidden")).toHaveAttribute("data-component", "Hidden");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Hidden ref={ref} when="narrow">
                Content
            </Hidden>,
        );
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("merges a custom className onto the root element", () => {
        render(
            <Hidden when="narrow" className="custom" data-testid="hidden">
                Content
            </Hidden>,
        );
        expect(screen.getByTestId("hidden")).toHaveClass("custom");
    });
});
