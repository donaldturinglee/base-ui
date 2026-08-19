import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { LocaleProvider } from "../../providers/locale";
import { FormatNumber } from ".";

const reading = () => screen.getByTestId("number");

describe("FormatNumber", () => {
    it("renders a span element by default", () => {
        render(<FormatNumber value={1234.5} data-testid="number" />);
        expect(reading().tagName).toBe("SPAN");
    });

    it("renders as the element passed to the as prop", () => {
        render(<FormatNumber as="div" value={1234.5} data-testid="number" />);
        expect(reading().tagName).toBe("DIV");
    });

    it("writes the number out", () => {
        render(<FormatNumber value={1234.5} data-testid="number" />);
        expect(reading()).toHaveTextContent("1,234.5");
    });

    it("carries the name of the component it rendered", () => {
        render(<FormatNumber value={1} data-testid="number" />);
        expect(reading()).toHaveAttribute("data-component", "FormatNumber");
    });

    it("passes the rest of its props down", () => {
        render(<FormatNumber value={1} className="figure" title="A figure" data-testid="number" />);

        expect(reading()).toHaveClass("figure");
        expect(reading()).toHaveAttribute("title", "A figure");
    });

    it("forwards a ref to the element it rendered", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(<FormatNumber ref={ref} value={1} data-testid="number" />);

        expect(ref.current).toBe(reading());
    });

    describe("the locale", () => {
        it("groups and separates the way the provider above it reads", () => {
            render(
                <LocaleProvider locale="de-DE">
                    <FormatNumber value={1234.5} data-testid="number" />
                </LocaleProvider>,
            );

            expect(reading()).toHaveTextContent("1.234,5");
        });

        it("takes a locale of its own over the one it is read under", () => {
            render(
                <LocaleProvider locale="de-DE">
                    <FormatNumber locale="en-US" value={1234.5} data-testid="number" />
                </LocaleProvider>,
            );

            expect(reading()).toHaveTextContent("1,234.5");
        });

        it("falls back to en-US outside a provider", () => {
            render(<FormatNumber value={1234.5} data-testid="number" />);
            expect(reading()).toHaveTextContent("1,234.5");
        });
    });

    describe("the format", () => {
        it("writes a figure as money, where the locale places the sign", () => {
            const { rerender } = render(
                <LocaleProvider locale="en-US">
                    <FormatNumber
                        value={1234.5}
                        format={{ style: "currency", currency: "USD" }}
                        data-testid="number"
                    />
                </LocaleProvider>,
            );
            expect(reading()).toHaveTextContent("$1,234.50");

            rerender(
                <LocaleProvider locale="de-DE">
                    <FormatNumber
                        value={1234.5}
                        format={{ style: "currency", currency: "EUR" }}
                        data-testid="number"
                    />
                </LocaleProvider>,
            );
            expect(reading()).toHaveTextContent("1.234,50 €");
        });

        it("writes a figure as a share of a hundred", () => {
            render(
                <FormatNumber value={0.256} format={{ style: "percent" }} data-testid="number" />,
            );

            expect(reading()).toHaveTextContent("26%");
        });

        it("writes a figure with a unit beside it", () => {
            render(
                <FormatNumber
                    value={72}
                    format={{ style: "unit", unit: "kilometer-per-hour" }}
                    data-testid="number"
                />,
            );

            expect(reading()).toHaveTextContent("72 km/h");
        });

        it("holds a figure to the places it was given", () => {
            render(
                <FormatNumber
                    value={1.005}
                    format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                    data-testid="number"
                />,
            );

            expect(reading()).toHaveTextContent("1.01");
        });

        // `style` names the shape a number is written in to Intl and a set of CSS declarations to
        // the element, so the two are kept apart rather than sharing one prop
        it("leaves the element's own style alone", () => {
            render(
                <FormatNumber
                    value={1234.5}
                    format={{ style: "percent" }}
                    style={{ color: "rgb(255, 0, 0)" }}
                    data-testid="number"
                />,
            );

            expect(reading()).toHaveTextContent("123,450%");
            expect(reading()).toHaveStyle("color: rgb(255, 0, 0)");
        });
    });

    describe("children", () => {
        it("stands in for the reading where one was handed over already written", () => {
            render(
                <FormatNumber value={1234.5} data-testid="number">
                    1.234,5
                </FormatNumber>,
            );

            expect(reading()).toHaveTextContent("1.234,5");
        });
    });
});
