import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Stack } from "../stack";
import { Text } from "../text";
import { Tabs, useTab, useTabList } from ".";

const classes = {
    // Gives the tablist a container to run the width of
    container: "w-[28rem]",
    // A tablist standing beside the panels takes a width of its own instead
    sidebar: "w-[10rem] shrink-0",
    panels: "min-w-0",
};

const sections = [
    {
        value: "overview",
        label: "Overview",
        body: "Everything that has happened on the repository over the last week.",
    },
    {
        value: "issues",
        label: "Issues",
        body: "Twelve issues are open, four of them raised since Friday.",
    },
    {
        value: "pull-requests",
        label: "Pull requests",
        body: "Three pull requests are waiting on a review from you.",
    },
];

export default {
    title: "Components/Tabs/Features",
    parameters: {
        layout: "centered",
    },
};

// Uncontrolled, where the tabs keep hold of what is selected themselves
export const Uncontrolled: StoryFn<typeof Tabs> = () => {
    const [selected, setSelected] = React.useState("overview");

    return (
        <Stack gap="normal" className={classes.container}>
            <Tabs defaultValue="overview" onChange={setSelected}>
                <Tabs.List aria-label="Repository">
                    {sections.map((section) => (
                        <Tabs.Tab key={section.value} value={section.value}>
                            {section.label}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
                {sections.map((section) => (
                    <Tabs.Panel key={section.value} value={section.value}>
                        <Text>{section.body}</Text>
                    </Tabs.Panel>
                ))}
            </Tabs>
            <Text size="small">Last selected: {selected}</Text>
        </Stack>
    );
};

// Controlled, where the caller keeps hold of what is selected
export const Controlled: StoryFn<typeof Tabs> = () => {
    const [value, setValue] = React.useState("overview");

    return (
        <Stack gap="normal" className={classes.container}>
            <Tabs value={value} onChange={setValue}>
                <Tabs.List aria-label="Repository">
                    {sections.map((section) => (
                        <Tabs.Tab key={section.value} value={section.value}>
                            {section.label}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
                {sections.map((section) => (
                    <Tabs.Panel key={section.value} value={section.value}>
                        <Text>{section.body}</Text>
                    </Tabs.Panel>
                ))}
            </Tabs>
            <Button size="small" onClick={() => setValue("pull-requests")}>
                Show pull requests
            </Button>
        </Stack>
    );
};

// Vertical, where the tablist stands beside the panels and the up and down keys move along it
export const Vertical: StoryFn<typeof Tabs> = () => (
    <Stack direction="horizontal" gap="normal" className={classes.container}>
        <Tabs defaultValue="overview">
            <Tabs.List
                aria-label="Repository"
                aria-orientation="vertical"
                className={classes.sidebar}
            >
                {sections.map((section) => (
                    <Tabs.Tab key={section.value} value={section.value}>
                        {section.label}
                    </Tabs.Tab>
                ))}
            </Tabs.List>
            <Stack gap="normal" className={classes.panels}>
                {sections.map((section) => (
                    <Tabs.Panel key={section.value} value={section.value}>
                        <Text>{section.body}</Text>
                    </Tabs.Panel>
                ))}
            </Stack>
        </Tabs>
    </Stack>
);

// With A Disabled Tab, which is passed over rather than landed on
export const WithADisabledTab: StoryFn<typeof Tabs> = () => (
    <Stack gap="normal" className={classes.container}>
        <Tabs defaultValue="overview">
            <Tabs.List aria-label="Repository">
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="issues" disabled>
                    Issues
                </Tabs.Tab>
                <Tabs.Tab value="pull-requests">Pull requests</Tabs.Tab>
            </Tabs.List>
            {sections.map((section) => (
                <Tabs.Panel key={section.value} value={section.value}>
                    <Text>{section.body}</Text>
                </Tabs.Panel>
            ))}
        </Tabs>
    </Stack>
);

// The tablist and the tabs, built out of whatever suits, with the hooks handing them
// everything they need to answer the keyboard and be read out as tabs
const CustomTabList = (props: React.PropsWithChildren) => {
    const { tabListProps } = useTabList<HTMLDivElement>({
        "aria-label": "Repository",
        "aria-orientation": "vertical",
    });

    return (
        <Stack {...tabListProps} gap="condensed" className={classes.sidebar}>
            {props.children}
        </Stack>
    );
};

const CustomTab = (props: React.PropsWithChildren<{ value: string }>) => {
    const { selected, tabProps } = useTab<HTMLButtonElement>({ value: props.value });

    return (
        <Button
            {...tabProps}
            variant={selected ? "primary" : "invisible"}
            block
            alignContent="start"
        >
            {props.children}
        </Button>
    );
};

// With Custom Components, where only the behaviour is taken and the rest is built to suit
export const WithCustomComponents: StoryFn<typeof Tabs> = () => (
    <Stack direction="horizontal" gap="normal" className={classes.container}>
        <Tabs defaultValue="overview">
            <CustomTabList>
                {sections.map((section) => (
                    <CustomTab key={section.value} value={section.value}>
                        {section.label}
                    </CustomTab>
                ))}
            </CustomTabList>
            <Stack gap="normal" className={classes.panels}>
                {sections.map((section) => (
                    <Tabs.Panel key={section.value} value={section.value}>
                        <Text>{section.body}</Text>
                    </Tabs.Panel>
                ))}
            </Stack>
        </Tabs>
    </Stack>
);
