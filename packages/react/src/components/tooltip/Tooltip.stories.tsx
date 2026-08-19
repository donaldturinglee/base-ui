import type { StoryFn, Meta } from "@storybook/react-vite";
import { Button } from "../button";
import { Tooltip } from ".";
import type { TooltipProps } from "./Tooltip.types";

const classes = {
    // Leaves room around the trigger for the tooltip to stand in
    container: "p-[var(--base-size-40)]",
};

export default {
    title: "Components/Tooltip",
    component: Tooltip,
} as Meta<typeof Tooltip>;

export const Default: StoryFn<typeof Tooltip> = () => (
    <div className={classes.container}>
        <Tooltip text="This cannot be undone">
            <Button variant="danger">Delete</Button>
        </Tooltip>
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<TooltipProps> = (args) => (
    <div className={classes.container}>
        <Tooltip {...args}>
            <Button variant="danger">Delete</Button>
        </Tooltip>
    </div>
);

Playground.args = {
    text: "This cannot be undone",
    direction: "s",
    type: "description",
    delay: "short",
};

Playground.argTypes = {
    text: {
        control: {
            type: "text",
        },
        description: "What the tooltip says",
    },
    direction: {
        control: {
            type: "radio",
        },
        options: ["nw", "n", "ne", "e", "se", "s", "sw", "w"],
        description: "Where the tooltip stands, given there is room for it",
    },
    type: {
        control: {
            type: "radio",
        },
        options: ["label", "description"],
        description: "Whether the tooltip names the trigger or says more about it",
    },
    delay: {
        control: {
            type: "radio",
        },
        options: ["short", "medium", "long"],
        description: "How long the pointer has to rest on the trigger first",
    },
    children: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
