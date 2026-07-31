import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { ActionList } from "../action-list";
import { FormControl } from "../form-control";
import { SelectPanel } from ".";

const classes = {
    swatch: "inline-block size-[var(--base-size-12)] rounded-[var(--border-radius-full)]",
};

const labels = [
    { id: "bug", name: "bug", description: "Something isn't working", color: "#d73a4a" },
    {
        id: "enhancement",
        name: "enhancement",
        description: "New feature or request",
        color: "#a2eeef",
    },
    {
        id: "documentation",
        name: "documentation",
        description: "Improvements to the docs",
        color: "#0075ca",
    },
    {
        id: "good-first-issue",
        name: "good first issue",
        description: "Good for newcomers",
        color: "#7057ff",
    },
    {
        id: "help-wanted",
        name: "help wanted",
        description: "Extra attention is needed",
        color: "#008672",
    },
    {
        id: "question",
        name: "question",
        description: "Further information is requested",
        color: "#d876e3",
    },
];

const assignees = [
    { id: "monalisa", name: "monalisa" },
    { id: "hubot", name: "hubot" },
    { id: "octocat", name: "octocat" },
];

const Swatch = ({ color }: { color: string }) => (
    <span className={classes.swatch} style={{ backgroundColor: color }} />
);

const useLabelSelection = (initial: string[] = ["bug"]) => {
    const [selected, setSelected] = React.useState<string[]>(initial);

    const toggle = (id: string) =>
        setSelected((current) =>
            current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
        );

    return { selected, setSelected, toggle };
};

export default {
    title: "Components/SelectPanel/Features",
    parameters: {
        layout: "centered",
    },
};

// With A Search Field, which the caller filters the items against
export const WithSearchField: StoryFn<typeof SelectPanel> = () => {
    const { selected, toggle } = useLabelSelection();
    const [query, setQuery] = React.useState("");

    const itemsToShow = labels.filter(
        (label) =>
            label.name.toLowerCase().includes(query.toLowerCase()) ||
            label.description.toLowerCase().includes(query.toLowerCase()),
    );

    return (
        <SelectPanel title="Select labels">
            <SelectPanel.Button>Assign label</SelectPanel.Button>

            <SelectPanel.Header>
                <SelectPanel.SearchInput aria-label="Search labels" onChange={setQuery} />
            </SelectPanel.Header>

            {itemsToShow.length === 0 ? (
                <SelectPanel.Message variant="empty" title={`No labels found for "${query}"`}>
                    Try a different search term
                </SelectPanel.Message>
            ) : (
                <ActionList>
                    {itemsToShow.map((label) => (
                        <ActionList.Item
                            key={label.id}
                            onSelect={() => toggle(label.id)}
                            selected={selected.includes(label.id)}
                        >
                            <ActionList.LeadingVisual>
                                <Swatch color={label.color} />
                            </ActionList.LeadingVisual>
                            {label.name}
                            <ActionList.Description variant="block">
                                {label.description}
                            </ActionList.Description>
                        </ActionList.Item>
                    ))}
                </ActionList>
            )}

            <SelectPanel.Footer />
        </SelectPanel>
    );
};

// With A Description, which says more about what is being picked
export const WithDescription: StoryFn<typeof SelectPanel> = () => {
    const { selected, toggle } = useLabelSelection();

    return (
        <SelectPanel
            title="Select labels"
            description="Use labels to organise issues and pull requests"
        >
            <SelectPanel.Button>Assign label</SelectPanel.Button>

            <ActionList>
                {labels.map((label) => (
                    <ActionList.Item
                        key={label.id}
                        onSelect={() => toggle(label.id)}
                        selected={selected.includes(label.id)}
                    >
                        {label.name}
                    </ActionList.Item>
                ))}
            </ActionList>

            <SelectPanel.Footer />
        </SelectPanel>
    );
};

// Single Selection, where picking one item gives up the last
export const SingleSelection: StoryFn<typeof SelectPanel> = () => {
    const [selected, setSelected] = React.useState("monalisa");

    return (
        <SelectPanel title="Select an assignee" selectionVariant="single">
            <SelectPanel.Button>Assign someone</SelectPanel.Button>

            <ActionList>
                {assignees.map((assignee) => (
                    <ActionList.Item
                        key={assignee.id}
                        onSelect={() => setSelected(assignee.id)}
                        selected={selected === assignee.id}
                    >
                        {assignee.name}
                    </ActionList.Item>
                ))}
            </ActionList>

            <SelectPanel.Footer />
        </SelectPanel>
    );
};

// Instant Selection, where the first pick is the answer and closes the panel
export const InstantSelection: StoryFn<typeof SelectPanel> = () => {
    const [selected, setSelected] = React.useState("monalisa");

    return (
        <SelectPanel title="Select an assignee" selectionVariant="instant">
            <SelectPanel.Button>Assign someone</SelectPanel.Button>

            <ActionList>
                {assignees.map((assignee) => (
                    <ActionList.Item
                        key={assignee.id}
                        onSelect={() => setSelected(assignee.id)}
                        selected={selected === assignee.id}
                    >
                        {assignee.name}
                    </ActionList.Item>
                ))}
            </ActionList>
        </SelectPanel>
    );
};

// With Clear Selection, which gives up every pick without closing the panel
export const WithClearSelection: StoryFn<typeof SelectPanel> = () => {
    const { selected, setSelected, toggle } = useLabelSelection();

    return (
        <SelectPanel title="Select labels" onClearSelection={() => setSelected([])}>
            <SelectPanel.Button>Assign label</SelectPanel.Button>

            <ActionList>
                {labels.map((label) => (
                    <ActionList.Item
                        key={label.id}
                        onSelect={() => toggle(label.id)}
                        selected={selected.includes(label.id)}
                    >
                        {label.name}
                    </ActionList.Item>
                ))}
            </ActionList>

            <SelectPanel.Footer />
        </SelectPanel>
    );
};

// With Groups, which collect the items under headings of their own
export const WithGroups: StoryFn<typeof SelectPanel> = () => {
    const { selected, toggle } = useLabelSelection();

    return (
        <SelectPanel title="Select labels">
            <SelectPanel.Button>Assign label</SelectPanel.Button>

            <ActionList>
                <ActionList.Group>
                    <ActionList.GroupHeading>Type</ActionList.GroupHeading>
                    {labels.slice(0, 3).map((label) => (
                        <ActionList.Item
                            key={label.id}
                            onSelect={() => toggle(label.id)}
                            selected={selected.includes(label.id)}
                        >
                            {label.name}
                        </ActionList.Item>
                    ))}
                </ActionList.Group>
                <ActionList.Group>
                    <ActionList.GroupHeading>Status</ActionList.GroupHeading>
                    {labels.slice(3).map((label) => (
                        <ActionList.Item
                            key={label.id}
                            onSelect={() => toggle(label.id)}
                            selected={selected.includes(label.id)}
                        >
                            {label.name}
                        </ActionList.Item>
                    ))}
                </ActionList.Group>
            </ActionList>

            <SelectPanel.Footer />
        </SelectPanel>
    );
};

// Modal, which stands over the middle of the page rather than against its button
export const Modal: StoryFn<typeof SelectPanel> = () => {
    const { selected, toggle } = useLabelSelection();

    return (
        <SelectPanel title="Select labels" variant="modal">
            <SelectPanel.Button>Assign label</SelectPanel.Button>

            <ActionList>
                {labels.map((label) => (
                    <ActionList.Item
                        key={label.id}
                        onSelect={() => toggle(label.id)}
                        selected={selected.includes(label.id)}
                    >
                        {label.name}
                    </ActionList.Item>
                ))}
            </ActionList>

            <SelectPanel.Footer />
        </SelectPanel>
    );
};

// Loading, which stands in place of the list while the items are fetched
export const Loading: StoryFn<typeof SelectPanel> = () => (
    <SelectPanel title="Select labels" defaultOpen>
        <SelectPanel.Button>Assign label</SelectPanel.Button>

        <SelectPanel.Header>
            <SelectPanel.SearchInput aria-label="Search labels" />
        </SelectPanel.Header>

        <SelectPanel.Loading />

        <SelectPanel.Footer />
    </SelectPanel>
);

// With A Warning, which stands above the list rather than in place of it
export const WithWarning: StoryFn<typeof SelectPanel> = () => {
    const { selected, toggle } = useLabelSelection();

    return (
        <SelectPanel title="Select labels" defaultOpen>
            <SelectPanel.Button>Assign label</SelectPanel.Button>

            <SelectPanel.Message variant="warning">
                Showing the first 6 labels of 214
            </SelectPanel.Message>

            <ActionList>
                {labels.map((label) => (
                    <ActionList.Item
                        key={label.id}
                        onSelect={() => toggle(label.id)}
                        selected={selected.includes(label.id)}
                    >
                        {label.name}
                    </ActionList.Item>
                ))}
            </ActionList>

            <SelectPanel.Footer />
        </SelectPanel>
    );
};

// With An Error, which says the list could not be fetched at all
export const WithError: StoryFn<typeof SelectPanel> = () => (
    <SelectPanel title="Select labels" defaultOpen>
        <SelectPanel.Button>Assign label</SelectPanel.Button>

        <SelectPanel.Message variant="error" size="full" title="We couldn't load the labels">
            Check your connection and try again
        </SelectPanel.Message>

        <SelectPanel.Footer />
    </SelectPanel>
);

// With Secondary Actions, which stand beside saving and cancelling
export const WithSecondaryActions: StoryFn<typeof SelectPanel> = () => {
    const { selected, toggle } = useLabelSelection();

    return (
        <SelectPanel title="Select labels">
            <SelectPanel.Button>Assign label</SelectPanel.Button>

            <ActionList>
                {labels.map((label) => (
                    <ActionList.Item
                        key={label.id}
                        onSelect={() => toggle(label.id)}
                        selected={selected.includes(label.id)}
                    >
                        {label.name}
                    </ActionList.Item>
                ))}
            </ActionList>

            <SelectPanel.Footer>
                <SelectPanel.SecondaryAction variant="link" href="#labels">
                    Edit labels
                </SelectPanel.SecondaryAction>
            </SelectPanel.Footer>
        </SelectPanel>
    );
};

// With A Back Button, for a panel that was opened from another one
export const WithBackButton: StoryFn<typeof SelectPanel> = () => {
    const { selected, toggle } = useLabelSelection();

    return (
        <SelectPanel title="Select labels" defaultOpen>
            <SelectPanel.Button>Assign label</SelectPanel.Button>

            <SelectPanel.Header onBack={() => {}}>
                <SelectPanel.SearchInput aria-label="Search labels" />
            </SelectPanel.Header>

            <ActionList>
                {labels.map((label) => (
                    <ActionList.Item
                        key={label.id}
                        onSelect={() => toggle(label.id)}
                        selected={selected.includes(label.id)}
                    >
                        {label.name}
                    </ActionList.Item>
                ))}
            </ActionList>

            <SelectPanel.Footer />
        </SelectPanel>
    );
};

// Inside A Form Control, which names the button that opens the panel
export const InsideFormControl: StoryFn<typeof SelectPanel> = () => {
    const { selected, toggle } = useLabelSelection();

    return (
        <FormControl>
            <FormControl.Label>Labels</FormControl.Label>
            <SelectPanel title="Select labels">
                <SelectPanel.Button>Assign label</SelectPanel.Button>

                <ActionList>
                    {labels.map((label) => (
                        <ActionList.Item
                            key={label.id}
                            onSelect={() => toggle(label.id)}
                            selected={selected.includes(label.id)}
                        >
                            {label.name}
                        </ActionList.Item>
                    ))}
                </ActionList>

                <SelectPanel.Footer />
            </SelectPanel>
            <FormControl.Caption>Labels organise issues and pull requests</FormControl.Caption>
        </FormControl>
    );
};

// Controlled, where the caller holds whether the panel is open
export const Controlled: StoryFn<typeof SelectPanel> = () => {
    const { selected, toggle } = useLabelSelection();
    const [open, setOpen] = React.useState(false);

    return (
        <SelectPanel
            title="Select labels"
            open={open}
            onCancel={() => setOpen(false)}
            onSubmit={() => setOpen(false)}
        >
            <SelectPanel.Button onClick={() => setOpen(!open)}>Assign label</SelectPanel.Button>

            <ActionList>
                {labels.map((label) => (
                    <ActionList.Item
                        key={label.id}
                        onSelect={() => toggle(label.id)}
                        selected={selected.includes(label.id)}
                    >
                        {label.name}
                    </ActionList.Item>
                ))}
            </ActionList>

            <SelectPanel.Footer />
        </SelectPanel>
    );
};
