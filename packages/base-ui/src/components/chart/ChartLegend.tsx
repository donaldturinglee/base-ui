import * as React from "react";
import { classNames } from "../../lib/classnames";
import { useChartContext } from "./ChartContext";
import { getProp } from "./useChart";
import type { ChartLegendProps } from "./Chart.types";

const classes = {
    root: "chart-legend",
    title: "chart-legend-title",
    list: "chart-legend-list",
    item: "chart-legend-item",
    control: "chart-legend-control",
    swatch: "chart-swatch",
    label: "chart-legend-label",
};

// What each series is called, beside the colour it is drawn in. It stands wherever there is
// more than one thing on the chart to tell apart.
//
// Recharts hands it what it drew rather than what it was asked to draw, so the entries here are
// the marks that made it onto the plot. Reading one of them lights that series up and holds the
// rest back, which is the only way a chart with several lines crossing can be read a line at a
// time. Where that is done by clicking it is a button, since a reader without a pointer has
// nothing to hover with
function ChartLegend(props: ChartLegendProps) {
    const {
        payload,
        align = "center",
        verticalAlign = "bottom",
        layout = "auto",
        title,
        nameKey,
        interaction = "hover",
        className,
    } = props;

    const chart = useChartContext();

    // A legend standing beside the plot has a column's worth of room and no width to spare,
    // while one under it has the whole width and no height, so which way the names run follows
    // where the legend was put unless the caller has said otherwise
    const orientation =
        layout === "auto" ? (align === "center" ? "horizontal" : "vertical") : layout;

    // Recharts marks the parts of a chart it drew but has nothing to say about — the invisible
    // half of a stacked bar, an axis it laid out — as having neither colour nor shape. They are
    // not series, and naming them would put entries in the legend the reader cannot find
    const entries = payload?.filter((item) => item.color !== "none" || item.type !== "none");

    if (!entries?.length) {
        return null;
    }

    return (
        <div
            className={classNames(classes.root, className)}
            data-component="Chart.Legend"
            data-align={align}
            data-vertical-align={verticalAlign}
        >
            {title ? <div className={classes.title}>{title}</div> : null}

            <ul className={classes.list} data-orientation={orientation}>
                {entries.map((item, index) => {
                    const config = chart.getSeries(item);
                    const name = config?.name;
                    const label = getProp<React.ReactNode>(item.payload, nameKey) ?? config?.label;

                    const content = (
                        <>
                            {config?.icon ?? (
                                <span
                                    className={classes.swatch}
                                    style={{ background: chart.color(config?.color) }}
                                    aria-hidden="true"
                                />
                            )}
                            <span className={classes.label}>{label}</span>
                        </>
                    );

                    return (
                        <li
                            key={`${name ?? "series"}-${index}`}
                            className={classes.item}
                            data-component="Chart.LegendItem"
                            data-series={name}
                            style={{ opacity: chart.getSeriesOpacity(name, 0.6) }}
                        >
                            {interaction === "click" ? (
                                <button
                                    type="button"
                                    className={classes.control}
                                    // The button says whether the series it names is the one
                                    // being read, which is what the fading on the plot shows
                                    aria-pressed={chart.isHighlightedSeries(name)}
                                    onClick={() => {
                                        if (!name) {
                                            return;
                                        }

                                        chart.setHighlightedSeries((previous) =>
                                            previous === name ? null : name,
                                        );
                                    }}
                                >
                                    {content}
                                </button>
                            ) : (
                                <span
                                    className={classes.control}
                                    onMouseEnter={() => chart.setHighlightedSeries(name ?? null)}
                                    onMouseLeave={() => chart.setHighlightedSeries(null)}
                                >
                                    {content}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

ChartLegend.displayName = "Chart.Legend";

export default ChartLegend;
