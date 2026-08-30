import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Stack } from "../stack";
import { Text } from "../text";
import { Resizable } from ".";
import type { ResizableLayout, ResizablePanelInstance } from "./Resizable.types";

const classes = {
    // A group of panels fills the room it is given, so the stories give it some to fill
    container:
        "w-[var(--overlay-width-medium)] max-w-full h-[var(--overlay-height-small)] border-solid border-[length:var(--border-width-thin)] border-border-default rounded-[var(--border-radius-medium)]",
    panel: "flex items-center justify-center p-[var(--base-size-8)] [font-weight:var(--base-text-weight-semibold)]",
    // A panel drawn in as little room as it will take, where a story needs it to be told apart
    // from the one beside it
    inset: "bg-background-inset",
    caption: "text-foreground-muted",
    // The triggers of this group alone are repainted, through the dials the root carries
    repainted:
        "[--resizable-resize-trigger-color:var(--border-color-accent-emphasis)] [--resizable-resize-trigger-thickness:var(--border-width-thicker)]",
};

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

export default {
    title: "Components/Resizable/Features",
    decorators: [withContainer],
};

// Standing Up, where the panels are stacked one on another and the trigger lies down between them
export const Vertical: StoryFn = () => (
    <Resizable orientation="vertical">
        <Resizable.Panel defaultSize="40" className={classes.panel}>
            Above
        </Resizable.Panel>
        <Resizable.ResizeTrigger>
            <Resizable.ResizeTriggerSeparator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel className={classes.panel}>Below</Resizable.Panel>
    </Resizable>
);

// With An Indicator, so that a line meant to be taken hold of is told apart from one that only
// parts two panels
export const Indicator: StoryFn = () => (
    <Resizable>
        <Resizable.Panel defaultSize="30" className={classes.panel}>
            Sidebar
        </Resizable.Panel>
        <Resizable.ResizeTrigger>
            <Resizable.ResizeTriggerSeparator />
            <Resizable.ResizeTriggerIndicator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel className={classes.panel}>Content</Resizable.Panel>
    </Resizable>
);

// Bounded, where each panel says how little and how much room it will take. The sidebar will not
// go below a fifth of the group nor past half of it, however far the trigger is dragged
export const Bounds: StoryFn = () => (
    <Resizable>
        <Resizable.Panel
            defaultSize="30"
            minSize="20"
            maxSize="50"
            className={`${classes.panel} ${classes.inset}`}
        >
            Between a fifth and half
        </Resizable.Panel>
        <Resizable.ResizeTrigger>
            <Resizable.ResizeTriggerSeparator />
            <Resizable.ResizeTriggerIndicator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel className={classes.panel}>Content</Resizable.Panel>
    </Resizable>
);

// Sizes In Other Units, since a number is read as pixels and a string as a share of the group
// unless it ends in a unit of its own
export const PixelSizes: StoryFn = () => (
    <Resizable>
        <Resizable.Panel
            defaultSize="12rem"
            minSize={120}
            maxSize="20rem"
            className={`${classes.panel} ${classes.inset}`}
        >
            12rem to start with
        </Resizable.Panel>
        <Resizable.ResizeTrigger>
            <Resizable.ResizeTriggerSeparator />
            <Resizable.ResizeTriggerIndicator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel className={classes.panel}>Content</Resizable.Panel>
    </Resizable>
);

// Folding Away, where a panel dragged below what it will take collapses rather than going on
// shrinking. Pressing Enter on the trigger folds it away and brings it back, as double-clicking
// the trigger does
export const Collapsible: StoryFn = () => (
    <Resizable>
        <Resizable.Panel
            defaultSize="30"
            minSize="20"
            collapsible
            className={`${classes.panel} ${classes.inset}`}
        >
            Drag me shut
        </Resizable.Panel>
        <Resizable.ResizeTrigger>
            <Resizable.ResizeTriggerSeparator />
            <Resizable.ResizeTriggerIndicator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel className={classes.panel}>Content</Resizable.Panel>
    </Resizable>
);

// Held By The Caller, where a panel is folded away and brought back from outside the group
// rather than by dragging the trigger
export const Imperative: StoryFn = () => {
    const panel = React.useRef<ResizablePanelInstance | null>(null);

    return (
        <Resizable>
            <Resizable.Panel
                panelRef={panel}
                defaultSize="30"
                minSize="20"
                collapsible
                className={`${classes.panel} ${classes.inset}`}
            >
                Sidebar
            </Resizable.Panel>
            <Resizable.ResizeTrigger>
                <Resizable.ResizeTriggerSeparator />
                <Resizable.ResizeTriggerIndicator />
            </Resizable.ResizeTrigger>
            <Resizable.Panel className={classes.panel}>
                <Stack direction="horizontal" gap="condensed">
                    <Button onClick={() => panel.current?.collapse()}>Fold away</Button>
                    <Button onClick={() => panel.current?.expand()}>Bring back</Button>
                </Stack>
            </Resizable.Panel>
        </Resizable>
    );
};

// One Within Another, where a panel holds a group of its own running the other way
export const Nested: StoryFn = () => (
    <Resizable>
        <Resizable.Panel defaultSize="30" className={classes.panel}>
            Sidebar
        </Resizable.Panel>
        <Resizable.ResizeTrigger>
            <Resizable.ResizeTriggerSeparator />
            <Resizable.ResizeTriggerIndicator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel>
            <Resizable orientation="vertical">
                <Resizable.Panel className={classes.panel}>Above</Resizable.Panel>
                <Resizable.ResizeTrigger>
                    <Resizable.ResizeTriggerSeparator />
                    <Resizable.ResizeTriggerIndicator />
                </Resizable.ResizeTrigger>
                <Resizable.Panel className={classes.panel}>Below</Resizable.Panel>
            </Resizable>
        </Resizable.Panel>
    </Resizable>
);

// Reporting Where The Panels Came To Rest, which is what a caller saves to hand the same layout
// back on the next visit. The group is told once the trigger has been let go of rather than on
// every step of the drag
export const LayoutReported: StoryFn = () => {
    const [layout, setLayout] = React.useState<ResizableLayout>({});

    return (
        <Resizable onLayoutChanged={setLayout}>
            <Resizable.Panel id="sidebar" defaultSize="30" className={classes.panel}>
                Sidebar
            </Resizable.Panel>
            <Resizable.ResizeTrigger>
                <Resizable.ResizeTriggerSeparator />
                <Resizable.ResizeTriggerIndicator />
            </Resizable.ResizeTrigger>
            <Resizable.Panel id="content" className={classes.panel}>
                <Stack gap="condensed" align="center">
                    {Object.entries(layout).map(([id, size]) => (
                        <Text key={id} size="small" className={classes.caption}>
                            {id}: {Math.round(size)}%
                        </Text>
                    ))}
                </Stack>
            </Resizable.Panel>
        </Resizable>
    );
};

// Held Where They Stand, for a layout a reader is shown rather than one they arrange
export const Disabled: StoryFn = () => (
    <Resizable disabled>
        <Resizable.Panel defaultSize="30" className={classes.panel}>
            Sidebar
        </Resizable.Panel>
        <Resizable.ResizeTrigger>
            <Resizable.ResizeTriggerSeparator />
            <Resizable.ResizeTriggerIndicator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel className={classes.panel}>Content</Resizable.Panel>
    </Resizable>
);

// Repainted, where the triggers are given a colour and a thickness of their own. The dials sit on
// the group, so every trigger within it follows without being reached for one at a time
export const Repainted: StoryFn = () => (
    <Resizable className={classes.repainted}>
        <Resizable.Panel defaultSize="30" className={classes.panel}>
            Sidebar
        </Resizable.Panel>
        <Resizable.ResizeTrigger>
            <Resizable.ResizeTriggerSeparator />
            <Resizable.ResizeTriggerIndicator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel className={classes.panel}>Content</Resizable.Panel>
    </Resizable>
);
