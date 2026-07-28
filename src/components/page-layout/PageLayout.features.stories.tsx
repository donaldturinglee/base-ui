import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Placeholder } from "../placeholder";
import { Text } from "../text";
import { PageLayout } from ".";

export default {
    title: "Components/PageLayout/Features",
};

// A Pane At The Start, which stands before the content
export const APaneAtTheStart: StoryFn<typeof PageLayout> = () => (
    <PageLayout>
        <PageLayout.Content>
            <Placeholder height="320px" label="Content" />
        </PageLayout.Content>
        <PageLayout.Pane position="start" divider="line">
            <Placeholder height="160px" label="Pane" />
        </PageLayout.Pane>
    </PageLayout>
);

// A Pane Placed By Viewport, which moves as the room allows
export const APanePlacedByViewport: StoryFn<typeof PageLayout> = () => (
    <PageLayout>
        <PageLayout.Content>
            <Placeholder height="320px" label="Content" />
        </PageLayout.Content>
        <PageLayout.Pane
            position={{ narrow: "start", regular: "end" }}
            divider={{ narrow: "filled", regular: "line" }}
        >
            <Placeholder height="160px" label="Pane" />
        </PageLayout.Pane>
    </PageLayout>
);

// Divider Variants, where a filled divider only reads well across the page
export const DividerVariants: StoryFn<typeof PageLayout> = () => (
    <PageLayout>
        <PageLayout.Header divider="line">
            <Placeholder height="64px" label="Header with a line" />
        </PageLayout.Header>
        <PageLayout.Content>
            <Placeholder height="240px" label="Content" />
        </PageLayout.Content>
        <PageLayout.Footer divider={{ narrow: "filled", regular: "line" }}>
            <Placeholder height="64px" label="Footer, filled when narrow" />
        </PageLayout.Footer>
    </PageLayout>
);

// A Resizable Pane, which the reader can drag or key wider and narrower
export const AResizablePane: StoryFn<typeof PageLayout> = () => (
    <PageLayout>
        <PageLayout.Content>
            <Placeholder height="320px" label="Content" />
        </PageLayout.Content>
        <PageLayout.Pane resizable aria-label="Files">
            <Placeholder height="160px" label="Drag the line beside this pane" />
        </PageLayout.Pane>
    </PageLayout>
);

// A Pane Held At A Width, where the caller keeps the width itself
export const APaneHeldAtAWidth: StoryFn<typeof PageLayout> = () => {
    const [paneWidth, setPaneWidth] = React.useState(320);

    return (
        <PageLayout>
            <PageLayout.Content>
                <Text as="p">The pane is {Math.round(paneWidth)} pixels wide.</Text>
            </PageLayout.Content>
            <PageLayout.Pane
                resizable
                currentWidth={paneWidth}
                onResizeEnd={setPaneWidth}
                aria-label="Files"
            >
                <Placeholder height="160px" label="Pane" />
            </PageLayout.Pane>
        </PageLayout>
    );
};

// A Pane Of A Custom Width, with bounds of the caller's own
export const APaneOfACustomWidth: StoryFn<typeof PageLayout> = () => (
    <PageLayout>
        <PageLayout.Content>
            <Placeholder height="320px" label="Content" />
        </PageLayout.Content>
        <PageLayout.Pane
            resizable
            width={{ min: "200px", default: "280px", max: "480px" }}
            aria-label="Files"
        >
            <Placeholder height="160px" label="Pane" />
        </PageLayout.Pane>
    </PageLayout>
);

// A Sticky Pane, which stays put as the content scrolls past it
export const AStickyPane: StoryFn<typeof PageLayout> = () => (
    <PageLayout>
        <PageLayout.Content>
            <Placeholder height="1200px" label="A long run of content" />
        </PageLayout.Content>
        <PageLayout.Pane sticky divider="line">
            <Placeholder height="160px" label="Pane" />
        </PageLayout.Pane>
    </PageLayout>
);

// With A Sidebar, which stands outside everything else the page holds
export const WithASidebar: StoryFn<typeof PageLayout> = () => (
    <PageLayout>
        <PageLayout.Sidebar divider="line" aria-label="Navigation">
            <Placeholder height="400px" label="Sidebar" />
        </PageLayout.Sidebar>
        <PageLayout.Header divider="line">
            <Placeholder height="64px" label="Header" />
        </PageLayout.Header>
        <PageLayout.Content>
            <Placeholder height="320px" label="Content" />
        </PageLayout.Content>
        <PageLayout.Footer divider="line">
            <Placeholder height="64px" label="Footer" />
        </PageLayout.Footer>
    </PageLayout>
);

// A Resizable Sidebar
export const AResizableSidebar: StoryFn<typeof PageLayout> = () => (
    <PageLayout>
        <PageLayout.Sidebar resizable aria-label="Navigation">
            <Placeholder height="400px" label="Drag the line beside this sidebar" />
        </PageLayout.Sidebar>
        <PageLayout.Content>
            <Placeholder height="320px" label="Content" />
        </PageLayout.Content>
    </PageLayout>
);

// Hidden When Narrow, where a region is left out on a small screen
export const HiddenWhenNarrow: StoryFn<typeof PageLayout> = () => (
    <PageLayout>
        <PageLayout.Content>
            <Placeholder height="320px" label="Content" />
        </PageLayout.Content>
        <PageLayout.Pane hidden={{ narrow: true, regular: false }} divider="line">
            <Placeholder height="160px" label="Pane, gone when narrow" />
        </PageLayout.Pane>
    </PageLayout>
);

// A Narrower Container, which holds the page in from the edges of the screen
export const ANarrowerContainer: StoryFn<typeof PageLayout> = () => (
    <PageLayout containerWidth="medium">
        <PageLayout.Header divider="line">
            <Placeholder height="64px" label="Header" />
        </PageLayout.Header>
        <PageLayout.Content>
            <Placeholder height="320px" label="Content" />
        </PageLayout.Content>
    </PageLayout>
);

// Condensed Spacing
export const CondensedSpacing: StoryFn<typeof PageLayout> = () => (
    <PageLayout padding="condensed" rowGap="condensed" columnGap="condensed">
        <PageLayout.Header divider="line">
            <Placeholder height="64px" label="Header" />
        </PageLayout.Header>
        <PageLayout.Content>
            <Placeholder height="240px" label="Content" />
        </PageLayout.Content>
        <PageLayout.Pane divider="line">
            <Placeholder height="160px" label="Pane" />
        </PageLayout.Pane>
    </PageLayout>
);
