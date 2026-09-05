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
import {
    Chart as ChartComponent,
    Heading,
    Stack,
    Text,
    useChart,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample, ComponentExternalPackage } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A chart is measured rather than told a size: it takes the width of whatever it was put in and
    // works its height out from the ratio. The page gives it a width to take rather than running
    // every plot the whole way across the card
    preview: "w-full max-w-[40rem]",
    // The shape of the plot comes through a custom property, so a plot can be squared off or drawn
    // as a strip without being told what height to stand at
    square: "[--chart-aspect-ratio:1]",
    strip: "[--chart-aspect-ratio:6]",
};

// What the plot itself is drawn out of. The marks, the axes and the grid are recharts' own; what
// the library adds is the room they are drawn in, the palette they are coloured from, and a legend
// and a readout that look like the rest of it. A listing reaches for both, so the page says which
// names came from which — and says so outright rather than leaving them to be told apart by the
// look of them, since Label and Tooltip are names the library uses as well
const recharts: ComponentExternalPackage = {
    name: "recharts",
    exports: [
        "Area",
        "AreaChart",
        "Bar",
        "BarChart",
        "CartesianGrid",
        "Cell",
        "Label",
        "Legend",
        "Line",
        "LineChart",
        "Pie",
        "PieChart",
        "PolarAngleAxis",
        "PolarGrid",
        "Radar",
        "RadarChart",
        "Scatter",
        "ScatterChart",
        "Tooltip",
        "XAxis",
        "YAxis",
        "ZAxis",
    ],
};

// What the examples are drawn from. Each is written once here and again in the setup of whichever
// examples read it, since a chart says nothing without the rows behind it and a reader copying one
// out has to be handed them too
const traffic = [
    { month: "Jan", visits: 1240, signups: 320 },
    { month: "Feb", visits: 1810, signups: 455 },
    { month: "Mar", visits: 1490, signups: 380 },
    { month: "Apr", visits: 2260, signups: 610 },
    { month: "May", visits: 2040, signups: 590 },
    { month: "Jun", visits: 2870, signups: 780 },
];

// The colour is on the row rather than on a series, since every slice and every bar here is drawn
// from the one key: what tells them apart is which row they came from
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

const revenue = [
    { day: "2026-01-05", amount: 4120 },
    { day: "2026-01-06", amount: 3980 },
    { day: "2026-01-07", amount: 5240 },
    { day: "2026-01-08", amount: 4870 },
    { day: "2026-01-09", amount: 6310 },
];

const trafficSeries = [
    { name: "visits" as const, label: "Visits" },
    { name: "signups" as const, label: "Sign ups" },
];

// What each example has to have in hand before it can be drawn: the rows, and the chart built from
// them. Every one of them holds a chart, since useChart is what a caller reaches for while laying
// the marks out — which is also why every preview on this page is a component of its own rather
// than an element the page holds ready
const trafficRows = `const traffic = [
    { month: "Jan", visits: 1240, signups: 320 },
    { month: "Feb", visits: 1810, signups: 455 },
    { month: "Mar", visits: 1490, signups: 380 },
    { month: "Apr", visits: 2260, signups: 610 },
    { month: "May", visits: 2040, signups: 590 },
    { month: "Jun", visits: 2870, signups: 780 },
];`;

const browserRows = `const browsers = [
    { name: "Chrome", share: 62, color: "blue" },
    { name: "Safari", share: 19, color: "orange" },
    { name: "Edge", share: 11, color: "purple" },
    { name: "Firefox", share: 8, color: "green" },
];`;

const trafficSetup = `${trafficRows}

const chart = useChart({
    data: traffic,
    series: [
        { name: "visits", label: "Visits" },
        { name: "signups", label: "Sign ups" },
    ],
});`;

// The plainest chart there is: a trend read over time, with the grid, the axes, the readout and the
// legend a chart is usually given.
//
// The chart is built once and handed to everything that has to know what is being plotted, so the
// name, the colour and the format are said once rather than repeated at every axis, mark, legend
// and readout. What the plot itself is made of is recharts' own, so everything recharts can draw is
// still there to be reached for.
//
// The width it is held to is the page's own furniture, as the card around it is, so the listing
// beneath is of the chart alone: standing in an application it takes whatever room it was put in.
//
// The page and the component it is about are both called Chart, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Chart, as an application
// importing it would
const DefaultPreview = () => {
    const chart = useChart({ data: traffic, series: trafficSeries });

    return (
        <Stack className={classes.preview}>
            <ChartComponent chart={chart}>
                <LineChart data={chart.data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={chart.key("month")} tickLine={false} axisLine={false} />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={chart.formatNumber({ notation: "compact" })}
                    />
                    <Tooltip cursor={false} content={<ChartComponent.Tooltip />} />
                    <Legend content={<ChartComponent.Legend />} />
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
            </ChartComponent>
        </Stack>
    );
};

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Chart chart={chart}>
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
</Chart>`;

// A single trend given weight. The wash under the line goes before it reaches the bottom of the
// plot, so what is read there is still the line rather than the block beneath it.
//
// One series carries no legend: there is nothing to tell apart, and the words around the chart
// already say what is being plotted
const AreaPreview = () => {
    const chart = useChart({ data: traffic, series: [{ name: "visits", label: "Visits" }] });

    return (
        <Stack className={classes.preview}>
            <ChartComponent chart={chart}>
                <AreaChart data={chart.data}>
                    <defs>
                        {chart.series.map((item) => (
                            <ChartComponent.Gradient
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
                    <Tooltip cursor={false} content={<ChartComponent.Tooltip hideSeriesLabel />} />
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
            </ChartComponent>
        </Stack>
    );
};

const areaSetup = `${trafficRows}

const chart = useChart({ data: traffic, series: [{ name: "visits", label: "Visits" }] });`;

const areaCode = `<Chart chart={chart}>
    <AreaChart data={chart.data}>
        <defs>
            {chart.series.map((item) => (
                <Chart.Gradient
                    key={String(item.name)}
                    id={\`\${chart.id}-\${String(item.name)}\`}
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
                fill={\`url(#\${chart.id}-\${String(item.name)})\`}
            />
        ))}
    </AreaChart>
</Chart>`;

// Bars, for holding one thing against another at each point rather than following a trend
const BarsPreview = () => {
    const chart = useChart({ data: traffic, series: trafficSeries });

    return (
        <Stack className={classes.preview}>
            <ChartComponent chart={chart}>
                <BarChart data={chart.data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={chart.key("month")} tickLine={false} axisLine={false} />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={chart.formatNumber({ notation: "compact" })}
                    />
                    <Tooltip content={<ChartComponent.Tooltip />} />
                    <Legend content={<ChartComponent.Legend />} />
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
            </ChartComponent>
        </Stack>
    );
};

const barsCode = `<Chart chart={chart}>
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
</Chart>`;

// Bars laid one on top of another rather than side by side, so what is read at each point is the
// whole of it as well as the parts it is made of. The readout adds them up under a rule, since a
// stack whose whole is worth as much as its parts should not leave the reader to do the sum
const StackedPreview = () => {
    const chart = useChart({
        data: traffic,
        series: [
            { name: "visits" as const, label: "Visits", stackId: "traffic" },
            { name: "signups" as const, label: "Sign ups", stackId: "traffic" },
        ],
    });

    return (
        <Stack className={classes.preview}>
            <ChartComponent chart={chart}>
                <BarChart data={chart.data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={chart.key("month")} tickLine={false} axisLine={false} />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={chart.formatNumber({ notation: "compact" })}
                    />
                    <Tooltip content={<ChartComponent.Tooltip showTotal />} />
                    <Legend content={<ChartComponent.Legend />} />
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
            </ChartComponent>
        </Stack>
    );
};

const stackedSetup = `${trafficRows}

const chart = useChart({
    data: traffic,
    series: [
        { name: "visits", label: "Visits", stackId: "traffic" },
        { name: "signups", label: "Sign ups", stackId: "traffic" },
    ],
});`;

const stackedCode = `<Chart chart={chart}>
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
</Chart>`;

// Bars on their side, which is what long names want: read down the left they are given a line each
// rather than being turned on end or cut short. The rows are put in order first, so that reading
// down the bars is itself the answer.
//
// No series is named here. Every bar is drawn from the one key, so what tells them apart is the row
// rather than the series, and naming one would give the readout a single colour and a single name
// for the whole of it
const HorizontalBarsPreview = () => {
    const chart = useChart({ data: browsers, sort: { by: "share", direction: "desc" } });

    return (
        <Stack className={classes.preview}>
            <ChartComponent chart={chart}>
                <BarChart data={chart.data} layout="vertical">
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" tickLine={false} axisLine={false} unit="%" />
                    <YAxis
                        type="category"
                        dataKey={chart.key("name")}
                        tickLine={false}
                        axisLine={false}
                        width={80}
                    />
                    <Tooltip content={<ChartComponent.Tooltip hideLabel fitContent />} />
                    <Bar dataKey={chart.key("share")} name="Share" radius={4}>
                        {chart.data.map((row) => (
                            <Cell key={row.name} fill={chart.color(row.color)} />
                        ))}
                    </Bar>
                </BarChart>
            </ChartComponent>
        </Stack>
    );
};

const horizontalBarsSetup = `${browserRows}

const chart = useChart({ data: browsers, sort: { by: "share", direction: "desc" } });`;

const horizontalBarsCode = `<Chart chart={chart}>
    <BarChart data={chart.data} layout="vertical">
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} unit="%" />
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
</Chart>`;

// A pie, for the parts of one whole. The plot is squared off through the ratio rather than given a
// height, so it holds its shape at whatever width it is handed
const PiePreview = () => {
    const chart = useChart({ data: browsers });

    return (
        <Stack className={classes.preview}>
            <ChartComponent chart={chart} className={classes.square}>
                <PieChart>
                    <Tooltip content={<ChartComponent.Tooltip hideLabel fitContent />} />
                    <Legend content={<ChartComponent.Legend nameKey="name" />} />
                    <Pie data={chart.data} dataKey={chart.key("share")} nameKey="name">
                        {chart.data.map((row) => (
                            <Cell key={row.name} fill={chart.color(row.color)} />
                        ))}
                    </Pie>
                </PieChart>
            </ChartComponent>
        </Stack>
    );
};

const browsersSetup = `${browserRows}

const chart = useChart({ data: browsers });`;

const pieCode = `<Chart chart={chart} className="[--chart-aspect-ratio:1]">
    <PieChart>
        <Tooltip content={<Chart.Tooltip hideLabel fitContent />} />
        <Legend content={<Chart.Legend nameKey="name" />} />
        <Pie data={chart.data} dataKey={chart.key("share")} nameKey="name">
            {chart.data.map((row) => (
                <Cell key={row.name} fill={chart.color(row.color)} />
            ))}
        </Pie>
    </PieChart>
</Chart>`;

// A pie with its middle taken out, and what the whole of it comes to written where the hole is
const DonutPreview = () => {
    const chart = useChart({ data: browsers });

    return (
        <Stack className={classes.preview}>
            <ChartComponent chart={chart} className={classes.square}>
                <PieChart>
                    <Tooltip content={<ChartComponent.Tooltip hideLabel fitContent />} />
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
                                <ChartComponent.RadialText
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
            </ChartComponent>
        </Stack>
    );
};

const donutCode = `<Chart chart={chart} className="[--chart-aspect-ratio:1]">
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
                        title={\`\${chart.getTotal("share")}%\`}
                        description="Measured"
                    />
                )}
            />
            {chart.data.map((row) => (
                <Cell key={row.name} fill={chart.color(row.color)} />
            ))}
        </Pie>
    </PieChart>
</Chart>`;

// A radar, for holding several readings of the same kind against one another at once
const RadarPreview = () => {
    const chart = useChart({
        data: scores,
        series: [
            { name: "team" as const, label: "This team" },
            { name: "benchmark" as const, label: "Benchmark" },
        ],
    });

    return (
        <Stack className={classes.preview}>
            <ChartComponent chart={chart} className={classes.square}>
                <RadarChart data={chart.data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey={chart.key("skill")} />
                    <Tooltip content={<ChartComponent.Tooltip />} />
                    <Legend content={<ChartComponent.Legend />} />
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
            </ChartComponent>
        </Stack>
    );
};

const radarSetup = `const scores = [
    { skill: "Speed", team: 82, benchmark: 65 },
    { skill: "Reach", team: 74, benchmark: 70 },
    { skill: "Cost", team: 58, benchmark: 72 },
    { skill: "Support", team: 91, benchmark: 66 },
    { skill: "Uptime", team: 88, benchmark: 84 },
];

const chart = useChart({
    data: scores,
    series: [
        { name: "team", label: "This team" },
        { name: "benchmark", label: "Benchmark" },
    ],
});`;

const radarCode = `<Chart chart={chart} className="[--chart-aspect-ratio:1]">
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
</Chart>`;

// Points, for two readings taken together, where what is being looked for is whether one moves with
// the other rather than what either did over time. A third reading is carried by how big each point
// is drawn
const ScatterPreview = () => {
    const chart = useChart({ data: sessions, series: [{ name: "pages", label: "Sessions" }] });

    return (
        <Stack className={classes.preview}>
            <ChartComponent chart={chart}>
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
                    <Tooltip content={<ChartComponent.Tooltip hideLabel />} />
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
            </ChartComponent>
        </Stack>
    );
};

const scatterSetup = `const sessions = [
    { minutes: 3, pages: 2, weight: 120 },
    { minutes: 8, pages: 5, weight: 260 },
    { minutes: 12, pages: 4, weight: 180 },
    { minutes: 17, pages: 9, weight: 340 },
    { minutes: 24, pages: 7, weight: 210 },
    { minutes: 31, pages: 13, weight: 400 },
];

const chart = useChart({ data: sessions, series: [{ name: "pages", label: "Sessions" }] });`;

const scatterCode = `<Chart chart={chart}>
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
</Chart>`;

// The shape of a trend and nothing else, drawn as a strip. There is no room at this size for axes
// or a legend, so nothing on the plot says what it is: it is named outright instead, and read as
// the one picture it is rather than as a run of marks
const SparklinePreview = () => {
    const chart = useChart({ data: traffic, series: [{ name: "visits" }] });

    return (
        <Stack className={classes.preview}>
            <ChartComponent
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
            </ChartComponent>
        </Stack>
    );
};

const sparklineSetup = `${trafficRows}

const chart = useChart({ data: traffic, series: [{ name: "visits" }] });`;

const sparklineCode = `<Chart
    chart={chart}
    className="[--chart-aspect-ratio:6]"
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
</Chart>`;

// The legend stood beside the plot rather than under it, which is where a run of names is easier
// read down than across. Where it stands is recharts' own to settle, and the legend follows it
const LegendBesidePreview = () => {
    const chart = useChart({ data: traffic, series: trafficSeries });

    return (
        <Stack className={classes.preview}>
            <ChartComponent chart={chart}>
                <LineChart data={chart.data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={chart.key("month")} tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} content={<ChartComponent.Tooltip />} />
                    <Legend
                        align="right"
                        verticalAlign="middle"
                        layout="vertical"
                        content={<ChartComponent.Legend title="Series" />}
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
            </ChartComponent>
        </Stack>
    );
};

const legendBesideCode = `<Chart chart={chart}>
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
</Chart>`;

// One series read at a time, held rather than let go of. A reader without a pointer has nothing to
// hover with, so where the highlight is worth having at all it is put on a press
const HighlightPreview = () => {
    const chart = useChart({ data: traffic, series: trafficSeries });

    return (
        <Stack className={classes.preview}>
            <ChartComponent chart={chart}>
                <BarChart data={chart.data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={chart.key("month")} tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartComponent.Tooltip />} />
                    <Legend content={<ChartComponent.Legend interaction="click" />} />
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
            </ChartComponent>
        </Stack>
    );
};

const highlightCode = `<Chart chart={chart}>
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
</Chart>`;

// Values written as money, in the readout and along the axis alike, so that the same number is
// never written two ways on the one chart. Both formatters come off the chart, so the locale is
// said once and everything written under it follows
const FormattedPreview = () => {
    const chart = useChart({
        data: revenue,
        // The colour belongs to the series rather than to the mark, so the swatch in the readout is
        // drawn from the same place the area is and the two cannot drift apart
        series: [{ name: "amount" as const, label: "Revenue", color: "green" }],
        locale: "en-GB",
    });

    const currency = chart.formatNumber({
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0,
    });

    const date = chart.formatDate({ day: "numeric", month: "short" });

    return (
        <Stack className={classes.preview}>
            <ChartComponent chart={chart}>
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
                            <ChartComponent.Tooltip
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
            </ChartComponent>
        </Stack>
    );
};

const formattedSetup = `const revenue = [
    { day: "2026-01-05", amount: 4120 },
    { day: "2026-01-06", amount: 3980 },
    { day: "2026-01-07", amount: 5240 },
    { day: "2026-01-08", amount: 4870 },
    { day: "2026-01-09", amount: 6310 },
];

const chart = useChart({
    data: revenue,
    series: [{ name: "amount", label: "Revenue", color: "green" }],
    locale: "en-GB",
});

const currency = chart.formatNumber({
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
});

const date = chart.formatDate({ day: "numeric", month: "short" });`;

const formattedCode = `<Chart chart={chart}>
    <AreaChart data={chart.data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={chart.key("day")} tickLine={false} axisLine={false} tickFormatter={date} />
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
</Chart>`;

// The chart as it is reached for, drawn and written out one above the other. The forms come first,
// in the order a reader picking one would read them — a trend, a trend with weight, a comparison, a
// whole and its parts, and the two that plot one reading against another — and what can be done to
// any of them follows
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: trafficSetup,
        preview: <DefaultPreview />,
        code: defaultCode,
    },
    {
        name: "An area",
        description:
            "A single trend given weight. The wash under the line is a gradient the chart names in the palette's own terms, so the fill is drawn from the same place the line is and follows the theme it is read under; it goes before it reaches the bottom of the plot, so what is read there is still the line rather than the block. One series carries no legend, since there is nothing to tell it apart from.",
        setup: areaSetup,
        preview: <AreaPreview />,
        code: areaCode,
    },
    {
        name: "Bars",
        description:
            "One thing held against another at each point rather than a trend followed through them. Reading a name in the legend fades everything but the series it belongs to, which is what the opacity handed to each mark is asking for.",
        setup: trafficSetup,
        preview: <BarsPreview />,
        code: barsCode,
    },
    {
        name: "Stacked bars",
        description:
            "Series sharing a stack id are laid one on top of another rather than side by side, so what is read at each point is the whole of it as well as the parts it is made of. The readout adds them up under a rule, since a stack whose whole is worth as much as its parts should not leave the reader to do the sum.",
        setup: stackedSetup,
        preview: <StackedPreview />,
        code: stackedCode,
    },
    {
        name: "Bars on their side",
        description:
            "What long names want: read down the left they are given a line each rather than being turned on end or cut short. The rows are put in order before they are drawn, so reading down the bars is itself the answer. No series is named — every bar comes from the one key, so what tells them apart is the row it came from, and the colour is carried there.",
        setup: horizontalBarsSetup,
        preview: <HorizontalBarsPreview />,
        code: horizontalBarsCode,
    },
    {
        name: "A pie",
        description:
            "The parts of one whole. The plot is squared off through the ratio rather than given a height, so it holds its shape at whatever width it is handed. The legend is told which key on the row the names are under, since they are in the data here rather than in a series list.",
        setup: browsersSetup,
        preview: <PiePreview />,
        code: pieCode,
    },
    {
        name: "A ring with a total",
        description:
            "A pie with its middle taken out, and what the whole of it comes to written where the hole is. The text is laid at the middle of the label rather than the middle of the plot, so it stays put where the ring is not centred.",
        setup: browsersSetup,
        preview: <DonutPreview />,
        code: donutCode,
    },
    {
        name: "A radar",
        description:
            "Several readings of the same kind held against one another at once. It is the one form where the axes all measure the same thing, which is what makes the shape worth reading rather than only the points.",
        setup: radarSetup,
        preview: <RadarPreview />,
        code: radarCode,
    },
    {
        name: "Points",
        description:
            "Two readings taken together, where what is being looked for is whether one moves with the other rather than what either did over time. A third reading is carried by how big each point is drawn, which is what the z axis settles.",
        setup: scatterSetup,
        preview: <ScatterPreview />,
        code: scatterCode,
    },
    {
        name: "A sparkline",
        description:
            "The shape of a trend and nothing else, drawn as a strip through the ratio. There is no room at this size for axes, a legend or a readout, so nothing on the plot says what it is: it is read as the one picture it is and named outright, which is what whatever it stands beside would otherwise have to do for it.",
        setup: sparklineSetup,
        preview: <SparklinePreview />,
        code: sparklineCode,
    },
    {
        name: "A legend beside the plot",
        description:
            "Where the legend stands is recharts' own to settle, and the legend follows what it is handed: down the side of a plot it stands beside, and across the bottom of one it stands under. A title says what the run of names is naming, for a chart where that is not already said above it.",
        setup: trafficSetup,
        preview: <LegendBesidePreview />,
        code: legendBesideCode,
    },
    {
        name: "Reading one series at a time",
        description:
            "The highlight held rather than let go of. Reading a name is enough where the highlight is only worth having while the pointer is there; a reader without a pointer has nothing to hover with, so where it is worth having at all it is put on a press.",
        setup: trafficSetup,
        preview: <HighlightPreview />,
        code: highlightCode,
    },
    {
        name: "Values written as money",
        description:
            "The same number written the one way in the readout and along the axis, since a chart that writes it two ways is asking the reader to work out that they are the same. Both formatters come off the chart, so the locale is said once and everything written under it follows — and a day written on its own is read as a day in the calendar rather than as midnight somewhere else.",
        setup: formattedSetup,
        preview: <FormattedPreview />,
        code: formattedCode,
    },
];

// The names a colour can be asked for by, so a chart is written in the terms the design system
// already uses rather than in whatever the marks happen to need. The five hues name the data and
// the rest name the furniture drawn around it
const color =
    '"blue" | "orange" | "purple" | "green" | "pink" | "grid" | "axis" | "surface" | "foreground" | "muted" | (string & {})';

// What lights a series up on the chart
const interaction = '"hover" | "click"';

// What stands beside each name in the readout
const indicator = '"dot" | "line" | "dashed"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Everything a chart is built and drawn from, under the thing that takes it. What a chart is made
// of comes first, since nothing is drawn before it, then what it hands back, then the room the plot
// is given, and last the parts drawn around the plot.
//
// The marks, the axes and the grid are recharts' own and are documented there; what is written here
// is what the library adds to them
const groups: ComponentPropGroup[] = [
    {
        name: "useChart",
        props: [
            {
                name: "data",
                type: "T[]",
                required: true,
                description: "The rows the chart is drawn from",
            },
            {
                name: "series",
                type: "ChartSeries<T>[]",
                description:
                    "What is plotted across the rows. Five is as many as the palette can tell apart; past that the tail is better gathered into one series of its own than given a sixth hue that reads as one of the five. A chart whose marks are told apart by the row rather than by the key names none at all",
            },
            {
                name: "sort",
                type: '{ by: keyof T, direction: "asc" | "desc" }',
                description:
                    "Puts the rows in order of one of their own values before they are drawn. The rows handed in are copied first, so what the caller still holds is left in the order they had it",
            },
            {
                name: "locale",
                type: "string",
                description:
                    "Whose conventions numbers and dates are written under. The one the runtime is set to stands where this is left out",
            },
        ],
    },
    {
        name: "ChartSeries",
        props: [
            {
                name: "name",
                type: "keyof T",
                description:
                    "The key the value is read under on every row, which is also what the series is called in the legend and the readout unless a label says otherwise",
            },
            {
                name: "label",
                type: "React.ReactNode",
                description: "What the series is called, in place of the key it is read under",
            },
            {
                name: "color",
                type: color,
                description:
                    "Stands in place of the colour the series would take from the palette. The palette hands its hues out in a fixed order, so the third series is purple whether or not the first two are still on the chart and filtering never repaints what is left standing",
            },
            {
                name: "icon",
                type: "React.ReactNode",
                description:
                    "Drawn in place of the swatch, for a series better told apart by a mark than by a hue",
            },
            {
                name: "stackId",
                type: "string",
                description:
                    "Series sharing one are laid one on top of another rather than side by side",
            },
            {
                name: "strokeDasharray",
                type: "string",
                description:
                    "Draws the mark dashed, which the readout says again in the line beside its name",
            },
        ],
    },
    {
        name: "chart",
        props: [
            {
                name: "key",
                type: "(prop?: keyof T) => keyof T",
                description:
                    "The key a value is read under, falling back to value the way recharts itself does. It is what every dataKey on the plot is given",
            },
            {
                name: "data",
                type: "T[]",
                description: "The rows, in whatever order the sort left them",
            },
            {
                name: "series",
                type: "ChartResolvedSeries<T>[]",
                description:
                    "What is plotted, each with the colour it came out in, which is what the marks are laid out from",
            },
            {
                name: "color",
                type: "(value?: ChartColor) => string | undefined",
                description:
                    "The custom property a palette name stands for, so a chart follows the theme it is read under. Anything the palette has no name for is handed back as it came",
            },
            {
                name: "formatNumber",
                type: "(options?: Intl.NumberFormatOptions) => (value: number) => string",
                description:
                    "A formatter for the chart's own locale, handed to an axis and to the readout alike so the same number is never written two ways",
            },
            {
                name: "formatDate",
                type: "(options?: Intl.DateTimeFormatOptions) => (value: string | number | Date) => string",
                description:
                    "The same for dates. A day written on its own is read as a day in the calendar rather than as a moment in time, and a cell that is not a date at all is written as it came rather than bringing the page down",
            },
            {
                name: "getSeriesOpacity",
                type: "(name?: string, fallback?: number) => number | undefined",
                description:
                    "How far a mark is faded while another series is being read. Nothing is faded while none is, so a chart left alone is drawn in full",
            },
            {
                name: "getTotal",
                type: "(key: keyof T) => number",
                description:
                    "What everything measured under a key comes to, which is what a ring writes in its hole",
            },
            {
                name: "getMin",
                type: "(key: keyof T) => number",
                description: "The smallest value measured under a key",
            },
            {
                name: "getMax",
                type: "(key: keyof T) => number",
                description: "The largest value measured under a key",
            },
            {
                name: "getValuePercent",
                type: "(key: keyof T, value: number, domain?: ChartValueDomain) => number",
                description:
                    "How far along a value stands: against the ends of the axis where they are given, and otherwise as its share of everything measured under that key",
            },
            {
                name: "groupBy",
                type: "(key: keyof T) => T[][]",
                description: "The rows gathered by one of their own values",
            },
            {
                name: "id",
                type: "string",
                description:
                    "Unique to this chart, for the gradients and clip paths a chart has to name and refer back to",
            },
        ],
    },
    {
        name: "Chart",
        props: [
            {
                name: "chart",
                type: "ChartInstance",
                required: true,
                description:
                    "What useChart handed back, which is passed down to every part drawn inside so the legend and the readout know what is being plotted without knowing anything about the data",
            },
            {
                name: "children",
                type: "React.ReactElement",
                required: true,
                description:
                    "The plot itself, which is a recharts chart. The box is measured rather than given a size, so the plot fills whatever room it was put in, and how tall that comes out follows from --chart-aspect-ratio rather than from a height in pixels",
            },
            styling,
        ],
    },
    {
        name: "Chart.Legend",
        props: [
            {
                name: "title",
                type: "React.ReactNode",
                description:
                    "What the run of names is naming, where that is not already said above",
            },
            {
                name: "layout",
                type: '"horizontal" | "vertical" | "auto"',
                default: '"auto"',
                description:
                    "Which way the names run. Left to itself it follows where the legend was put: down the side of a plot it stands beside, and across the bottom of one it stands under",
            },
            {
                name: "interaction",
                type: interaction,
                default: '"hover"',
                description:
                    "What lights a series up. Reading a name is enough where the highlight is only worth having while the pointer is there; a press holds it, and is what a reader without a pointer has",
            },
            {
                name: "nameKey",
                type: "string",
                description:
                    "The key on the row each entry is named under, for a chart whose names are in the data rather than in the series list",
            },
            {
                name: "align",
                type: '"left" | "center" | "right"',
                description: "Handed down by recharts, from where the legend was put",
            },
            {
                name: "verticalAlign",
                type: '"top" | "middle" | "bottom"',
                description: "Handed down by recharts, from where the legend was put",
            },
            styling,
        ],
    },
    {
        name: "Chart.Tooltip",
        props: [
            {
                name: "indicator",
                type: indicator,
                default: '"dot"',
                description:
                    "The mark beside each name: a dot for a point or an area, a line for a line, and a dashed line for one drawn dashed",
            },
            {
                name: "hideLabel",
                type: "boolean",
                default: "false",
                description:
                    "Drops the name of the point the reader is on. The point along the bottom is already named by the axis, so a chart with one series has no need to name it again above the value",
            },
            {
                name: "hideIndicator",
                type: "boolean",
                default: "false",
                description: "Drops the mark that stands beside each name",
            },
            {
                name: "hideSeriesLabel",
                type: "boolean",
                default: "false",
                description:
                    "Drops the name of the series, for a chart plotting one thing, where the name is already said elsewhere",
            },
            {
                name: "showTotal",
                type: "boolean",
                default: "false",
                description:
                    "Adds the readings up under a rule, which is what a stack whose whole is worth as much as its parts wants",
            },
            {
                name: "fitContent",
                type: "boolean",
                default: "false",
                description:
                    "Lets the readout be as narrow as what it holds rather than holding a width of its own",
            },
            {
                name: "nameKey",
                type: "string",
                description: "The key on the row each reading is named under",
            },
            {
                name: "formatter",
                type: "(value: unknown, name: React.ReactNode) => React.ReactNode | [React.ReactNode, React.ReactNode]",
                description:
                    "How each reading is written. Handed the chart's own formatter, the readout and the axis write the same number the same way",
            },
            {
                name: "render",
                type: "(payload: unknown) => React.ReactNode",
                description:
                    "Draws the whole of a row from the data behind it, in place of the name and value pair",
            },
            styling,
        ],
    },
    {
        name: "Chart.Gradient",
        props: [
            {
                name: "id",
                type: "string",
                required: true,
                description:
                    "What the fill refers to the gradient back by, as url(#id). The chart's own id is what keeps it apart from another chart's on the same page",
            },
            {
                name: "stops",
                type: "ChartGradientStop[]",
                required: true,
                description:
                    "The colours the wash runs between, each with how far along it stands and how solid it is there. They are named in the palette's own terms, so the fill follows the theme it is read under",
            },
            {
                name: "fillOpacity",
                type: "number",
                description: "How solid a stop is where it does not say for itself",
            },
        ],
    },
    {
        name: "Chart.RadialText",
        props: [
            {
                name: "title",
                type: "React.ReactNode",
                required: true,
                description: "What is written in the hole, which is usually what the ring comes to",
            },
            {
                name: "description",
                type: "React.ReactNode",
                description: "What is written under it, saying what the number is",
            },
            {
                name: "viewBox",
                type: "ViewBox",
                description:
                    "Handed down by recharts from the label the text was given to. The text is laid at the middle of that rather than the middle of the plot, so it stays put where the ring is not centred",
            },
            {
                name: "gap",
                type: "number",
                default: "24",
                description:
                    "How far under the title the description sits, in the plot's own units",
            },
            {
                name: "fontSize",
                type: "string",
                default: '"2rem"',
                description: "How large the title is drawn",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the chart is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Chart = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Chart
            </Heading>
            <Text as="p" size="large">
                The room a plot is drawn in, and where its parts are told what is being plotted. The
                plot itself is a recharts chart handed in as the only child, so everything recharts
                can draw is still there to be reached for; what the library adds is the part that
                belongs to the design system rather than to the drawing — the palette the series
                take their colours from, the type and rules the axes are drawn with, and a legend
                and a readout that look like the rest of it. The palette hands its five hues out in
                a fixed order and they hold their separation under colour blindness, so a chart is
                written in the system's own terms rather than in whatever the marks happen to need.
                The box is measured rather than given a size, so a plot fills whatever room it was
                put in and takes its height from a ratio.
            </Text>
        </Stack>
        <ComponentExamples component="Chart" examples={examples} external={recharts} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Chart;
