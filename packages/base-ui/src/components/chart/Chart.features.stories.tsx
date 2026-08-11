import type { StoryFn } from "@storybook/react-vite";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Label,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
    ZAxis,
} from "recharts";
import { Chart, useChart } from ".";

const classes = {
    frame: "w-[var(--overlay-width-large)] max-w-full",
    // The shape of the plot comes through a custom property, so a caller can square it off or
    // draw it as a strip without having to say what height it stands at
    square: "[--chart-aspect-ratio:1]",
    strip: "[--chart-aspect-ratio:6]",
};

const traffic = [
    { month: "Jan", visits: 1240, signups: 320 },
    { month: "Feb", visits: 1810, signups: 455 },
    { month: "Mar", visits: 1490, signups: 380 },
    { month: "Apr", visits: 2260, signups: 610 },
    { month: "May", visits: 2040, signups: 590 },
    { month: "Jun", visits: 2870, signups: 780 },
];

const revenue = [
    { day: "2026-01-05", amount: 4120 },
    { day: "2026-01-06", amount: 3980 },
    { day: "2026-01-07", amount: 5240 },
    { day: "2026-01-08", amount: 4870 },
    { day: "2026-01-09", amount: 6310 },
];

const browsers = [
    { name: "Chrome", share: 62, color: "blue" },
    { name: "Safari", share: 19, color: "orange" },
    { name: "Edge", share: 11, color: "purple" },
    { name: "Firefox", share: 8, color: "green" },
];

const scores = [
    { skill: "Speed", team: 82, benchmark: 65 },
    { skill: "Reach", team: 74, benchmark: 70 },
    { skill: "Cost", team: 58, benchmark: 72 },
    { skill: "Support", team: 91, benchmark: 66 },
    { skill: "Uptime", team: 88, benchmark: 84 },
];

const sessions = [
    { minutes: 3, pages: 2, weight: 120 },
    { minutes: 8, pages: 5, weight: 260 },
    { minutes: 12, pages: 4, weight: 180 },
    { minutes: 17, pages: 9, weight: 340 },
    { minutes: 24, pages: 7, weight: 210 },
    { minutes: 31, pages: 13, weight: 400 },
];

const trafficSeries = [
    { name: "visits" as const, label: "Visits" },
    { name: "signups" as const, label: "Sign ups" },
];

export default {
    title: "Components/Chart/Features",
};

// A Line, which is what a trend read over time is drawn as
export const LineSeries: StoryFn = () => {
    const chart = useChart({ data: traffic, series: trafficSeries });

    return (
        <div className={classes.frame}>
            <Chart chart={chart}>
                <LineChart data={chart.data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={chart.key("month")} tickLine={false} axisLine={false} />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={chart.formatNumber({ notation: "compact" })}
                    />
                    <Tooltip cursor={false} content={<Chart.Tooltip />} />
                    <Legend content={<Chart.Legend />} />
                    {chart.series.map((item) => (
                        <Line
                            key={String(item.name)}
                            dataKey={chart.key(item.name)}
                            name={String(item.label)}
                            stroke={chart.color(item.color)}
                            strokeOpacity={chart.getSeriesOpacity(String(item.name))}
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </Chart>
        </div>
    );
};

// An Area, which is a single trend given weight. The wash under the line goes before it reaches
// the bottom of the plot, so what is read there is still the line rather than the block
export const AreaSeries: StoryFn = () => {
    const chart = useChart({ data: traffic, series: [{ name: "visits", label: "Visits" }] });

    return (
        <div className={classes.frame}>
            <Chart chart={chart}>
                <AreaChart data={chart.data}>
                    <defs>
                        {chart.series.map((item) => (
                            <Chart.Gradient
                                key={String(item.name)}
                                id={`${chart.id}-${String(item.name)}`}
                                stops={[
                                    { color: item.color, offset: "0%", opacity: 0.35 },
                                    { color: item.color, offset: "100%", opacity: 0 },
                                ]}
                            />
                        ))}
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={chart.key("month")} tickLine={false} axisLine={false} />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={chart.formatNumber({ notation: "compact" })}
                    />
                    <Tooltip cursor={false} content={<Chart.Tooltip hideSeriesLabel />} />
                    {chart.series.map((item) => (
                        <Area
                            key={String(item.name)}
                            type="natural"
                            dataKey={chart.key(item.name)}
                            name={String(item.label)}
                            stroke={chart.color(item.color)}
                            strokeWidth={2}
                            fill={`url(#${chart.id}-${String(item.name)})`}
                        />
                    ))}
                </AreaChart>
            </Chart>
        </div>
    );
};

// Bars, for holding one thing against another at each point rather than following a trend
export const BarSeries: StoryFn = () => {
    const chart = useChart({ data: traffic, series: trafficSeries });

    return (
        <div className={classes.frame}>
            <Chart chart={chart}>
                <BarChart data={chart.data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={chart.key("month")} tickLine={false} axisLine={false} />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={chart.formatNumber({ notation: "compact" })}
                    />
                    <Tooltip content={<Chart.Tooltip />} />
                    <Legend content={<Chart.Legend />} />
                    {chart.series.map((item) => (
                        <Bar
                            key={String(item.name)}
                            dataKey={chart.key(item.name)}
                            name={String(item.label)}
                            fill={chart.color(item.color)}
                            fillOpacity={chart.getSeriesOpacity(String(item.name))}
                            radius={4}
                        />
                    ))}
                </BarChart>
            </Chart>
        </div>
    );
};

// Stacked Bars, where the series share a stack id, so what is read at each point is the whole of
// it as well as the parts it is made of
export const StackedBars: StoryFn = () => {
    const chart = useChart({
        data: traffic,
        series: [
            { name: "visits", label: "Visits", stackId: "traffic" },
            { name: "signups", label: "Sign ups", stackId: "traffic" },
        ],
    });

    return (
        <div className={classes.frame}>
            <Chart chart={chart}>
                <BarChart data={chart.data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={chart.key("month")} tickLine={false} axisLine={false} />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={chart.formatNumber({ notation: "compact" })}
                    />
                    <Tooltip content={<Chart.Tooltip showTotal />} />
                    <Legend content={<Chart.Legend />} />
                    {chart.series.map((item) => (
                        <Bar
                            key={String(item.name)}
                            dataKey={chart.key(item.name)}
                            name={String(item.label)}
                            stackId={item.stackId}
                            fill={chart.color(item.color)}
                            radius={[4, 4, 0, 0]}
                        />
                    ))}
                </BarChart>
            </Chart>
        </div>
    );
};

// Bars On Their Side, which is what long names need: read down the left they are given a line
// each rather than being turned on end or cut short
export const HorizontalBars: StoryFn = () => {
    // Every bar is drawn from the same key, so what tells them apart is the row rather than the
    // series. Naming a series here would give the readout one colour and one name for the whole
    // of it, when the colour and the name it wants are the ones on the row the reader is over
    const chart = useChart({
        data: browsers,
        sort: { by: "share", direction: "desc" },
    });

    return (
        <div className={classes.frame}>
            <Chart chart={chart}>
                <BarChart data={chart.data} layout="vertical">
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" tickLine={false} axisLine={false} />
                    <YAxis
                        type="category"
                        dataKey={chart.key("name")}
                        tickLine={false}
                        axisLine={false}
                        width={80}
                    />
                    <Tooltip content={<Chart.Tooltip hideLabel fitContent />} />
                    <Bar dataKey={chart.key("share")} name="Share" radius={4}>
                        {chart.data.map((row) => (
                            <Cell key={row.name} fill={chart.color(row.color)} />
                        ))}
                    </Bar>
                </BarChart>
            </Chart>
        </div>
    );
};

// A Pie, for the parts of one whole. The colour is on each row rather than on a series, since
// every slice is drawn from the same key
export const PieSlices: StoryFn = () => {
    const chart = useChart({ data: browsers });

    return (
        <div className={classes.frame}>
            <Chart chart={chart} className={classes.square}>
                <PieChart>
                    <Tooltip content={<Chart.Tooltip hideLabel fitContent />} />
                    <Legend content={<Chart.Legend nameKey="name" />} />
                    <Pie data={chart.data} dataKey={chart.key("share")} nameKey="name">
                        {chart.data.map((row) => (
                            <Cell key={row.name} fill={chart.color(row.color)} />
                        ))}
                    </Pie>
                </PieChart>
            </Chart>
        </div>
    );
};

// A Ring, which is a pie with its middle taken out, and what the whole of it comes to written
// where the hole is
export const DonutWithATotal: StoryFn = () => {
    const chart = useChart({ data: browsers });

    return (
        <div className={classes.frame}>
            <Chart chart={chart} className={classes.square}>
                <PieChart>
                    <Tooltip content={<Chart.Tooltip hideLabel fitContent />} />
                    <Pie
                        data={chart.data}
                        dataKey={chart.key("share")}
                        nameKey="name"
                        innerRadius="60%"
                        outerRadius="80%"
                        paddingAngle={2}
                    >
                        <Label
                            content={({ viewBox }) => (
                                <Chart.RadialText
                                    viewBox={viewBox}
                                    title={`${chart.getTotal("share")}%`}
                                    description="Measured"
                                />
                            )}
                        />
                        {chart.data.map((row) => (
                            <Cell key={row.name} fill={chart.color(row.color)} />
                        ))}
                    </Pie>
                </PieChart>
            </Chart>
        </div>
    );
};

// A Radar, for holding several readings of the same kind against one another at once
export const RadarSeries: StoryFn = () => {
    const chart = useChart({
        data: scores,
        series: [
            { name: "team", label: "This team" },
            { name: "benchmark", label: "Benchmark" },
        ],
    });

    return (
        <div className={classes.frame}>
            <Chart chart={chart} className={classes.square}>
                <RadarChart data={chart.data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey={chart.key("skill")} />
                    <Tooltip content={<Chart.Tooltip />} />
                    <Legend content={<Chart.Legend />} />
                    {chart.series.map((item) => (
                        <Radar
                            key={String(item.name)}
                            dataKey={chart.key(item.name)}
                            name={String(item.label)}
                            stroke={chart.color(item.color)}
                            fill={chart.color(item.color)}
                            fillOpacity={0.15}
                        />
                    ))}
                </RadarChart>
            </Chart>
        </div>
    );
};

// Points, for two readings taken together, where what is being looked for is whether one moves
// with the other rather than what either did over time
export const ScatterPoints: StoryFn = () => {
    const chart = useChart({ data: sessions, series: [{ name: "pages", label: "Sessions" }] });

    return (
        <div className={classes.frame}>
            <Chart chart={chart}>
                <ScatterChart>
                    <CartesianGrid />
                    <XAxis
                        type="number"
                        dataKey={chart.key("minutes")}
                        name="Minutes"
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        type="number"
                        dataKey={chart.key("pages")}
                        name="Pages"
                        tickLine={false}
                        axisLine={false}
                    />
                    <ZAxis type="number" dataKey={chart.key("weight")} range={[40, 200]} />
                    <Tooltip content={<Chart.Tooltip hideLabel />} />
                    {chart.series.map((item) => (
                        <Scatter
                            key={String(item.name)}
                            data={chart.data}
                            name={String(item.label)}
                            fill={chart.color(item.color)}
                            fillOpacity={0.6}
                        />
                    ))}
                </ScatterChart>
            </Chart>
        </div>
    );
};

// A Sparkline, which is the shape of a trend and nothing else. There is no room at this size for
// axes or a legend, so what it stands beside has to say what it is
export const Sparkline: StoryFn = () => {
    const chart = useChart({ data: traffic, series: [{ name: "visits" }] });

    return (
        <div className={classes.frame}>
            <Chart
                chart={chart}
                className={classes.strip}
                role="img"
                aria-label="Visits over the first half of the year"
            >
                <LineChart data={chart.data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                    {chart.series.map((item) => (
                        <Line
                            key={String(item.name)}
                            dataKey={chart.key(item.name)}
                            stroke={chart.color(item.color)}
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </Chart>
        </div>
    );
};

// A Legend Beside The Plot, which is where a run of names is easier to read down than across
export const LegendBesideThePlot: StoryFn = () => {
    const chart = useChart({ data: traffic, series: trafficSeries });

    return (
        <div className={classes.frame}>
            <Chart chart={chart}>
                <LineChart data={chart.data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={chart.key("month")} tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} content={<Chart.Tooltip />} />
                    <Legend
                        align="right"
                        verticalAlign="middle"
                        layout="vertical"
                        content={<Chart.Legend title="Series" />}
                    />
                    {chart.series.map((item) => (
                        <Line
                            key={String(item.name)}
                            dataKey={chart.key(item.name)}
                            name={String(item.label)}
                            stroke={chart.color(item.color)}
                            strokeOpacity={chart.getSeriesOpacity(String(item.name))}
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </Chart>
        </div>
    );
};

// Reading One Series At A Time, held rather than let go of. A reader without a pointer has
// nothing to hover with, so where the highlight is worth having it is put on a button
export const HighlightOnClick: StoryFn = () => {
    const chart = useChart({ data: traffic, series: trafficSeries });

    return (
        <div className={classes.frame}>
            <Chart chart={chart}>
                <BarChart data={chart.data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={chart.key("month")} tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip content={<Chart.Tooltip />} />
                    <Legend content={<Chart.Legend interaction="click" />} />
                    {chart.series.map((item) => (
                        <Bar
                            key={String(item.name)}
                            dataKey={chart.key(item.name)}
                            name={String(item.label)}
                            fill={chart.color(item.color)}
                            fillOpacity={chart.getSeriesOpacity(String(item.name))}
                            radius={4}
                        />
                    ))}
                </BarChart>
            </Chart>
        </div>
    );
};

// Values Written As Money, in the readout and along the axis alike, so that the same number is
// never written two ways on the one chart
export const FormattedValues: StoryFn = () => {
    const chart = useChart({
        data: revenue,
        // The colour belongs to the series rather than to the mark, so that the swatch in the
        // readout is drawn from the same place the area is and the two cannot drift apart
        series: [{ name: "amount", label: "Revenue", color: "green" }],
        locale: "en-GB",
    });

    const currency = chart.formatNumber({
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0,
    });

    const date = chart.formatDate({ day: "numeric", month: "short" });

    return (
        <div className={classes.frame}>
            <Chart chart={chart}>
                <AreaChart data={chart.data}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey={chart.key("day")}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={date}
                    />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={currency} />
                    <Tooltip
                        cursor={false}
                        content={
                            <Chart.Tooltip
                                labelFormatter={(label) => date(String(label))}
                                formatter={(value) => currency(Number(value))}
                            />
                        }
                    />
                    {chart.series.map((item) => (
                        <Area
                            key={String(item.name)}
                            type="natural"
                            dataKey={chart.key(item.name)}
                            name={String(item.label)}
                            stroke={chart.color(item.color)}
                            strokeWidth={2}
                            fill={chart.color(item.color)}
                            fillOpacity={0.12}
                        />
                    ))}
                </AreaChart>
            </Chart>
        </div>
    );
};

// Rows Put In Order before they are drawn, which is what a chart comparing one thing against
// another wants: read down the bars, the order is the answer
export const SortedRows: StoryFn = () => {
    const chart = useChart({
        data: browsers,
        sort: { by: "share", direction: "asc" },
    });

    return (
        <div className={classes.frame}>
            <Chart chart={chart}>
                <BarChart data={chart.data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={chart.key("name")} tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} unit="%" />
                    <Tooltip content={<Chart.Tooltip hideLabel fitContent />} />
                    <Bar dataKey={chart.key("share")} name="Share" radius={[4, 4, 0, 0]}>
                        {chart.data.map((row) => (
                            <Cell key={row.name} fill={chart.color(row.color)} />
                        ))}
                    </Bar>
                </BarChart>
            </Chart>
        </div>
    );
};

// A Readout With A Rule Under It, for a stack whose whole is worth as much as its parts
export const TooltipWithATotal: StoryFn = () => {
    const chart = useChart({
        data: traffic,
        series: [
            { name: "visits", label: "Visits", stackId: "traffic" },
            { name: "signups", label: "Sign ups", stackId: "traffic" },
        ],
    });

    return (
        <div className={classes.frame}>
            <Chart chart={chart}>
                <AreaChart data={chart.data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={chart.key("month")} tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip content={<Chart.Tooltip indicator="line" showTotal />} />
                    <Legend content={<Chart.Legend />} />
                    {chart.series.map((item) => (
                        <Area
                            key={String(item.name)}
                            type="natural"
                            dataKey={chart.key(item.name)}
                            name={String(item.label)}
                            stackId={item.stackId}
                            stroke={chart.color(item.color)}
                            strokeWidth={2}
                            fill={chart.color(item.color)}
                            fillOpacity={0.15}
                        />
                    ))}
                </AreaChart>
            </Chart>
        </div>
    );
};

// A Squarer Plot, set through the ratio rather than a height, so the shape holds at whatever
// width the chart is given
export const CustomAspectRatio: StoryFn = () => {
    const chart = useChart({
        data: traffic,
        series: [{ name: "visits", label: "Visits", color: "purple" }],
    });

    return (
        <div className={classes.frame}>
            <Chart chart={chart} className={classes.square}>
                <BarChart data={chart.data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={chart.key("month")} tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip content={<Chart.Tooltip hideLabel fitContent />} />
                    {chart.series.map((item) => (
                        <Bar
                            key={String(item.name)}
                            dataKey={chart.key(item.name)}
                            name={String(item.label)}
                            fill={chart.color(item.color)}
                            radius={[4, 4, 0, 0]}
                        />
                    ))}
                </BarChart>
            </Chart>
        </div>
    );
};
