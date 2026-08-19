import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Link } from "../link";
import { Text } from "../text";
import { Token } from "../token";
import { Marquee } from ".";
import type { MarqueeSpacing, MarqueeSpeed } from "./Marquee.types";

const classes = {
    // Gives the run a container narrower than its content, which is what it is for
    container: "w-[32rem]",
    // Sets one run apart from the next where several are shown together
    group: "flex flex-col gap-[var(--base-size-24)]",
    row: "flex items-start gap-[var(--base-size-40)]",
    stack: "flex flex-col items-start gap-[var(--base-size-8)]",
    // The height a run travelling up or down is read through, which it has to be given
    tall: "h-[10rem]",
    muted: "text-[var(--foreground-color-muted)]",
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

const speeds: MarqueeSpeed[] = ["slow", "medium", "fast"];

const spacings: MarqueeSpacing[] = ["none", "condensed", "normal", "spacious"];

const items = projects.map((project) => <Text key={project}>{project}</Text>);

export default {
    title: "Components/Marquee/Features",
};

// Along The Line, which is the same run played backwards. Which way "the start" lies follows the
// reading direction, so these travel the other way round on a page read right to left
export const AlongTheLine: StoryFn<typeof Marquee> = () => (
    <div className={`${classes.container} ${classes.group}`}>
        <div className={classes.stack}>
            <Text size="small" className={classes.muted}>
                Towards the start
            </Text>
            <Marquee>{items}</Marquee>
        </div>

        <div className={classes.stack}>
            <Text size="small" className={classes.muted}>
                Towards the end
            </Text>
            <Marquee side="end">{items}</Marquee>
        </div>
    </div>
);

// Down The Page. Nothing holds a column back the way the width of the page holds back a row, so
// a run travelling up or down is only a run at all once it has been given a height to read it
// through
export const DownThePage: StoryFn<typeof Marquee> = () => (
    <div className={classes.row}>
        <div className={classes.stack}>
            <Text size="small" className={classes.muted}>
                Towards the top
            </Text>
            <Marquee side="top" className={classes.tall}>
                {items}
            </Marquee>
        </div>

        <div className={classes.stack}>
            <Text size="small" className={classes.muted}>
                Towards the bottom
            </Text>
            <Marquee side="bottom" className={classes.tall}>
                {items}
            </Marquee>
        </div>
    </div>
);

// How Fast It Travels. The speeds are in pixels a second, so these three runs cover the same
// ground at different paces rather than covering different ground in the same time
export const Speeds: StoryFn<typeof Marquee> = () => (
    <div className={`${classes.container} ${classes.group}`}>
        {speeds.map((speed) => (
            <div key={speed} className={classes.stack}>
                <Text size="small" className={classes.muted}>
                    {speed}
                </Text>
                <Marquee speed={speed}>{items}</Marquee>
            </div>
        ))}
    </div>
);

// The Room Between The Items, which is also the room a copy leaves for the one coming round
// behind it, so the run reads evenly however far along it has got
export const Spacing: StoryFn<typeof Marquee> = () => (
    <div className={`${classes.container} ${classes.group}`}>
        {spacings.map((spacing) => (
            <div key={spacing} className={classes.stack}>
                <Text size="small" className={classes.muted}>
                    {spacing}
                </Text>
                <Marquee spacing={spacing} speed="slow">
                    {items}
                </Marquee>
            </div>
        ))}
    </div>
);

// A Band Of Marks, which is the run most often asked for. The room between them is set on the
// run rather than on each of them
export const WithTokens: StoryFn<typeof Marquee> = () => (
    <div className={classes.container}>
        <Marquee speed="slow" spacing="spacious">
            {projects.map((project) => (
                <Token key={project} text={project} />
            ))}
        </Marquee>
    </div>
);

// With Something To Reach In It. The run stops under the pointer so that a link travelling past
// can be caught, and stops for the keyboard as well once anything in it has focus
export const WithLinks: StoryFn<typeof Marquee> = () => (
    <div className={classes.container}>
        <Marquee speed="slow">
            {projects.map((project) => (
                <Link key={project} href={`#${project}`}>
                    {project}
                </Link>
            ))}
        </Marquee>
    </div>
);

// Held Still By The Caller, which is how a pause control of their own is wired up
export const Paused: StoryFn<typeof Marquee> = () => {
    const [paused, setPaused] = React.useState(false);

    return (
        <div className={`${classes.container} ${classes.stack}`}>
            <Button onClick={() => setPaused((current) => !current)}>
                {paused ? "Start the run" : "Hold the run"}
            </Button>

            <Marquee paused={paused}>{items}</Marquee>
        </div>
    );
};

// Travelling Under The Pointer, for a run with nothing in it worth stopping for
export const WithoutPauseOnHover: StoryFn<typeof Marquee> = () => (
    <div className={classes.container}>
        <Marquee pauseOnHover={false}>{items}</Marquee>
    </div>
);
