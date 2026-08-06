import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Stack } from "../stack";
import { Text } from "../text";
import { Splitter } from ".";
import type { SplitterLayout, SplitterPanelInstance } from "./Splitter.types";

const classes = {
    // A splitter fills the room it is given, so the stories give it some to fill
    container:
        "w-[var(--overlay-width-medium)] max-w-full h-[var(--overlay-height-small)] border-solid border-[length:var(--border-width-thin)] border-border-default rounded-[var(--border-radius-medium)]",
    panel: "flex items-center justify-center p-[var(--base-size-8)] [font-weight:var(--base-text-weight-semibold)]",
    // A panel drawn in as little room as it will take, where a story needs it to be told apart
    // from the one beside it
    inset: "bg-background-inset",
    caption: "text-foreground-muted",
    // The triggers of this splitter alone are repainted, through the dials the root carries
    repainted:
        "[--splitter-resize-trigger-color:var(--border-color-accent-emphasis)] [--splitter-resize-trigger-thickness:var(--border-width-thicker)]",
};

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

export default {
    title: "Components/Splitter/Features",
    decorators: [withContainer],
};

// Standing Up, where the panels are stacked one on another and the trigger lies down between them
export const Vertical: StoryFn = () => (
    <Splitter orientation="vertical">
        <Splitter.Panel defaultSize="40" className={classes.panel}>
            Above
        </Splitter.Panel>
        <Splitter.ResizeTrigger>
            <Splitter.ResizeTriggerSeparator />
        </Splitter.ResizeTrigger>
        <Splitter.Panel className={classes.panel}>Below</Splitter.Panel>
    </Splitter>
);

// With An Indicator, so that a line meant to be taken hold of is told apart from one that only
// parts two panels
export const Indicator: StoryFn = () => (
    <Splitter>
        <Splitter.Panel defaultSize="30" className={classes.panel}>
            Sidebar
        </Splitter.Panel>
        <Splitter.ResizeTrigger>
            <Splitter.ResizeTriggerSeparator />
            <Splitter.ResizeTriggerIndicator />
        </Splitter.ResizeTrigger>
        <Splitter.Panel className={classes.panel}>Content</Splitter.Panel>
    </Splitter>
);

// Bounded, where each panel says how little and how much room it will take. The sidebar will not
// go below a fifth of the splitter nor past half of it, however far the trigger is dragged
export const Bounds: StoryFn = () => (
    <Splitter>
        <Splitter.Panel
            defaultSize="30"
            minSize="20"
            maxSize="50"
            className={`${classes.panel} ${classes.inset}`}
        >
            Between a fifth and half
        </Splitter.Panel>
        <Splitter.ResizeTrigger>
            <Splitter.ResizeTriggerSeparator />
            <Splitter.ResizeTriggerIndicator />
        </Splitter.ResizeTrigger>
        <Splitter.Panel className={classes.panel}>Content</Splitter.Panel>
    </Splitter>
);

// Sizes In Other Units, since a number is read as pixels and a string as a share of the splitter
// unless it ends in a unit of its own
export const PixelSizes: StoryFn = () => (
    <Splitter>
        <Splitter.Panel
            defaultSize="12rem"
            minSize={120}
            maxSize="20rem"
            className={`${classes.panel} ${classes.inset}`}
        >
            12rem to start with
        </Splitter.Panel>
        <Splitter.ResizeTrigger>
            <Splitter.ResizeTriggerSeparator />
            <Splitter.ResizeTriggerIndicator />
        </Splitter.ResizeTrigger>
        <Splitter.Panel className={classes.panel}>Content</Splitter.Panel>
    </Splitter>
);

// Folding Away, where a panel dragged below what it will take collapses rather than going on
// shrinking. Pressing Enter on the trigger folds it away and brings it back, as double-clicking
// the trigger does
export const Collapsible: StoryFn = () => (
    <Splitter>
        <Splitter.Panel
            defaultSize="30"
            minSize="20"
            collapsible
            className={`${classes.panel} ${classes.inset}`}
        >
            Drag me shut
        </Splitter.Panel>
        <Splitter.ResizeTrigger>
            <Splitter.ResizeTriggerSeparator />
            <Splitter.ResizeTriggerIndicator />
        </Splitter.ResizeTrigger>
        <Splitter.Panel className={classes.panel}>Content</Splitter.Panel>
    </Splitter>
);

// Held By The Caller, where a panel is folded away and brought back from outside the splitter
// rather than by dragging the trigger
export const Imperative: StoryFn = () => {
    const panel = React.useRef<SplitterPanelInstance | null>(null);

    return (
        <Splitter>
            <Splitter.Panel
                panelRef={panel}
                defaultSize="30"
                minSize="20"
                collapsible
                className={`${classes.panel} ${classes.inset}`}
            >
                Sidebar
            </Splitter.Panel>
            <Splitter.ResizeTrigger>
                <Splitter.ResizeTriggerSeparator />
                <Splitter.ResizeTriggerIndicator />
            </Splitter.ResizeTrigger>
            <Splitter.Panel className={classes.panel}>
                <Stack direction="horizontal" gap="condensed">
                    <Button onClick={() => panel.current?.collapse()}>Fold away</Button>
                    <Button onClick={() => panel.current?.expand()}>Bring back</Button>
                </Stack>
            </Splitter.Panel>
        </Splitter>
    );
};

// One Within Another, where a panel holds a splitter of its own running the other way
export const Nested: StoryFn = () => (
    <Splitter>
        <Splitter.Panel defaultSize="30" className={classes.panel}>
            Sidebar
        </Splitter.Panel>
        <Splitter.ResizeTrigger>
            <Splitter.ResizeTriggerSeparator />
            <Splitter.ResizeTriggerIndicator />
        </Splitter.ResizeTrigger>
        <Splitter.Panel>
            <Splitter orientation="vertical">
                <Splitter.Panel className={classes.panel}>Above</Splitter.Panel>
                <Splitter.ResizeTrigger>
                    <Splitter.ResizeTriggerSeparator />
                    <Splitter.ResizeTriggerIndicator />
                </Splitter.ResizeTrigger>
                <Splitter.Panel className={classes.panel}>Below</Splitter.Panel>
            </Splitter>
        </Splitter.Panel>
    </Splitter>
);

// Reporting Where The Panels Came To Rest, which is what a caller saves to hand the same layout
// back on the next visit. The splitter is told once the trigger has been let go of rather than on
// every step of the drag
export const LayoutReported: StoryFn = () => {
    const [layout, setLayout] = React.useState<SplitterLayout>({});

    return (
        <Splitter onLayoutChanged={setLayout}>
            <Splitter.Panel id="sidebar" defaultSize="30" className={classes.panel}>
                Sidebar
            </Splitter.Panel>
            <Splitter.ResizeTrigger>
                <Splitter.ResizeTriggerSeparator />
                <Splitter.ResizeTriggerIndicator />
            </Splitter.ResizeTrigger>
            <Splitter.Panel id="content" className={classes.panel}>
                <Stack gap="condensed" align="center">
                    {Object.entries(layout).map(([id, size]) => (
                        <Text key={id} size="small" className={classes.caption}>
                            {id}: {Math.round(size)}%
                        </Text>
                    ))}
                </Stack>
            </Splitter.Panel>
        </Splitter>
    );
};

// Held Where They Stand, for a layout a reader is shown rather than one they arrange
export const Disabled: StoryFn = () => (
    <Splitter disabled>
        <Splitter.Panel defaultSize="30" className={classes.panel}>
            Sidebar
        </Splitter.Panel>
        <Splitter.ResizeTrigger>
            <Splitter.ResizeTriggerSeparator />
            <Splitter.ResizeTriggerIndicator />
        </Splitter.ResizeTrigger>
        <Splitter.Panel className={classes.panel}>Content</Splitter.Panel>
    </Splitter>
);

// Repainted, where the triggers are given a colour and a thickness of their own. The dials sit on
// the splitter, so every trigger within it follows without being reached for one at a time
export const Repainted: StoryFn = () => (
    <Splitter className={classes.repainted}>
        <Splitter.Panel defaultSize="30" className={classes.panel}>
            Sidebar
        </Splitter.Panel>
        <Splitter.ResizeTrigger>
            <Splitter.ResizeTriggerSeparator />
            <Splitter.ResizeTriggerIndicator />
        </Splitter.ResizeTrigger>
        <Splitter.Panel className={classes.panel}>Content</Splitter.Panel>
    </Splitter>
);
