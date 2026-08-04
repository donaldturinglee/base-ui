import type { StoryFn, Meta } from "@storybook/react-vite";
import { Status } from ".";
import type { StatusProps } from "./Status.types";

export default {
    title: "Components/Status",
    component: Status,
} as Meta<typeof Status>;

export const Default: StoryFn<typeof Status> = () => (
    <Status variant="success">
        <Status.Indicator />
        Operational
    </Status>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<StatusProps> = (args) => (
    <Status {...args}>
        <Status.Indicator />
        Operational
    </Status>
);

Playground.args = {
    as: "span",
    variant: "success",
    size: "medium",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["span", "div"],
        description: "HTML element to render",
    },
    variant: {
        control: {
            type: "select",
        },
        options: ["accent", "success", "attention", "severe", "danger", "done", "neutral"],
        description: "Condition being reported, which sets the colour of the dot",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "Size of the dot and the words beside it",
    },
    srText: {
        control: {
            type: "text",
        },
        description: "Words read in place of the dot where it is shown without a label",
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
