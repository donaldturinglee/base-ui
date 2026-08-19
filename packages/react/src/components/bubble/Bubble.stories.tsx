import type { StoryFn, Meta } from "@storybook/react-vite";
import { Bubble } from ".";
import type { BubbleProps } from "./Bubble.types";

const classes = {
    // A bubble is measured against the room it is given, so the stories give it some
    container: "w-[var(--overlay-width-small)]",
};

export default {
    title: "Components/Bubble",
    component: Bubble,
} as Meta<typeof Bubble>;

export const Default: StoryFn<typeof Bubble> = () => (
    <div className={classes.container}>
        <Bubble>
            <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
        </Bubble>
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<BubbleProps> = (args) => (
    <div className={classes.container}>
        <Bubble {...args}>
            <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
        </Bubble>
    </div>
);

Playground.args = {
    variant: "default",
    align: "start",
};

Playground.argTypes = {
    variant: {
        control: {
            type: "select",
        },
        options: ["default", "secondary", "muted", "tinted", "outline", "ghost", "danger"],
        description: "What the surface is painted",
    },
    align: {
        control: {
            type: "radio",
        },
        options: ["start", "end"],
        description: "Which side of the conversation the turn stands on",
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
