import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { CodeRegular, EyeRegular, PeopleRegular } from "@gamecrafters/base-ui-icons";
import { Text } from "../text";
import { SegmentedControl } from ".";

const classes = {
    // The control only falls back to something narrower once it runs out of room, so the
    // stories that show that off are given a container to run out of
    narrow: "w-[20rem]",
    label: "flex flex-col gap-[var(--base-size-4)]",
    stack: "flex flex-col gap-[var(--base-size-8)]",
};

export default {
    title: "Components/SegmentedControl/Features",
    parameters: {
        layout: "centered",
    },
};

// Icons Beside The Labels, which is what the control falls back to where the labels are dropped
export const WithLeadingVisuals: StoryFn<typeof SegmentedControl> = () => (
    <SegmentedControl aria-label="File view">
        <SegmentedControl.Button defaultSelected leadingVisual={EyeRegular}>
            Preview
        </SegmentedControl.Button>
        <SegmentedControl.Button leadingVisual={CodeRegular}>Raw</SegmentedControl.Button>
        <SegmentedControl.Button leadingVisual={PeopleRegular}>Blame</SegmentedControl.Button>
    </SegmentedControl>
);

// Counters, for a row of segments that each stand for a number of things
export const WithCounters: StoryFn<typeof SegmentedControl> = () => (
    <SegmentedControl aria-label="Issues by label">
        <SegmentedControl.Button defaultSelected count={5}>
            Feature
        </SegmentedControl.Button>
        <SegmentedControl.Button count={3}>Bug</SegmentedControl.Button>
        <SegmentedControl.Button count={10}>Good first issue</SegmentedControl.Button>
    </SegmentedControl>
);

// Icons On Their Own, each named by the tooltip it brings up
export const IconOnly: StoryFn<typeof SegmentedControl> = () => (
    <SegmentedControl aria-label="File view">
        <SegmentedControl.IconButton defaultSelected aria-label="Preview" icon={EyeRegular} />
        <SegmentedControl.IconButton aria-label="Raw" icon={CodeRegular} />
        <SegmentedControl.IconButton aria-label="Blame" icon={PeopleRegular} />
    </SegmentedControl>
);

// A Segment That Cannot Be Picked, which says so rather than going quiet
export const WithDisabledSegment: StoryFn<typeof SegmentedControl> = () => (
    <SegmentedControl aria-label="File view">
        <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
        <SegmentedControl.Button>Raw</SegmentedControl.Button>
        <SegmentedControl.Button disabled>Blame</SegmentedControl.Button>
    </SegmentedControl>
);

// The Small Control, for a row standing beside other controls of that size
export const Small: StoryFn<typeof SegmentedControl> = () => (
    <SegmentedControl aria-label="File view" size="small">
        <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
        <SegmentedControl.Button>Raw</SegmentedControl.Button>
        <SegmentedControl.Button>Blame</SegmentedControl.Button>
    </SegmentedControl>
);

// Filling The Container, with the room shared evenly between the segments
export const FullWidth: StoryFn<typeof SegmentedControl> = () => (
    <div className={classes.narrow}>
        <SegmentedControl aria-label="File view" fullWidth>
            <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
            <SegmentedControl.Button>Raw</SegmentedControl.Button>
            <SegmentedControl.Button>Blame</SegmentedControl.Button>
        </SegmentedControl>
    </div>
);

// Filling The Container Only Where It Is Narrow, and taking its own width from there up
export const FullWidthAtNarrow: StoryFn<typeof SegmentedControl> = () => (
    <SegmentedControl aria-label="File view" fullWidth={{ narrow: true, regular: false }}>
        <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
        <SegmentedControl.Button>Raw</SegmentedControl.Button>
        <SegmentedControl.Button>Blame</SegmentedControl.Button>
    </SegmentedControl>
);

// Dropping The Labels Where It Is Narrow, which leaves the icons to stand for the segments
export const HideLabelsAtNarrow: StoryFn<typeof SegmentedControl> = () => (
    <SegmentedControl aria-label="File view" variant={{ narrow: "hideLabels", regular: "default" }}>
        <SegmentedControl.Button defaultSelected leadingVisual={EyeRegular}>
            Preview
        </SegmentedControl.Button>
        <SegmentedControl.Button leadingVisual={CodeRegular}>Raw</SegmentedControl.Button>
        <SegmentedControl.Button leadingVisual={PeopleRegular}>Blame</SegmentedControl.Button>
    </SegmentedControl>
);

// Giving Way To A Menu Where It Is Narrow, which offers the same segments in a list
export const DropdownAtNarrow: StoryFn<typeof SegmentedControl> = () => (
    <SegmentedControl aria-label="File view" variant={{ narrow: "dropdown", regular: "default" }}>
        <SegmentedControl.Button defaultSelected leadingVisual={EyeRegular}>
            Preview
        </SegmentedControl.Button>
        <SegmentedControl.Button leadingVisual={CodeRegular}>Raw</SegmentedControl.Button>
        <SegmentedControl.Button leadingVisual={PeopleRegular}>Blame</SegmentedControl.Button>
    </SegmentedControl>
);

// A Control The Caller Holds The State Of, alongside whatever else that state is driving
export const Controlled: StoryFn<typeof SegmentedControl> = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const views = ["Preview", "Raw", "Blame"];

    return (
        <div className={classes.stack}>
            <SegmentedControl aria-label="File view" onChange={setSelectedIndex}>
                {views.map((view, index) => (
                    <SegmentedControl.Button key={view} selected={index === selectedIndex}>
                        {view}
                    </SegmentedControl.Button>
                ))}
            </SegmentedControl>
            <Text size="small">Showing {views[selectedIndex]}</Text>
        </div>
    );
};

// A Label And A Caption Of Its Own, which the control is named and described by
export const WithLabelAndCaption: StoryFn<typeof SegmentedControl> = () => (
    <div className={classes.stack}>
        <div className={classes.label}>
            <Text id="file-view-label" weight="semibold">
                File view
            </Text>
            <Text id="file-view-caption" size="small">
                Change the way the file is shown
            </Text>
        </div>
        <SegmentedControl aria-labelledby="file-view-label" aria-describedby="file-view-caption">
            <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
            <SegmentedControl.Button>Raw</SegmentedControl.Button>
            <SegmentedControl.Button>Blame</SegmentedControl.Button>
        </SegmentedControl>
    </div>
);
