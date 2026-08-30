import type * as React from "react";
import type {
    GroupImperativeHandle,
    GroupProps,
    Layout,
    PanelImperativeHandle,
    PanelProps,
    SeparatorProps as PanelSeparatorProps,
} from "react-resizable-panels";

// Which way the panels are laid out. Panels side by side are parted by a handle standing up;
// panels stacked one on another by a handle lying down
export type ResizableOrientation = "horizontal" | "vertical";

// Where the panels stand, kept against the id of each of them. It is what a caller saves to
// hand the same layout back on the next visit
export type ResizableLayout = Layout;

// What a group of panels can be asked to do from outside it, through the `resizableRef` prop
export type ResizableInstance = GroupImperativeHandle;

// What a panel can be asked to do from outside it, through the `panelRef` prop
export type ResizablePanelInstance = PanelImperativeHandle;

// `elementRef` is dropped from all three, since a ref handed to one of them lands on the element
// it draws, the way it does on every other component here
export type ResizableProps = Omit<GroupProps, "elementRef" | "groupRef" | "orientation"> & {
    orientation?: ResizableOrientation;
    // Exposes what the group can be asked to do: reading the layout back, and setting a
    // fresh one
    resizableRef?: GroupProps["groupRef"];
    className?: string;
};

export type ResizablePanelProps = Omit<PanelProps, "elementRef"> & {
    className?: string;
};

export type ResizableResizeTriggerProps = Omit<PanelSeparatorProps, "elementRef"> & {
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
