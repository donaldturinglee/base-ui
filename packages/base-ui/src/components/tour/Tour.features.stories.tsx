import * as React from "react";
import {
    AddRegular,
    DeleteRegular,
    EditRegular,
    KeyboardRegular,
    SparkleRegular,
} from "@gamecrafters/base-ui-icons";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { ProgressBar } from "../progress-bar";
import { Text } from "../text";
import { TextInput } from "../text-input";
import { Tour, useTour, waitForElement, waitForElementValue, waitForEvent } from ".";
import type { TourStatusChangeDetails, TourStep, TourStepChangeDetails } from "./Tour.types";

const classes = {
    frame: "flex flex-col items-start gap-[var(--stack-gap-spacious)]",
    row: "flex items-center gap-[var(--stack-gap-normal)]",
    stack: "flex flex-col items-start gap-[var(--stack-gap-condensed)]",
    target: "flex items-center justify-center min-w-[var(--base-size-96)] px-[var(--base-size-16)] py-[var(--base-size-8)] rounded-[var(--border-radius-medium)] border border-[var(--border-color-default)]",
    log: "flex flex-col gap-[var(--base-size-2)] w-[var(--overlay-width-small)] p-[var(--base-size-12)] rounded-[var(--border-radius-medium)] bg-[var(--background-color-muted)]",
};

export default {
    title: "Components/Tour/Features",
};

// The parts a tour is drawn from, written once and used by every story here
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

const StartButton = ({ onClick, children = "Take the tour" }: React.ComponentProps<"button">) => (
    <Button variant="primary" leadingVisual={SparkleRegular} onClick={onClick}>
        {children}
    </Button>
);

// The three kinds of step side by side. A tooltip stands against something on the page and points
// at it, a dialog stands in the middle of the screen with nothing to point at, and a floating step
// keeps to a corner wherever the reader has scrolled to
export const StepTypes: StoryFn = () => {
    const [open, setOpen] = React.useState(false);

    const steps: TourStep[] = [
        {
            id: "welcome",
            type: "dialog",
            title: "A step with nothing to point at",
            description: "This one stands in the middle of the screen, the way a dialog would.",
            actions: [{ label: "Next", action: "next" }],
        },
        {
            id: "tooltip",
            title: "A step standing against something",
            description: "This one is measured against the box below and points at it.",
            target: () => document.querySelector<HTMLElement>("#types-target"),
            actions: [
                { label: "Back", action: "prev" },
                { label: "Next", action: "next" },
            ],
        },
        {
            id: "floating",
            type: "floating",
            placement: "bottom-end",
            title: "A step keeping to a corner",
            description: "This one stays where it is, whatever the reader scrolls to.",
            actions: [
                { label: "Back", action: "prev" },
                { label: "Done", action: "dismiss" },
            ],
        },
    ];

    return (
        <div className={classes.frame}>
            <StartButton onClick={() => setOpen(true)} />

            <div id="types-target" className={classes.target}>
                Something to point at
            </div>

            <Tour steps={steps} open={open} defaultStep="welcome" onOpenChange={setOpen}>
                {surface}
            </Tour>
        </div>
    );
};

// Stepping through with the arrow keys as well as the buttons, for a reader working through a
// long tour without reaching for the pointer each time
export const KeyboardNavigation: StoryFn = () => {
    const [open, setOpen] = React.useState(false);

    const steps: TourStep[] = ["first", "second", "third"].map((name, index) => ({
        id: name,
        title: `The ${name} of them`,
        description: "Press the right arrow to go on, or the left to go back.",
        target: () => document.querySelector<HTMLElement>(`#key-${index}`),
        actions: [
            { label: "Back", action: "prev" },
            { label: index === 2 ? "Done" : "Next", action: index === 2 ? "dismiss" : "next" },
        ],
    }));

    return (
        <div className={classes.frame}>
            <StartButton onClick={() => setOpen(true)} />

            <Text size="small">
                <KeyboardRegular /> The arrow keys step through, and Escape closes it
            </Text>

            <div className={classes.row}>
                {[0, 1, 2].map((index) => (
                    <div key={index} id={`key-${index}`} className={classes.target}>
                        Step {index + 1}
                    </div>
                ))}
            </div>

            <Tour
                steps={steps}
                open={open}
                defaultStep="first"
                onOpenChange={setOpen}
                keyboardNavigation
            >
                {surface}
            </Tour>
        </div>
    );
};

// A bar under the words saying how far along the tour has come. How far that is comes from the
// tour rather than being counted again here, which is what `useTour` is for
const Progress = () => {
    const tour = useTour();

    return <ProgressBar progress={tour.progressPercent} aria-label="How far along the tour is" />;
};

export const WithProgress: StoryFn = () => {
    const [open, setOpen] = React.useState(false);

    const steps: TourStep[] = [0, 1, 2, 3].map((index) => ({
        id: `step-${index}`,
        title: `Step ${index + 1}`,
        description: "The bar under this says how much of the tour is left.",
        target: () => document.querySelector<HTMLElement>(`#progress-${index}`),
        actions: [
            { label: "Back", action: "prev" },
            { label: index === 3 ? "Done" : "Next", action: index === 3 ? "dismiss" : "next" },
        ],
    }));

    return (
        <div className={classes.frame}>
            <StartButton onClick={() => setOpen(true)} />

            <div className={classes.row}>
                {[0, 1, 2, 3].map((index) => (
                    <div key={index} id={`progress-${index}`} className={classes.target}>
                        Step {index + 1}
                    </div>
                ))}
            </div>

            <Tour steps={steps} open={open} defaultStep="step-0" onOpenChange={setOpen}>
                <Tour.Backdrop />
                <Tour.Spotlight />
                <Tour.Positioner>
                    <Tour.Content>
                        <Tour.Arrow />
                        <Tour.CloseTrigger />
                        <Tour.ProgressText />
                        <Tour.Title />
                        <Tour.Description />
                        <Progress />
                        <Tour.Control>
                            <Tour.Actions>
                                {(actions) =>
                                    actions.map((action) => (
                                        <Tour.ActionTrigger
                                            key={action.label}
                                            action={action}
                                            variant={
                                                action.action === "next" ? "primary" : "default"
                                            }
                                        />
                                    ))
                                }
                            </Tour.Actions>
                        </Tour.Control>
                    </Tour.Content>
                </Tour.Positioner>
            </Tour>
        </div>
    );
};

// A step that asks the reader to do something rather than read something. It carries no buttons
// at all: what takes the tour on is the reader pressing the very thing the step is pointing at
export const WaitingForAPress: StoryFn = () => {
    const [open, setOpen] = React.useState(false);
    const [done, setDone] = React.useState<string[]>([]);

    const steps: TourStep[] = [
        {
            id: "intro",
            type: "dialog",
            title: "One thing at a time",
            description: "Each of the next three steps waits until you have done what it asks.",
            actions: [{ label: "Begin", action: "next" }],
        },
        ...(["add", "edit", "delete"] as const).map((name) => ({
            id: name,
            title: `Press ${name}`,
            description: "The tour waits here until you do.",
            target: () => document.querySelector<HTMLElement>(`#press-${name}`),
            effect({ next, target, show }: Parameters<NonNullable<TourStep["effect"]>>[0]) {
                show();

                const [pressed, stop] = waitForEvent(target, "click");
                pressed.then(() => next());

                return stop;
            },
        })),
        {
            id: "done",
            type: "dialog",
            title: "That is all three",
            description: "Nothing was pressed for you: the tour simply waited.",
            actions: [{ label: "Finish", action: "dismiss" }],
        },
    ];

    return (
        <div className={classes.frame}>
            <StartButton onClick={() => setOpen(true)}>Take the interactive tour</StartButton>

            <div className={classes.row}>
                <Button
                    id="press-add"
                    leadingVisual={AddRegular}
                    onClick={() => setDone((current) => [...current, "Added"])}
                >
                    Add
                </Button>
                <Button
                    id="press-edit"
                    leadingVisual={EditRegular}
                    onClick={() => setDone((current) => [...current, "Edited"])}
                >
                    Edit
                </Button>
                <Button
                    id="press-delete"
                    leadingVisual={DeleteRegular}
                    onClick={() => setDone((current) => [...current, "Deleted"])}
                >
                    Delete
                </Button>
            </div>

            <div className={classes.stack}>
                {done.map((entry, index) => (
                    <Text key={index} size="small">
                        {entry}
                    </Text>
                ))}
            </div>

            <Tour steps={steps} open={open} defaultStep="intro" onOpenChange={setOpen}>
                {surface}
            </Tour>
        </div>
    );
};

// A step speaking about something that is not on the page yet. It stays back until the element
// arrives, so the tour never points at nothing
export const WaitingForAnElement: StoryFn = () => {
    const [open, setOpen] = React.useState(false);
    const [items, setItems] = React.useState<string[]>([]);

    const steps: TourStep[] = [
        {
            id: "add",
            title: "Add something to the list",
            description: "The next step speaks about what you add, so it waits for it.",
            target: () => document.querySelector<HTMLElement>("#waiting-add"),
            effect({ next, target, show }) {
                show();

                const [pressed, stop] = waitForEvent(target, "click");
                pressed.then(() => next());

                return stop;
            },
        },
        {
            id: "added",
            title: "There it is",
            description: "This step stayed back until the row below had been drawn.",
            target: () => document.querySelector<HTMLElement>("[data-latest]"),
            effect({ show }) {
                const [arrived, stop] = waitForElement(
                    () => document.querySelector<HTMLElement>("[data-latest]"),
                    { timeout: 5000 },
                );
                arrived.then(() => show());

                return stop;
            },
            actions: [{ label: "Done", action: "dismiss" }],
        },
    ];

    return (
        <div className={classes.frame}>
            <StartButton onClick={() => setOpen(true)} />

            <Button
                id="waiting-add"
                leadingVisual={AddRegular}
                onClick={() => setItems((current) => [...current, `Item ${current.length + 1}`])}
            >
                Add an item
            </Button>

            <div className={classes.stack}>
                {items.map((item, index) => (
                    <div
                        key={item}
                        className={classes.target}
                        data-latest={index === items.length - 1 ? "" : undefined}
                    >
                        {item}
                    </div>
                ))}
            </div>

            <Tour steps={steps} open={open} defaultStep="add" onOpenChange={setOpen}>
                {surface}
            </Tour>
        </div>
    );
};

// A step waiting on a field rather than on a press, which is the same idea asked of something the
// reader types rather than something they click
export const WaitingForAValue: StoryFn = () => {
    const [open, setOpen] = React.useState(false);

    const steps: TourStep[] = [
        {
            id: "type",
            title: 'Type "hello"',
            description: "The tour waits here until the field says exactly that.",
            target: () => document.querySelector<HTMLElement>("#waiting-field"),
            effect({ next, show }) {
                show();

                const [typed, stop] = waitForElementValue(
                    () => document.querySelector<HTMLInputElement>("#waiting-field"),
                    "hello",
                );
                typed.then((element) => element && next());

                return stop;
            },
        },
        {
            id: "done",
            type: "dialog",
            title: "That is it",
            description: "The tour moved on the moment the field held what it was waiting for.",
            actions: [{ label: "Finish", action: "dismiss" }],
        },
    ];

    return (
        <div className={classes.frame}>
            <StartButton onClick={() => setOpen(true)} />

            <TextInput id="waiting-field" placeholder="e.g. hello" aria-label="Say hello" />

            <Tour steps={steps} open={open} defaultStep="type" onOpenChange={setOpen}>
                {surface}
            </Tour>
        </div>
    );
};

// A step that only knows what it has to say once something has come back. It stays back while it
// waits and writes what it found into itself before it speaks
export const LoadedStep: StoryFn = () => {
    const [open, setOpen] = React.useState(false);

    const steps: TourStep[] = [
        {
            id: "loading",
            title: "Just a moment",
            description: "Reading your account…",
            target: () => document.querySelector<HTMLElement>("#loaded-target"),
            actions: [{ label: "Done", action: "dismiss" }],
            effect({ show, update }) {
                const waiting = window.setTimeout(() => {
                    update({
                        title: "Welcome back",
                        description: "You have three drafts waiting and one review to answer.",
                    });
                    show();
                }, 1200);

                return () => window.clearTimeout(waiting);
            },
        },
    ];

    return (
        <div className={classes.frame}>
            <StartButton onClick={() => setOpen(true)} />

            <div id="loaded-target" className={classes.target}>
                Your account
            </div>

            <Tour steps={steps} open={open} defaultStep="loading" onOpenChange={setOpen}>
                {surface}
            </Tour>
        </div>
    );
};

// What a tour says as it is read, for a caller keeping their own count of who has seen what
export const Events: StoryFn = () => {
    const [open, setOpen] = React.useState(false);
    const [log, setLog] = React.useState<string[]>([]);

    const note = (entry: string) => setLog((current) => [...current, entry]);

    const steps: TourStep[] = [0, 1, 2].map((index) => ({
        id: `step-${index}`,
        title: `Step ${index + 1}`,
        description: "Watch the log below as you go.",
        target: () => document.querySelector<HTMLElement>(`#event-${index}`),
        actions: [
            { label: "Back", action: "prev" },
            { label: index === 2 ? "Done" : "Next", action: index === 2 ? "dismiss" : "next" },
        ],
    }));

    return (
        <div className={classes.frame}>
            <StartButton onClick={() => setOpen(true)} />

            <div className={classes.row}>
                {[0, 1, 2].map((index) => (
                    <div key={index} id={`event-${index}`} className={classes.target}>
                        Step {index + 1}
                    </div>
                ))}
            </div>

            <div className={classes.log}>
                {log.length === 0 ? (
                    <Text size="small">Start the tour to see what it says</Text>
                ) : (
                    log.map((entry, index) => (
                        <Text key={index} size="small">
                            {entry}
                        </Text>
                    ))
                )}
            </div>

            <Tour
                steps={steps}
                open={open}
                defaultStep="step-0"
                onOpenChange={setOpen}
                onStepChange={(details: TourStepChangeDetails) =>
                    note(`Step: ${details.stepId ?? "none"}`)
                }
                onStatusChange={(details: TourStatusChangeDetails) =>
                    note(`Status: ${details.status}`)
                }
            >
                {surface}
            </Tour>
        </div>
    );
};

// Controls of the caller's own, drawn outside the surface the steps are read from. `useTour` is
// what reaches the tour standing around them, so a step's own actions are not the only way on
const Controls = () => {
    const tour = useTour();

    return (
        <div className={classes.row}>
            <Button size="small" disabled={!tour.hasPrev} onClick={() => tour.prev()}>
                Back
            </Button>
            <Text size="small">{tour.progressText}</Text>
            <Button size="small" disabled={!tour.hasNext} onClick={() => tour.next()}>
                Next
            </Button>
            <Button size="small" variant="danger" onClick={() => tour.dismiss()}>
                Leave
            </Button>
        </div>
    );
};

export const OwnControls: StoryFn = () => {
    const [open, setOpen] = React.useState(false);

    const steps: TourStep[] = [0, 1, 2].map((index) => ({
        id: `step-${index}`,
        title: `Step ${index + 1}`,
        description: "The buttons under this are the caller's rather than the step's.",
        target: () => document.querySelector<HTMLElement>(`#own-${index}`),
    }));

    return (
        <div className={classes.frame}>
            <StartButton onClick={() => setOpen(true)} />

            <div className={classes.row}>
                {[0, 1, 2].map((index) => (
                    <div key={index} id={`own-${index}`} className={classes.target}>
                        Step {index + 1}
                    </div>
                ))}
            </div>

            <Tour steps={steps} open={open} defaultStep="step-0" onOpenChange={setOpen}>
                <Tour.Backdrop />
                <Tour.Spotlight />
                <Tour.Positioner>
                    <Tour.Content>
                        <Tour.Arrow />
                        <Tour.CloseTrigger />
                        <Tour.Title />
                        <Tour.Description />
                        <Tour.Control>
                            <Controls />
                        </Tour.Control>
                    </Tour.Content>
                </Tour.Positioner>
            </Tour>
        </div>
    );
};

// A tour read without the dim behind it, for one that speaks about a page the reader is meant to
// go on using while they read
export const WithoutBackdrop: StoryFn = () => {
    const [open, setOpen] = React.useState(false);

    const steps: TourStep[] = [0, 1].map((index) => ({
        id: `step-${index}`,
        backdrop: false,
        title: `Step ${index + 1}`,
        description: "The page behind is left as it was, and only the ring says where to look.",
        target: () => document.querySelector<HTMLElement>(`#plain-${index}`),
        actions: [
            { label: "Back", action: "prev" },
            { label: index === 1 ? "Done" : "Next", action: index === 1 ? "dismiss" : "next" },
        ],
    }));

    return (
        <div className={classes.frame}>
            <StartButton onClick={() => setOpen(true)} />

            <div className={classes.row}>
                {[0, 1].map((index) => (
                    <div key={index} id={`plain-${index}`} className={classes.target}>
                        Step {index + 1}
                    </div>
                ))}
            </div>

            <Tour steps={steps} open={open} defaultStep="step-0" onOpenChange={setOpen}>
                {surface}
            </Tour>
        </div>
    );
};
