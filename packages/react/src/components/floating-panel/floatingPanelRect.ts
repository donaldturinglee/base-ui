import type {
    FloatingPanelPoint,
    FloatingPanelRect,
    FloatingPanelResizeAxis,
    FloatingPanelSize,
} from "./FloatingPanel.types";

// A panel opens large enough to hold something worth floating, and small enough to leave the page
// behind it readable
export const DEFAULT_FLOATING_PANEL_SIZE: FloatingPanelSize = { width: 320, height: 240 };

// Far enough in from the corner that the panel reads as sitting above the page rather than as part
// of its edge
export const DEFAULT_FLOATING_PANEL_POSITION: FloatingPanelPoint = { x: 24, y: 24 };

// Below this there is no room left for a header, so a panel dragged smaller would have nothing
// left to drag it back by
export const DEFAULT_FLOATING_PANEL_MIN_SIZE: FloatingPanelSize = { width: 200, height: 120 };

// How far one press of an arrow key moves or resizes the panel, and how far with Shift held
export const FLOATING_PANEL_STEP = 8;
export const FLOATING_PANEL_LARGE_STEP = 40;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// A grid is only a grid above nought, so anything else leaves the value where it was
export const snapToGrid = (value: number, gridSize?: number) =>
    gridSize && gridSize > 0 ? Math.round(value / gridSize) * gridSize : value;

export const clampSize = (
    size: FloatingPanelSize,
    minSize: FloatingPanelSize,
    maxSize?: FloatingPanelSize,
): FloatingPanelSize => ({
    // The largest is read against the smallest rather than on its own, so a max below a min still
    // leaves a size the panel can actually take
    width: clamp(size.width, minSize.width, Math.max(minSize.width, maxSize?.width ?? Infinity)),
    height: clamp(
        size.height,
        minSize.height,
        Math.max(minSize.height, maxSize?.height ?? Infinity),
    ),
});

// Holds the panel within the room it was given. A panel larger than that room is left at the
// boundary's own corner rather than pushed back by the difference, which would put it further out
// than it started
export const clampPosition = (
    position: FloatingPanelPoint,
    size: FloatingPanelSize,
    boundary?: FloatingPanelRect,
    allowOverflow?: boolean,
): FloatingPanelPoint => {
    if (!boundary || allowOverflow) {
        return position;
    }

    return {
        x: clamp(
            position.x,
            boundary.x,
            Math.max(boundary.x, boundary.x + boundary.width - size.width),
        ),
        y: clamp(
            position.y,
            boundary.y,
            Math.max(boundary.y, boundary.y + boundary.height - size.height),
        ),
    };
};

export const isHorizontalAxis = (axis: FloatingPanelResizeAxis) =>
    axis.includes("e") || axis.includes("w");

export const isVerticalAxis = (axis: FloatingPanelResizeAxis) =>
    axis.includes("n") || axis.includes("s");

type ResizeOptions = {
    minSize: FloatingPanelSize;
    maxSize?: FloatingPanelSize;
    boundary?: FloatingPanelRect;
    allowOverflow?: boolean;
    lockAspectRatio?: boolean;
    gridSize?: number;
};

// The panel as it stands after an edge or a corner has been dragged by `delta` from where the
// gesture started. The rect handed in is the one the gesture started from rather than the one on
// screen, so a pointer dragged back over its own path lands where it began instead of drifting
export const resizeRect = (
    rect: FloatingPanelRect,
    axis: FloatingPanelResizeAxis,
    delta: FloatingPanelPoint,
    options: ResizeOptions,
): FloatingPanelRect => {
    const { minSize, maxSize, boundary, allowOverflow, lockAspectRatio, gridSize } = options;

    let width = rect.width;
    let height = rect.height;

    // An edge dragged away from the panel's own corner grows it; one dragged towards it shrinks it
    if (axis.includes("e")) {
        width = rect.width + delta.x;
    }

    if (axis.includes("w")) {
        width = rect.width - delta.x;
    }

    if (axis.includes("s")) {
        height = rect.height + delta.y;
    }

    if (axis.includes("n")) {
        height = rect.height - delta.y;
    }

    width = snapToGrid(width, gridSize);
    height = snapToGrid(height, gridSize);

    // The edge that was taken hold of is the one that leads: a side dragged sideways settles the
    // width and the height follows from it, and the other way about for a top or a bottom
    if (lockAspectRatio && rect.width > 0 && rect.height > 0) {
        const ratio = rect.width / rect.height;

        if (isHorizontalAxis(axis)) {
            height = width / ratio;
        } else {
            width = height * ratio;
        }
    }

    const size = clampSize({ width, height }, minSize, maxSize);

    // Dragging a west or a north edge moves the corner the panel is positioned by, so the edge
    // that was not taken hold of is what stays where it was
    const position = {
        x: axis.includes("w") ? rect.x + rect.width - size.width : rect.x,
        y: axis.includes("n") ? rect.y + rect.height - size.height : rect.y,
    };

    return { ...clampPosition(position, size, boundary, allowOverflow), ...size };
};

// The panel as it stands after being dragged by `delta` from where the gesture started
export const moveRect = (
    rect: FloatingPanelRect,
    delta: FloatingPanelPoint,
    options: Pick<ResizeOptions, "boundary" | "allowOverflow" | "gridSize">,
): FloatingPanelPoint => {
    const { boundary, allowOverflow, gridSize } = options;

    const position = {
        x: snapToGrid(rect.x + delta.x, gridSize),
        y: snapToGrid(rect.y + delta.y, gridSize),
    };

    return clampPosition(position, rect, boundary, allowOverflow);
};

// The room the panel is kept within. An element names its own; without one it is the viewport,
// whose corner is nought because a fixed panel is laid out against the viewport already
export const getBoundaryRect = (element?: HTMLElement | null): FloatingPanelRect | undefined => {
    if (element) {
        const { left, top, width, height } = element.getBoundingClientRect();
        return { x: left, y: top, width, height };
    }

    if (typeof window === "undefined") {
        return undefined;
    }

    return { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
};
