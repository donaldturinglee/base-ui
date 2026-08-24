import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { ActionList } from "../action-list";
import { Button } from "../button";
import { Text } from "../text";
import { Collapsible } from ".";

const classes = {
    box: "w-[var(--overlay-width-small)]",
    stack: "flex w-[var(--overlay-width-small)] flex-col gap-[var(--base-size-8)]",
    nested: "ps-[var(--base-size-8)]",
};

const summary =
    "A disclosure standing on its own: something to press, and content that is only there once it has been pressed.";

export default {
    title: "Components/Collapsible/Features",
    parameters: {
        layout: "centered",
    },
};

// Starts Open, for content a reader is more likely to want than not
export const StartsOpen: StoryFn<typeof Collapsible> = () => (
    <Collapsible className={classes.box} defaultOpen>
        <Collapsible.Trigger>What is a collapsible?</Collapsible.Trigger>
        <Collapsible.Panel>
            <Text>{summary}</Text>
        </Collapsible.Panel>
    </Collapsible>
);

// With The Chevron Before The Label, which reads as a row of a tree rather than as a button
export const IndicatorAtStart: StoryFn<typeof Collapsible> = () => (
    <Collapsible className={classes.box}>
        <Collapsible.Trigger indicator="start">What is a collapsible?</Collapsible.Trigger>
        <Collapsible.Panel>
            <Text>{summary}</Text>
        </Collapsible.Panel>
    </Collapsible>
);

// Without A Chevron, for a trigger that says it is open some other way
export const WithoutIndicator: StoryFn<typeof Collapsible> = () => (
    <Collapsible className={classes.box}>
        <Collapsible.Trigger indicator="none">What is a collapsible?</Collapsible.Trigger>
        <Collapsible.Panel>
            <Text>{summary}</Text>
        </Collapsible.Panel>
    </Collapsible>
);

// Disabled, which leaves the disclosure as it stands
export const Disabled: StoryFn<typeof Collapsible> = () => (
    <div className={classes.stack}>
        <Collapsible disabled>
            <Collapsible.Trigger>Closed, and cannot be opened</Collapsible.Trigger>
            <Collapsible.Panel>
                <Text>{summary}</Text>
            </Collapsible.Panel>
        </Collapsible>

        <Collapsible disabled defaultOpen>
            <Collapsible.Trigger>Open, and cannot be closed</Collapsible.Trigger>
            <Collapsible.Panel>
                <Text>{summary}</Text>
            </Collapsible.Panel>
        </Collapsible>
    </div>
);

// Controlled, where the caller holds whether the disclosure is open
export const Controlled: StoryFn<typeof Collapsible> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={classes.stack}>
            <Button onClick={() => setOpen(!open)}>{open ? "Hide" : "Show"} the answer</Button>

            <Collapsible open={open} onChange={setOpen}>
                <Collapsible.Trigger>What is a collapsible?</Collapsible.Trigger>
                <Collapsible.Panel>
                    <Text>{summary}</Text>
                </Collapsible.Panel>
            </Collapsible>
        </div>
    );
};

// Holding A List, which is what a disclosure of choices holds
export const WithAList: StoryFn<typeof Collapsible> = () => (
    <Collapsible className={classes.box} defaultOpen>
        <Collapsible.Trigger>Filters</Collapsible.Trigger>
        <Collapsible.Panel>
            <ActionList>
                <ActionList.Item>Open issues</ActionList.Item>
                <ActionList.Item>Your issues</ActionList.Item>
                <ActionList.Item>Everything assigned to you</ActionList.Item>
            </ActionList>
        </Collapsible.Panel>
    </Collapsible>
);

// Nested, where one disclosure holds another
export const Nested: StoryFn<typeof Collapsible> = () => (
    <Collapsible className={classes.box} defaultOpen>
        <Collapsible.Trigger indicator="start">Components</Collapsible.Trigger>
        <Collapsible.Panel>
            <Collapsible className={classes.nested}>
                <Collapsible.Trigger indicator="start">Forms</Collapsible.Trigger>
                <Collapsible.Panel>
                    <Text>Checkbox, Radio, Select, TextInput, Textarea</Text>
                </Collapsible.Panel>
            </Collapsible>

            <Collapsible className={classes.nested}>
                <Collapsible.Trigger indicator="start">Overlays</Collapsible.Trigger>
                <Collapsible.Panel>
                    <Text>Dialog, Popover, SelectPanel, Tooltip</Text>
                </Collapsible.Panel>
            </Collapsible>
        </Collapsible.Panel>
    </Collapsible>
);

// Drawn Only Once It Is Asked For, where the panel is taken off the page while it is closed
// rather than left there hidden. The trigger stops pointing at it while it is gone
export const NotKeptMounted: StoryFn<typeof Collapsible> = () => (
    <Collapsible className={classes.box}>
        <Collapsible.Trigger>What is a collapsible?</Collapsible.Trigger>
        <Collapsible.Panel keepMounted={false}>
            <Text>{summary}</Text>
        </Collapsible.Panel>
    </Collapsible>
);

// Found By The Browser, where find-in-page reaches the closed panel and what it turns up opens
// the disclosure rather than being passed over
export const HiddenUntilFound: StoryFn<typeof Collapsible> = () => (
    <Collapsible className={classes.box}>
        <Collapsible.Trigger>What is a collapsible?</Collapsible.Trigger>
        <Collapsible.Panel hiddenUntilFound>
            <Text>{summary}</Text>
        </Collapsible.Panel>
    </Collapsible>
);

// Reporting What It Did, for a caller that keeps its own count of what is open
export const ReportingChanges: StoryFn<typeof Collapsible> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={classes.stack}>
            <Collapsible onChange={setOpen}>
                <Collapsible.Trigger>What is a collapsible?</Collapsible.Trigger>
                <Collapsible.Panel>
                    <Text>{summary}</Text>
                </Collapsible.Panel>
            </Collapsible>

            <Text size="small">Currently {open ? "open" : "closed"}</Text>
        </div>
    );
};
