import ChartBase from "./Chart";
import ChartLegend from "./ChartLegend";
import ChartTooltip from "./ChartTooltip";

export const Chart = Object.assign(ChartBase, {
    Legend: ChartLegend,
    Tooltip: ChartTooltip,
});

export { ChartLegend, ChartTooltip };
export { CHART_SERIES_COLORS, CHART_OVERFLOW_COLOR, getSeriesColor } from "./chartPalette";
export { BAR_RADIUS, MARK_GAP, MAX_BAR_THICKNESS } from "./chartScales";
export * from "./Chart.types";
