import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ChartLegendProps } from "./Chart.types";

const classes = {
    root: "chart-legend",
    item: "chart-legend-item",
    swatch: "chart-swatch",
};

// What each series is called, beside the colour it is drawn in. It stands wherever there is
// more than one thing on the chart to tell apart
function ChartLegend(
    props: ChartLegendProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { series, className, ...rest } = props;

    return (
        <ul
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Chart.Legend"
            {...rest}
        >
            {series.map((entry) => (
                <li key={entry.key} className={classes.item} data-component="Chart.LegendItem">
                    <span
                        className={classes.swatch}
                        style={{ background: entry.color }}
                        aria-hidden="true"
                    />
                    {entry.name}
                </li>
            ))}
        </ul>
    );
}

ChartLegend.displayName = "Chart.Legend";

export default fixedForwardRef(ChartLegend);
