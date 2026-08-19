import * as React from "react";
import { useChartContext } from "./ChartContext";
import type { ChartGradientProps } from "./Chart.types";

// A wash for an area to be filled with, which is what gives a filled trend its weight at the
// line and lets it go before it reaches the bottom of the plot. It goes inside the chart's own
// <defs>, and whatever is being filled names it back through `url(#id)`.
//
// The stops are named in the palette's own terms rather than in colours, so an area is filled
// from the same place its line is drawn from and follows the theme it is read under
function ChartGradient(props: ChartGradientProps) {
    const { id, fillOpacity, stops } = props;

    const chart = useChartContext();

    return (
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1" data-component="Chart.Gradient">
            {stops.map((stop, index) => (
                <stop
                    key={index}
                    offset={stop.offset}
                    stopColor={chart.color(stop.color)}
                    stopOpacity={stop.opacity ?? fillOpacity}
                />
            ))}
        </linearGradient>
    );
}

ChartGradient.displayName = "Chart.Gradient";

export default ChartGradient;
