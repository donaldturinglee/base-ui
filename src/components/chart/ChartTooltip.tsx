import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { useChartContext } from "./ChartContext";
import { getProp } from "./useChart";
import type { ChartTooltipProps } from "./Chart.types";

const classes = {
    root: "chart-tooltip",
    label: "chart-tooltip-label",
    rows: "chart-tooltip-rows",
    row: "chart-tooltip-row",
    swatch: "chart-swatch",
    name: "chart-tooltip-name",
    value: "chart-tooltip-value",
    divider: "chart-tooltip-divider",
};

// What every series had at the point the reader is on. The colour comes from the swatch beside
// each name; the text itself keeps the colours text has everywhere else, since a hue chosen to
// tell one line from another is rarely one that reads as words.
//
// Recharts settles where this stands and when, and hands it what the reader is over. All that
// is left is to say what a row of it looks like
function ChartTooltip(props: ChartTooltipProps) {
    const {
        payload: payloadProp,
        label,
        labelFormatter,
        hideLabel,
        hideIndicator,
        hideSeriesLabel,
        showTotal,
        fitContent,
        nameKey,
        indicator = "dot",
        formatter,
        render,
        className,
    } = props;

    const chart = useChartContext();

    // The parts of the chart recharts drew but has nothing to say about are not readings, and
    // a row for one of them would name a series the reader cannot see
    const payload = payloadProp?.filter((item) => item.color !== "none" || item.type !== "none");

    const total = React.useMemo(() => chart.getPayloadTotal(payload), [chart, payload]);

    // What names the point the reader is on: the name on the row where the caller said where to
    // find it, and otherwise whatever the axis is calling that point.
    //
    // Recharts draws the readout while the reader is on nothing at all, so that it has its
    // measurements ready for when they are. There is no point to name then, and working one out
    // anyway would hand a caller who writes their labels as dates or as money the standing-in
    // `value` to make one out of
    const tooltipLabel = React.useMemo(() => {
        const item = payload?.[0];

        if (!item) {
            return undefined;
        }

        const name = `${getProp(item.payload, nameKey) ?? label ?? item.dataKey ?? "value"}`;

        return labelFormatter?.(name, payload ?? []) ?? name;
    }, [label, labelFormatter, nameKey, payload]);

    if (!payload?.length) {
        return null;
    }

    const formatValue = (value: unknown, name: React.ReactNode) => {
        const formatted = formatter
            ? formatter(value, name)
            : (value as { toLocaleString?: () => string })?.toLocaleString?.();

        return Array.isArray(formatted) ? formatted : [formatted, name];
    };

    return (
        <div
            className={classNames(classes.root, className)}
            data-component="Chart.Tooltip"
            data-fit-content={fitContent ? "" : undefined}
        >
            {hideLabel ? null : <div className={classes.label}>{tooltipLabel}</div>}

            <div className={classes.rows}>
                {payload.map((item, index) => {
                    if (render) {
                        return <React.Fragment key={index}>{render(item.payload)}</React.Fragment>;
                    }

                    const config = chart.getSeries(item);
                    const [value, name] = formatValue(item.value, config?.label ?? item.name);

                    return (
                        <div
                            key={index}
                            className={classes.row}
                            data-component="Chart.TooltipRow"
                            data-series={config?.name}
                        >
                            {config?.icon ??
                                (config?.color && !hideIndicator ? (
                                    <span
                                        className={classes.swatch}
                                        data-indicator={indicator}
                                        style={{ background: chart.color(config.color) }}
                                        aria-hidden="true"
                                    />
                                ) : null)}

                            {hideSeriesLabel ? null : <span className={classes.name}>{name}</span>}
                            <span className={classes.value}>{value}</span>
                        </div>
                    );
                })}
            </div>

            {showTotal && total !== undefined ? (
                <>
                    <hr className={classes.divider} />

                    <div className={classes.row} data-component="Chart.TooltipTotal">
                        <span className={classes.name}>Total</span>
                        <span className={classes.value}>{formatValue(total, "")[0]}</span>
                    </div>
                </>
            ) : null}
        </div>
    );
}

ChartTooltip.displayName = "Chart.Tooltip";

export default ChartTooltip;
