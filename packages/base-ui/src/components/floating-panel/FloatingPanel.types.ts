import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// Where the panel's top-left corner sits, in the coordinates its boundary is measured in
export type FloatingPanelPoint = {
    x: number;
    y: number;
};

export type FloatingPanelSize = {
    width: number;
    height: number;
};

export type FloatingPanelRect = FloatingPanelPoint & FloatingPanelSize;

// Which edge or corner a resize trigger takes hold of, named after the compass point it sits at
export type FloatingPanelResizeAxis = "n" | "e" | "s" | "w" | "ne" | "nw" | "se" | "sw";

// How much of the panel is showing: all of it, only the header, or the whole of the room it was
// given
export type FloatingPanelStage = "default" | "minimized" | "maximized";

// Whether the panel is laid out against the viewport or against the nearest positioned ancestor
export type FloatingPanelStrategy = "fixed" | "absolute";

export type FloatingPanelProps = {
    // Whether the panel is showing, where the caller keeps hold of the state
    open?: boolean;
    // Whether it starts out showing, where the panel keeps hold of the state itself
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    // Where the panel stands, where the caller keeps hold of the state
    position?: FloatingPanelPoint;
    defaultPosition?: FloatingPanelPoint;
    // Called throughout a drag, on every step of it
    onPositionChange?: (position: FloatingPanelPoint) => void;
    // Called once the drag is let go of, for a caller that would rather store where it landed
    // than every place it passed through
    onPositionChangeEnd?: (position: FloatingPanelPoint) => void;
    size?: FloatingPanelSize;
    defaultSize?: FloatingPanelSize;
    onSizeChange?: (size: FloatingPanelSize) => void;
    onSizeChangeEnd?: (size: FloatingPanelSize) => void;
    stage?: FloatingPanelStage;
    defaultStage?: FloatingPanelStage;
    onStageChange?: (stage: FloatingPanelStage) => void;
    // The smallest and largest the panel can be dragged to
    minSize?: FloatingPanelSize;
    maxSize?: FloatingPanelSize;
    draggable?: boolean;
    resizable?: boolean;
    // Stops it being moved or resized, while leaving it on the page
    disabled?: boolean;
    closeOnEscape?: boolean;
    // Holds the shape it started at, so a corner dragged out keeps the panel in proportion
    lockAspectRatio?: boolean;
    // Lets the panel be dragged past the edges of its boundary rather than being held within them
    allowOverflow?: boolean;
    // Rounds every step of a drag to a multiple of this, so panels line up with one another
    gridSize?: number;
    strategy?: FloatingPanelStrategy;
    // The room the panel is kept within, which is the viewport when nothing is named
    getBoundaryElement?: () => HTMLElement | null;
    children?: React.ReactNode;
};

export type FloatingPanelTriggerProps = React.ComponentPropsWithoutRef<"button"> & {
    className?: string;
};

export type FloatingPanelPositionerProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type FloatingPanelContentProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type FloatingPanelHeaderProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type FloatingPanelTitleProps<As extends React.ElementType = "h2"> = PolymorphicProps<
    As,
    "h2",
    {
        className?: string;
    }
>;

export type FloatingPanelBodyProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

// The row the header buttons stand in, so that pressing anywhere else on the header still drags
export type FloatingPanelControlProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type FloatingPanelDragTriggerProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

// The button draws an icon and is named for a screen reader by the panel itself, so there is
// nothing left for a caller to fill either with
export type FloatingPanelCloseTriggerProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "children" | "aria-label" | "aria-labelledby"
> & {
    className?: string;
};

export type FloatingPanelStageTriggerProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "children" | "aria-label" | "aria-labelledby"
> & {
    // Which stage pressing it puts the panel into
    stage: FloatingPanelStage;
    className?: string;
};

export type FloatingPanelResizeTriggerProps = React.ComponentPropsWithoutRef<"div"> & {
    // Which edge or corner it takes hold of
    axis: FloatingPanelResizeAxis;
    className?: string;
};

export type FloatingPanelContextValue = {
    open: boolean;
    setOpen: (open: boolean) => void;
    position: FloatingPanelPoint;
    size: FloatingPanelSize;
    stage: FloatingPanelStage;
    setStage: (stage: FloatingPanelStage) => void;
    // Whether a gesture is under way, so the parts can say so without watching the pointer
    dragging: boolean;
    resizing: boolean;
    draggable: boolean;
    resizable: boolean;
    // What the panel will actually answer to as it stands, which is what the props allow read
    // against the stage it is at. The parts read these rather than working the rule out again, so
    // that what a trigger says of itself and what the panel does cannot drift apart
    canDrag: boolean;
    canResize: boolean;
    disabled: boolean;
    strategy: FloatingPanelStrategy;
    triggerId: string;
    contentId: string;
    titleId: string;
    // Takes hold of the panel with a pointer. The gesture is followed on the window rather than on
    // the trigger, so a pointer that runs ahead of the panel keeps hold of it
    startDrag: (event: React.PointerEvent) => void;
    startResize: (event: React.PointerEvent, axis: FloatingPanelResizeAxis) => void;
    // The same two moves from the keyboard, for a reader who is not holding a pointer
    moveBy: (delta: FloatingPanelPoint) => void;
    resizeBy: (axis: FloatingPanelResizeAxis, delta: FloatingPanelPoint) => void;
};
