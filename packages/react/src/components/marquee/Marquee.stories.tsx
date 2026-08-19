import type { StoryFn, Meta } from "@storybook/react-vite";
import { Text } from "../text";
import { Marquee } from ".";
import type { MarqueeProps } from "./Marquee.types";

const classes = {
    // Gives the run a container narrower than its content, which is what it is for
    container: "w-[32rem]",
};

const projects = [
    "base-ui",
    "primer",
    "octicons",
    "actions",
    "codespaces",
    "copilot",
    "dependabot",
];

const items = projects.map((project) => <Text key={project}>{project}</Text>);

export default {
    title: "Components/Marquee",
    component: Marquee,
} as Meta<typeof Marquee>;

export const Default: StoryFn<typeof Marquee> = () => (
    <div className={classes.container}>
        <Marquee>{items}</Marquee>
    </div>
);

export const Playground: StoryFn<MarqueeProps> = (args) => (
    <div className={classes.container}>
        <Marquee {...args}>{items}</Marquee>
    </div>
);

Playground.args = {
    side: "start",
    speed: "medium",
    spacing: "normal",
    pauseOnHover: true,
    paused: false,
};

Playground.argTypes = {
    side: {
        control: {
            type: "radio",
        },
        options: ["start", "end", "top", "bottom"],
        description:
            "Which side the content travels towards. A run travelling up or down needs a height of its own",
    },
    speed: {
        control: {
            type: "radio",
        },
        options: ["slow", "medium", "fast"],
        description: "How fast it travels, in pixels a second rather than in time to come round",
    },
    spacing: {
        control: {
            type: "radio",
        },
        options: ["none", "tight", "condensed", "cozy", "normal", "spacious"],
        description: "The room left between the items, and between one copy and the next",
    },
    pauseOnHover: {
        control: {
            type: "boolean",
        },
        description: "Holds the content still while the pointer rests on it",
    },
    paused: {
        control: {
            type: "boolean",
        },
        description: "Holds the content still because the caller says so",
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
