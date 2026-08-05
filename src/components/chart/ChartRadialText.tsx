import * as React from "react";
import type { PolarViewBoxRequired, ViewBox } from "recharts/types/util/types";
import { useChartContext } from "./ChartContext";
import type { ChartRadialTextProps } from "./Chart.types";

const classes = {
    title: "chart-radial-title",
    description: "chart-radial-description",
};

// A ring drawn from a pie with its middle taken out leaves a hole, and what the ring adds up to
// is what belongs in it. The text is laid in the middle of the label recharts handed over
// rather than at the middle of the plot, so it stays put when the ring is not centred
const isPolarViewBox = (viewBox: ViewBox): viewBox is PolarViewBoxRequired =>
    "cx" in viewBox && "cy" in viewBox;

function ChartRadialText(props: ChartRadialTextProps) {
    const { viewBox, title, description, gap = 24, fontSize = "2rem" } = props;

    const chart = useChartContext();

    // Anything but a ring has no middle to write in, and a label that was never given a box has
    // nowhere to be put at all
    if (!viewBox || !isPolarViewBox(viewBox)) {
        return null;
    }

    return (
        <text
            x={viewBox.cx}
            y={viewBox.cy}
            textAnchor="middle"
            dominantBaseline="middle"
            data-component="Chart.RadialText"
        >
            <tspan
                className={classes.title}
                x={viewBox.cx}
                y={viewBox.cy}
                style={{ fontSize, fill: chart.color("foreground") }}
            >
                {title}
            </tspan>

            {description ? (
                <tspan
                    className={classes.description}
                    x={viewBox.cx}
                    y={viewBox.cy + gap}
                    style={{ fill: chart.color("muted") }}
                >
                    {description}
                </tspan>
            ) : null}
        </text>
    );
}

ChartRadialText.displayName = "Chart.RadialText";

export default ChartRadialText;
