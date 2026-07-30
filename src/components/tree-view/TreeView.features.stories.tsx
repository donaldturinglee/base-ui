import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import {
    CheckmarkCircleRegular,
    DeleteRegular,
    DocumentRegular,
    EditRegular,
    ErrorCircleRegular,
} from "@gamecrafters/base-ui-icons";
import { Checkbox } from "../checkbox";
import { CounterLabel } from "../counter-label";
import { TreeView } from ".";
import type { TreeViewSubTreeState } from "./TreeView.types";

const classes = {
    // Gives the tree a column to stand in rather than the width of the page
    container: "w-[20rem]",
    success: "[color:var(--foreground-color-success)]",
    danger: "[color:var(--foreground-color-danger)]",
};

export default {
    title: "Components/TreeView/Features",
    parameters: {
        layout: "centered",
    },
};

// Files and folders, which is what a tree is most often standing in for
export const Files: StoryFn<typeof TreeView> = () => (
    <TreeView aria-label="Files" className={classes.container}>
        <TreeView.Item id="src" defaultExpanded>
            <TreeView.LeadingVisual label="Folder">
                <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            src
            <TreeView.SubTree>
                <TreeView.Item id="src/index.ts">
                    <TreeView.LeadingVisual label="File">
                        <DocumentRegular />
                    </TreeView.LeadingVisual>
                    index.ts
                </TreeView.Item>
            </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.Item id="readme">
            <TreeView.LeadingVisual label="File">
                <DocumentRegular />
            </TreeView.LeadingVisual>
            README.md
        </TreeView.Item>
    </TreeView>
);

// The item the reader is looking at, which the tree fills and marks in the margin
export const CurrentItem: StoryFn<typeof TreeView> = () => (
    <TreeView aria-label="Files" className={classes.container}>
        <TreeView.Item id="src" defaultExpanded>
            src
            <TreeView.SubTree>
                <TreeView.Item id="src/index.ts" current>
                    index.ts
                </TreeView.Item>
                <TreeView.Item id="src/main.ts">main.ts</TreeView.Item>
            </TreeView.SubTree>
        </TreeView.Item>
    </TreeView>
);

// Trailing visuals, which say something about the row beyond its name
export const TrailingVisuals: StoryFn<typeof TreeView> = () => (
    <TreeView aria-label="Checks" className={classes.container}>
        <TreeView.Item id="build" defaultExpanded>
            Build
            <TreeView.TrailingVisual label="4 checks">
                <CounterLabel>4</CounterLabel>
            </TreeView.TrailingVisual>
            <TreeView.SubTree>
                <TreeView.Item id="build/lint">
                    Lint
                    <TreeView.TrailingVisual label="Passed">
                        <CheckmarkCircleRegular className={classes.success} />
                    </TreeView.TrailingVisual>
                </TreeView.Item>
                <TreeView.Item id="build/test">
                    Test
                    <TreeView.TrailingVisual label="Failed">
                        <ErrorCircleRegular className={classes.danger} />
                    </TreeView.TrailingVisual>
                </TreeView.Item>
            </TreeView.SubTree>
        </TreeView.Item>
    </TreeView>
);

// A leading action, which stands before everything else on the row
export const LeadingAction: StoryFn<typeof TreeView> = () => (
    <TreeView aria-label="Files" className={classes.container}>
        <TreeView.Item id="src" defaultExpanded>
            <TreeView.LeadingAction label="Pick">
                <Checkbox aria-label="Pick src" />
            </TreeView.LeadingAction>
            src
            <TreeView.SubTree>
                <TreeView.Item id="src/index.ts">
                    <TreeView.LeadingAction label="Pick">
                        <Checkbox aria-label="Pick index.ts" />
                    </TreeView.LeadingAction>
                    index.ts
                </TreeView.Item>
            </TreeView.SubTree>
        </TreeView.Item>
    </TreeView>
);

// A sub-tree being fetched, which stands a spinner in place of what has not arrived
export const AsyncSubTree: StoryFn<typeof TreeView> = () => {
    const [state, setState] = React.useState<TreeViewSubTreeState>("initial");

    React.useEffect(() => {
        if (state !== "loading") {
            return;
        }

        const timeout = window.setTimeout(() => setState("done"), 1500);

        return () => window.clearTimeout(timeout);
    }, [state]);

    return (
        <TreeView aria-label="Files" className={classes.container}>
            <TreeView.Item
                id="src"
                onExpandedChange={(expanded) => {
                    if (expanded && state === "initial") {
                        setState("loading");
                    }
                }}
            >
                <TreeView.LeadingVisual label="Folder">
                    <TreeView.DirectoryIcon />
                </TreeView.LeadingVisual>
                src
                <TreeView.SubTree state={state}>
                    {state === "done" ? (
                        <>
                            <TreeView.Item id="src/index.ts">index.ts</TreeView.Item>
                            <TreeView.Item id="src/main.ts">main.ts</TreeView.Item>
                        </>
                    ) : null}
                </TreeView.SubTree>
            </TreeView.Item>
        </TreeView>
    );
};

// A sub-tree being fetched, standing in rows rather than a spinner where roughly how many
// are coming is already known
export const AsyncSubTreeWithCount: StoryFn<typeof TreeView> = () => (
    <TreeView aria-label="Files" className={classes.container}>
        <TreeView.Item id="src" defaultExpanded>
            <TreeView.LeadingVisual label="Folder">
                <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            src
            <TreeView.SubTree state="loading" count={5} />
        </TreeView.Item>
    </TreeView>
);

// A sub-tree that turned out to hold nothing
export const EmptySubTree: StoryFn<typeof TreeView> = () => (
    <TreeView aria-label="Files" className={classes.container}>
        <TreeView.Item id="src" defaultExpanded>
            <TreeView.LeadingVisual label="Folder">
                <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            src
            <TreeView.SubTree state="done" />
        </TreeView.Item>
    </TreeView>
);

// A sub-tree that could not be fetched, which offers to try again
export const ErrorSubTree: StoryFn<typeof TreeView> = () => {
    const [state, setState] = React.useState<TreeViewSubTreeState>("error");

    return (
        <TreeView aria-label="Files" className={classes.container}>
            <TreeView.Item id="src" defaultExpanded>
                <TreeView.LeadingVisual label="Folder">
                    <TreeView.DirectoryIcon />
                </TreeView.LeadingVisual>
                src
                <TreeView.SubTree state={state}>
                    {state === "error" ? (
                        <TreeView.ErrorDialog onRetry={() => setState("loading")}>
                            Could not load the contents of this folder.
                        </TreeView.ErrorDialog>
                    ) : null}
                </TreeView.SubTree>
            </TreeView.Item>
        </TreeView>
    );
};

// Things an item can do beyond being picked. They are reached with the pointer, or from
// the keyboard with the shortcut the row is read as offering
export const SecondaryActions: StoryFn<typeof TreeView> = () => (
    <TreeView aria-label="Files" className={classes.container}>
        <TreeView.Item
            id="readme"
            aria-label="README.md"
            secondaryActions={[
                { label: "Rename", onClick: () => {}, icon: EditRegular },
                { label: "Delete", onClick: () => {}, icon: DeleteRegular },
            ]}
        >
            <TreeView.LeadingVisual label="File">
                <DocumentRegular />
            </TreeView.LeadingVisual>
            README.md
        </TreeView.Item>
    </TreeView>
);

// A flat tree, which draws every row against the same edge
export const Flat: StoryFn<typeof TreeView> = () => (
    <TreeView aria-label="Files" flat className={classes.container}>
        <TreeView.Item id="readme">README.md</TreeView.Item>
        <TreeView.Item id="license">LICENSE</TreeView.Item>
        <TreeView.Item id="changelog">CHANGELOG.md</TreeView.Item>
    </TreeView>
);

// A long name runs onto another line rather than being cut short
export const WithoutTruncation: StoryFn<typeof TreeView> = () => (
    <TreeView aria-label="Files" truncate={false} className={classes.container}>
        <TreeView.Item id="src" defaultExpanded>
            src
            <TreeView.SubTree>
                <TreeView.Item id="src/long">
                    <TreeView.LeadingVisual label="File">
                        <DocumentRegular />
                    </TreeView.LeadingVisual>
                    a-very-long-file-name-that-will-not-fit-on-one-line.tsx
                </TreeView.Item>
            </TreeView.SubTree>
        </TreeView.Item>
    </TreeView>
);
