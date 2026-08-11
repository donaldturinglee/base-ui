import ChartBase from "./Chart";
import ChartGradient from "./ChartGradient";
import ChartLegend from "./ChartLegend";
import ChartRadialText from "./ChartRadialText";
import ChartTooltip from "./ChartTooltip";

export const Chart = Object.assign(ChartBase, {
    Gradient: ChartGradient,
    Legend: ChartLegend,
    RadialText: ChartRadialText,
    Tooltip: ChartTooltip,
});

export { ChartGradient, ChartLegend, ChartRadialText, ChartTooltip };
export { ChartContext, useChartContext } from "./ChartContext";
export { getProp, useChart } from "./useChart";
export {
    CHART_COLORS,
    CHART_OVERFLOW_COLOR,
    CHART_SERIES_COLORS,
    getSeriesColor,
} from "./chartPalette";
export type { ChartColorName } from "./chartPalette";
export * from "./Chart.types";
