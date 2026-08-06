import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// Which way the flow runs. A horizontal flow reads left to right and stacks its branches down
// the page; a vertical one reads top to bottom and stands its branches side by side
export type FlowOrientation = "horizontal" | "vertical";

// How a step shorter than the run it stands in lines up across the flow
export type FlowAlign = "start" | "center";

// How a branch shorter than the group it stands in lines up along the flow: it begins with the
// group, or it ends with it
export type FlowBranchAlign = "start" | "end";

// The shape a flow is laid out from. It is read off the children rather than registered by them,
// so the whole of it is known on the first render and nothing has to be drawn twice
export type FlowTreeNode =
    | { kind: "node"; id: string; disabled?: boolean }
    | { kind: "list"; children: FlowTreeNode[] }
    | { kind: "parallel"; align?: FlowBranchAlign; children: FlowTreeNode[] };

export type FlowSize = {
    width: number;
    height: number;
};

export type FlowPoint = {
    x: number;
    y: number;
};

export type FlowRect = FlowPoint & FlowSize;

// What each step measures, reported by the steps themselves once the browser has laid them out
export type FlowSizes = Record<string, FlowSize>;

// Where each step was put, worked out from what they measure and the shape they stand in
export type FlowPositions = Record<string, FlowPoint>;

// One join between two steps. A join touching a step that is out of use is drawn faintly, so a
// path through the flow that cannot be taken reads as one
export type FlowEdge = {
    from: string;
    to: string;
    disabled?: boolean;
};

// What the layout is worked out from, beyond the shape itself
export type FlowLayoutOptions = {
    sizes: FlowSizes;
    orientation: FlowOrientation;
    align: FlowAlign;
    // The room left between one step and the next along the flow, and between one branch and
    // the next across it
    columnGap: number;
    rowGap: number;
};

type FlowOwnProps = {
    orientation?: FlowOrientation;
    align?: FlowAlign;
    // The room left between one step and the next along the flow
    columnGap?: number;
    // And between one branch and the next across it
    rowGap?: number;
    // How far the arrowheads are turned at the corners of a join
    cornerRadius?: number;
    className?: string;
};

export type FlowProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    FlowOwnProps
>;

export type FlowNodeProps = Omit<React.ComponentPropsWithoutRef<"li">, "id"> & {
    // What the step is called within the flow, which is what the joins either side of it are
    // drawn to and from. It is written out as `data-node-id` rather than as the element's own
    // id, so two flows on a page cannot name the same thing. One is made up from where the step
    // stands where the caller gives none
    id?: string;
    // Draws the step, and the joins either side of it, as a path that cannot be taken
    disabled?: boolean;
    className?: string;
};

export type FlowListProps = React.ComponentPropsWithoutRef<"li"> & {
    className?: string;
};

export type FlowParallelProps = React.ComponentPropsWithoutRef<"li"> & {
    // Whether a branch shorter than the group ends with it rather than beginning with it
    align?: FlowBranchAlign;
    className?: string;
};

export type FlowConnectorsProps = Omit<React.ComponentPropsWithoutRef<"svg">, "children"> & {
    className?: string;
};

export type FlowContextValue = {
    orientation?: FlowOrientation;
    positions?: FlowPositions;
    // Whether every step has said what it measures. Until they all have there is nowhere to put
    // any of them, so they are kept out of sight rather than drawn in a heap at the corner
    measured?: boolean;
    // How a step says what it measures, and says it has gone
    reportSize?: (id: string, size: FlowSize | null) => void;
};
