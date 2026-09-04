import type { ResizableLayout, ResizablePanelSize } from "./Resizable.types";

// Shares are worked out in floating point and compared against one another all the way through, so
// two that differ only in the last place are taken to be the same share rather than a reason to
// lay the panels out again
const EPSILON = 0.0001;

// What a size is read against. The room is what the panels have between them, which is the group
// less the triggers standing in it; the rest are the lengths the units a caller may write are
// worked out from
export type ResizableSizeContext = {
    availablePx: number;
    remPx: number;
    emPx: number;
    vhPx: number;
    vwPx: number;
};

// How little and how much room a panel will take, both as shares of the group, with what it comes
// to when it is folded away and whether it is held where it stands
export type ResizableConstraints = {
    min: number;
    max: number;
    collapsedTo: number;
    collapsible: boolean;
    disabled: boolean;
};

// What a panel says about itself, which is everything the layout is worked out from. It is kept
// apart from the props so that the maths can be read and tested without a panel to draw
export type ResizablePanelRecord = {
    id: string;
    defaultSize?: ResizablePanelSize;
    minSize?: ResizablePanelSize;
    maxSize?: ResizablePanelSize;
    collapsedSize?: ResizablePanelSize;
    collapsible?: boolean;
    disabled?: boolean;
};

// A number and a string with nothing on the end of it say two different things, so the unit is
// read off the end rather than guessed at from the value
const SIZE_PATTERN = /^(-?\d*\.?\d+)(px|%|rem|em|vh|vw)?$/;

export const clamp = (value: number, low: number, high: number) =>
    Math.min(Math.max(value, low), Math.max(low, high));

export const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

// A length in pixels as a share of the room the panels have between them. A group that has not been
// laid out yet has no room to read a length against, so a size given in pixels says nothing until
// it has: it is left out rather than read as nought, which would hold every panel shut
const toShare = (px: number, availablePx: number) =>
    availablePx > 0 ? (px / availablePx) * 100 : undefined;

// How much room a size asks for, as a share of the group. A number is read as pixels and a string
// with no unit on it as a share, so 20 and "20" are two different sizes; anything ending in a unit
// is read as that unit
export const toPercentage = (
    size: ResizablePanelSize | undefined,
    context: ResizableSizeContext,
): number | undefined => {
    if (size === undefined || size === null) {
        return undefined;
    }

    if (typeof size === "number") {
        return Number.isFinite(size) ? toShare(size, context.availablePx) : undefined;
    }

    const match = SIZE_PATTERN.exec(size.trim());

    if (!match) {
        return undefined;
    }

    const value = Number(match[1]);

    switch (match[2]) {
        case undefined:
        case "%":
            return value;
        case "px":
            return toShare(value, context.availablePx);
        case "rem":
            return toShare(value * context.remPx, context.availablePx);
        case "em":
            return toShare(value * context.emPx, context.availablePx);
        case "vh":
            return toShare(value * context.vhPx, context.availablePx);
        case "vw":
            return toShare(value * context.vwPx, context.availablePx);
        default:
            return undefined;
    }
};

// What a panel will and will not do, read off what it was given. A maximum below the minimum is
// raised to it rather than left to hold the panel at two sizes at once, and what a panel folds
// away to can never be more than the smallest size it is open at
export const constraintsOf = (
    panel: ResizablePanelRecord,
    context: ResizableSizeContext,
): ResizableConstraints => {
    const min = clamp(toPercentage(panel.minSize, context) ?? 0, 0, 100);
    const max = clamp(toPercentage(panel.maxSize, context) ?? 100, min, 100);
    const collapsedTo = clamp(toPercentage(panel.collapsedSize, context) ?? 0, 0, min);

    return {
        min,
        max,
        collapsedTo,
        collapsible: panel.collapsible ?? false,
        disabled: panel.disabled ?? false,
    };
};

// The smallest a panel will go: shut, where it folds away, and its stated minimum otherwise
export const floorOf = (constraints: ResizableConstraints) =>
    constraints.collapsible ? constraints.collapsedTo : constraints.min;

// Whether a panel is standing at the size it folds away to
export const isCollapsed = (size: number, constraints: ResizableConstraints) =>
    constraints.collapsible && size <= constraints.collapsedTo + EPSILON;

// Where the panels start: at a size saved from a previous visit where one names them, at the size
// they were given where they name one themselves, and at an even share of whatever is left over
// otherwise
export const startingSizes = (
    panels: ResizablePanelRecord[],
    context: ResizableSizeContext,
    saved?: ResizableLayout,
) => {
    const asked = panels.map((panel) => {
        const savedSize = saved?.[panel.id];

        if (typeof savedSize === "number" && Number.isFinite(savedSize)) {
            return savedSize;
        }

        return toPercentage(panel.defaultSize, context);
    });

    const spoken = sum(asked.filter((size): size is number => size !== undefined));
    const silent = asked.filter((size) => size === undefined).length;
    const share = silent > 0 ? Math.max(100 - spoken, 0) / silent : 0;

    return asked.map((size) => size ?? share);
};

// The panels held to what they will take and to the room there is between them. Whatever the
// clamping leaves over is handed back to the panels with room for it, in proportion to how much
// room each of them has, so that the shares always come to the whole of the group
export const settle = (sizes: number[], constraints: ResizableConstraints[]) => {
    if (!sizes.length) {
        return sizes;
    }

    const next = sizes.map((size, index) =>
        clamp(size, floorOf(constraints[index]), constraints[index].max),
    );

    // Twice over: once to hand back what the clamping left, and once more for whatever the first
    // pass could not place because a panel it was handed to reached its own bound
    for (let pass = 0; pass < 2; pass += 1) {
        const drift = 100 - sum(next);

        if (Math.abs(drift) <= EPSILON) {
            break;
        }

        const room = next.map((size, index) =>
            drift > 0 ? constraints[index].max - size : size - floorOf(constraints[index]),
        );
        const total = sum(room);

        if (total <= EPSILON) {
            break;
        }

        const moved = Math.min(Math.abs(drift), total) * Math.sign(drift);

        next.forEach((size, index) => {
            next[index] = size + (moved * room[index]) / total;
        });
    }

    return next;
};

// The panels in the order they are reached for, nearest the trigger first. A trigger stands
// between the panel at its own index and the one after it, so growing runs back towards the start
// of the group and shrinking on towards the end, or the other way about
const towardsStart = (from: number) => Array.from({ length: from + 1 }, (_, step) => from - step);

const towardsEnd = (from: number, count: number) =>
    Array.from({ length: count - from }, (_, step) => from + step);

// How much room the panels in an order have to give up, or to take on
const roomIn = (
    order: number[],
    sizes: number[],
    constraints: ResizableConstraints[],
    direction: "grow" | "shrink",
) =>
    sum(
        order.map((index) => {
            if (constraints[index].disabled) {
                return 0;
            }

            return direction === "grow"
                ? constraints[index].max - sizes[index]
                : sizes[index] - floorOf(constraints[index]);
        }),
    );

// Room taken off the panels in an order, or handed to them, nearest the trigger first, so that the
// panel a reader is dragging against is the one that moves and the ones beyond it only take what
// is left over
const spread = (
    sizes: number[],
    order: number[],
    constraints: ResizableConstraints[],
    amount: number,
    direction: "grow" | "shrink",
) => {
    let left = amount;

    for (const index of order) {
        if (left <= EPSILON) {
            break;
        }

        if (constraints[index].disabled) {
            continue;
        }

        const room =
            direction === "grow"
                ? constraints[index].max - sizes[index]
                : sizes[index] - floorOf(constraints[index]);
        const moved = Math.min(room, left);

        sizes[index] += direction === "grow" ? moved : -moved;
        left -= moved;
    }

    return amount - left;
};

// Every panel but the one named, nearest it first and reaching out either side by turns, so that
// room a panel gives up goes to whatever it was standing against rather than to the far end of the
// group
const around = (index: number, count: number) => {
    const order: number[] = [];

    for (let step = 1; step < count; step += 1) {
        if (index + step < count) {
            order.push(index + step);
        }

        if (index - step >= 0) {
            order.push(index - step);
        }
    }

    return order;
};

// One panel put at a size of its own, with the difference taken from or handed to the panels
// around it rather than back to the panel itself. This is what folding a panel away is: settling
// it against the rest would hand it back a share of the very room it just gave up
export const setSizeAt = (
    sizes: number[],
    constraints: ResizableConstraints[],
    index: number,
    target: number,
) => {
    if (index < 0 || index >= sizes.length) {
        return sizes;
    }

    const next = [...sizes];
    const wanted = clamp(target, floorOf(constraints[index]), constraints[index].max);
    const change = wanted - next[index];

    if (Math.abs(change) <= EPSILON) {
        return next;
    }

    // A panel growing takes room off the others; one shrinking hands room to them, and only as
    // much moves as they will bear
    const moved = spread(
        next,
        around(index, sizes.length),
        constraints,
        Math.abs(change),
        change > 0 ? "shrink" : "grow",
    );

    next[index] += change > 0 ? moved : -moved;

    return next;
};

// Where the panels come to rest once the trigger at `index` has been moved by `delta` shares. A
// delta above nought gives room to the panels before the trigger by taking it from those after.
//
// Only as much is moved as both sides will bear, so a drag that runs past what a panel will take
// stops there rather than being lost: what one side gives up is exactly what the other takes on,
// and the shares still come to the whole of the group
export const resizeAt = (
    sizes: number[],
    constraints: ResizableConstraints[],
    index: number,
    delta: number,
) => {
    if (index < 0 || index + 1 >= sizes.length || Math.abs(delta) <= EPSILON) {
        return sizes;
    }

    const growing = delta > 0 ? towardsStart(index) : towardsEnd(index + 1, sizes.length);
    const shrinking = delta > 0 ? towardsEnd(index + 1, sizes.length) : towardsStart(index);

    const move = Math.min(
        Math.abs(delta),
        roomIn(growing, sizes, constraints, "grow"),
        roomIn(shrinking, sizes, constraints, "shrink"),
    );

    if (move <= EPSILON) {
        return sizes;
    }

    const next = [...sizes];
    const taken = spread(next, shrinking, constraints, move, "shrink");
    spread(next, growing, constraints, taken, "grow");

    return snapPivot(next, constraints, shrinking[0], growing);
};

// A panel that folds away is not left resting between shut and the smallest size it is open at:
// dragged into that gap it goes to whichever end of it is nearer, and whatever that frees or
// costs is settled with the panels on the other side of the trigger
const snapPivot = (
    sizes: number[],
    constraints: ResizableConstraints[],
    pivot: number,
    growing: number[],
) => {
    const constraint = constraints[pivot];
    const size = sizes[pivot];

    if (
        !constraint.collapsible ||
        size <= constraint.collapsedTo + EPSILON ||
        size >= constraint.min - EPSILON
    ) {
        return sizes;
    }

    const shut = size - constraint.collapsedTo < constraint.min - size;
    const target = shut ? constraint.collapsedTo : constraint.min;
    const next = [...sizes];

    next[pivot] = target;

    if (shut) {
        spread(next, growing, constraints, size - target, "grow");
    } else {
        spread(next, growing, constraints, target - size, "shrink");
    }

    return next;
};

// The shares kept against the id of each panel, which is the shape a layout is read back and
// handed in as
export const toLayout = (panels: ResizablePanelRecord[], sizes: number[]): ResizableLayout =>
    Object.fromEntries(panels.map((panel, index) => [panel.id, sizes[index] ?? 0]));

// Whether two layouts stand at the same shares, so that one that has not moved is not reported as
// though it had
export const sameLayout = (left: ResizableLayout, right: ResizableLayout) => {
    const keys = Object.keys(left);

    if (keys.length !== Object.keys(right).length) {
        return false;
    }

    return keys.every((key) => Math.abs((left[key] ?? 0) - (right[key] ?? 0)) <= EPSILON);
};
