import type * as React from "react";

// Which ends of the rail are trimmed back to the first and last badge, so the timeline does
// not appear to run on past what it holds
export type TimelineClipSidebar = boolean | "start" | "end" | "both";

export type TimelineBadgeVariant =
    | "accent"
    | "success"
    | "attention"
    | "severe"
    | "danger"
    | "done"
    | "open"
    | "closed"
    | "sponsors";

// `role` is dropped because the list has to keep saying it is one: Safari takes the
// semantics away from a list with no markers
export type TimelineProps = Omit<React.ComponentPropsWithoutRef<"ol">, "role"> & {
    clipSidebar?: TimelineClipSidebar;
    className?: string;
};

export type TimelineItemProps = React.ComponentPropsWithoutRef<"li"> & {
    // Draws the item tighter, for a run of small events such as commits
    condensed?: boolean;
    className?: string;
};

export type TimelineBadgeProps = React.ComponentPropsWithoutRef<"div"> & {
    variant?: TimelineBadgeVariant;
    className?: string;
};

export type TimelineBodyProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

// A break is only a line across the rail, so it says nothing of its own
export type TimelineBreakProps = Omit<React.ComponentPropsWithoutRef<"li">, "role"> & {
    className?: string;
};

export type TimelineActionsProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type TimelineAvatarProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};
