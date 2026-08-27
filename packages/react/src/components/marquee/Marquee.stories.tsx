import type { StoryFn, Meta } from "@storybook/react-vite";
import { Marquee } from ".";
import type { MarqueeProps } from "./Marquee.types";

const classes = {
    // Gives the run a window to travel across, since a marquee is as wide as it is let be
    container: "w-[var(--overlay-width-large)]",
    item: "flex items-center gap-[var(--base-size-8)] whitespace-nowrap text-body-medium",
    logo: "text-title-medium",
};

const fruits = [
    { name: "Apple", logo: "🍎" },
    { name: "Banana", logo: "🍌" },
    { name: "Cherry", logo: "🍒" },
    { name: "Grape", logo: "🍇" },
    { name: "Watermelon", logo: "🍉" },
    { name: "Strawberry", logo: "🍓" },
];

const items = fruits.map((fruit) => (
    <span key={fruit.name} className={classes.item}>
        <span className={classes.logo}>{fruit.logo}</span>
        {fruit.name}
    </span>
));

export default {
    title: "Components/Marquee",
    component: Marquee,
} as Meta<typeof Marquee>;

export const Default: StoryFn<typeof Marquee> = () => (
    <div className={classes.container}>
        <Marquee>{items}</Marquee>
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<MarqueeProps> = (args) => (
    <div className={classes.container}>
        <Marquee {...args}>{items}</Marquee>
    </div>
);

Playground.args = {
    side: "start",
    speed: 50,
    delay: 0,
    loopCount: 0,
    autoFill: false,
    reverse: false,
    pauseOnInteraction: true,
    edges: false,
};

Playground.argTypes = {
    side: {
        control: {
            type: "inline-radio",
        },
        options: ["start", "end", "top", "bottom"],
        description: "Which end of the window the run heads towards",
    },
    speed: {
        control: {
            type: "number",
            min: 1,
            max: 400,
            step: 10,
        },
        description: "How far the run travels in a second, in pixels",
    },
    delay: {
        control: {
            type: "number",
            min: 0,
            max: 10000,
            step: 250,
        },
        description: "How long the run waits before it sets off, in milliseconds",
    },
    loopCount: {
        control: {
            type: "number",
            min: 0,
            max: 10,
            step: 1,
        },
        description: "How many times the run goes round, nought going round for good",
    },
    autoFill: {
        control: {
            type: "boolean",
        },
        description: "Draws out as many copies as it takes to fill the window",
    },
    spacing: {
        control: {
            type: "text",
        },
        description: "The gap left between one thing in the run and the next",
    },
    reverse: {
        control: {
            type: "boolean",
        },
        description: "Sends the run the other way",
    },
    paused: {
        control: {
            type: "boolean",
        },
        description: "Whether the run is held still, where the caller keeps hold of it",
    },
    pauseOnInteraction: {
        control: {
            type: "boolean",
        },
        description: "Holds the run still while a reader is on it",
    },
    edges: {
        control: {
            type: "boolean",
        },
        description: "Fades the run out where it meets either edge of the window",
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
