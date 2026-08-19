import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis } from "recharts";
import { Chart, ChartContext, useChart } from ".";
import { CHART_OVERFLOW_COLOR, CHART_SERIES_COLORS } from "./chartPalette";
import type { ChartInstance, ChartLegendProps, ChartTooltipProps } from "./Chart.types";

const originalResizeObserver = window.ResizeObserver;
const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

const traffic = [
    { month: "Jan", visits: 120, signups: 40 },
    { month: "Feb", visits: 180, signups: 55 },
    { month: "Mar", visits: 90, signups: 30 },
];

const series = [
    { name: "visits" as const, label: "Visits" },
    { name: "signups" as const, label: "Sign ups" },
];

const part = (name: string) => document.querySelector(`[data-component='Chart.${name}']`);

const parts = (name: string) =>
    Array.from(document.querySelectorAll(`[data-component='Chart.${name}']`));

const root = () => document.querySelector("[data-component='Chart']") as HTMLElement;

const swatch = (element: Element | null) => element?.querySelector(".chart-swatch");

// Hands the chart itself back, so that what the hook worked out can be read without a plot
// having to be drawn to reach it
const Probe = (props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (chart: any) => React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: any;
}) => {
    const chart = useChart(props.options);

    return <div data-testid="probe">{props.render(chart)}</div>;
};

// The parts are handed to recharts as content rather than written into the tree, so on their own
// they are given the chart the way recharts would have given it to them
const withChart = (node: React.ReactNode, options = { data: traffic, series }) => {
    const Wrapper = () => {
        const chart = useChart(options);

        return <ChartContext.Provider value={chart}>{node}</ChartContext.Provider>;
    };

    return render(<Wrapper />);
};

const renderChart = (children: React.ReactElement, options = { data: traffic, series }) => {
    const Wrapper = () => {
        const chart = useChart(options);

        return <Chart chart={chart}>{children}</Chart>;
    };

    return render(<Wrapper />);
};

describe("Chart", () => {
    // jsdom lays nothing out and has no ResizeObserver of its own, so a plot measured against
    // the room it was given is given none at all and draws nothing. Only the box recharts
    // measures is answered for, since a stubbed width for every element would have the axes
    // laid out against a string measured as wide as the chart
    beforeAll(() => {
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;

        Element.prototype.getBoundingClientRect = function getBoundingClientRect(this: Element) {
            if (this.classList?.contains("recharts-responsive-container")) {
                return {
                    width: 640,
                    height: 360,
                    top: 0,
                    left: 0,
                    right: 640,
                    bottom: 360,
                    x: 0,
                    y: 0,
                    toJSON: () => ({}),
                } as DOMRect;
            }

            return originalGetBoundingClientRect.call(this);
        };
    });

    afterAll(() => {
        window.ResizeObserver = originalResizeObserver;
        Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });

    describe("the root", () => {
        it("tags the root element with a data-component attribute", () => {
            renderChart(<LineChart data={traffic} />);
            expect(root()).toHaveAttribute("data-component", "Chart");
            expect(root()).toHaveClass("chart");
        });

        it("gives the plot the room the root was given", () => {
            const { container } = renderChart(<LineChart data={traffic} />);
            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });

        it("draws the marks it was handed", () => {
            renderChart(
                <LineChart data={traffic}>
                    <CartesianGrid />
                    <XAxis dataKey="month" />
                    <Line dataKey="visits" />
                </LineChart>,
            );

            expect(document.querySelector(".recharts-surface")).toBeInTheDocument();
            expect(document.querySelector(".recharts-line")).toBeInTheDocument();
        });

        it("merges a custom className onto the root element", () => {
            const Wrapper = () => {
                const chart = useChart({ data: traffic, series });

                return (
                    <Chart chart={chart} className="custom">
                        <LineChart data={traffic} />
                    </Chart>
                );
            };

            render(<Wrapper />);
            expect(root()).toHaveClass("chart", "custom");
        });

        it("passes extra props onto the root element", () => {
            const Wrapper = () => {
                const chart = useChart({ data: traffic, series });

                return (
                    <Chart chart={chart} id="traffic" aria-label="Traffic">
                        <LineChart data={traffic} />
                    </Chart>
                );
            };

            render(<Wrapper />);
            expect(root()).toHaveAttribute("id", "traffic");
            expect(root()).toHaveAttribute("aria-label", "Traffic");
        });

        it("forwards a ref to the root element", () => {
            const ref = React.createRef<HTMLDivElement>();

            const Wrapper = () => {
                const chart = useChart({ data: traffic, series });

                return (
                    <Chart ref={ref} chart={chart}>
                        <LineChart data={traffic} />
                    </Chart>
                );
            };

            render(<Wrapper />);
            expect(ref.current).toBe(root());
        });

        it("refuses to draw a part that was not put inside a chart", () => {
            const legend: ChartLegendProps = { payload: [{ value: "visits" }] };

            expect(() => render(<Chart.Legend {...legend} />)).toThrow(
                "Chart parts have to be rendered inside a Chart",
            );
        });
    });

    describe("useChart", () => {
        it("hands out the palette in order to the series that named no colour", () => {
            withChart(null);

            const Wrapper = () => (
                <Probe
                    options={{ data: traffic, series }}
                    render={(chart: { series: { color: string }[] }) =>
                        chart.series.map((item, index) => (
                            <span key={index} data-testid={`color-${index}`}>
                                {item.color}
                            </span>
                        ))
                    }
                />
            );

            render(<Wrapper />);
            expect(screen.getByTestId("color-0")).toHaveTextContent(CHART_SERIES_COLORS[0]);
            expect(screen.getByTestId("color-1")).toHaveTextContent(CHART_SERIES_COLORS[1]);
        });

        it("lets a series keep a colour of its own", () => {
            render(
                <Probe
                    options={{ data: traffic, series: [{ name: "visits", color: "green" }] }}
                    render={(chart: ChartInstance & { series: { color: string }[] }) => (
                        <span data-testid="color">{chart.color(chart.series[0].color)}</span>
                    )}
                />,
            );

            expect(screen.getByTestId("color")).toHaveTextContent(
                "var(--base-display-color-green-5)",
            );
        });

        it("falls back to the quiet foreground once the palette runs out", () => {
            const many = ["a", "b", "c", "d", "e", "f"].map((name) => ({ name }));

            render(
                <Probe
                    options={{ data: traffic, series: many }}
                    render={(chart: { series: { color: string }[] }) => (
                        <span data-testid="color">{chart.series[5].color}</span>
                    )}
                />,
            );

            expect(screen.getByTestId("color")).toHaveTextContent(CHART_OVERFLOW_COLOR);
        });

        it("passes a colour the palette has no name for along as it came", () => {
            render(
                <Probe
                    options={{ data: traffic }}
                    render={(chart: ChartInstance) => (
                        <span data-testid="color">{chart.color("#ff8800")}</span>
                    )}
                />,
            );

            expect(screen.getByTestId("color")).toHaveTextContent("#ff8800");
        });

        it("puts the rows in order without reordering the array it was handed", () => {
            const rows = [...traffic];

            render(
                <Probe
                    options={{ data: rows, sort: { by: "visits", direction: "desc" } }}
                    render={(chart: { data: { month: string }[] }) => (
                        <span data-testid="order">
                            {chart.data.map((row) => row.month).join(",")}
                        </span>
                    )}
                />,
            );

            expect(screen.getByTestId("order")).toHaveTextContent("Feb,Jan,Mar");
            expect(rows.map((row) => row.month)).toEqual(["Jan", "Feb", "Mar"]);
        });

        it("adds up, and finds the ends of, everything measured under a key", () => {
            render(
                <Probe
                    options={{ data: traffic }}
                    render={(chart: {
                        getTotal: (key: string) => number;
                        getMin: (key: string) => number;
                        getMax: (key: string) => number;
                        getValuePercent: (key: string, value: number) => number;
                    }) => (
                        <>
                            <span data-testid="total">{chart.getTotal("visits")}</span>
                            <span data-testid="min">{chart.getMin("visits")}</span>
                            <span data-testid="max">{chart.getMax("visits")}</span>
                            <span data-testid="percent">
                                {Math.round(chart.getValuePercent("visits", 90))}
                            </span>
                        </>
                    )}
                />,
            );

            expect(screen.getByTestId("total")).toHaveTextContent("390");
            expect(screen.getByTestId("min")).toHaveTextContent("90");
            expect(screen.getByTestId("max")).toHaveTextContent("180");
            expect(screen.getByTestId("percent")).toHaveTextContent("23");
        });

        it("measures a value against the ends of the axis where it was given them", () => {
            render(
                <Probe
                    options={{ data: traffic }}
                    render={(chart: {
                        getValuePercent: (
                            key: string,
                            value: number,
                            domain: [number, number],
                        ) => number;
                    }) => (
                        <span data-testid="percent">
                            {chart.getValuePercent("visits", 150, [100, 200])}
                        </span>
                    )}
                />,
            );

            expect(screen.getByTestId("percent")).toHaveTextContent("50");
        });

        it("gathers the rows under one of their own values", () => {
            render(
                <Probe
                    options={{ data: [...traffic, { month: "Jan", visits: 10, signups: 5 }] }}
                    render={(chart: { groupBy: (key: string) => unknown[][] }) => (
                        <span data-testid="groups">
                            {chart
                                .groupBy("month")
                                .map((group) => group.length)
                                .join(",")}
                        </span>
                    )}
                />,
            );

            expect(screen.getByTestId("groups")).toHaveTextContent("2,1,1");
        });

        it("gives every chart on the page an id a fill can refer to", () => {
            render(
                <Probe
                    options={{ data: traffic }}
                    render={(chart: ChartInstance) => <span data-testid="id">{chart.id}</span>}
                />,
            );

            expect(screen.getByTestId("id").textContent).toMatch(/^chart-[\w-]+$/);
        });

        it("writes a number the way the locale it was given writes it", () => {
            render(
                <Probe
                    options={{ data: traffic, locale: "en-GB" }}
                    render={(chart: ChartInstance) => (
                        <span data-testid="number">{chart.formatNumber()(1234.5)}</span>
                    )}
                />,
            );

            expect(screen.getByTestId("number")).toHaveTextContent("1,234.5");
        });

        it("writes a date the way the locale it was given writes it", () => {
            render(
                <Probe
                    options={{ data: traffic, locale: "en-GB" }}
                    render={(chart: ChartInstance) => (
                        <span data-testid="date">
                            {chart.formatDate({ day: "numeric", month: "short" })("2026-01-05")}
                        </span>
                    )}
                />,
            );

            expect(screen.getByTestId("date")).toHaveTextContent("5 Jan");
        });

        it("keeps a day written on its own on the day it was written", () => {
            render(
                <Probe
                    options={{ data: traffic, locale: "en-GB" }}
                    render={(chart: ChartInstance) => (
                        <span data-testid="date">
                            {chart.formatDate({ dateStyle: "short" })("2026-01-05")}
                        </span>
                    )}
                />,
            );

            expect(screen.getByTestId("date")).toHaveTextContent("05/01/2026");
        });

        it("writes a value it cannot read as a date out as it came", () => {
            render(
                <Probe
                    options={{ data: traffic, locale: "en-GB" }}
                    render={(chart: ChartInstance) => (
                        <span data-testid="date">
                            {chart.formatDate({ day: "numeric", month: "short" })("value")}
                        </span>
                    )}
                />,
            );

            expect(screen.getByTestId("date")).toHaveTextContent("value");
        });

        it("holds nothing back while no series is being read", () => {
            render(
                <Probe
                    options={{ data: traffic, series }}
                    render={(chart: ChartInstance) => (
                        <span data-testid="opacity">
                            {String(chart.getSeriesOpacity("visits"))}
                        </span>
                    )}
                />,
            );

            expect(screen.getByTestId("opacity")).toHaveTextContent("undefined");
        });
    });

    describe("the legend", () => {
        const payload = [
            { value: "visits", dataKey: "visits" },
            { value: "signups", dataKey: "signups" },
        ];

        it("names every series it was handed", () => {
            withChart(<Chart.Legend payload={payload} />);

            expect(part("Legend")).toBeInTheDocument();
            expect(parts("LegendItem")).toHaveLength(2);
            expect(screen.getByText("Visits")).toBeInTheDocument();
            expect(screen.getByText("Sign ups")).toBeInTheDocument();
        });

        it("draws each name beside the colour its series is drawn in", () => {
            withChart(<Chart.Legend payload={payload} />);

            expect(swatch(parts("LegendItem")[0])).toHaveStyle({
                background: CHART_SERIES_COLORS[0],
            });
            expect(swatch(parts("LegendItem")[1])).toHaveStyle({
                background: CHART_SERIES_COLORS[1],
            });
        });

        it("keeps the swatch from a screen reader, since the name already says which series", () => {
            withChart(<Chart.Legend payload={payload} />);
            expect(swatch(parts("LegendItem")[0])).toHaveAttribute("aria-hidden", "true");
        });

        it("draws nothing where there is nothing to tell apart", () => {
            withChart(<Chart.Legend payload={[]} />);
            expect(part("Legend")).toBeNull();
        });

        it("leaves out what recharts drew but has nothing to say about", () => {
            withChart(
                <Chart.Legend
                    payload={[
                        { value: "visits", dataKey: "visits" },
                        { value: "spacer", dataKey: "spacer", color: "none", type: "none" },
                    ]}
                />,
            );

            expect(parts("LegendItem")).toHaveLength(1);
        });

        it("names the legend as a whole where it was given a title", () => {
            withChart(<Chart.Legend payload={payload} title="Series" />);
            expect(screen.getByText("Series")).toBeInTheDocument();
        });

        it("runs the names across the bottom by default", () => {
            withChart(<Chart.Legend payload={payload} />);
            expect(part("Legend")?.querySelector(".chart-legend-list")).toHaveAttribute(
                "data-orientation",
                "horizontal",
            );
        });

        it("runs the names down the side where the legend stands beside the plot", () => {
            withChart(<Chart.Legend payload={payload} align="right" verticalAlign="middle" />);
            expect(part("Legend")?.querySelector(".chart-legend-list")).toHaveAttribute(
                "data-orientation",
                "vertical",
            );
        });

        it("lets the caller say which way the names run", () => {
            withChart(<Chart.Legend payload={payload} layout="vertical" />);
            expect(part("Legend")?.querySelector(".chart-legend-list")).toHaveAttribute(
                "data-orientation",
                "vertical",
            );
        });

        it("holds the rest of the series back while one of them is read", () => {
            withChart(<Chart.Legend payload={payload} />);

            fireEvent.mouseEnter(parts("LegendItem")[0].querySelector("span") as Element);
            expect(parts("LegendItem")[0]).toHaveStyle({ opacity: "1" });
            expect(parts("LegendItem")[1]).toHaveStyle({ opacity: "0.6" });

            fireEvent.mouseLeave(parts("LegendItem")[0].querySelector("span") as Element);
            expect(parts("LegendItem")[1]).not.toHaveStyle({ opacity: "0.6" });
        });

        it("puts the highlight on a button where it is held rather than hovered", () => {
            withChart(<Chart.Legend payload={payload} interaction="click" />);

            const toggle = screen.getByRole("button", { name: "Visits" });

            expect(toggle).toHaveAttribute("aria-pressed", "false");

            fireEvent.click(toggle);
            expect(toggle).toHaveAttribute("aria-pressed", "true");
            expect(parts("LegendItem")[1]).toHaveStyle({ opacity: "0.6" });

            fireEvent.click(toggle);
            expect(toggle).toHaveAttribute("aria-pressed", "false");
        });

        it("names each entry from the row where the names are in the data", () => {
            withChart(
                <Chart.Legend
                    nameKey="name"
                    payload={[{ value: "chrome", payload: { name: "Chrome" } }]}
                />,
                { data: traffic, series: [] },
            );

            expect(screen.getByText("Chrome")).toBeInTheDocument();
        });

        it("merges a custom className onto the legend", () => {
            withChart(<Chart.Legend payload={payload} className="custom" />);
            expect(part("Legend")).toHaveClass("chart-legend", "custom");
        });
    });

    describe("the readout", () => {
        // What recharts hands the readout once the reader is over a point, one entry to each
        // mark it drew there
        const payload: ChartTooltipProps["payload"] = [
            { value: 120, dataKey: "visits", name: "visits", graphicalItemId: "visits" },
            { value: 40, dataKey: "signups", name: "signups", graphicalItemId: "signups" },
        ];

        it("says what every series had at the point the reader is on", () => {
            withChart(<Chart.Tooltip payload={payload} label="Jan" />);

            expect(part("Tooltip")).toBeInTheDocument();
            expect(parts("TooltipRow")).toHaveLength(2);
            expect(screen.getByText("Jan")).toBeInTheDocument();
            expect(screen.getByText("120")).toBeInTheDocument();
            expect(screen.getByText("40")).toBeInTheDocument();
        });

        it("draws nothing where the reader is on nothing", () => {
            withChart(<Chart.Tooltip payload={[]} />);
            expect(part("Tooltip")).toBeNull();
        });

        // Recharts draws the readout ahead of the reader arriving anywhere, so a caller who
        // writes their labels as dates or as money must not be handed a point to name until
        // there is one
        it("names no point while the reader is on nothing", () => {
            const labelFormatter = (label: React.ReactNode) => {
                if (label !== "Jan") {
                    throw new Error(`Nothing to name here: ${label}`);
                }

                return `Month: ${label}`;
            };

            expect(() =>
                withChart(<Chart.Tooltip payload={[]} labelFormatter={labelFormatter} />),
            ).not.toThrow();

            expect(part("Tooltip")).toBeNull();
        });

        it("draws each reading beside the colour its series is drawn in", () => {
            withChart(<Chart.Tooltip payload={payload} label="Jan" />);
            expect(swatch(parts("TooltipRow")[0])).toHaveStyle({
                background: CHART_SERIES_COLORS[0],
            });
        });

        it("marks the swatch with the shape the series was drawn as", () => {
            withChart(<Chart.Tooltip payload={payload} label="Jan" indicator="dashed" />);
            expect(swatch(parts("TooltipRow")[0])).toHaveAttribute("data-indicator", "dashed");
        });

        it("drops the swatch where it was told to", () => {
            withChart(<Chart.Tooltip payload={payload} label="Jan" hideIndicator />);
            expect(swatch(parts("TooltipRow")[0])).toBeNull();
        });

        it("drops the name of the point where the axis already says it", () => {
            withChart(<Chart.Tooltip payload={payload} label="Jan" hideLabel />);
            expect(screen.queryByText("Jan")).toBeNull();
        });

        it("drops the name of the series where there is only one of them", () => {
            withChart(<Chart.Tooltip payload={payload} label="Jan" hideSeriesLabel />);
            expect(screen.queryByText("Visits")).toBeNull();
            expect(screen.getByText("120")).toBeInTheDocument();
        });

        it("adds the readings up under a rule where it was asked to", () => {
            withChart(<Chart.Tooltip payload={payload} label="Jan" showTotal />);

            expect(part("TooltipTotal")).toBeInTheDocument();
            expect(part("TooltipTotal")).toHaveTextContent("160");
        });

        it("writes the values the way it was told to", () => {
            withChart(
                <Chart.Tooltip
                    payload={payload}
                    label="Jan"
                    formatter={(value) => `${value} visits`}
                />,
            );

            expect(screen.getByText("120 visits")).toBeInTheDocument();
        });

        it("writes the name of the point the way it was told to", () => {
            withChart(
                <Chart.Tooltip
                    payload={payload}
                    label="Jan"
                    labelFormatter={(label) => `Month: ${label}`}
                />,
            );

            expect(screen.getByText("Month: Jan")).toBeInTheDocument();
        });

        it("names the point from the row where the names are in the data", () => {
            const named: ChartTooltipProps["payload"] = [
                {
                    value: 120,
                    dataKey: "visits",
                    graphicalItemId: "visits",
                    payload: { month: "January" },
                },
            ];

            withChart(<Chart.Tooltip nameKey="month" payload={named} />);

            expect(screen.getByText("January")).toBeInTheDocument();
        });

        it("lets the caller draw a row of their own", () => {
            withChart(
                <Chart.Tooltip
                    payload={payload}
                    label="Jan"
                    render={() => <span>A row of my own</span>}
                />,
            );

            expect(screen.getAllByText("A row of my own")).toHaveLength(2);
        });

        it("lets the readout be as narrow as what it says", () => {
            withChart(<Chart.Tooltip payload={payload} label="Jan" fitContent />);
            expect(part("Tooltip")).toHaveAttribute("data-fit-content");
        });

        it("merges a custom className onto the readout", () => {
            withChart(<Chart.Tooltip payload={payload} label="Jan" className="custom" />);
            expect(part("Tooltip")).toHaveClass("chart-tooltip", "custom");
        });
    });

    describe("the gradient", () => {
        it("draws a stop for every colour it was given", () => {
            const { container } = withChart(
                <svg>
                    <defs>
                        <Chart.Gradient
                            id="wash"
                            fillOpacity={0.4}
                            stops={[
                                { color: "blue", offset: "0%" },
                                { color: "blue", offset: "100%", opacity: 0 },
                            ]}
                        />
                    </defs>
                </svg>,
            );

            const stops = container.querySelectorAll("stop");

            expect(container.querySelector("#wash")).toBeInTheDocument();
            expect(stops).toHaveLength(2);
            expect(stops[0]).toHaveAttribute("stop-color", CHART_SERIES_COLORS[0]);
            expect(stops[0]).toHaveAttribute("stop-opacity", "0.4");
            expect(stops[1]).toHaveAttribute("stop-opacity", "0");
        });
    });

    describe("the text in the middle of a ring", () => {
        const viewBox = {
            cx: 100,
            cy: 80,
            innerRadius: 40,
            outerRadius: 60,
            startAngle: 0,
            endAngle: 360,
            clockWise: false,
        };

        it("writes what the ring comes to where its middle is", () => {
            withChart(
                <svg>
                    <Chart.RadialText viewBox={viewBox} title="100%" description="Measured" />
                </svg>,
            );

            expect(part("RadialText")).toHaveAttribute("x", "100");
            expect(screen.getByText("100%")).toBeInTheDocument();
            expect(screen.getByText("Measured")).toBeInTheDocument();
        });

        it("sits the description under the title", () => {
            withChart(
                <svg>
                    <Chart.RadialText
                        viewBox={viewBox}
                        title="100%"
                        description="Measured"
                        gap={30}
                    />
                </svg>,
            );

            expect(screen.getByText("Measured")).toHaveAttribute("y", "110");
        });

        it("draws nothing where there is no middle to write in", () => {
            withChart(
                <svg>
                    <Chart.RadialText
                        viewBox={{ x: 0, y: 0, width: 100, height: 100 }}
                        title="100%"
                    />
                </svg>,
            );

            expect(part("RadialText")).toBeNull();
        });
    });

    describe("drawn together", () => {
        it("carries the chart from the root down to the parts recharts renders", () => {
            renderChart(
                <BarChart data={traffic}>
                    <XAxis dataKey="month" />
                    <Tooltip content={<Chart.Tooltip />} />
                    <Legend content={<Chart.Legend />} />
                    <Bar dataKey="visits" name="visits" />
                    <Bar dataKey="signups" name="signups" />
                </BarChart>,
            );

            expect(part("Legend")).toBeInTheDocument();
            expect(parts("LegendItem")).toHaveLength(2);
            expect(screen.getByText("Visits")).toBeInTheDocument();
            expect(screen.getByText("Sign ups")).toBeInTheDocument();
        });
    });
});
