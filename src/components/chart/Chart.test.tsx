import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Chart } from ".";
import { CHART_OVERFLOW_COLOR, CHART_SERIES_COLORS } from "./chartPalette";
import type { ChartProps } from "./Chart.types";

const originalPointerEvent = window.PointerEvent;

const data = [
    { month: "Jan", visits: 120, signups: 40 },
    { month: "Feb", visits: 180, signups: 55 },
    { month: "Mar", visits: 90, signups: 30 },
];

const series = [
    { key: "visits", name: "Visits" },
    { key: "signups", name: "Signups" },
];

const renderChart = (props: Partial<ChartProps> = {}) =>
    render(<Chart data={data} xKey="month" series={series} {...props} />);

const chart = () => document.querySelector("[data-component='Chart']") as HTMLElement;

const plot = () => document.querySelector("[data-component='Chart.Plot']") as HTMLElement;

const part = (name: string) => document.querySelector(`[data-component='Chart.${name}']`);

const parts = (name: string) =>
    Array.from(document.querySelectorAll(`[data-component='Chart.${name}']`));

const marks = (key: string, name: string) =>
    Array.from(
        document.querySelectorAll(
            `[data-component='Chart.Series'][data-series='${key}'] [data-component='Chart.${name}']`,
        ),
    );

describe("Chart", () => {
    // jsdom has no PointerEvent, and the plain event it falls back on carries none of the
    // coordinates the readout is placed from
    beforeAll(() => {
        window.PointerEvent = window.MouseEvent as unknown as typeof window.PointerEvent;
    });

    afterAll(() => {
        window.PointerEvent = originalPointerEvent;
    });

    it("tags the root element with a data-component attribute", () => {
        const { container } = renderChart();

        expect(container.firstChild).toHaveAttribute("data-component", "Chart");
        expect(chart()).toHaveAttribute("data-type", "line");
    });

    it("tags each of its parts with a data-component attribute", () => {
        renderChart();

        for (const name of [
            "Legend",
            "Plot",
            "Canvas",
            "Baseline",
            "GridLine",
            "Tick",
            "Label",
            "Series",
            "Table",
        ]) {
            expect(part(name)).toBeInTheDocument();
        }
    });

    it("names the chart above the plot and to a screen reader", () => {
        renderChart({ title: "Visits by month", description: "The last quarter" });

        expect(screen.getByText("Visits by month")).toBeInTheDocument();
        expect(plot()).toHaveAccessibleName("Visits by month");
        expect(plot()).toHaveAccessibleDescription("The last quarter");
    });

    describe("what is plotted", () => {
        it("draws a line for every series by default", () => {
            renderChart();

            expect(marks("visits", "Line")).toHaveLength(1);
            expect(marks("signups", "Line")).toHaveLength(1);
            expect(marks("visits", "Area")).toHaveLength(0);
        });

        it("draws an area under the line where it is asked to", () => {
            renderChart({ type: "area" });

            expect(marks("visits", "Area")).toHaveLength(1);
            expect(marks("visits", "Line")).toHaveLength(1);
        });

        it("draws a bar for every point where it is asked to", () => {
            renderChart({ type: "bar" });

            expect(marks("visits", "Bar")).toHaveLength(3);
            expect(marks("signups", "Bar")).toHaveLength(3);
            expect(chart()).toHaveAttribute("data-type", "bar");
        });

        it("leaves a gap in the data as a gap rather than as a nought", () => {
            renderChart({
                type: "bar",
                data: [{ month: "Jan", visits: 120 }, { month: "Feb" }],
                series: [{ key: "visits", name: "Visits" }],
            });

            expect(marks("visits", "Bar")).toHaveLength(1);
            expect(part("Table")).toHaveTextContent("—");
        });
    });

    describe("the colours the series are drawn in", () => {
        it("hands them out in a fixed order", () => {
            renderChart();

            expect(marks("visits", "Line")[0]).toHaveAttribute("stroke", CHART_SERIES_COLORS[0]);
            expect(marks("signups", "Line")[0]).toHaveAttribute("stroke", CHART_SERIES_COLORS[1]);
        });

        it("keeps a series on the colour of its place in the list", () => {
            renderChart({ series: [series[1]] });

            // The one series left is still the first in the list, so it takes the first colour
            expect(marks("signups", "Line")[0]).toHaveAttribute("stroke", CHART_SERIES_COLORS[0]);
        });

        it("takes a colour of the caller's own in place of the palette", () => {
            renderChart({ series: [{ key: "visits", color: "rebeccapurple" }] });

            expect(marks("visits", "Line")[0]).toHaveAttribute("stroke", "rebeccapurple");
        });

        it("stops short of making up a hue past the end of the palette", () => {
            const many = ["a", "b", "c", "d", "e", "f"].map((key) => ({ key }));

            renderChart({
                data: [{ month: "Jan", a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }],
                series: many,
            });

            expect(marks("f", "Line")[0]).toHaveAttribute("stroke", CHART_OVERFLOW_COLOR);
        });
    });

    describe("the legend", () => {
        it("stands where there is more than one series to tell apart", () => {
            renderChart();

            expect(part("Legend")).toBeInTheDocument();
            expect(parts("LegendItem")).toHaveLength(2);
        });

        it("is kept out of the way where there is only one", () => {
            renderChart({ series: [series[0]] });
            expect(part("Legend")).not.toBeInTheDocument();
        });

        it("stands where it is asked for even with one series", () => {
            renderChart({ series: [series[0]], showLegend: true });
            expect(part("Legend")).toBeInTheDocument();
        });

        it("names a series after its key where it was given no name", () => {
            renderChart({ series: [{ key: "visits" }, { key: "signups" }] });
            expect(part("Legend")).toHaveTextContent("visits");
        });
    });

    describe("reading a point", () => {
        it("shows what every series had where the pointer is", () => {
            renderChart();

            fireEvent.pointerMove(plot(), { clientX: 200, clientY: 40 });

            expect(part("Tooltip")).toBeInTheDocument();
            expect(part("Tooltip")).toHaveTextContent("Visits");
            expect(part("Crosshair")).toBeInTheDocument();
        });

        it("stops showing it once the pointer comes off the plot", () => {
            renderChart();

            fireEvent.pointerMove(plot(), { clientX: 200, clientY: 40 });
            fireEvent.pointerLeave(plot());

            expect(part("Tooltip")).not.toBeInTheDocument();
        });

        it("moves through the points with the arrow keys", () => {
            renderChart();

            plot().focus();
            fireEvent.keyDown(plot(), { key: "ArrowRight" });

            expect(part("Tooltip")).toHaveTextContent("Jan");

            fireEvent.keyDown(plot(), { key: "ArrowRight" });
            expect(part("Tooltip")).toHaveTextContent("Feb");

            fireEvent.keyDown(plot(), { key: "ArrowLeft" });
            expect(part("Tooltip")).toHaveTextContent("Jan");
        });

        it("stops at either end rather than coming round", () => {
            renderChart();

            plot().focus();
            fireEvent.keyDown(plot(), { key: "ArrowLeft" });

            expect(part("Tooltip")).toHaveTextContent("Mar");

            data.forEach(() => fireEvent.keyDown(plot(), { key: "ArrowRight" }));

            expect(part("Tooltip")).toHaveTextContent("Mar");
        });

        it("says the point out loud for a reader who cannot see the readout", () => {
            renderChart();

            plot().focus();
            fireEvent.keyDown(plot(), { key: "ArrowRight" });

            expect(screen.getByRole("status")).toHaveTextContent("Jan: Visits 120, Signups 40");
        });

        it("leaves the page alone for any other key", () => {
            renderChart();

            plot().focus();
            fireEvent.keyDown(plot(), { key: "a" });

            expect(part("Tooltip")).not.toBeInTheDocument();
        });
    });

    describe("the table underneath", () => {
        it("writes out everything the chart is drawn from", () => {
            renderChart({ title: "Visits by month" });

            const table = part("Table") as HTMLElement;

            expect(table).toHaveTextContent("Visits");
            expect(table).toHaveTextContent("Signups");

            for (const row of data) {
                expect(table).toHaveTextContent(row.month);
                expect(table).toHaveTextContent(String(row.visits));
            }
        });

        it("writes the values the way the chart was told to", () => {
            renderChart({ valueFormat: (value) => `${value} visits` });
            expect(part("Table")).toHaveTextContent("120 visits");
        });

        it("writes the names the way the chart was told to", () => {
            renderChart({ labelFormat: (label) => label.toUpperCase() });
            expect(part("Table")).toHaveTextContent("JAN");
        });
    });

    describe("with nothing to show", () => {
        it("says so in place of the plot", () => {
            renderChart({ data: [] });

            expect(screen.getByText("No data to show")).toBeInTheDocument();
            expect(part("Canvas")).not.toBeInTheDocument();
        });

        it("says so in whichever words it was given", () => {
            renderChart({ data: [], emptyText: "Nothing happened this quarter" });
            expect(screen.getByText("Nothing happened this quarter")).toBeInTheDocument();
        });

        it("says so where there is nothing to plot out of the data", () => {
            renderChart({ series: [] });
            expect(screen.getByText("No data to show")).toBeInTheDocument();
        });

        it("leaves the plot out of the tab order", () => {
            renderChart({ data: [] });
            expect(plot()).not.toHaveAttribute("tabindex");
        });
    });

    describe("how the plot is laid out", () => {
        it("draws lines across the plot to be read past", () => {
            renderChart();
            expect(parts("GridLine").length).toBeGreaterThan(0);
        });

        it("leaves them out where it is asked to", () => {
            renderChart({ showGrid: false });
            expect(parts("GridLine")).toHaveLength(0);
        });

        it("stands as tall as it is told to", () => {
            renderChart({ height: 320 });
            expect(plot()).toHaveStyle({ height: "320px" });
        });

        it("writes a name along the bottom for every point", () => {
            renderChart();
            expect(parts("Label")).toHaveLength(3);
        });
    });
});
