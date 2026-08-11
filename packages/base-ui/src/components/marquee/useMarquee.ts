import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import type {
    MarqueeAxis,
    MarqueeSide,
    MarqueeSpeed,
    UseMarqueeOptions,
    UseMarqueeResult,
} from "./Marquee.types";

// Pixels a second. How far the content has to travel is measured rather than assumed, so what
// is settled here is how fast it moves rather than how long it takes to come round
export const MARQUEE_SPEEDS = {
    slow: 30,
    medium: 60,
    fast: 120,
} satisfies Record<MarqueeSpeed, number>;

// Which way round a run is laid out follows from the side it travels towards: the two sides of
// a line lay it out along the line, and the two ends of the page lay it out down the page
export const MARQUEE_AXES = {
    start: "inline",
    end: "inline",
    top: "block",
    bottom: "block",
} satisfies Record<MarqueeSide, MarqueeAxis>;

// The fewest copies a seamless loop can be made of: one to be read, and one standing behind it
export const MARQUEE_MINIMUM_COPIES = 2;

// Works out what it takes to loop a run of content without a seam: how far the track has to
// travel before the copy behind is standing exactly where the one in front was, how long that
// takes at the speed asked for, and how many copies it takes to keep the run from emptying on
// the way round.
//
// Only the axis the run travels along is measured, since that is the one the loop closes on: a
// run travelling along the line is measured by width, and one travelling down the page by height.
//
// It is kept apart from the component so that a run laid out some other way can be worked out
// the same way. What it hands back goes on two elements: the run itself, and the first copy of
// the content inside it
export const useMarquee = ({
    side = "start",
    speed = "medium",
}: UseMarqueeOptions = {}): UseMarqueeResult => {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const groupRef = React.useRef<HTMLDivElement>(null);

    const [distance, setDistance] = React.useState(0);
    const [copies, setCopies] = React.useState(MARQUEE_MINIMUM_COPIES);

    const axis = MARQUEE_AXES[side];

    useIsomorphicLayoutEffect(() => {
        const root = rootRef.current;
        const group = groupRef.current;

        if (!root || !group) {
            return;
        }

        const measure = () => {
            const groupRect = group.getBoundingClientRect();
            const rootRect = root.getBoundingClientRect();

            const groupSize = axis === "inline" ? groupRect.width : groupRect.height;
            const rootSize = axis === "inline" ? rootRect.width : rootRect.height;

            setDistance(groupSize);
            // Enough copies to fill the run, and one more to come round behind them, so that a
            // short run of content in a wide space never leaves a gap trailing after it
            setCopies(
                groupSize > 0
                    ? Math.max(MARQUEE_MINIMUM_COPIES, Math.ceil(rootSize / groupSize) + 1)
                    : MARQUEE_MINIMUM_COPIES,
            );
        };

        measure();

        // Not every browser has one to reach for, and a run that is never measured again still
        // travels the length it was first given
        if (typeof ResizeObserver === "undefined") {
            return;
        }

        // The content is measured again as it grows and as the room for it changes. Neither the
        // copy nor the run is resized by there being more copies, so this does not set itself off
        const observer = new ResizeObserver(measure);
        observer.observe(root);
        observer.observe(group);

        return () => {
            observer.disconnect();
        };
    }, [axis]);

    const duration = distance > 0 ? distance / MARQUEE_SPEEDS[speed] : 0;

    const style = {
        "--marquee-distance": `${distance}px`,
        "--marquee-duration": `${duration}s`,
    } as React.CSSProperties;

    return { rootRef, groupRef, axis, copies, distance, duration, style };
};
