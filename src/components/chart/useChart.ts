import * as React from "react";
import { CHART_COLORS, getSeriesColor } from "./chartPalette";
import type { ChartColorName } from "./chartPalette";
import type {
    ChartColor,
    ChartSeriesConfig,
    ChartValueDomain,
    UseChartProps,
    UseChartReturn,
} from "./Chart.types";

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

// Reads a named value off whatever recharts handed over, where there is something to read it
// from and a name to read it under. What arrives from a chart is a mark rather than a row, and
// which of the two carries the name depends on the mark, so both are asked in turn
export const getProp = <T = unknown>(item: unknown, key?: string): T | undefined => {
    if (!key || !isObject(item)) {
        return undefined;
    }

    return item[key] as T | undefined;
};

// A day written on its own is a day in the calendar rather than a moment in time. Read the way
// a timestamp is, `2026-01-05` is midnight UTC, which for a good part of the world is the
// evening of the fourth, so a date with no time on it is built out of its own parts and left to
// stand where it was written. Anything else carries a moment and is read as one
const parseDate = (value: string | number | Date) => {
    if (typeof value === "string") {
        const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

        if (parts) {
            return new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
        }
    }

    return new Date(value);
};

const groupRows = <T>(data: T[], key: keyof T): T[][] => {
    const groups = new Map<unknown, T[]>();

    for (const row of data) {
        const value = row[key];
        const group = groups.get(value) ?? [];

        group.push(row);
        groups.set(value, group);
    }

    return Array.from(groups.values());
};

// What a chart is built from, before any of it is drawn: the rows, what is plotted across them,
// the colour each of those is drawn in, and how a value is written.
//
// It draws nothing itself. The marks are recharts' own, and this is what a caller reaches for
// while laying them out, so that a chart says which series it is plotting once rather than
// repeating the name, the colour and the format at every axis, mark, legend and readout that
// has to know them
export const useChart = <T>(props: UseChartProps<T>): UseChartReturn<T> => {
    const { data, series = [], sort, locale } = props;

    // A gradient is reached for as `url(#id)`, which is a fragment rather than a selector, and
    // React's own id carries the punctuation it keeps ids apart with. Taking it out leaves an
    // id that can be written into a fill without being escaped first
    const reactId = React.useId();
    const id = `chart-${reactId.replace(/[^\w-]/g, "")}`;

    const [highlightedSeries, setHighlightedSeries] = React.useState<string | null>(null);

    // A series is drawn in the colour it was given, and otherwise in the step of the palette
    // that belongs to its place in the list, so that a chart which names no colours at all
    // still comes out in hues that can be told apart
    const resolvedSeries = series.map((item, index) => ({
        ...item,
        color: getSeriesColor(index, item.color),
    }));

    const sortedData = React.useMemo(() => {
        if (!sort) {
            return data;
        }

        // The rows are copied before they are put in order, since the array handed in is the
        // caller's own and sorting it in place would reorder what they still hold
        return [...data].sort((first, second) => {
            const a = Number(first[sort.by]);
            const b = Number(second[sort.by]);

            return sort.direction === "desc" ? b - a : a - b;
        });
    }, [data, sort]);

    const key = <K extends keyof T>(prop?: K): K => prop ?? ("value" as K);

    // Anything the palette has a name for is drawn in the custom property that name stands for,
    // so a chart follows the theme it is read under. Anything else is passed along as it came,
    // which is what lets a colour the palette has no name for still be drawn
    const color = (value?: ChartColor) => {
        if (!value) {
            return undefined;
        }

        return CHART_COLORS[value as ChartColorName] ?? value;
    };

    const formatNumber = React.useCallback(
        (options?: Intl.NumberFormatOptions) => {
            const formatter = new Intl.NumberFormat(locale, options);

            return (value: number) => formatter.format(value);
        },
        [locale],
    );

    const formatDate = React.useCallback(
        (options?: Intl.DateTimeFormatOptions) => {
            const formatter = new Intl.DateTimeFormat(locale, options);

            return (value: string | number | Date) => {
                const date = parseDate(value);

                // A chart is drawn from whatever the data holds, and Intl throws outright at
                // anything it cannot read as a date. One cell that is not a date is not worth
                // bringing the page down over, so what cannot be read is written as it came
                return Number.isNaN(date.getTime()) ? String(value) : formatter.format(date);
            };
        },
        [locale],
    );

    // Which series a mark belongs to. A cartesian mark is named after the key it was drawn
    // from, while a slice of a pie is named on the row behind it, so the name is looked for in
    // both places before the row itself is taken at its word
    const getSeries = (item: unknown): ChartSeriesConfig | undefined => {
        if (!isObject(item)) {
            return undefined;
        }

        const match = resolvedSeries.find(
            (entry) =>
                entry.name === item.name ||
                entry.name === getProp(item.payload, "name") ||
                entry.name === item.dataKey ||
                entry.name === getProp(item.payload, "dataKey"),
        );

        const name = match?.name?.toString() ?? getProp<string>(item.payload, "name");

        return {
            name,
            color: match?.color ?? getProp<string>(item.payload, "color"),
            icon: match?.icon,
            label: match?.label ?? name,
        };
    };

    const groupBy = (groupKey: keyof T) => groupRows(sortedData, groupKey);

    const getTotal = (totalKey: keyof T) =>
        data.reduce((total, row) => total + Number(row[totalKey]), 0);

    const getMin = (minKey: keyof T) => Math.min(...data.map((row) => Number(row[minKey])));

    const getMax = (maxKey: keyof T) => Math.max(...data.map((row) => Number(row[maxKey])));

    // What the readout is showing, added up. A value that is not a number stands for nothing
    // rather than turning the whole total into one
    const getPayloadTotal = (payload?: readonly { value?: unknown }[]) =>
        payload?.reduce((total, item) => {
            if (item.value === null || item.value === undefined || item.value === "") {
                return total;
            }

            const value = Number(item.value);

            return total + (Number.isNaN(value) ? 0 : value);
        }, 0);

    // How far along a value stands. Against the ends of the axis where they are given, and
    // otherwise as its share of everything measured under that key
    const getValuePercent = (percentKey: keyof T, value: number, domain?: ChartValueDomain) => {
        const min = getMin(percentKey);
        const max = getMax(percentKey);

        if (domain) {
            const [start, end] = typeof domain === "function" ? domain({ min, max }) : domain;

            return ((value - start) / (end - start)) * 100;
        }

        return (value / getTotal(percentKey)) * 100;
    };

    const isHighlightedSeries = (name?: string) => highlightedSeries === name;

    // Nothing is faded while no series is being read, so a chart left alone is drawn in full
    const getSeriesOpacity = (name?: string, fallback = 0.2) => {
        if (name && highlightedSeries) {
            return isHighlightedSeries(name) ? 1 : fallback;
        }

        return undefined;
    };

    return {
        id,
        key,

        data: sortedData,
        series: resolvedSeries,
        getSeries,
        groupBy,

        color,

        formatNumber,
        formatDate,

        highlightedSeries,
        setHighlightedSeries,
        isHighlightedSeries,
        getSeriesOpacity,

        getTotal,
        getMin,
        getMax,
        getPayloadTotal,
        getValuePercent,
    };
};
