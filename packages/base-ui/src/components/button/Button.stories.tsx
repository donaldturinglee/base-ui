import type { StoryFn, Meta } from "@storybook/react-vite";
import { Button } from ".";
import type { ButtonProps } from "./Button.types";

export default {
    title: "Components/Button",
    component: Button,
} as Meta<typeof Button>;

export const Default: StoryFn<typeof Button> = () => <Button>Save changes</Button>;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<ButtonProps> = (args) => <Button {...args} />;

Playground.args = {
    children: "Save changes",
    variant: "default",
    size: "medium",
    alignContent: "center",
    block: false,
    disabled: false,
    inactive: false,
    labelWrap: false,
};

Playground.argTypes = {
    children: {
        control: {
            type: "text",
        },
        description: "The label of the button",
    },
    variant: {
        control: {
            type: "radio",
        },
        options: ["default", "primary", "danger", "invisible", "link"],
        description: "How much weight the button carries against the page",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "How tall the button is, and how much padding it carries",
    },
    alignContent: {
        control: {
            type: "radio",
        },
        options: ["center", "start"],
        description: "Where the label sits once the button is wider than its content",
    },
    count: {
        control: {
            type: "number",
        },
        description: "Shows a counter after the label",
    },
    loading: {
        control: {
            type: "boolean",
        },
        description: "Swaps the visuals for a spinner and stops the button being pressed",
    },
    loadingAnnouncement: {
        control: {
            type: "text",
        },
        description: "What a screen reader hears while the button is loading",
    },
    block: {
        control: {
            type: "boolean",
        },
        description: "Fills the width of its container",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the button being used",
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
