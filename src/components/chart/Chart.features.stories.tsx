import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Chart } from ".";
import { CHART_SERIES_COLORS } from "./chartPalette";

const classes = {
    frame: "w-[var(--overlay-width-large)] max-w-full",
    narrow: "w-[var(--overlay-width-medium)] max-w-full",
    row: "flex flex-wrap gap-[var(--base-size-24)]",
};

const traffic = [
    { month: "Jan", visits: 1240, signups: 320 },
    { month: "Feb", visits: 1810, signups: 455 },
    { month: "Mar", visits: 1490, signups: 380 },
    { month: "Apr", visits: 2260, signups: 610 },
    { month: "May", visits: 2040, signups: 590 },
    { month: "Jun", visits: 2870, signups: 780 },
];

const channels = [
    { channel: "Search", sessions: 4820 },
    { channel: "Direct", sessions: 3110 },
    { channel: "Referral", sessions: 1740 },
    { channel: "Social", sessions: 980 },
    { channel: "Email", sessions: 620 },
];

const spend = [
    { quarter: "Q1", research: 42, build: 88, support: 26 },
    { quarter: "Q2", research: 51, build: 96, support: 31 },
    { quarter: "Q3", research: 38, build: 104, support: 29 },
    { quarter: "Q4", research: 61, build: 112, support: 44 },
];

const balance = [
    { month: "Jan", net: 18 },
    { month: "Feb", net: -12 },
    { month: "Mar", net: 26 },
    { month: "Apr", net: -6 },
    { month: "May", net: 34 },
];

const patchy = [
    { week: "W1", uptime: 99.2 },
    { week: "W2", uptime: 98.7 },
    { week: "W3" },
    { week: "W4", uptime: 99.6 },
    { week: "W5", uptime: 99.9 },
];

const trafficSeries = [
    { key: "visits", name: "Visits" },
    { key: "signups", name: "Signups" },
];

const spendSeries = [
    { key: "research", name: "Research" },
    { key: "build", name: "Build" },
    { key: "support", name: "Support" },
];

export default {
    title: "Components/Chart/Features",
    parameters: {
        layout: "padded",
    },
};

// A Trend Over Time, which is what a line is for
export const ALine: StoryFn = () => (
    <div className={classes.frame}>
        <Chart
            data={traffic}
            xKey="month"
            series={trafficSeries}
            title="Visits and signups"
            description="The first half of the year"
        />
    </div>
);

// One Series Given Weight, where the area under the line says how much as well as which way.
// A chart with one series needs no legend: its own title already says what is plotted
export const AnArea: StoryFn = () => (
    <div className={classes.frame}>
        <Chart
            type="area"
            data={traffic}
            xKey="month"
            series={[{ key: "visits", name: "Visits" }]}
            title="Visits"
            description="The first half of the year"
        />
    </div>
);

// Holding One Thing Against Another, which is what bars are for. They grow from a baseline, so
// the axis always reaches nought however far from it the data sits
export const Bars: StoryFn = () => (
    <div className={classes.frame}>
        <Chart
            type="bar"
            data={channels}
            xKey="channel"
            series={[{ key: "sessions", name: "Sessions" }]}
            title="Sessions by channel"
        />
    </div>
);

// Bars On Their Side, which is what long names need: they are read straight across rather than
// turned on end
export const HorizontalBars: StoryFn = () => (
    <div className={classes.frame}>
        <Chart
            type="bar"
            horizontal
            data={channels}
            xKey="channel"
            series={[{ key: "sessions", name: "Sessions" }]}
            title="Sessions by channel"
            height={220}
        />
    </div>
);

// Side By Side Or One On Top Of Another. Grouped bars hold the series against each other;
// stacked bars hold each of them against the whole
export const GroupedAndStacked: StoryFn = () => (
    <Stack gap="spacious" align="start">
        <div className={classes.frame}>
            <Chart
                type="bar"
                data={spend}
                xKey="quarter"
                series={spendSeries}
                title="Spend by quarter"
                description="Side by side"
                valueFormat={(value) => `£${value}k`}
            />
        </div>
        <div className={classes.frame}>
            <Chart
                type="bar"
                stacked
                data={spend}
                xKey="quarter"
                series={spendSeries}
                title="Spend by quarter"
                description="One on top of another"
                valueFormat={(value) => `£${value}k`}
            />
        </div>
    </Stack>
);

// Above And Below The Line, where the bars grow either way from a baseline that is still nought
export const AroundABaseline: StoryFn = () => (
    <div className={classes.frame}>
        <Chart
            type="bar"
            data={balance}
            xKey="month"
            series={[{ key: "net", name: "Net" }]}
            title="Net change"
            valueFormat={(value) => `${value > 0 ? "+" : ""}${value}`}
        />
    </div>
);

// A Gap In The Data, which is left as a gap. A line drawn across it would say something that
// was never measured
export const AGapInTheData: StoryFn = () => (
    <div className={classes.frame}>
        <Chart
            data={patchy}
            xKey="week"
            series={[{ key: "uptime", name: "Uptime" }]}
            title="Uptime"
            description="Nothing was measured in week three"
            valueFormat={(value) => `${value}%`}
        />
    </div>
);

// Rounded Off Between The Points, for a reading taken often enough that the line stands for
// something continuous rather than for the points themselves
export const Smooth: StoryFn = () => (
    <div className={classes.frame}>
        <Chart
            type="area"
            smooth
            data={traffic}
            xKey="month"
            series={[{ key: "visits", name: "Visits" }]}
            title="Visits"
        />
    </div>
);

// How The Numbers Are Written, in the axis and the readout alike
export const Formatting: StoryFn = () => (
    <div className={classes.frame}>
        <Chart
            data={traffic}
            xKey="month"
            series={trafficSeries}
            title="Visits and signups"
            valueFormat={(value) => `${(value / 1000).toFixed(1)}k`}
            labelFormat={(label) => label.toUpperCase()}
        />
    </div>
);

// The Colours The Series Are Drawn In, handed out in a fixed order so that taking one series
// off the chart never repaints the rest
export const ThePalette: StoryFn = () => (
    <Stack gap="condensed" align="start">
        <Text>
            Five is the whole of it. A chart with more to say gathers the tail into a series of its
            own rather than reaching for another colour
        </Text>
        <div className={classes.frame}>
            <Chart
                type="bar"
                data={[{ step: "One", a: 5, b: 4, c: 3, d: 2, e: 1 }]}
                xKey="step"
                series={CHART_SERIES_COLORS.map((_, index) => ({
                    key: ["a", "b", "c", "d", "e"][index],
                    name: `Series ${index + 1}`,
                }))}
                title="The five series colours"
                height={160}
            />
        </div>
    </Stack>
);

// Nothing To Show, which says so in place of the plot rather than drawing an empty one
export const Empty: StoryFn = () => (
    <div className={classes.narrow}>
        <Chart
            data={[]}
            xKey="month"
            series={trafficSeries}
            title="Visits and signups"
            emptyText="Nothing was recorded this quarter"
            height={180}
        />
    </div>
);
