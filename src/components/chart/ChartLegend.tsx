import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ChartLegendProps } from "./Chart.types";

const classes = {
    root: "flex flex-wrap items-center gap-x-[var(--base-size-16)] gap-y-[var(--base-size-4)] m-0 list-none p-0",
    item: "flex items-center gap-[var(--base-size-6)] [color:var(--foreground-color-muted)] [font-size:var(--text-body-size-small)] [line-height:var(--text-body-line-height-small)]",
    // The colour is carried by the swatch beside the name rather than by the name itself. A
    // light hue is unreadable as text, and identity that lives only in the text colour is
    // identity a colour-blind reader cannot get at
    swatch: "size-[var(--base-size-8)] shrink-0 rounded-[var(--border-radius-full)]",
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
