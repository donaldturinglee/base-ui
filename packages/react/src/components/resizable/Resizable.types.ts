import type * as React from "react";

// Which way the panels are laid out. Panels side by side are parted by a handle standing up;
// panels stacked one on another by a handle lying down
export type ResizableOrientation = "horizontal" | "vertical";

// Where the panels stand, kept against the id of each of them as a share of the group between
// nought and a hundred. It is what a caller saves to hand the same layout back on the next visit
export type ResizableLayout = Record<string, number>;

// How much room a panel is given. A number is read as pixels and a string with no unit on it as a
// share of the group, so 20 and "20" are two different sizes; anything ending in a unit is read as
// that unit, which is what "20rem" and "50%" say
export type ResizablePanelSize = number | string;

// A panel's size read both ways at once, since a caller saving a layout wants the share and one
// laying something out beside it wants the pixels
export type ResizablePanelSizes = {
    asPercentage: number;
    inPixels: number;
};

// What is said about a layout that has finished changing. A change the reader made by working a
// trigger is told from one the group was handed from outside, since only the first is worth
// saving as something the reader chose
export type ResizableLayoutChangeDetails = {
    isUserInteraction: boolean;
};

// What a group of panels can be asked to do from outside it, through the `resizableRef` prop
export type ResizableInstance = {
    getLayout: () => ResizableLayout;
    setLayout: (layout: ResizableLayout) => ResizableLayout;
};

// What a panel can be asked to do from outside it, through the `panelRef` prop
export type ResizablePanelInstance = {
    collapse: () => void;
    expand: () => void;
    getSize: () => ResizablePanelSizes;
    isCollapsed: () => boolean;
    resize: (size: ResizablePanelSize) => void;
};

// The group draws a div and takes what one takes, less the resize event of its own that an
// element carries and that says nothing about the panels
export type ResizableProps = Omit<React.ComponentPropsWithoutRef<"div">, "onResize"> & {
    orientation?: ResizableOrientation;
    // Holds every panel where it stands
    disabled?: boolean;
    // Leaves the pointer as it is rather than changing it to say which way a trigger will move
    disableCursor?: boolean;
    // Where the panels start, for a layout saved from a previous visit
    defaultLayout?: ResizableLayout;
    // Called as the layout is changing, which for a drag is every time the pointer moves
    onLayoutChange?: (layout: ResizableLayout) => void;
    // Called once the layout has changed, which for a drag is not until the trigger has been let
    // go of. It is what a layout being saved somewhere is read from
    onLayoutChanged?: (layout: ResizableLayout, details: ResizableLayoutChangeDetails) => void;
    // Exposes what the group can be asked to do: reading the layout back, and setting a fresh one
    resizableRef?: React.Ref<ResizableInstance | null>;
    className?: string;
};

// A panel is named within its group rather than on the page, so its id is its own rather than the
// element's, and it is what a saved layout is kept against
export type ResizablePanelProps = Omit<React.ComponentPropsWithoutRef<"div">, "onResize" | "id"> & {
    id?: string | number;
    // How much room the panel starts with
    defaultSize?: ResizablePanelSize;
    // How little and how much room it will take, however far the trigger is dragged
    minSize?: ResizablePanelSize;
    maxSize?: ResizablePanelSize;
    // Lets the panel fold shut where it is dragged below its minimum
    collapsible?: boolean;
    // How much room a folded panel is left with
    collapsedSize?: ResizablePanelSize;
    // Holds this panel where it stands
    disabled?: boolean;
    // Called as the panel's own size changes
    onResize?: (
        size: ResizablePanelSizes,
        id: string,
        previous: ResizablePanelSizes | undefined,
    ) => void;
    panelRef?: React.Ref<ResizablePanelInstance | null>;
    className?: string;
};

export type ResizableResizeTriggerProps = React.ComponentPropsWithoutRef<"div"> & {
    // Holds this one trigger where it stands, leaving the rest of the group as it was
    disabled?: boolean;
    className?: string;
};

// What a trigger holds is drawing and nothing more, so both parts are kept out of the
// accessibility tree: what the trigger is and what it stands between is already said by the
// trigger itself
export type ResizableResizeTriggerSeparatorProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type ResizableResizeTriggerIndicatorProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};
