import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { LocaleProvider } from "../../providers/locale";
import { FormatByte } from ".";

const reading = () => screen.getByTestId("size");

describe("FormatByte", () => {
    it("renders a span element by default", () => {
        render(<FormatByte value={1500} data-testid="size" />);
        expect(reading().tagName).toBe("SPAN");
    });

    it("renders as the element passed to the as prop", () => {
        render(<FormatByte as="div" value={1500} data-testid="size" />);
        expect(reading().tagName).toBe("DIV");
    });

    it("writes a size the way it would be read aloud", () => {
        render(<FormatByte value={1500} data-testid="size" />);
        expect(reading()).toHaveTextContent("1.5 kB");
    });

    it("carries the name of the component it rendered", () => {
        render(<FormatByte value={1500} data-testid="size" />);
        expect(reading()).toHaveAttribute("data-component", "FormatByte");
    });

    it("passes the rest of its props down", () => {
        render(<FormatByte value={1500} className="size" title="A size" data-testid="size" />);

        expect(reading()).toHaveClass("size");
        expect(reading()).toHaveAttribute("title", "A size");
    });

    it("forwards a ref to the element it rendered", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(<FormatByte ref={ref} value={1500} data-testid="size" />);

        expect(ref.current).toBe(reading());
    });

    describe("the locale", () => {
        it("writes the size the way the provider above it reads", () => {
            render(
                <LocaleProvider locale="de-DE">
                    <FormatByte value={1500} data-testid="size" />
                </LocaleProvider>,
            );

            expect(reading()).toHaveTextContent("1,5 kB");
        });

        it("takes a locale of its own over the one it is read under", () => {
            render(
                <LocaleProvider locale="de-DE">
                    <FormatByte locale="en-US" value={1500} data-testid="size" />
                </LocaleProvider>,
            );

            expect(reading()).toHaveTextContent("1.5 kB");
        });

        it("falls back to en-US outside a provider", () => {
            render(<FormatByte value={1500} data-testid="size" />);
            expect(reading()).toHaveTextContent("1.5 kB");
        });
    });

    describe("the format", () => {
        it("counts in 1024s when asked to", () => {
            render(
                <FormatByte value={1024} format={{ unitSystem: "binary" }} data-testid="size" />,
            );

            expect(reading()).toHaveTextContent("1 kB");
        });

        it("counts in bits when asked to", () => {
            render(<FormatByte value={1500} format={{ unit: "bit" }} data-testid="size" />);
            expect(reading()).toHaveTextContent("1.5 kb");
        });

        it("spells the unit out at length when asked to", () => {
            render(<FormatByte value={1500} format={{ unitDisplay: "long" }} data-testid="size" />);

            expect(reading()).toHaveTextContent("1.5 kilobytes");
        });

        it("holds the reading to the digits it was given", () => {
            render(<FormatByte value={1500} format={{ precision: 2 }} data-testid="size" />);
            expect(reading()).toHaveTextContent("1.5 kB");
        });

        it("steps up a prefix at a time as the size grows", () => {
            const { rerender } = render(<FormatByte value={1500} data-testid="size" />);
            expect(reading()).toHaveTextContent("1.5 kB");

            rerender(<FormatByte value={1.5e6} data-testid="size" />);
            expect(reading()).toHaveTextContent("1.5 MB");

            rerender(<FormatByte value={1.5e9} data-testid="size" />);
            expect(reading()).toHaveTextContent("1.5 GB");
        });

        it("reads nothing as nothing", () => {
            render(<FormatByte value={0} data-testid="size" />);
            expect(reading()).toHaveTextContent("0 B");
        });
    });

    describe("children", () => {
        it("stands in for the reading where one was handed over already written", () => {
            render(
                <FormatByte value={1500} data-testid="size">
                    1,5 kB
                </FormatByte>,
            );

            expect(reading()).toHaveTextContent("1,5 kB");
        });
    });
});
