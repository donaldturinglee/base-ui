import type * as React from "react";

// Which way the content travels. The inline sides follow the reading direction, so a run that
// travels towards the start travels leftwards on a page read left to right and rightwards on one
// read right to left. The block sides travel up and down it
export type MarqueeSide = "start" | "end" | "top" | "bottom";

// Which way round the run is laid out, which follows from the side it travels towards
export type MarqueeAxis = "inline" | "block";

// How fast it travels. The speeds are in pixels a second rather than in how long one turn takes,
// so that a run of three items and a run of thirty move at the same pace as one another
export type MarqueeSpeed = "slow" | "medium" | "fast";

// How much room is left between the items in the run. It is the same scale a Stack is spaced by,
// since a run of content is a stack of it that happens to be travelling
export type MarqueeSpacing = "none" | "tight" | "condensed" | "cozy" | "normal" | "spacious";

export type MarqueeProps = React.ComponentPropsWithoutRef<"div"> & {
    // A run travelling up or down has to be given a height of its own: there is nothing holding
    // back a column of content the way the width of the page holds back a row of it
    side?: MarqueeSide;
    speed?: MarqueeSpeed;
    // The room left between the items, and between the last item of one copy and the first of
    // the next, so that a copy coming round is spaced from the one in front the way its own
    // items are spaced from each other
    spacing?: MarqueeSpacing;
    // Holds the content still while the pointer rests on it, so that something worth reading or
    // clicking can be. It is held still while anything inside it has focus either way
    pauseOnHover?: boolean;
    // Holds the content still because the caller says so, which is what a pause control of
    // their own drives
    paused?: boolean;
    className?: string;
};

export type UseMarqueeOptions = {
    side?: MarqueeSide;
    speed?: MarqueeSpeed;
};

export type UseMarqueeResult = {
    // Goes on the run, which is what settles how much room there is to fill
    rootRef: React.RefObject<HTMLDivElement | null>;
    // Goes on the first copy of the content, which is what the travel is measured from
    groupRef: React.RefObject<HTMLDivElement | null>;
    // Which way round the run is laid out, taken from the side it travels towards
    axis: MarqueeAxis;
    // How many copies the loop has to be made of to keep from emptying on the way round
    copies: number;
    // How far the track travels before it is back where it started, in pixels
    distance: number;
    // How long the track takes to cover that, in seconds
    duration: number;
    // Both of those written as custom properties, ready to go on the run
    style: React.CSSProperties;
};
