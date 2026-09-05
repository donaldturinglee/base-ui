import type { TextDirection } from "../../providers/direction/Direction.types";

export type NavigateOptions = {
    key: string;
    // Which way the items run, and so which arrows move along them. Items running both ways
    // answer every arrow
    orientation?: "horizontal" | "vertical" | "both";
    // Whether moving past either end comes round to the other
    loop?: boolean;
    direction?: TextDirection;
};

// Which of the items a key moves focus to from the one holding it: the neighbour on either side,
// or the item at either end. Nothing where the key does not move along the way the items run, or
// where the one holding focus is not among them
export const navigate = <T extends HTMLElement>(
    items: T[],
    current: T | null,
    options: NavigateOptions,
): T | null => {
    const { key, orientation = "both", loop = true, direction = "ltr" } = options;

    if (!current || items.length === 0) {
        return null;
    }

    const isVertical = key === "ArrowUp" || key === "ArrowDown";
    const isHorizontal = key === "ArrowLeft" || key === "ArrowRight";

    if (!isVertical && !isHorizontal && key !== "Home" && key !== "End") {
        return null;
    }

    if (
        (orientation === "vertical" && isHorizontal) ||
        (orientation === "horizontal" && isVertical)
    ) {
        return null;
    }

    if (key === "Home") {
        return items[0];
    }

    if (key === "End") {
        return items[items.length - 1];
    }

    const index = items.indexOf(current);

    if (index === -1) {
        return null;
    }

    // Along a row the way forward is the way the page is read, so the arrows swap over where it
    // is read right to left
    const forwardKey = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
    const isForward = key === "ArrowDown" || key === forwardKey;
    const step = isForward ? 1 : -1;

    if (loop) {
        return items[(index + step + items.length) % items.length];
    }

    return items[Math.min(Math.max(index + step, 0), items.length - 1)];
};
