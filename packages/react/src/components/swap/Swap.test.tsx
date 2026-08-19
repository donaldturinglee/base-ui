import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Swap } from ".";
import type { SwapProps } from "./Swap.types";

const swap = (props: Partial<SwapProps> = {}) => (
    <Swap {...props}>
        <Swap.Indicator type="on">On</Swap.Indicator>
        <Swap.Indicator type="off">Off</Swap.Indicator>
    </Swap>
);

const root = () => document.querySelector('[data-component="Swap"]') as HTMLElement;

const indicators = () => Array.from(document.querySelectorAll('[data-component="Swap.Indicator"]'));

const indicator = (type: "on" | "off") =>
    document.querySelector(`[data-component="Swap.Indicator"][data-type="${type}"]`) as HTMLElement;

describe("Swap", () => {
    it("renders a span by default", () => {
        render(swap());
        expect(root().tagName).toBe("SPAN");
    });

    it("renders as whatever it is told to", () => {
        render(
            <Swap as="div">
                <Swap.Indicator type="on">On</Swap.Indicator>
                <Swap.Indicator type="off">Off</Swap.Indicator>
            </Swap>,
        );
        expect(root().tagName).toBe("DIV");
    });

    it("tags the swap and its indicators with data-component attributes", () => {
        render(swap());

        for (const name of ["Swap", "Swap.Indicator"]) {
            expect(document.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("shows the off indicator until it is swapped", () => {
        render(swap());

        expect(root()).toHaveAttribute("data-swap", "off");
        expect(indicator("off")).toHaveAttribute("data-active", "true");
        expect(indicator("on")).toHaveAttribute("data-active", "false");
    });

    it("shows the on indicator once it is swapped", () => {
        render(swap({ swap: true }));

        expect(root()).toHaveAttribute("data-swap", "on");
        expect(indicator("on")).toHaveAttribute("data-active", "true");
        expect(indicator("off")).toHaveAttribute("data-active", "false");
    });

    it("follows the caller, who holds which of the two is shown", () => {
        const { rerender } = render(swap({ swap: false }));
        expect(indicator("off")).toHaveClass("swap-indicator-active");

        rerender(swap({ swap: true }));
        expect(indicator("on")).toHaveClass("swap-indicator-active");
        expect(indicator("off")).not.toHaveClass("swap-indicator-active");
    });

    it("keeps both indicators on the page, so nothing beside it moves", () => {
        render(swap());
        expect(indicators()).toHaveLength(2);
    });

    it("keeps the indicator standing back from a screen reader", () => {
        render(swap());

        expect(indicator("off")).not.toHaveAttribute("aria-hidden");
        expect(indicator("on")).toHaveAttribute("aria-hidden", "true");
    });

    it("says only what is being shown, though both are on the page", () => {
        render(swap({ swap: true }));

        expect(screen.getByText("On")).not.toHaveAttribute("aria-hidden");
        expect(screen.getByText("Off")).toHaveAttribute("aria-hidden", "true");
    });

    describe("transition", () => {
        it("fades when it is told nothing else", () => {
            render(swap());

            expect(root()).toHaveAttribute("data-transition", "fade");
            expect(root()).toHaveClass("swap-fade");
        });

        it("carries whichever it was given", () => {
            for (const transition of ["flip", "rotate", "scale", "none"] as const) {
                const { unmount } = render(swap({ transition }));

                expect(root()).toHaveAttribute("data-transition", transition);
                expect(root()).toHaveClass(`swap-${transition}`);

                unmount();
            }
        });
    });

    describe("an indicator on its own", () => {
        it("falls back to the swap being off", () => {
            render(<Swap.Indicator type="off">Off</Swap.Indicator>);
            expect(indicator("off")).toHaveAttribute("data-active", "true");
        });

        it("renders as whatever it is told to", () => {
            render(
                <Swap>
                    <Swap.Indicator as="strong" type="off">
                        Off
                    </Swap.Indicator>
                </Swap>,
            );
            expect(indicator("off").tagName).toBe("STRONG");
        });
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(
            <Swap ref={ref}>
                <Swap.Indicator type="on">On</Swap.Indicator>
                <Swap.Indicator type="off">Off</Swap.Indicator>
            </Swap>,
        );
        expect(ref.current).toBe(root());
    });

    it("forwards a ref to an indicator", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(
            <Swap>
                <Swap.Indicator ref={ref} type="on">
                    On
                </Swap.Indicator>
                <Swap.Indicator type="off">Off</Swap.Indicator>
            </Swap>,
        );
        expect(ref.current).toBe(indicator("on"));
    });

    it("merges a custom className onto each part", () => {
        render(
            <Swap className="root">
                <Swap.Indicator className="on" type="on">
                    On
                </Swap.Indicator>
                <Swap.Indicator className="off" type="off">
                    Off
                </Swap.Indicator>
            </Swap>,
        );

        expect(root()).toHaveClass("root");
        expect(indicator("on")).toHaveClass("on");
        expect(indicator("off")).toHaveClass("off");
    });
});
