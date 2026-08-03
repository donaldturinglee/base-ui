import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import ChartLegend from "./ChartLegend";
import { getSeriesColor } from "./chartPalette";
import {
    CHART_PADDING,
    getAreaPath,
    getBandScale,
    getBarBand,
    getBarPath,
    getLinePath,
    getPointScale,
    getStackBounds,
    getValueDomain,
    getValueScale,
    MARK_GAP,
    readLabel,
    readValue,
} from "./chartScales";
import ChartTooltip from "./ChartTooltip";
import { useChartWidth } from "./useChartWidth";
import type { ChartProps, ChartReading, ChartResolvedSeries } from "./Chart.types";

const classes = {
    root: "chart",
    caption: "chart-caption",
    title: "chart-title",
    description: "chart-description",
    plot: "chart-plot",
    svg: "chart-svg",
    grid: "chart-grid",
    axis: "chart-axis",
    tick: "chart-tick",
    label: "chart-label",
    crosshair: "chart-crosshair",
    line: "chart-line",
    area: "chart-area",
    marker: "chart-marker",
    empty: "chart-empty",
    hidden: "sr-only",
};

// Roughly how wide a digit of the axis text is, which is all the room the ticks need to be
// given before the scale they come from can be built
const TICK_CHARACTER_WIDTH = 7;

const AXIS_GUTTER = 12;
const LABEL_GUTTER = 24;
const MAX_NAME_GUTTER = 160;

const DEFAULT_HEIGHT = 240;
const DEFAULT_WIDTH = 480;
const DEFAULT_TICK_COUNT = 4;

const formatValue = (value: number) => value.toLocaleString();

// A line, an area or a set of bars, drawn from rows of data and a list of what to plot out of
// them. Every point can be read with the pointer or with the arrow keys, and the whole of the
// data is laid out again as a table for a screen reader, so nothing on the chart is held only
// in its colours
function Chart(
    props: ChartProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        type = "line",
        data,
        xKey,
        series,
        title,
        description,
        stacked = false,
        horizontal = false,
        height = DEFAULT_HEIGHT,
        valueFormat = formatValue,
        labelFormat = (label: string) => label,
        tickCount = DEFAULT_TICK_COUNT,
        showGrid = true,
        showLegend,
        smooth = false,
        emptyText = "No data to show",
        className,
        ...rest
    } = props;

    const titleId = useId();
    const descriptionId = useId();
    const plotRef = React.useRef<HTMLDivElement>(null);
    const width = useChartWidth(plotRef, DEFAULT_WIDTH);

    const [hovered, setHovered] = React.useState<number | null>(null);

    const resolved: ChartResolvedSeries[] = series.map((entry, index) => ({
        ...entry,
        name: entry.name ?? entry.key,
        color: getSeriesColor(index, entry.color),
    }));

    const isBar = type === "bar";
    const isHorizontal = isBar && horizontal;
    const isStacked = stacked && (isBar || type === "area");
    const isEmpty = data.length === 0 || resolved.length === 0;

    const labels = data.map((datum) => readLabel(datum, xKey));
    const bounds = getStackBounds(data, resolved, isStacked);
    const domain = getValueDomain(bounds, type);

    // The ticks have to be known before the plot can be laid out, since what they are written
    // as is what settles how much room the axis takes. They are worked out on a scale of no
    // particular size and the real one is built once there is room for it
    const ticks = getValueScale(domain, [0, 1]).ticks(tickCount);
    const widestTick = Math.max(...ticks.map((tick) => valueFormat(tick).length), 1);
    const widestName = Math.max(...labels.map((label) => labelFormat(label).length), 1);

    const valueGutter = widestTick * TICK_CHARACTER_WIDTH + AXIS_GUTTER;
    const nameGutter = Math.min(widestName * TICK_CHARACTER_WIDTH + AXIS_GUTTER, MAX_NAME_GUTTER);

    const left = isHorizontal ? nameGutter : valueGutter;
    const innerWidth = Math.max(width - left - CHART_PADDING.right, 0);
    const innerHeight = Math.max(height - CHART_PADDING.top - LABEL_GUTTER, 0);

    // One axis carries the names and the other the values. Turning the bars on their side only
    // swaps which is which
    const nameScale = isBar
        ? getBandScale(labels, isHorizontal ? innerHeight : innerWidth)
        : getPointScale(labels, innerWidth);
    const valueScale = getValueScale(domain, isHorizontal ? [0, innerWidth] : [innerHeight, 0]);

    const namePosition = (index: number) => {
        const at = nameScale(labels[index]);

        return (at ?? 0) + (isBar ? (nameScale.bandwidth?.() ?? 0) / 2 : 0);
    };

    const readings: ChartReading[] = data.map((datum, index) => ({
        index,
        label: labels[index],
        values: resolved.map((entry) => ({ series: entry, value: readValue(datum, entry.key) })),
    }));

    const reading = hovered === null ? null : (readings[hovered] ?? null);

    // Which point the pointer is nearest. A band is answered anywhere along it, and a point on
    // a line by whichever is closest, so there is never a dead strip between two of them
    const findPoint = (offset: number) => {
        if (data.length === 0) {
            return null;
        }

        if (isBar) {
            const step = (isHorizontal ? innerHeight : innerWidth) / data.length;

            return Math.min(Math.max(Math.floor(offset / step), 0), data.length - 1);
        }

        let nearest = 0;

        data.forEach((_, index) => {
            if (Math.abs(namePosition(index) - offset) < Math.abs(namePosition(nearest) - offset)) {
                nearest = index;
            }
        });

        return nearest;
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const box = event.currentTarget.getBoundingClientRect();
        const offset = isHorizontal
            ? event.clientY - box.top - CHART_PADDING.top
            : event.clientX - box.left - left;

        setHovered(findPoint(offset));
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

        if (step === 0 || data.length === 0) {
            return;
        }

        // Taking the event keeps the page from scrolling away underneath the plot
        event.preventDefault();
        setHovered((current) => {
            const next = (current ?? (step > 0 ? -1 : data.length)) + step;

            return Math.min(Math.max(next, 0), data.length - 1);
        });
    };

    const showsLegend = showLegend ?? resolved.length > 1;
    const baseline = isHorizontal ? valueScale(0) : valueScale(0);

    const marks = resolved.map((entry, seriesIndex) => {
        if (isBar) {
            const bandwidth = nameScale.bandwidth?.() ?? 0;
            const { offset, thickness } = getBarBand(
                bandwidth,
                resolved.length,
                seriesIndex,
                !isStacked && resolved.length > 1,
            );

            return (
                <g key={entry.key} data-component="Chart.Series" data-series={entry.key}>
                    {data.map((_, index) => {
                        const { value, start, end } = bounds[index][seriesIndex];

                        if (value === null) {
                            return null;
                        }

                        const from = valueScale(start);
                        const to = valueScale(end);
                        const at = (nameScale(labels[index]) ?? 0) + offset;
                        // The surface shows through between one segment of a stack and the
                        // next, which is what separates them
                        const inset = isStacked && seriesIndex > 0 ? MARK_GAP : 0;

                        const path = isHorizontal
                            ? getBarPath(
                                  Math.min(from, to) + inset,
                                  at,
                                  Math.abs(to - from) - inset,
                                  thickness,
                                  value < 0 ? "left" : "right",
                              )
                            : getBarPath(
                                  at,
                                  Math.min(from, to),
                                  thickness,
                                  Math.abs(to - from) - inset,
                                  value < 0 ? "bottom" : "top",
                              );

                        return (
                            <path
                                key={labels[index]}
                                d={path}
                                fill={entry.color}
                                opacity={hovered === null || hovered === index ? 1 : 0.5}
                                data-component="Chart.Bar"
                            />
                        );
                    })}
                </g>
            );
        }

        const points = data.map((_, index) => ({
            x: namePosition(index),
            value: bounds[index][seriesIndex].value,
            start: bounds[index][seriesIndex].start,
        }));

        return (
            <g key={entry.key} data-component="Chart.Series" data-series={entry.key}>
                {type === "area" ? (
                    <path
                        d={getAreaPath(points, valueScale, smooth)}
                        fill={entry.color}
                        className={classes.area}
                        data-component="Chart.Area"
                    />
                ) : null}
                <path
                    d={getLinePath(
                        type === "area"
                            ? points.map((point) => ({
                                  ...point,
                                  value: point.value === null ? null : point.start + point.value,
                              }))
                            : points,
                        valueScale,
                        smooth,
                    )}
                    stroke={entry.color}
                    className={classes.line}
                    data-component="Chart.Line"
                />
                {points.map((point, index) =>
                    point.value === null || (hovered !== null && hovered !== index) ? null : (
                        <circle
                            key={labels[index]}
                            cx={point.x}
                            cy={valueScale(
                                type === "area" ? point.start + point.value : point.value,
                            )}
                            r={4}
                            fill={entry.color}
                            className={classes.marker}
                            // Only the point being read carries a marker on a run of many, so
                            // the line is not lost under its own dots
                            opacity={hovered === index || data.length <= 12 ? 1 : 0}
                            data-component="Chart.Marker"
                        />
                    ),
                )}
            </g>
        );
    });

    return (
        <figure
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Chart"
            data-type={type}
            {...rest}
        >
            {title || description ? (
                <figcaption className={classes.caption} data-component="Chart.Caption">
                    {title ? (
                        <span id={titleId} className={classes.title}>
                            {title}
                        </span>
                    ) : null}
                    {description ? (
                        <span id={descriptionId} className={classes.description}>
                            {description}
                        </span>
                    ) : null}
                </figcaption>
            ) : null}

            {showsLegend && !isEmpty ? <ChartLegend series={resolved} /> : null}

            <div
                ref={plotRef}
                className={classes.plot}
                style={{ height: `${height}px` }}
                tabIndex={isEmpty ? undefined : 0}
                role={isEmpty ? undefined : "img"}
                aria-labelledby={title ? titleId : undefined}
                aria-describedby={description ? descriptionId : undefined}
                onPointerMove={isEmpty ? undefined : handlePointerMove}
                onPointerLeave={() => setHovered(null)}
                onKeyDown={isEmpty ? undefined : handleKeyDown}
                onBlur={() => setHovered(null)}
                data-component="Chart.Plot"
            >
                {isEmpty ? (
                    <div className={classes.empty} style={{ height: `${height}px` }}>
                        {emptyText}
                    </div>
                ) : (
                    <svg
                        width={width}
                        height={height}
                        className={classes.svg}
                        aria-hidden="true"
                        focusable="false"
                        data-component="Chart.Canvas"
                    >
                        <g transform={`translate(${left}, ${CHART_PADDING.top})`}>
                            {showGrid
                                ? ticks.map((tick) => (
                                      <line
                                          key={tick}
                                          x1={isHorizontal ? valueScale(tick) : 0}
                                          x2={isHorizontal ? valueScale(tick) : innerWidth}
                                          y1={isHorizontal ? 0 : valueScale(tick)}
                                          y2={isHorizontal ? innerHeight : valueScale(tick)}
                                          className={classes.grid}
                                          data-component="Chart.GridLine"
                                      />
                                  ))
                                : null}

                            {/* The baseline is drawn a shade stronger than the rest, since it
                                is what the marks are read against rather than a guide */}
                            <line
                                x1={isHorizontal ? baseline : 0}
                                x2={isHorizontal ? baseline : innerWidth}
                                y1={isHorizontal ? 0 : baseline}
                                y2={isHorizontal ? innerHeight : baseline}
                                className={classes.axis}
                                data-component="Chart.Baseline"
                            />

                            {reading ? (
                                <line
                                    x1={isHorizontal ? 0 : namePosition(reading.index)}
                                    x2={isHorizontal ? innerWidth : namePosition(reading.index)}
                                    y1={isHorizontal ? namePosition(reading.index) : 0}
                                    y2={isHorizontal ? namePosition(reading.index) : innerHeight}
                                    className={classes.crosshair}
                                    data-component="Chart.Crosshair"
                                />
                            ) : null}

                            {marks}

                            {ticks.map((tick) => (
                                <text
                                    key={tick}
                                    x={isHorizontal ? valueScale(tick) : -AXIS_GUTTER / 2}
                                    y={
                                        isHorizontal
                                            ? innerHeight + LABEL_GUTTER / 2
                                            : valueScale(tick)
                                    }
                                    textAnchor={isHorizontal ? "middle" : "end"}
                                    dominantBaseline={isHorizontal ? "hanging" : "middle"}
                                    className={classes.tick}
                                    data-component="Chart.Tick"
                                >
                                    {valueFormat(tick)}
                                </text>
                            ))}

                            {labels.map((label, index) => (
                                <text
                                    key={label}
                                    x={isHorizontal ? -AXIS_GUTTER / 2 : namePosition(index)}
                                    y={
                                        isHorizontal
                                            ? namePosition(index)
                                            : innerHeight + LABEL_GUTTER / 2
                                    }
                                    textAnchor={isHorizontal ? "end" : "middle"}
                                    dominantBaseline={isHorizontal ? "middle" : "hanging"}
                                    className={classes.label}
                                    data-component="Chart.Label"
                                >
                                    {labelFormat(label)}
                                </text>
                            ))}
                        </g>
                    </svg>
                )}

                {reading ? (
                    <ChartTooltip
                        reading={reading}
                        valueFormat={valueFormat}
                        labelFormat={labelFormat}
                        style={{
                            left: isHorizontal
                                ? left + innerWidth / 2
                                : left + namePosition(reading.index),
                        }}
                    />
                ) : null}
            </div>

            {/* Everything the chart is drawn from, written out again. It is what a screen
                reader reads, and what carries the values the marks only show */}
            <table
                className={classes.hidden}
                // Named by the same words that name the plot rather than by a caption of its
                // own, so the chart says what it is once rather than twice over
                aria-labelledby={title ? titleId : undefined}
                data-component="Chart.Table"
            >
                <thead>
                    <tr>
                        <th scope="col">{xKey}</th>
                        {resolved.map((entry) => (
                            <th key={entry.key} scope="col">
                                {entry.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {readings.map((row) => (
                        <tr key={row.label}>
                            <th scope="row">{labelFormat(row.label)}</th>
                            {row.values.map(({ series: entry, value }) => (
                                <td key={entry.key}>{value === null ? "—" : valueFormat(value)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* The point being read is said out loud as the reader moves through the plot with
                the arrow keys, which is what stands in for the readout they cannot see */}
            <span role="status" aria-live="polite" className={classes.hidden}>
                {reading
                    ? `${labelFormat(reading.label)}: ${reading.values
                          .map(
                              ({ series: entry, value }) =>
                                  `${entry.name} ${value === null ? "no value" : valueFormat(value)}`,
                          )
                          .join(", ")}`
                    : ""}
            </span>
        </figure>
    );
}

Chart.displayName = "Chart";

export default fixedForwardRef(Chart);
