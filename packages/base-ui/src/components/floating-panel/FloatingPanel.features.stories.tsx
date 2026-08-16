import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { FloatingPanel } from ".";
import type { FloatingPanelPoint, FloatingPanelResizeAxis } from "./FloatingPanel.types";

const EDGES: FloatingPanelResizeAxis[] = ["n", "e", "s", "w", "ne", "nw", "se", "sw"];

// What a panel is usually given: every corner can be taken hold of, and the edges between them are
// left out
const CORNERS: FloatingPanelResizeAxis[] = ["nw", "ne", "sw", "se"];

const classes = {
    // The room a panel laid out against an ancestor is measured within. It is positioned, which is
    // what makes it the thing the panel is measured against
    boundary:
        "relative h-[320px] w-full overflow-hidden [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-dashed border-border-default",
};

export default {
    title: "Components/FloatingPanel/Features",
};

type PanelProps = {
    axes?: FloatingPanelResizeAxis[];
    title?: string;
    children?: React.ReactNode;
};

const Panel = ({ axes = CORNERS, title = "Layers", children }: PanelProps) => (
    <FloatingPanel.Positioner>
        <FloatingPanel.Content>
            <FloatingPanel.DragTrigger>
                <FloatingPanel.Header>
                    <FloatingPanel.Title>{title}</FloatingPanel.Title>
                    <FloatingPanel.Control>
                        <FloatingPanel.StageTrigger stage="minimized" />
                        <FloatingPanel.StageTrigger stage="maximized" />
                        <FloatingPanel.CloseTrigger />
                    </FloatingPanel.Control>
                </FloatingPanel.Header>
            </FloatingPanel.DragTrigger>
            <FloatingPanel.Body>{children ?? "Drag the header to move me."}</FloatingPanel.Body>
            {axes.map((axis) => (
                <FloatingPanel.ResizeTrigger key={axis} axis={axis} />
            ))}
        </FloatingPanel.Content>
    </FloatingPanel.Positioner>
);

// Every Edge, where each side and corner can be taken hold of. They are rendered one at a time
// rather than all eight being drawn for the caller, since each is a stop on the way past the panel
export const EveryEdge: StoryFn<typeof FloatingPanel> = () => (
    <FloatingPanel defaultOpen defaultPosition={{ x: 80, y: 80 }}>
        <Panel axes={EDGES} title="Resize from any edge" />
    </FloatingPanel>
);

// Stages, where the panel is drawn as its header alone or fills the room it was given
export const Stages: StoryFn<typeof FloatingPanel> = () => (
    <FloatingPanel defaultOpen defaultPosition={{ x: 80, y: 80 }}>
        <Panel title="Minimize or maximize me" />
    </FloatingPanel>
);

// Grid, where every step of a drag is rounded so that panels line up with one another
export const Grid: StoryFn<typeof FloatingPanel> = () => (
    <FloatingPanel defaultOpen gridSize={32} defaultPosition={{ x: 96, y: 96 }}>
        <Panel title="Snapped to a 32px grid" />
    </FloatingPanel>
);

// Locked Aspect Ratio, which holds the shape the panel started at as it is resized
export const LockedAspectRatio: StoryFn<typeof FloatingPanel> = () => (
    <FloatingPanel
        defaultOpen
        lockAspectRatio
        defaultPosition={{ x: 80, y: 80 }}
        defaultSize={{ width: 320, height: 180 }}
    >
        <Panel title="Sixteen by nine" />
    </FloatingPanel>
);

// Within A Boundary, where the panel is measured against an ancestor rather than the viewport and
// cannot be dragged out of it
export const WithinABoundary: StoryFn<typeof FloatingPanel> = () => {
    const boundary = React.useRef<HTMLDivElement>(null);

    return (
        <div ref={boundary} className={classes.boundary}>
            <FloatingPanel
                defaultOpen
                strategy="absolute"
                getBoundaryElement={() => boundary.current}
                defaultPosition={{ x: 24, y: 24 }}
                defaultSize={{ width: 260, height: 160 }}
            >
                <Panel title="Held within the dashes" />
            </FloatingPanel>
        </div>
    );
};

// Allowed To Overflow, where the panel can be carried past the edges of its boundary
export const AllowedToOverflow: StoryFn<typeof FloatingPanel> = () => (
    <FloatingPanel defaultOpen allowOverflow defaultPosition={{ x: 80, y: 80 }}>
        <Panel title="Draggable off the edge" />
    </FloatingPanel>
);

// Not Draggable, for a panel that floats but stays where it was put
export const NotDraggable: StoryFn<typeof FloatingPanel> = () => (
    <FloatingPanel defaultOpen draggable={false} defaultPosition={{ x: 80, y: 80 }}>
        <Panel title="Resize only" />
    </FloatingPanel>
);

// Controlled, where where the panel stands is the caller's to hold and change
export const Controlled: StoryFn<typeof FloatingPanel> = () => {
    const [position, setPosition] = React.useState<FloatingPanelPoint>({ x: 80, y: 80 });

    return (
        <Stack gap="condensed">
            <Text>
                Standing at {Math.round(position.x)}, {Math.round(position.y)}
            </Text>
            <FloatingPanel defaultOpen position={position} onPositionChange={setPosition}>
                <Panel title="Held by the page" />
            </FloatingPanel>
        </Stack>
    );
};

// With A Trigger, where the panel is opened rather than already showing
export const WithATrigger: StoryFn<typeof FloatingPanel> = () => (
    <FloatingPanel defaultPosition={{ x: 80, y: 120 }}>
        <FloatingPanel.Trigger>Open the panel</FloatingPanel.Trigger>
        <Panel title="Opened from a trigger" />
    </FloatingPanel>
);
