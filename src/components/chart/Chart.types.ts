import type * as React from "react";

// What the marks are drawn as. The job the data is doing settles it: a line for a trend, an
// area for a single trend given weight, bars for holding one thing against another
export type ChartType = "line" | "area" | "bar";

// A row of the data: whatever names the point along the bottom, and a value for every series
export type ChartDatum = Record<string, string | number | null | undefined>;

// One thing plotted across the points
export type ChartSeries = {
    // The name the series' value is read under on every row
    key: string;
    // What the series is called in the legend and the readout. The key stands in where it is
    // left out
    name?: string;
    // Stands in for the colour the series would take from the palette
    color?: string;
};

// A series once the chart has settled what it is called and what colour it is drawn in
export type ChartResolvedSeries = ChartSeries & {
    name: string;
    color: string;
};

// One point along the bottom, with what every series had there
export type ChartReading = {
    index: number;
    label: string;
    values: { series: ChartResolvedSeries; value: number | null }[];
};

// Where the plot has been laid out: the room the marks are drawn in, and the room the axes
// take up around them
export type ChartLayout = {
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    innerWidth: number;
    innerHeight: number;
};

export type ChartProps = Omit<React.ComponentPropsWithoutRef<"figure">, "title"> & {
    type?: ChartType;
    data: ChartDatum[];
    // The name along the bottom is read under this key
    xKey: string;
    // What is plotted. Five is as many as the palette can tell apart; past that the tail is
    // better gathered into one series of its own
    series: ChartSeries[];
    // Names the chart, both above it and to a screen reader. A chart with one series needs no
    // legend, since this already says what is plotted
    title?: React.ReactNode;
    description?: React.ReactNode;
    // Lays the series one on top of another rather than side by side
    stacked?: boolean;
    // Turns the bars on their side, which is what long names need
    horizontal?: boolean;
    height?: number;
    // How a value is written, in the axis and the readout alike
    valueFormat?: (value: number) => string;
    // How the name along the bottom is written
    labelFormat?: (label: string) => string;
    // Roughly how many lines are drawn across the plot
    tickCount?: number;
    showGrid?: boolean;
    // A chart with one series is named by its own title, so the legend only stands where there
    // is more than one thing to tell apart
    showLegend?: boolean;
    // Rounds the line off between one point and the next
    smooth?: boolean;
    // What stands in place of the plot where there is nothing to draw
    emptyText?: string;
    className?: string;
};

export type ChartLegendProps = Omit<React.ComponentPropsWithoutRef<"ul">, "children"> & {
    series: ChartResolvedSeries[];
    className?: string;
};

export type ChartTooltipProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    reading: ChartReading;
    valueFormat: (value: number) => string;
    labelFormat: (label: string) => string;
    className?: string;
};
