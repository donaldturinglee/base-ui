import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ChartTooltipProps } from "./Chart.types";

const classes = {
    root: "pointer-events-none absolute top-0 z-1 min-w-[var(--base-size-112)] -translate-x-1/2 rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-border-default bg-[var(--overlay-background-color)] p-[var(--base-size-8)] [box-shadow:var(--shadow-floating-small)]",
    label: "mb-[var(--base-size-4)] text-foreground-default [font-size:var(--text-body-size-small)] [font-weight:var(--base-text-weight-semibold)] [line-height:var(--text-body-line-height-small)]",
    row: "flex items-center gap-[var(--base-size-6)] [font-size:var(--text-body-size-small)] [line-height:var(--text-body-line-height-small)]",
    swatch: "size-[var(--base-size-8)] shrink-0 rounded-[var(--border-radius-full)]",
    name: "grow text-foreground-muted",
    // A column of numbers is the one place the digits are held to the same width, so that they
    // line up down the readout
    value: "text-foreground-default [font-variant-numeric:tabular-nums] [font-weight:var(--base-text-weight-semibold)]",
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
