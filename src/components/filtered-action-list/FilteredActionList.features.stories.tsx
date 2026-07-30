import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { BranchRegular, PersonRegular, TagRegular } from "@gamecrafters/base-ui-icons";
import { ActionList } from "../action-list";
import { Avatar } from "../avatar";
import { Blankslate } from "../blankslate";
import { CounterLabel } from "../counter-label";
import { FilteredActionList } from ".";
import type { FilteredActionListItemInput } from "./FilteredActionList.types";

const classes = {
    // Gives the list a box to sit in rather than the width and height of the page, since it
    // is only ever drawn inside a panel of some kind
    container:
        "w-[20rem] h-[20rem] rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-[color:var(--border-color-default)]",
};

export default {
    title: "Components/FilteredActionList/Features",
    parameters: {
        layout: "centered",
    },
};

const people = [
    "Monalisa Octocat",
    "Hubot",
    "Mona Lisa",
    "Octocat",
    "Ada Lovelace",
    "Grace Hopper",
    "Alan Turing",
    "Katherine Johnson",
    "Margaret Hamilton",
    "Barbara Liskov",
];

const peopleItems: FilteredActionListItemInput[] = people.map((name, index) => ({
    id: index,
    text: name,
    leadingVisual: PersonRegular,
}));

// The filtering itself is the caller's, so every story does it the same way
const matching = (items: FilteredActionListItemInput[], filter: string) =>
    items.filter((item) => item.text?.toLowerCase().includes(filter.toLowerCase()));

// Descriptions, where each item says more about itself than its name does
export const WithDescriptions: StoryFn<typeof FilteredActionList> = () => {
    const [filter, setFilter] = React.useState("");

    const items: FilteredActionListItemInput[] = [
        { id: "main", text: "main", description: "default", trailingVisual: "3 days ago" },
        { id: "next", text: "next", description: "ahead by 4 commits" },
        { id: "fix-overflow", text: "fix-overflow", description: "behind by 1 commit" },
        { id: "release-2-1", text: "release-2.1", description: "protected" },
    ].map((item) => ({ ...item, leadingVisual: BranchRegular }));

    return (
        <FilteredActionList
            className={classes.container}
            placeholderText="Filter branches"
            filterValue={filter}
            onFilterChange={setFilter}
            items={matching(items, filter)}
        />
    );
};

// Selection, where the items are picked rather than gone to
export const Selection: StoryFn<typeof FilteredActionList> = () => {
    const [filter, setFilter] = React.useState("");
    const [selected, setSelected] = React.useState<string[]>(["Hubot"]);

    const toggle = (name: string) =>
        setSelected((current) =>
            current.includes(name) ? current.filter((entry) => entry !== name) : [...current, name],
        );

    const items: FilteredActionListItemInput[] = people.map((name, index) => ({
        id: index,
        text: name,
        leadingVisual: PersonRegular,
        selected: selected.includes(name),
        onAction: () => toggle(name),
    }));

    return (
        <FilteredActionList
            className={classes.container}
            placeholderText="Filter people"
            selectionVariant="multiple"
            filterValue={filter}
            onFilterChange={setFilter}
            items={matching(items, filter)}
        />
    );
};

// Select All, which picks every item the filter has left at once
export const SelectAll: StoryFn<typeof FilteredActionList> = () => {
    const [filter, setFilter] = React.useState("");
    const [selected, setSelected] = React.useState<string[]>([]);

    const visible = people.filter((name) => name.toLowerCase().includes(filter.toLowerCase()));

    const items: FilteredActionListItemInput[] = visible.map((name, index) => ({
        id: index,
        text: name,
        leadingVisual: PersonRegular,
        selected: selected.includes(name),
        onAction: () =>
            setSelected((current) =>
                current.includes(name)
                    ? current.filter((entry) => entry !== name)
                    : [...current, name],
            ),
    }));

    return (
        <FilteredActionList
            className={classes.container}
            placeholderText="Filter people"
            selectionVariant="multiple"
            filterValue={filter}
            onFilterChange={setFilter}
            items={items}
            onSelectAllChange={(checked) => setSelected(checked ? visible : [])}
        />
    );
};

// Groups, where the items are collected under headings of their own
export const Grouped: StoryFn<typeof FilteredActionList> = () => {
    const [filter, setFilter] = React.useState("");

    const items: FilteredActionListItemInput[] = [
        { id: "bug", text: "bug", groupId: "type" },
        { id: "enhancement", text: "enhancement", groupId: "type" },
        { id: "documentation", text: "documentation", groupId: "type" },
        { id: "good-first-issue", text: "good first issue", groupId: "effort" },
        { id: "help-wanted", text: "help wanted", groupId: "effort" },
    ].map((item) => ({ ...item, leadingVisual: TagRegular }));

    return (
        <FilteredActionList
            className={classes.container}
            placeholderText="Filter labels"
            filterValue={filter}
            onFilterChange={setFilter}
            items={matching(items, filter)}
            groupMetadata={[
                { groupId: "type", header: { title: "Type" } },
                { groupId: "effort", header: { title: "Effort", variant: "filled" } },
            ]}
        />
    );
};

// Loading with a spinner, which stands in place of the list while it waits
export const LoadingSpinner: StoryFn<typeof FilteredActionList> = () => (
    <FilteredActionList
        className={classes.container}
        placeholderText="Filter people"
        loading
        loadingType="body-spinner"
        onFilterChange={() => {}}
        items={[]}
    />
);

// Loading with a skeleton, for a list arriving for the first time rather than being
// filtered again
export const LoadingSkeleton: StoryFn<typeof FilteredActionList> = () => (
    <FilteredActionList
        className={classes.container}
        placeholderText="Filter people"
        loading
        loadingType="body-skeleton"
        onFilterChange={() => {}}
        items={[]}
    />
);

// Loading in the field, which leaves the items the list is already showing where they are
export const LoadingInput: StoryFn<typeof FilteredActionList> = () => (
    <FilteredActionList
        className={classes.container}
        placeholderText="Filter people"
        loading
        loadingType="input"
        onFilterChange={() => {}}
        items={peopleItems}
    />
);

// A message, which stands in place of a list the filter has left with nothing in it
export const EmptyMessage: StoryFn<typeof FilteredActionList> = () => {
    const [filter, setFilter] = React.useState("octopus");

    const items = matching(peopleItems, filter);
    const messageText = {
        title: "No people found",
        description: "Try a different name.",
    };

    return (
        <FilteredActionList
            className={classes.container}
            placeholderText="Filter people"
            filterValue={filter}
            onFilterChange={setFilter}
            items={items}
            messageText={messageText}
            message={
                items.length === 0 ? (
                    <Blankslate narrow>
                        <Blankslate.Heading>{messageText.title}</Blankslate.Heading>
                        <Blankslate.Description>{messageText.description}</Blankslate.Description>
                    </Blankslate>
                ) : undefined
            }
        />
    );
};

// Virtualised, where only the items in view are drawn. Every one of the thousand items is
// passed in, and a handful of them are ever in the DOM
export const Virtualized: StoryFn<typeof FilteredActionList> = () => {
    const [filter, setFilter] = React.useState("");

    const items: FilteredActionListItemInput[] = React.useMemo(
        () =>
            Array.from({ length: 1000 }, (_, index) => ({
                id: index,
                text: `Item ${index + 1}`,
                leadingVisual: TagRegular,
            })),
        [],
    );

    return (
        <FilteredActionList
            className={classes.container}
            placeholderText="Filter 1,000 items"
            filterValue={filter}
            onFilterChange={setFilter}
            items={matching(items, filter)}
            virtualized
        />
    );
};

// Trailing visuals, which stand after the name and say something more about the item
export const TrailingVisuals: StoryFn<typeof FilteredActionList> = () => {
    const [filter, setFilter] = React.useState("");

    const items: FilteredActionListItemInput[] = people.slice(0, 5).map((name, index) => ({
        id: index,
        text: name,
        leadingVisual: PersonRegular,
        trailingVisual: <CounterLabel>{(index + 1) * 3}</CounterLabel>,
    }));

    return (
        <FilteredActionList
            className={classes.container}
            placeholderText="Filter people"
            filterValue={filter}
            onFilterChange={setFilter}
            items={matching(items, filter)}
        />
    );
};

// A renderer of the caller's own, which draws the items the list has no way to describe
export const CustomItemRendering: StoryFn<typeof FilteredActionList> = () => {
    const [filter, setFilter] = React.useState("");

    return (
        <FilteredActionList
            className={classes.container}
            placeholderText="Filter people"
            filterValue={filter}
            onFilterChange={setFilter}
            items={matching(peopleItems, filter)}
            renderItem={(item) => (
                <ActionList.Item key={item.id} role="option" onSelect={() => {}}>
                    <ActionList.LeadingVisual>
                        <Avatar src="https://avatars.githubusercontent.com/u/7143434?v=4" />
                    </ActionList.LeadingVisual>
                    {item.text}
                    <ActionList.Description>@{item.text?.split(" ")[0]}</ActionList.Description>
                </ActionList.Item>
            )}
        />
    );
};
