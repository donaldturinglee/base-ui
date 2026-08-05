import type { StoryFn, Meta } from "@storybook/react-vite";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { Chart, useChart } from ".";
import type { ChartLegendInteraction, ChartTooltipIndicator } from "./Chart.types";

const classes = {
    frame: "w-[var(--overlay-width-large)] max-w-full",
};

const traffic = [
    { month: "Jan", visits: 1240, signups: 320 },
    { month: "Feb", visits: 1810, signups: 455 },
    { month: "Mar", visits: 1490, signups: 380 },
    { month: "Apr", visits: 2260, signups: 610 },
    { month: "May", visits: 2040, signups: 590 },
    { month: "Jun", visits: 2870, signups: 780 },
];

const series = [
    { name: "visits" as const, label: "Visits" },
    { name: "signups" as const, label: "Sign ups" },
];

type PlaygroundArgs = {
    showGrid: boolean;
    showLegend: boolean;
    legendTitle: string;
    interaction: ChartLegendInteraction;
    indicator: ChartTooltipIndicator;
    showTotal: boolean;
    hideLabel: boolean;
    smooth: boolean;
};

export default {
    title: "Components/Chart",
    component: Chart,
} as Meta<typeof Chart>;

export const Default: StoryFn<typeof Chart> = () => {
    const chart = useChart({ data: traffic, series });

    return (
        <div className={classes.frame}>
            <Chart chart={chart}>
                <LineChart data={chart.data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={chart.key("month")} tickLine={false} axisLine={false} />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={chart.formatNumber({ notation: "compact" })}
                    />
                    <Tooltip cursor={false} content={<Chart.Tooltip />} />
                    <Legend content={<Chart.Legend />} />
                    {chart.series.map((item) => (
                        <Line
                            key={String(item.name)}
                            dataKey={chart.key(item.name)}
                            name={String(item.label)}
                            stroke={chart.color(item.color)}
                            strokeOpacity={chart.getSeriesOpacity(String(item.name))}
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </Chart>
        </div>
    );
};

export const Playground: StoryFn<PlaygroundArgs> = (args) => {
    const chart = useChart({ data: traffic, series });

    return (
        <div className={classes.frame}>
            <Chart chart={chart}>
                <LineChart data={chart.data}>
                    {args.showGrid ? <CartesianGrid vertical={false} /> : null}
                    <XAxis dataKey={chart.key("month")} tickLine={false} axisLine={false} />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={chart.formatNumber({ notation: "compact" })}
                    />
                    <Tooltip
                        cursor={false}
                        content={
                            <Chart.Tooltip
                                indicator={args.indicator}
                                showTotal={args.showTotal}
                                hideLabel={args.hideLabel}
                            />
                        }
                    />
                    {args.showLegend ? (
                        <Legend
                            content={
                                <Chart.Legend
                                    title={args.legendTitle}
                                    interaction={args.interaction}
                                />
                            }
                        />
                    ) : null}
                    {chart.series.map((item) => (
                        <Line
                            key={String(item.name)}
                            type={args.smooth ? "natural" : "linear"}
                            dataKey={chart.key(item.name)}
                            name={String(item.label)}
                            stroke={chart.color(item.color)}
                            strokeOpacity={chart.getSeriesOpacity(String(item.name))}
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </Chart>
        </div>
    );
};

Playground.args = {
    showGrid: true,
    showLegend: true,
    legendTitle: "",
    interaction: "hover",
    indicator: "dot",
    showTotal: false,
    hideLabel: false,
    smooth: false,
};

Playground.argTypes = {
    showGrid: {
        control: {
            type: "boolean",
        },
        description: "Draws lines across the plot to be read past",
    },
    showLegend: {
        control: {
            type: "boolean",
        },
        description: "Names each series beside the colour it is drawn in",
    },
    legendTitle: {
        control: {
            type: "text",
        },
        description: "What the legend as a whole is naming",
    },
    interaction: {
        control: {
            type: "radio",
        },
        options: ["hover", "click"],
        description: "What lights a series up: reading its name, or pressing it",
    },
    indicator: {
        control: {
            type: "radio",
        },
        options: ["dot", "line", "dashed"],
        description: "The mark that stands beside each name in the readout",
    },
    showTotal: {
        control: {
            type: "boolean",
        },
        description: "Adds the readings in the readout up under a rule",
    },
    hideLabel: {
        control: {
            type: "boolean",
        },
        description: "Drops the name of the point the reader is on from the readout",
    },
    smooth: {
        control: {
            type: "boolean",
        },
        description: "Rounds the line off between one point and the next",
    },
};
