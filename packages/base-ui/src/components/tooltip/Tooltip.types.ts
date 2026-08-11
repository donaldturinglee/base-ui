import type * as React from "react";

// Where the tooltip stands in relation to what it describes, written as a compass point
export type TooltipDirection = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

// A label names the trigger; a description says more about a trigger that is already named
export type TooltipType = "label" | "description";

// How long the pointer has to rest on the trigger before the tooltip appears, so one moving
// across the page does not leave a trail of them
export type TooltipDelay = "short" | "medium" | "long";

export type TooltipProps = React.PropsWithChildren<
    Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
        text: string;
        direction?: TooltipDirection;
        type?: TooltipType;
        delay?: TooltipDelay;
        className?: string;
    }
>;

export type TooltipContextValue = {
    tooltipId?: string;
};
