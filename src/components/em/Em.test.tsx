import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Em } from ".";
import type { EmSize, EmWeight } from "./Em.types";

const em = () => screen.getByText("Emphasised text");

describe("Em", () => {
    it("renders an em element by default", () => {
        render(<Em>Emphasised text</Em>);
        expect(em().tagName).toBe("EM");
    });

    it("renders the provided text content", () => {
        render(<Em>Emphasised text</Em>);
        expect(em()).toBeInTheDocument();
    });

    it("renders as the element passed to the as prop", () => {
        render(<Em as="i">Emphasised text</Em>);
        expect(em().tagName).toBe("I");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <Em as="time" dateTime="2026-08-03">
                Emphasised text
            </Em>,
        );
        expect(em()).toHaveAttribute("datetime", "2026-08-03");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Em>Emphasised text</Em>);
        expect(em()).toHaveAttribute("data-component", "Em");
    });

    it("carries the stress on the slope of the letters", () => {
        render(<Em>Emphasised text</Em>);
        expect(em()).toHaveClass("em");
    });

    it("keeps the slope when a size and a weight are asked for alongside it", () => {
        // The three classes answer three different things, so none of them displaces another
        // on the way through classNames
        render(
            <Em size="large" weight="semibold">
                Emphasised text
            </Em>,
        );
        expect(em()).toHaveClass("em", "em-size-large", "em-weight-semibold");
    });

    it("takes the size of the line it is read in when no size is provided", () => {
        render(<Em>Emphasised text</Em>);
        expect(em()).not.toHaveAttribute("data-size");
        expect(em().className).not.toMatch(/\bem-size-/);
    });

    it("respects the size prop", () => {
        const sizes = {
            large: "em-size-large",
            medium: "em-size-medium",
            small: "em-size-small",
        } as const;

        for (const [size, expected] of Object.entries(sizes)) {
            const { unmount } = render(<Em size={size as EmSize}>Emphasised text</Em>);
            expect(em()).toHaveAttribute("data-size", size);
            expect(em()).toHaveClass(expected);
            unmount();
        }
    });

    it("takes the weight of the line it is read in when no weight is provided", () => {
        render(<Em>Emphasised text</Em>);
        expect(em()).not.toHaveAttribute("data-weight");
        expect(em().className).not.toMatch(/\bem-weight-/);
    });

    it("respects the weight prop", () => {
        const weights = {
            light: "em-weight-light",
            normal: "em-weight-normal",
            medium: "em-weight-medium",
            semibold: "em-weight-semibold",
        } as const;

        for (const [weight, expected] of Object.entries(weights)) {
            const { unmount } = render(<Em weight={weight as EmWeight}>Emphasised text</Em>);
            expect(em()).toHaveAttribute("data-weight", weight);
            expect(em()).toHaveClass(expected);
            unmount();
        }
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLElement>();
        render(<Em ref={ref}>Emphasised text</Em>);
        expect(ref.current).toBe(em());
    });

    it("merges a custom className onto the root element", () => {
        render(<Em className="custom">Emphasised text</Em>);
        expect(em()).toHaveClass("custom");
    });

    it("passes extra props onto the root element", () => {
        render(<Em data-testid="em">Emphasised text</Em>);
        expect(screen.getByTestId("em")).toBe(em());
    });
});
