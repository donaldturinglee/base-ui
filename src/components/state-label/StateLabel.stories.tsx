import type { StoryFn, Meta } from "@storybook/react-vite";
import StateLabel from "./StateLabel";
import type { StateLabelProps } from "./StateLabel.types";

export default {
    title: "Components/StateLabel",
    component: StateLabel,
} as Meta<typeof StateLabel>;

export const Default: StoryFn<typeof StateLabel> = () => (
    <StateLabel status="issueOpened">Open</StateLabel>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<StateLabelProps> = (args) => (
    <StateLabel {...args}>Open</StateLabel>
);

Playground.args = {
    status: "issueOpened",
    size: "medium",
};

Playground.argTypes = {
    status: {
        control: {
            type: "select",
        },
        options: [
            "open",
            "closed",
            "draft",
            "archived",
            "unavailable",
            "issueOpened",
            "issueClosed",
            "issueClosedNotPlanned",
            "issueDraft",
            "pullOpened",
            "pullClosed",
            "pullMerged",
            "pullQueued",
            "alertOpened",
            "alertClosed",
            "alertFixed",
            "alertDismissed",
        ],
        description: "State being reported, which sets the colour and the icon",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium"],
        description: "Size of the label and its icon",
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
