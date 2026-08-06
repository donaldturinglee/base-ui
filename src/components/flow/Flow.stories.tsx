import type { StoryFn, Meta } from "@storybook/react-vite";
import { Flow } from ".";
import type { FlowProps } from "./Flow.types";

export default {
    title: "Components/Flow",
    component: Flow,
} as Meta<typeof Flow>;

export const Default: StoryFn<typeof Flow> = () => (
    <Flow aria-label="How a request is served">
        <Flow.Node>Request</Flow.Node>
        <Flow.Parallel>
            <Flow.Node>Cache</Flow.Node>
            <Flow.Node>Worker</Flow.Node>
        </Flow.Parallel>
        <Flow.Node>Response</Flow.Node>
    </Flow>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<FlowProps> = (args) => (
    <Flow {...args} aria-label="How a request is served">
        <Flow.Node>Request</Flow.Node>
        <Flow.Parallel>
            <Flow.List>
                <Flow.Node>Cache</Flow.Node>
                <Flow.Node>Origin</Flow.Node>
            </Flow.List>
            <Flow.Node>Worker</Flow.Node>
        </Flow.Parallel>
        <Flow.Node>Response</Flow.Node>
    </Flow>
);

Playground.args = {
    orientation: "horizontal",
    align: "start",
    columnGap: 64,
    rowGap: 16,
    cornerRadius: 8,
};

Playground.argTypes = {
    orientation: {
        control: {
            type: "radio",
        },
        options: ["horizontal", "vertical"],
        description: "Which way the flow runs",
    },
    align: {
        control: {
            type: "radio",
        },
        options: ["start", "center"],
        description: "How a step shorter than the run it stands in lines up across the flow",
    },
    columnGap: {
        control: {
            type: "number",
            min: 16,
            max: 160,
            step: 8,
        },
        description: "The room left between one step and the next along the flow",
    },
    rowGap: {
        control: {
            type: "number",
            min: 0,
            max: 80,
            step: 4,
        },
        description: "And between one branch and the next across it",
    },
    cornerRadius: {
        control: {
            type: "number",
            min: 0,
            max: 24,
            step: 2,
        },
        description: "How far the joins are turned at their corners",
    },
    children: {
        table: {
            disable: true,
        },
    },
    ref: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
