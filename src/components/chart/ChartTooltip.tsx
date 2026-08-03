import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ChartTooltipProps } from "./Chart.types";

const classes = {
    root: "chart-tooltip",
    label: "chart-tooltip-label",
    row: "chart-tooltip-row",
    swatch: "chart-swatch",
    name: "chart-tooltip-name",
    value: "chart-tooltip-value",
};

// What every series had at the point the reader is on. The colour comes from the swatch beside
// each name; the text itself keeps the colours text has everywhere else
function ChartTooltip(
    props: ChartTooltipProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { reading, valueFormat, labelFormat, className, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Chart.Tooltip"
            {...rest}
        >
            <div className={classes.label}>{labelFormat(reading.label)}</div>
            {reading.values.map(({ series, value }) => (
                <div key={series.key} className={classes.row}>
                    <span
                        className={classes.swatch}
                        style={{ background: series.color }}
                        aria-hidden="true"
                    />
                    <span className={classes.name}>{series.name}</span>
                    <span className={classes.value}>
                        {value === null ? "—" : valueFormat(value)}
                    </span>
                </div>
            ))}
        </div>
    );
}

ChartTooltip.displayName = "Chart.Tooltip";

export default fixedForwardRef(ChartTooltip);
