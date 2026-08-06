import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Meter } from ".";
import type { MeterProps } from "./Meter.types";

const meter = (props: Partial<MeterProps> = {}) => (
    <Meter value={72} {...props}>
        <Meter.Label>Storage used</Meter.Label>
        <Meter.Value />
    </Meter>
);

const root = () => screen.getByRole("meter");

const label = () => document.querySelector('[data-component="Meter.Label"]');

const value = () => document.querySelector('[data-component="Meter.Value"]');

const track = () => document.querySelector('[data-component="Meter.Track"]');

const indicator = () => document.querySelector('[data-component="Meter.Indicator"]') as HTMLElement;

describe("Meter", () => {
    it("renders a plain box by default", () => {
        render(meter());
        expect(root().tagName).toBe("DIV");
    });

    it("renders as whatever it is told to", () => {
        render(
            <Meter as="section" value={72}>
                <Meter.Label>Storage used</Meter.Label>
            </Meter>,
        );
        expect(root().tagName).toBe("SECTION");
    });

    it("reads as a meter rather than as a progress bar", () => {
        render(meter());
        expect(root()).toHaveAttribute("role", "meter");
    });

    it("tags the meter and its parts with data-component attributes", () => {
        render(meter());

        for (const name of [
            "Meter",
            "Meter.Label",
            "Meter.Value",
            "Meter.Track",
            "Meter.Indicator",
        ]) {
            expect(document.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    describe("the reading", () => {
        it("says where it stands and what it was measured between", () => {
            render(meter({ value: 72 }));

            expect(root()).toHaveAttribute("aria-valuenow", "72");
            expect(root()).toHaveAttribute("aria-valuemin", "0");
            expect(root()).toHaveAttribute("aria-valuemax", "100");
        });

        it("takes the ends it is measured between from the caller", () => {
            render(meter({ value: 340, min: 0, max: 512 }));

            expect(root()).toHaveAttribute("aria-valuenow", "340");
            expect(root()).toHaveAttribute("aria-valuemax", "512");
        });

        it("brings a reading past either end back to the end it ran past", () => {
            const { rerender } = render(meter({ value: 140 }));
            expect(root()).toHaveAttribute("aria-valuenow", "100");

            rerender(meter({ value: -20 }));
            expect(root()).toHaveAttribute("aria-valuenow", "0");
        });

        it("reads a value that is no number at all as standing at the start", () => {
            render(meter({ value: Number.NaN, min: 10, max: 50 }));
            expect(root()).toHaveAttribute("aria-valuenow", "10");
        });

        it("hands the stylesheet how far along it stands", () => {
            render(meter({ value: 25 }));
            expect(root().style.getPropertyValue("--meter-percentage")).toBe("25%");
        });

        it("works out how far along it stands within the ends it was given", () => {
            render(meter({ value: 30, min: 20, max: 40 }));
            expect(root().style.getPropertyValue("--meter-percentage")).toBe("50%");
        });

        it("stands at the start where the two ends are the same", () => {
            render(meter({ value: 5, min: 5, max: 5 }));
            expect(root().style.getPropertyValue("--meter-percentage")).toBe("0%");
        });

        it("keeps a style of the caller's own", () => {
            render(meter({ style: { marginTop: "4px" } }));
            expect(root()).toHaveStyle({ marginTop: "4px" });
        });
    });

    describe("what it is written as", () => {
        it("writes how far along it stands where it was given no shape", () => {
            render(meter({ value: 72 }));

            expect(root()).toHaveAttribute("aria-valuetext", "72%");
            expect(value()).toHaveTextContent("72%");
        });

        it("writes how far along it stands within the ends it was given", () => {
            render(meter({ value: 256, min: 0, max: 512 }));
            expect(value()).toHaveTextContent("50%");
        });

        it("writes the reading itself where it was given a shape", () => {
            render(
                meter({
                    value: 340,
                    min: 0,
                    max: 512,
                    format: { style: "unit", unit: "megabyte" },
                }),
            );

            expect(root()).toHaveAttribute("aria-valuetext", "340 MB");
            expect(value()).toHaveTextContent("340 MB");
        });

        it("takes words of the caller's own for what a screen reader hears", () => {
            render(
                meter({
                    value: 72,
                    getAriaValueText: (formatted, raw) => `${formatted} of the quota (${raw})`,
                }),
            );

            expect(root()).toHaveAttribute("aria-valuetext", "72% of the quota (72)");
            // What the eye reads is left as it was, since only what is heard was renamed
            expect(value()).toHaveTextContent("72%");
        });

        it("keeps the written reading out of the way of a screen reader", () => {
            render(meter());
            expect(value()).toHaveAttribute("aria-hidden", "true");
        });

        it("hands the reading to a caller who would rather write it themselves", () => {
            render(
                <Meter value={340} min={0} max={512}>
                    <Meter.Value>
                        {({ formattedValue, value: raw }) => `${raw} MB, or ${formattedValue}`}
                    </Meter.Value>
                </Meter>,
            );

            expect(value()).toHaveTextContent("340 MB, or 66%");
        });

        it("lets a caller write something of their own in its place", () => {
            render(
                <Meter value={72}>
                    <Meter.Value>Nearly full</Meter.Value>
                </Meter>,
            );

            expect(value()).toHaveTextContent("Nearly full");
        });
    });

    describe("the name", () => {
        it("names the meter after the line naming what it measures", () => {
            render(meter());

            expect(root()).toHaveAttribute("aria-labelledby", label()?.getAttribute("id"));
            expect(root()).toHaveAccessibleName("Storage used");
        });

        it("leaves a meter that was named by the caller alone", () => {
            render(
                <Meter value={72} aria-label="Storage">
                    <Meter.Label>Storage used</Meter.Label>
                </Meter>,
            );

            expect(root()).not.toHaveAttribute("aria-labelledby");
            expect(root()).toHaveAccessibleName("Storage");
        });

        it("points at a line of the caller's own where they gave one", () => {
            render(
                <>
                    <span id="elsewhere">Storage</span>
                    <Meter value={72} aria-labelledby="elsewhere">
                        <Meter.Label>Storage used</Meter.Label>
                    </Meter>
                </>,
            );

            expect(root()).toHaveAttribute("aria-labelledby", "elsewhere");
        });

        it("lets the line naming it carry an id of its own", () => {
            render(
                <Meter value={72}>
                    <Meter.Label id="storage-name">Storage used</Meter.Label>
                </Meter>,
            );

            expect(label()).toHaveAttribute("id", "storage-name");
        });

        it("names nothing where there is no line to name it after", () => {
            render(<Meter value={72} />);
            expect(root()).not.toHaveAttribute("aria-labelledby");
        });
    });

    describe("the groove", () => {
        it("draws one for a meter that was given none", () => {
            render(<Meter value={72} aria-label="Storage" />);

            expect(track()).not.toBeNull();
            expect(track()).toContainElement(indicator());
        });

        it("leaves a meter that laid out its own alone", () => {
            render(
                <Meter value={72} aria-label="Storage">
                    <Meter.Track className="mine">
                        <Meter.Indicator />
                    </Meter.Track>
                </Meter>,
            );

            expect(document.querySelectorAll('[data-component="Meter.Track"]')).toHaveLength(1);
            expect(track()).toHaveClass("mine");
        });

        it("renders the track and the indicator as whatever they are told to", () => {
            render(
                <Meter value={72} aria-label="Storage">
                    <Meter.Track as="div">
                        <Meter.Indicator as="div" />
                    </Meter.Track>
                </Meter>,
            );

            expect(track()?.tagName).toBe("DIV");
            expect(indicator().tagName).toBe("DIV");
        });
    });

    it("keeps whatever else it was given, in the order it was written", () => {
        render(
            <Meter value={72} aria-label="Storage">
                <Meter.Label>Storage used</Meter.Label>
                <span data-testid="extra">36 GB of 50 GB</span>
            </Meter>,
        );

        expect(screen.getByTestId("extra")).toBeInTheDocument();
    });

    it("says how it is drawn, so a caller can style from it", () => {
        render(meter({ size: "large", variant: "danger" }));

        expect(root()).toHaveAttribute("data-size", "large");
        expect(root()).toHaveAttribute("data-variant", "danger");
        expect(root()).toHaveAttribute("data-value", "72");
        expect(root()).toHaveClass("meter-large", "meter-danger");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Meter ref={ref} value={72} aria-label="Storage">
                <Meter.Label>Storage used</Meter.Label>
            </Meter>,
        );
        expect(ref.current).toBe(root());
    });

    it("forwards a ref to each part", () => {
        const labelRef = React.createRef<HTMLSpanElement>();
        const valueRef = React.createRef<HTMLSpanElement>();
        const trackRef = React.createRef<HTMLSpanElement>();
        const indicatorRef = React.createRef<HTMLSpanElement>();

        render(
            <Meter value={72} aria-label="Storage">
                <Meter.Label ref={labelRef}>Storage used</Meter.Label>
                <Meter.Value ref={valueRef} />
                <Meter.Track ref={trackRef}>
                    <Meter.Indicator ref={indicatorRef} />
                </Meter.Track>
            </Meter>,
        );

        expect(labelRef.current).toBe(label());
        expect(valueRef.current).toBe(value());
        expect(trackRef.current).toBe(track());
        expect(indicatorRef.current).toBe(indicator());
    });

    it("merges a custom className onto each part", () => {
        render(
            <Meter className="root" value={72} aria-label="Storage">
                <Meter.Label className="name">Storage used</Meter.Label>
                <Meter.Value className="reading" />
                <Meter.Track className="groove">
                    <Meter.Indicator className="fill" />
                </Meter.Track>
            </Meter>,
        );

        expect(root()).toHaveClass("root");
        expect(label()).toHaveClass("name");
        expect(value()).toHaveClass("reading");
        expect(track()).toHaveClass("groove");
        expect(indicator()).toHaveClass("fill");
    });
});
