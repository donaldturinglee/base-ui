import * as React from "react";
import {
    ArrowUploadRegular,
    MoreHorizontalRegular,
    SaveRegular,
    SparkleRegular,
} from "@gamecrafters/base-ui-icons";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { Button } from "../button";
import { Tour } from ".";
import type { TourProps, TourStep } from "./Tour.types";

const classes = {
    frame: "flex flex-col items-start gap-[var(--stack-gap-spacious)]",
    row: "flex items-center gap-[var(--stack-gap-normal)]",
};

const steps: TourStep[] = [
    {
        id: "welcome",
        type: "dialog",
        title: "Welcome",
        description:
            "Here is a quick way round the things you will reach for most. It takes about a minute.",
        actions: [{ label: "Start", action: "next" }],
    },
    {
        id: "upload",
        title: "Upload your files",
        description: "Anything you drop here is kept with the rest of your work.",
        target: () => document.querySelector<HTMLElement>("#tour-upload"),
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "save",
        title: "Save as you go",
        description:
            "Your work is kept as you make it, and this puts a marker down to come back to.",
        target: () => document.querySelector<HTMLElement>("#tour-save"),
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "more",
        title: "Everything else",
        description: "The rest of what you can do here is behind this.",
        target: () => document.querySelector<HTMLElement>("#tour-more"),
        side: "outside-bottom",
        align: "end",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "done",
        type: "dialog",
        title: "That is the whole of it",
        description: "You can start this again from the help menu whenever you like.",
        actions: [{ label: "Finish", action: "dismiss" }],
    },
];

// The parts a tour is drawn from, written once and used by every story here. Which step is being
// read, and everything it says, comes from the tour rather than from anything written in
const surface = (
    <>
        <Tour.Backdrop />
        <Tour.Spotlight />
        <Tour.Positioner>
            <Tour.Content>
                <Tour.Arrow />
                <Tour.CloseTrigger />
                <Tour.ProgressText />
                <Tour.Title />
                <Tour.Description />
                <Tour.Control>
                    <Tour.Actions>
                        {(actions) =>
                            actions.map((action) => (
                                <Tour.ActionTrigger
                                    key={action.label}
                                    action={action}
                                    variant={action.action === "next" ? "primary" : "default"}
                                />
                            ))
                        }
                    </Tour.Actions>
                </Tour.Control>
            </Tour.Content>
        </Tour.Positioner>
    </>
);

const page = (
    <div className={classes.row}>
        <Button id="tour-upload" leadingVisual={ArrowUploadRegular}>
            Upload
        </Button>
        <Button id="tour-save" leadingVisual={SaveRegular}>
            Save
        </Button>
        <Button id="tour-more" leadingVisual={MoreHorizontalRegular}>
            More
        </Button>
    </div>
);

export default {
    title: "Components/Tour",
    component: Tour,
} as Meta<typeof Tour>;

export const Default: StoryFn<typeof Tour> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={classes.frame}>
            <Button variant="primary" leadingVisual={SparkleRegular} onClick={() => setOpen(true)}>
                Take the tour
            </Button>

            {page}

            <Tour steps={steps} open={open} defaultStep="welcome" onOpenChange={setOpen}>
                {surface}
            </Tour>
        </div>
    );
};

// A tour has nothing to open it of its own, so the button that starts it is the story's rather
// than a control. What is left to play with is how the tour behaves once it is open
export const Playground: StoryFn<TourProps> = (args) => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={classes.frame}>
            <Button variant="primary" leadingVisual={SparkleRegular} onClick={() => setOpen(true)}>
                Take the tour
            </Button>

            {page}

            <Tour {...args} steps={steps} open={open} defaultStep="welcome" onOpenChange={setOpen}>
                {surface}
            </Tour>
        </div>
    );
};

Playground.args = {
    keyboardNavigation: false,
    closeOnEscape: true,
    closeOnInteractOutside: true,
    spotlightOffset: 4,
    spotlightRadius: 8,
};

Playground.argTypes = {
    keyboardNavigation: {
        control: {
            type: "boolean",
        },
        description: "Whether the arrow keys step through the tour",
    },
    closeOnEscape: {
        control: {
            type: "boolean",
        },
        description: "Whether Escape closes the tour",
    },
    closeOnInteractOutside: {
        control: {
            type: "boolean",
        },
        description: "Whether a press landing away from the step closes the tour",
    },
    spotlightOffset: {
        control: {
            type: "number",
        },
        description: "How far the ring stands clear of what the step points at",
    },
    spotlightRadius: {
        control: {
            type: "number",
        },
        description: "How far the corners of that ring are rounded",
    },
    steps: {
        table: {
            disable: true,
        },
    },
    children: {
        table: {
            disable: true,
        },
    },
};
