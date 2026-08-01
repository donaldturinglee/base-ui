import type { StoryFn, Meta } from "@storybook/react-vite";
import { Chart } from ".";
import type { ChartProps } from "./Chart.types";

const classes = {
    frame: "w-[var(--overlay-width-large)] max-w-full",
};

const traffic = [
    { month: "Jan", visits: 1240, signups: 320 },
    { month: "Feb", visits: 1810, signups: 455 },
    { month: "Mar", visits: 1490, signups: 380 },
    { month: "Apr", visits: 2260, signups: 610 },
    { month: "May", visits: 2040, signups: 590 },
    { month: "Jun", visits: 2870, signups: 780 },
];

const series = [
    { key: "visits", name: "Visits" },
    { key: "signups", name: "Signups" },
];

export default {
    title: "Components/Chart",
    component: Chart,
} as Meta<typeof Chart>;

export const Default: StoryFn<typeof Chart> = () => (
    <div className={classes.frame}>
        <Chart
            data={traffic}
            xKey="month"
            series={series}
            title="Visits and signups"
            description="The first half of the year"
        />
    </div>
);

export const Playground: StoryFn<ChartProps> = (args) => (
    <div className={classes.frame}>
        <Chart {...args} />
    </div>
);

Playground.args = {
    data: traffic,
    xKey: "month",
    series,
    title: "Visits and signups",
    description: "The first half of the year",
    type: "line",
    stacked: false,
    horizontal: false,
    smooth: false,
    showGrid: true,
    height: 240,
    tickCount: 4,
};

Playground.argTypes = {
    type: {
        control: {
            type: "radio",
        },
        options: ["line", "area", "bar"],
        description: "What the marks are drawn as",
    },
    stacked: {
        control: {
            type: "boolean",
        },
        description: "Lays the series one on top of another rather than side by side",
    },
    horizontal: {
        control: {
            type: "boolean",
        },
        description: "Turns the bars on their side, which is what long names need",
    },
    smooth: {
        control: {
            type: "boolean",
        },
        description: "Rounds the line off between one point and the next",
    },
    showGrid: {
        control: {
            type: "boolean",
        },
        description: "Draws lines across the plot to be read past",
    },
    showLegend: {
        control: {
            type: "boolean",
        },
        description: "Stands the legend even where there is only one series",
    },
    height: {
        control: {
            type: "number",
        },
        description: "How tall the plot stands, in pixels",
    },
    tickCount: {
        control: {
            type: "number",
        },
        description: "Roughly how many lines are drawn across the plot",
    },
    emptyText: {
        control: {
            type: "text",
        },
        description: "What stands in place of the plot where there is nothing to draw",
    },
    data: {
        table: {
            disable: true,
        },
    },
    series: {
        table: {
            disable: true,
        },
    },
    valueFormat: {
        table: {
            disable: true,
        },
    },
    labelFormat: {
        table: {
            disable: true,
        },
    },
};
