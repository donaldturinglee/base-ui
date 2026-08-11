import type { StoryFn, Meta } from "@storybook/react-vite";
import { LinkButton } from ".";
import type { LinkButtonProps } from "./LinkButton.types";

export default {
    title: "Components/LinkButton",
    component: LinkButton,
} as Meta<typeof LinkButton>;

export const Default: StoryFn<typeof LinkButton> = () => (
    <LinkButton href="#settings">Open settings</LinkButton>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<LinkButtonProps> = (args) => <LinkButton {...args} />;

Playground.args = {
    children: "Open settings",
    href: "#settings",
    variant: "default",
    size: "medium",
    alignContent: "center",
    block: false,
    inactive: false,
    labelWrap: false,
};

Playground.argTypes = {
    children: {
        control: {
            type: "text",
        },
        description: "The label of the link",
    },
    href: {
        control: {
            type: "text",
        },
        description: "Where the link goes",
    },
    variant: {
        control: {
            type: "radio",
        },
        options: ["default", "primary", "danger", "invisible", "link"],
        description: "How much weight the link carries against the page",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "How tall the link is, and how much padding it carries",
    },
    alignContent: {
        control: {
            type: "radio",
        },
        options: ["center", "start"],
        description: "Where the label sits once the link is wider than its content",
    },
    count: {
        control: {
            type: "number",
        },
        description: "Shows a counter after the label",
    },
    block: {
        control: {
            type: "boolean",
        },
        description: "Fills the width of its container",
    },
    inactive: {
        control: {
            type: "boolean",
        },
        description: "Reads as unavailable while staying in the tab order, so it can be explained",
    },
    labelWrap: {
        control: {
            type: "boolean",
        },
        description: "Lets a long label run onto more than one line",
    },
};

Playground.parameters = {
    layout: "centered",
};
