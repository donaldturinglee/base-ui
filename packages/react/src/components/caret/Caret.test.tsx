import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Caret } from ".";
import type { CaretLocation } from "./Caret.types";

const caret = () => screen.getByTestId("caret");

const group = () => caret().querySelector("g");

const triangle = () => caret().querySelector(".caret-triangle");

const border = () => caret().querySelector(".caret-border");

describe("Caret", () => {
    it("renders an svg element", () => {
        render(<Caret data-testid="caret" />);
        expect(caret().tagName).toBe("svg");
    });

    it("stands on the bottom edge by default", () => {
        render(<Caret data-testid="caret" />);
        expect(caret()).toHaveAttribute("data-location", "bottom");
        expect(caret()).toHaveClass("caret-bottom");
    });

    it("applies the class for the location it is given", () => {
        const locations: CaretLocation[] = [
            "top",
            "bottom",
            "left",
            "right",
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
            "left-top",
            "left-bottom",
            "right-top",
            "right-bottom",
        ];

        for (const location of locations) {
            const { unmount } = render(<Caret location={location} data-testid="caret" />);
            expect(caret()).toHaveAttribute("data-location", location);
            expect(caret()).toHaveClass(`caret-${location}`);
            unmount();
        }
    });

    it("draws a box twice the size it is given", () => {
        render(<Caret size={12} data-testid="caret" />);
        expect(caret()).toHaveAttribute("width", "24");
        expect(caret()).toHaveAttribute("height", "24");
    });

    it("falls back to a size of eight", () => {
        render(<Caret data-testid="caret" />);
        expect(caret()).toHaveAttribute("width", "16");
        expect(caret()).toHaveAttribute("height", "16");
    });

    it("hands the size to the stylesheet as a custom property", () => {
        render(<Caret size={12} data-testid="caret" />);
        expect(caret()).toHaveStyle({ "--caret-size": "12px" });
    });

    it("draws the triangle from the size it is given", () => {
        render(<Caret data-testid="caret" />);
        expect(triangle()).toHaveAttribute("d", "M-8,0L0,8L8,0L-8,0Z");
    });

    it("outlines only the two sides that run to the point", () => {
        render(<Caret data-testid="caret" />);
        expect(border()).toHaveAttribute("d", "M-8,0L0,8L8,0");
    });

    it("turns the triangle to face away from the edge it stands on", () => {
        const transforms: Record<string, string> = {
            top: "translate(8,16) rotate(180)",
            right: "translate(0,8) rotate(-90)",
            bottom: "translate(8,0)",
            left: "translate(16,8) rotate(90)",
        };

        for (const [location, transform] of Object.entries(transforms)) {
            const { unmount } = render(
                <Caret location={location as CaretLocation} data-testid="caret" />,
            );
            expect(group()).toHaveAttribute("transform", transform);
            unmount();
        }
    });

    it("turns the triangle by the edge a location names rather than by the whole of it", () => {
        render(<Caret location="bottom-left" data-testid="caret" />);
        expect(group()).toHaveAttribute("transform", "translate(8,0)");
    });

    it("hands the colours it is painted with to the stylesheet as custom properties", () => {
        render(<Caret background="red" borderColor="blue" borderWidth={2} data-testid="caret" />);
        expect(caret()).toHaveStyle({
            "--caret-background": "red",
            "--caret-border-color": "blue",
            "--caret-border-width": "2",
        });
    });

    it("keeps a style passed in alongside the ones it draws itself with", () => {
        render(<Caret style={{ opacity: 0.5 }} data-testid="caret" />);
        expect(caret()).toHaveStyle({ opacity: "0.5", "--caret-size": "8px" });
    });

    it("is kept from a screen reader", () => {
        render(<Caret data-testid="caret" />);
        expect(caret()).toHaveAttribute("aria-hidden", "true");
        expect(caret()).toHaveAttribute("focusable", "false");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Caret data-testid="caret" />);
        expect(caret()).toHaveAttribute("data-component", "Caret");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<SVGSVGElement>();
        render(<Caret ref={ref} data-testid="caret" />);
        expect(ref.current).toBeInstanceOf(SVGSVGElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<Caret className="custom" data-testid="caret" />);
        expect(caret()).toHaveClass("custom");
    });
});
