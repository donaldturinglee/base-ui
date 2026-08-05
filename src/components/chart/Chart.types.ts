import type * as React from "react";
import type { LegendPayload, TooltipContentProps } from "recharts";
import type { ViewBox } from "recharts/types/util/types";
import type { ChartColorName } from "./chartPalette";

// A colour to draw with: one of the names the chart palette hands out, or anything CSS already
// understands, for the times a series has to be painted in something the palette has no name for
export type ChartColor = ChartColorName | (string & {});

// One thing plotted across the points. The name is the key the value is read under on every
// row, which is also what the series is called in the legend and the readout unless a label
// says otherwise
export type ChartSeries<T> = {
    name?: keyof T;
    // Stands in for the colour the series would take from the palette
    color?: ChartColor;
    // Drawn in place of the swatch, for a series better told apart by a mark than by a hue
    icon?: React.ReactNode;
    label?: React.ReactNode;
    // Series sharing a stack id are laid one on top of another rather than side by side
    stackId?: string;
    yAxisId?: string;
    strokeDasharray?: string;
    id?: string;
};

// A series once the chart has settled what colour it is drawn in
export type ChartResolvedSeries<T> = ChartSeries<T> & {
    color: ChartColor;
};

// What the legend and the readout need to know about whatever mark they were handed. A mark
// drawn from the rows rather than named in the series list still has a colour and a name on the
// row it came from, so this is what is found either way
export type ChartSeriesConfig = {
    name?: string;
    color?: ChartColor;
    icon?: React.ReactNode;
    label?: React.ReactNode;
};

// Which way an axis runs, where the ends are not simply the smallest and largest of the data
export type ChartValueDomain =
    [number, number] | ((props: { min: number; max: number }) => [number, number]);

export type ChartSort<T> = {
    by: keyof T;
    direction: "asc" | "desc";
};

export type UseChartProps<T> = {
    data: T[];
    // What is plotted. Five is as many as the palette can tell apart; past that the tail is
    // better gathered into one series of its own
    series?: ChartSeries<T>[];
    // Puts the rows in order of one of their own values before they are drawn
    sort?: ChartSort<T>;
    // Whose conventions numbers and dates are written under. The one the runtime is set to
    // stands where this is left out
    locale?: string;
};

// The half of a chart that has nothing to do with the shape of a row: what a mark is drawn in,
// which series it belongs to, and which of them the reader is on. It is the whole of what the
// legend and the readout ask for, which is what lets the root carry a chart built from any data
// at all to parts that know nothing about that data
export type ChartInstance = {
    // Unique to this chart, for the gradients and clip paths a chart has to name
    id: string;
    getSeries: (item: unknown) => ChartSeriesConfig | undefined;
    color: (value?: ChartColor) => string | undefined;

    formatNumber: (options?: Intl.NumberFormatOptions) => (value: number) => string;
    formatDate: (options?: Intl.DateTimeFormatOptions) => (value: string | number | Date) => string;

    highlightedSeries: string | null;
    setHighlightedSeries: React.Dispatch<React.SetStateAction<string | null>>;
    isHighlightedSeries: (name?: string) => boolean;
    getSeriesOpacity: (name?: string, fallback?: number) => number | undefined;

    getPayloadTotal: (payload?: readonly { value?: unknown }[]) => number | undefined;
};

export type UseChartReturn<T> = ChartInstance & {
    // The key a value is read under, falling back to `value` the way recharts itself does
    key: <K extends keyof T>(prop?: K) => K;

    // the data
    data: T[];
    series: ChartResolvedSeries<T>[];
    groupBy: (key: keyof T) => T[][];

    // what the values come to
    getTotal: (key: keyof T) => number;
    getMin: (key: keyof T) => number;
    getMax: (key: keyof T) => number;
    getValuePercent: (key: keyof T, value: number, domain?: ChartValueDomain) => number;
};

export type ChartProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    chart: ChartInstance;
    // The plot itself: a recharts chart, which the root gives the room it has to draw in
    children: React.ReactElement;
    className?: string;
};

// Where the legend stands against the plot, which is recharts' own to settle: it hands these
// down to whatever was given as the legend's content
export type ChartLegendAlign = "left" | "center" | "right";
export type ChartLegendVerticalAlign = "top" | "middle" | "bottom";

// Which way the names run. Left to itself it follows where the legend was put: down the side
// of a plot it stands beside, and across the bottom of one it stands under
export type ChartLegendLayout = "horizontal" | "vertical" | "auto";

// What lights a series up on the chart. Moving over a name is enough where the highlight is
// only worth having while the pointer is there; clicking holds it, and is what a reader without
// a pointer has
export type ChartLegendInteraction = "hover" | "click";

export type ChartLegendProps = {
    // Handed down by recharts, one entry to each mark it drew
    payload?: LegendPayload[];
    align?: ChartLegendAlign;
    verticalAlign?: ChartLegendVerticalAlign;
    layout?: ChartLegendLayout;
    title?: React.ReactNode;
    // The key on the row each entry is named under, for a chart whose names are in the data
    // rather than in the series list
    nameKey?: string;
    interaction?: ChartLegendInteraction;
    className?: string;
};

// What stands beside each name in the readout: a dot for a mark that is a point or an area, a
// line for one that is a line, and a dashed line for one drawn dashed
export type ChartTooltipIndicator = "dot" | "line" | "dashed";

export type ChartTooltipFormatter = (
    value: unknown,
    name: React.ReactNode,
) => React.ReactNode | [React.ReactNode, React.ReactNode];

export type ChartTooltipProps = Partial<TooltipContentProps<string | number, string>> & {
    // The point along the bottom is already named by the axis, so a chart with one series has
    // no need to name it again above the value
    hideLabel?: boolean;
    hideIndicator?: boolean;
    hideSeriesLabel?: boolean;
    showTotal?: boolean;
    // Lets the readout be as narrow as its contents rather than holding a width of its own
    fitContent?: boolean;
    nameKey?: string;
    indicator?: ChartTooltipIndicator;
    formatter?: ChartTooltipFormatter;
    // Draws the whole of a row from the data behind it, in place of the name and value pair
    render?: (payload: unknown) => React.ReactNode;
    className?: string;
};

export type ChartGradientStop = {
    color: ChartColor;
    offset: string | number;
    opacity?: number;
};

export type ChartGradientProps = {
    // What the fill refers to the gradient by, as `url(#id)`
    id: string;
    fillOpacity?: number;
    stops: ChartGradientStop[];
};

export type ChartRadialTextProps = {
    // Handed down by recharts from the label the text was given to
    viewBox?: ViewBox;
    title: React.ReactNode;
    description?: React.ReactNode;
    // How far under the title the description sits, in the plot's own units
    gap?: number;
    fontSize?: string;
};
