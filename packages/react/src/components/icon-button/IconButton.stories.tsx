import { SearchRegular } from "@gamecrafters/base-ui-icons";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { IconButton } from ".";
import type { IconButtonElementProps } from "./IconButton.types";

// The icon and the accessible name are set by the story itself, so that the controls cannot
// leave the button unnamed
type PlaygroundArgs = Omit<IconButtonElementProps, "icon" | "aria-label" | "aria-labelledby">;

export default {
    title: "Components/IconButton",
    component: IconButton,
} as Meta<typeof IconButton>;

export const Default: StoryFn<typeof IconButton> = () => (
    <IconButton icon={SearchRegular} aria-label="Search" />
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<PlaygroundArgs> = (args) => (
    <IconButton {...args} icon={SearchRegular} aria-label="Search" />
);

Playground.args = {
    variant: "default",
    size: "medium",
    disabled: false,
    inactive: false,
};

Playground.argTypes = {
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
        description: "How wide and tall the square button is",
    },
    loading: {
        control: {
            type: "boolean",
        },
        description: "Swaps the icon for a spinner and stops the button being pressed",
    },
    loadingAnnouncement: {
        control: {
            type: "text",
        },
        description: "What a screen reader hears while the button is loading",
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
};

Playground.parameters = {
    layout: "centered",
};
