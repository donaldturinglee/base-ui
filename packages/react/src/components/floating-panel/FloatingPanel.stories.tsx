import type { StoryFn, Meta } from "@storybook/react-vite";
import { FloatingPanel } from ".";
import type { FloatingPanelProps, FloatingPanelResizeAxis } from "./FloatingPanel.types";

// The controls hand back one number at a time rather than a whole rect, so the story gathers them
// back up into the sizes it passes on
type PlaygroundArgs = Omit<FloatingPanelProps, "defaultSize" | "minSize"> & {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
};

const classes = {
    body: "flex flex-col gap-[var(--base-size-8)]",
};

// The trigger stands at the top left of the story, so the panel opens below it rather than over
// it. A story that says where it wants the panel still wins, since this is spread over
const STORY_POSITION = { x: 24, y: 72 };

// What a panel is usually given: every corner can be taken hold of, and the edges between them are
// left out. Rendering none of these leaves a panel that cannot be resized at all
const CORNERS: FloatingPanelResizeAxis[] = ["nw", "ne", "sw", "se"];

export default {
    title: "Components/FloatingPanel",
    component: FloatingPanel,
} as Meta<typeof FloatingPanel>;

const Panel = (props: FloatingPanelProps) => (
    <FloatingPanel defaultPosition={STORY_POSITION} {...props}>
        <FloatingPanel.Trigger>Open the panel</FloatingPanel.Trigger>
        <FloatingPanel.Positioner>
            <FloatingPanel.Content>
                <FloatingPanel.DragTrigger>
                    <FloatingPanel.Header>
                        <FloatingPanel.Title>Layers</FloatingPanel.Title>
                        <FloatingPanel.Control>
                            <FloatingPanel.StageTrigger stage="minimized" />
                            <FloatingPanel.StageTrigger stage="maximized" />
                            <FloatingPanel.CloseTrigger />
                        </FloatingPanel.Control>
                    </FloatingPanel.Header>
                </FloatingPanel.DragTrigger>
                <FloatingPanel.Body>
                    <div className={classes.body}>
                        <span>Drag the header to move the panel.</span>
                        <span>Drag the bottom right corner to resize it.</span>
                    </div>
                </FloatingPanel.Body>
                {CORNERS.map((axis) => (
                    <FloatingPanel.ResizeTrigger key={axis} axis={axis} />
                ))}
            </FloatingPanel.Content>
        </FloatingPanel.Positioner>
    </FloatingPanel>
);

export const Default: StoryFn<typeof FloatingPanel> = () => <Panel defaultOpen />;

export const Playground: StoryFn<PlaygroundArgs> = ({
    width,
    height,
    minWidth,
    minHeight,
    ...args
}) => (
    <Panel
        {...args}
        defaultSize={{ width, height }}
        minSize={{ width: minWidth, height: minHeight }}
    />
);

Playground.args = {
    defaultOpen: true,
    draggable: true,
    resizable: true,
    disabled: false,
    closeOnEscape: true,
    lockAspectRatio: false,
    allowOverflow: false,
    gridSize: 0,
    strategy: "fixed",
    width: 320,
    height: 240,
    minWidth: 200,
    minHeight: 120,
};

Playground.argTypes = {
    draggable: {
        control: {
            type: "boolean",
        },
        description: "Whether the panel can be moved",
    },
    resizable: {
        control: {
            type: "boolean",
        },
        description: "Whether the panel can be resized",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops it being moved or resized, while leaving it on the page",
    },
    closeOnEscape: {
        control: {
            type: "boolean",
        },
        description: "Whether escape closes the panel",
    },
    lockAspectRatio: {
        control: {
            type: "boolean",
        },
        description: "Holds the shape it started at as it is resized",
    },
    allowOverflow: {
        control: {
            type: "boolean",
        },
        description: "Lets the panel be dragged past the edges of its boundary",
    },
    gridSize: {
        control: {
            type: "number",
        },
        description: "Rounds every step of a drag to a multiple of this",
    },
    strategy: {
        control: {
            type: "inline-radio",
        },
        options: ["fixed", "absolute"],
        description: "Whether it is laid out against the viewport or a positioned ancestor",
    },
    width: {
        control: {
            type: "number",
        },
        description: "How wide the panel opens",
    },
    height: {
        control: {
            type: "number",
        },
        description: "How tall the panel opens",
    },
    minWidth: {
        control: {
            type: "number",
        },
        description: "The narrowest it can be dragged to",
    },
    minHeight: {
        control: {
            type: "number",
        },
        description: "The shortest it can be dragged to",
    },
    children: {
        table: {
            disable: true,
        },
    },
};
