// D3 is taken a module at a time rather than through the umbrella package. The chart works
// out where the marks go and leaves React to draw them, so the parts of D3 that reach for the
// DOM themselves are not wanted here and would only be carried into the bundle
import { scaleBand, scaleLinear, scalePoint } from "d3-scale";
import { area, curveLinear, curveMonotoneX, line } from "d3-shape";
import type { ChartDatum, ChartResolvedSeries, ChartType } from "./Chart.types";

// How thick a bar is allowed to get. Past this the band is filled rather than drawn in, and
// the chart stops reading as marks on a surface
export const MAX_BAR_THICKNESS = 24;

// The corner the far end of a bar is rounded by. The end against the baseline stays square,
// since a bar that is rounded there no longer starts where it says it does
export const BAR_RADIUS = 4;

// The surface showing through between one mark and the next. It is what separates them: a
// stroke around a mark would only add ink that is not data
export const MARK_GAP = 2;

// Where the marks are drawn, and how much room the axes take up around them
export const CHART_PADDING = { top: 8, right: 8 };

// Reads a series' value off a row. Anything that is not a number is a gap in the data rather
// than a nought, so it is left as nothing and the marks step over it
export const readValue = (datum: ChartDatum, key: string) => {
    const value = datum[key];

    return typeof value === "number" && Number.isFinite(value) ? value : null;
};

export const readLabel = (datum: ChartDatum, key: string) => String(datum[key] ?? "");

// Where every series sits once they are laid one on top of another: each one starts where the
// one below it left off. Only what is there counts, so a gap neither adds nor takes away
export const getStackBounds = (
    data: ChartDatum[],
    series: ChartResolvedSeries[],
    stacked: boolean,
) =>
    data.map((datum) => {
        let below = 0;

        return series.map((entry) => {
            const value = readValue(datum, entry.key);

            if (value === null) {
                return { value: null, start: 0, end: 0 };
            }

            const start = stacked ? below : 0;
            below = stacked ? below + value : below;

            return { value, start, end: start + value };
        });
    });

// The lowest and the highest the value axis has to reach. Bars and areas are read against a
// baseline, so nought is always in view for them however far from it the data sits
export const getValueDomain = (
    bounds: ReturnType<typeof getStackBounds>,
    type: ChartType,
): [number, number] => {
    const reached = bounds
        .flat()
        .filter((entry) => entry.value !== null)
        .flatMap((entry) => [entry.start, entry.end]);

    const grounded = type === "line" ? reached : [...reached, 0];

    if (grounded.length === 0) {
        return [0, 1];
    }

    const low = Math.min(...grounded);
    const high = Math.max(...grounded);

    // A flat run would otherwise be a scale with no height to it at all
    return low === high ? [Math.min(low, 0), high === 0 ? 1 : high] : [low, high];
};

export const getValueScale = (domain: [number, number], range: [number, number]) =>
    scaleLinear().domain(domain).nice().range(range);

// The points sit at the middle of their share of the width for a line, and take a band of
// their own for bars, since a bar has width where a point on a line has none
export const getPointScale = (labels: string[], width: number) =>
    scalePoint<string>().domain(labels).range([0, width]).padding(0.5);

export const getBandScale = (labels: string[], width: number) =>
    scaleBand<string>().domain(labels).range([0, width]).paddingInner(0.3).paddingOuter(0.15);

// How thick each bar in a band is, and how far along the band it starts. Grouped bars share
// the band between them with the surface showing through in the gaps
export const getBarBand = (bandwidth: number, count: number, index: number, grouped: boolean) => {
    if (!grouped) {
        const thickness = Math.min(bandwidth, MAX_BAR_THICKNESS);

        return { offset: (bandwidth - thickness) / 2, thickness };
    }

    const share = (bandwidth - MARK_GAP * (count - 1)) / count;
    const thickness = Math.max(Math.min(share, MAX_BAR_THICKNESS), 1);
    const used = thickness * count + MARK_GAP * (count - 1);

    return { offset: (bandwidth - used) / 2 + index * (thickness + MARK_GAP), thickness };
};

// A bar with the far end rounded off and the end against the baseline left square. Which end
// is which follows the way the bar grows, so a bar below the line is rounded underneath
export const getBarPath = (
    x: number,
    y: number,
    width: number,
    height: number,
    end: "top" | "bottom" | "left" | "right",
) => {
    if (width <= 0 || height <= 0) {
        return "";
    }

    const radius = Math.min(BAR_RADIUS, width / 2, height / 2);
    const right = x + width;
    const bottom = y + height;

    // The bar is written as its four sides, with a quarter turn taken out of the two corners
    // at whichever end the data reaches to and square corners left at the baseline
    const sides = {
        top: [
            `M${x},${bottom}`,
            `L${x},${y + radius}`,
            `Q${x},${y} ${x + radius},${y}`,
            `L${right - radius},${y}`,
            `Q${right},${y} ${right},${y + radius}`,
            `L${right},${bottom}`,
        ],
        bottom: [
            `M${x},${y}`,
            `L${x},${bottom - radius}`,
            `Q${x},${bottom} ${x + radius},${bottom}`,
            `L${right - radius},${bottom}`,
            `Q${right},${bottom} ${right},${bottom - radius}`,
            `L${right},${y}`,
        ],
        right: [
            `M${x},${y}`,
            `L${right - radius},${y}`,
            `Q${right},${y} ${right},${y + radius}`,
            `L${right},${bottom - radius}`,
            `Q${right},${bottom} ${right - radius},${bottom}`,
            `L${x},${bottom}`,
        ],
        left: [
            `M${right},${y}`,
            `L${x + radius},${y}`,
            `Q${x},${y} ${x},${y + radius}`,
            `L${x},${bottom - radius}`,
            `Q${x},${bottom} ${x + radius},${bottom}`,
            `L${right},${bottom}`,
        ],
    };

    return `${sides[end].join(" ")} Z`;
};

type PointReading = { x: number; value: number | null; start: number };

// The line through everything a series had. A gap in the data breaks the line rather than
// being drawn across, since a line drawn over nothing says something that was never measured
export const getLinePath = (
    readings: PointReading[],
    valueScale: (value: number) => number,
    smooth: boolean,
) =>
    line<PointReading>()
        .defined((reading) => reading.value !== null)
        .x((reading) => reading.x)
        .y((reading) => valueScale(reading.value ?? 0))
        .curve(smooth ? curveMonotoneX : curveLinear)(readings) ?? "";

export const getAreaPath = (
    readings: PointReading[],
    valueScale: (value: number) => number,
    smooth: boolean,
) =>
    area<PointReading>()
        .defined((reading) => reading.value !== null)
        .x((reading) => reading.x)
        .y0((reading) => valueScale(reading.start))
        .y1((reading) => valueScale((reading.start ?? 0) + (reading.value ?? 0)))
        .curve(smooth ? curveMonotoneX : curveLinear)(readings) ?? "";
