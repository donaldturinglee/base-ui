import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { PersonRegular, TagRegular } from "@gamecrafters/base-ui-icons";
import { Stack } from "../stack";
import { Text } from "../text";
import { Token } from "../token";
import { Autocomplete } from ".";
import type { AutocompleteItem } from "./Autocomplete.types";

const classes = {
    field: "w-[var(--overlay-width-small)]",
    // The field is given room below it so that the list has somewhere to stand within the
    // frame the story is drawn in
    stage: "min-h-[20rem]",
    // Stands the list against a box of the caller's own rather than against the field inside
    // it
    anchor: "inline-flex p-[var(--base-size-8)] rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-[color:var(--border-color-default)]",
    // A list drawn where it stands rather than on a surface over the page needs a box of its
    // own to be told apart from what is around it
    inlineMenu:
        "w-[var(--overlay-width-small)] rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-[color:var(--border-color-default)]",
};

const topics: AutocompleteItem[] = [
    { id: "css", text: "css" },
    { id: "css-in-js", text: "css-in-js" },
    { id: "design-systems", text: "design-systems" },
    { id: "javascript", text: "javascript" },
    { id: "react", text: "react" },
    { id: "styled-system", text: "styled-system" },
    { id: "typescript", text: "typescript" },
];

// The secondary text stands below the label rather than beside it, so that every line of it
// begins in the same place down the list rather than after a name of its own length
const people: AutocompleteItem[] = [
    {
        id: "ada",
        text: "Ada Lovelace",
        description: "Analytical engine",
        descriptionVariant: "block",
        leadingVisual: PersonRegular,
    },
    {
        id: "alan",
        text: "Alan Turing",
        description: "Computable numbers",
        descriptionVariant: "block",
        leadingVisual: PersonRegular,
    },
    {
        id: "grace",
        text: "Grace Hopper",
        description: "Compilers",
        descriptionVariant: "block",
        leadingVisual: PersonRegular,
    },
    {
        id: "katherine",
        text: "Katherine Johnson",
        description: "Orbital mechanics",
        descriptionVariant: "block",
        leadingVisual: PersonRegular,
    },
];

export default {
    title: "Components/Autocomplete/Features",
    parameters: {
        layout: "centered",
    },
};

// Opening On Focus, for a field whose whole purpose is the list under it
export const OpenOnFocus: StoryFn<typeof Autocomplete> = () => (
    <Stack gap="condensed" align="start" className={classes.stage}>
        <Text as="label" id="open-on-focus-label" htmlFor="open-on-focus">
            Topic
        </Text>
        <Autocomplete id="open-on-focus">
            <Autocomplete.Input
                className={classes.field}
                placeholder="Search topics"
                block
                openOnFocus
            />
            <Autocomplete.Overlay>
                <Autocomplete.Menu items={topics} aria-labelledby="open-on-focus-label" />
            </Autocomplete.Overlay>
        </Autocomplete>
    </Stack>
);

// Picking Several, where the field is emptied after each one and what has been picked stands
// below it
export const PickingSeveral: StoryFn<typeof Autocomplete> = () => {
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    const remove = (id: string) =>
        setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));

    return (
        <Stack gap="condensed" align="start" className={classes.stage}>
            <Text as="label" id="picking-several-label" htmlFor="picking-several">
                Topics
            </Text>
            <Autocomplete id="picking-several">
                <Autocomplete.Input className={classes.field} placeholder="Search topics" block />
                <Autocomplete.Overlay>
                    <Autocomplete.Menu
                        items={topics}
                        selectionVariant="multiple"
                        selectedItemIds={selectedIds}
                        onSelectedChange={(items) => setSelectedIds(items.map((item) => item.id))}
                        aria-labelledby="picking-several-label"
                    />
                </Autocomplete.Overlay>
            </Autocomplete>

            <Stack direction="horizontal" gap="condensed" wrap="wrap">
                {selectedIds.map((id) => (
                    <Token key={id} text={id} onRemove={() => remove(id)} />
                ))}
            </Stack>
        </Stack>
    );
};

// Adding An Option, so that something the list does not hold can still be picked
export const AddingAnOption: StoryFn<typeof Autocomplete> = () => {
    const [typed, setTyped] = React.useState("");
    const [added, setAdded] = React.useState<string[]>([]);

    const isNew = Boolean(typed) && !topics.some((topic) => topic.text === typed);

    return (
        <Stack gap="condensed" align="start" className={classes.stage}>
            <Text as="label" id="adding-an-option-label" htmlFor="adding-an-option">
                Topic
            </Text>
            <Autocomplete id="adding-an-option">
                <Autocomplete.Input
                    className={classes.field}
                    placeholder="Search topics"
                    block
                    onChange={(event) => setTyped(event.currentTarget.value)}
                />
                <Autocomplete.Overlay>
                    <Autocomplete.Menu
                        items={topics}
                        addNewItem={
                            isNew
                                ? {
                                      item: { id: typed, text: `Add "${typed}"` },
                                      onAdd: (item) => setAdded((current) => [...current, item.id]),
                                  }
                                : undefined
                        }
                        aria-labelledby="adding-an-option-label"
                    />
                </Autocomplete.Overlay>
            </Autocomplete>

            <Text size="small">Added: {added.length ? added.join(", ") : "nothing yet"}</Text>
        </Stack>
    );
};

// A Filter Of The Caller's Own, for options that are matched some other way than by what
// they begin with
export const CustomFilter: StoryFn<typeof Autocomplete> = () => {
    const [typed, setTyped] = React.useState("");

    return (
        <Stack gap="condensed" align="start" className={classes.stage}>
            <Text as="label" id="custom-filter-label" htmlFor="custom-filter">
                Topic
            </Text>
            <Autocomplete id="custom-filter">
                <Autocomplete.Input
                    className={classes.field}
                    placeholder="Search topics"
                    block
                    onChange={(event) => setTyped(event.currentTarget.value)}
                />
                <Autocomplete.Overlay>
                    <Autocomplete.Menu
                        items={topics}
                        filter={(item) =>
                            Boolean(item.text?.toLowerCase().includes(typed.toLowerCase()))
                        }
                        aria-labelledby="custom-filter-label"
                    />
                </Autocomplete.Overlay>
            </Autocomplete>

            <Text size="small">
                An option is kept where any part of it matches, rather than only its start
            </Text>
        </Stack>
    );
};

// An Order Of The Caller's Own, applied once the list closes rather than while it is being
// read
export const CustomOrderOnClose: StoryFn<typeof Autocomplete> = () => {
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    return (
        <Stack gap="condensed" align="start" className={classes.stage}>
            <Text as="label" id="custom-order-label" htmlFor="custom-order">
                Topics
            </Text>
            <Autocomplete id="custom-order">
                <Autocomplete.Input className={classes.field} placeholder="Search topics" block />
                <Autocomplete.Overlay>
                    <Autocomplete.Menu
                        items={topics}
                        selectionVariant="multiple"
                        selectedItemIds={selectedIds}
                        onSelectedChange={(items) => setSelectedIds(items.map((item) => item.id))}
                        sortOnClose={(itemIdA, itemIdB) => {
                            const isPicked = (id: string) => selectedIds.includes(id);
                            return isPicked(itemIdA) === isPicked(itemIdB)
                                ? 0
                                : isPicked(itemIdA)
                                  ? 1
                                  : -1;
                        }}
                        aria-labelledby="custom-order-label"
                    />
                </Autocomplete.Overlay>
            </Autocomplete>

            <Text size="small">Picked options are sent to the end once the list closes</Text>
        </Stack>
    );
};

// Reporting When It Opens, for a caller keeping its own count of what is showing
export const ReportingWhenItOpens: StoryFn<typeof Autocomplete> = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Stack gap="condensed" align="start" className={classes.stage}>
            <Text as="label" id="reporting-label" htmlFor="reporting">
                Topic
            </Text>
            <Autocomplete id="reporting">
                <Autocomplete.Input className={classes.field} placeholder="Search topics" block />
                <Autocomplete.Overlay>
                    <Autocomplete.Menu
                        items={topics}
                        onOpenChange={setIsOpen}
                        aria-labelledby="reporting-label"
                    />
                </Autocomplete.Overlay>
            </Autocomplete>

            <Text size="small">The list is currently {isOpen ? "open" : "closed"}</Text>
        </Stack>
    );
};

// Waiting On Its Options, which are only fetched once the list is opened
export const LoadingOptions: StoryFn<typeof Autocomplete> = () => {
    const [loaded, setLoaded] = React.useState<AutocompleteItem[]>([]);

    const load = (open: boolean) => {
        if (open && loaded.length === 0) {
            window.setTimeout(() => setLoaded(topics), 1500);
        }
    };

    return (
        <Stack gap="condensed" align="start" className={classes.stage}>
            <Text as="label" id="loading-label" htmlFor="loading">
                Topic
            </Text>
            <Autocomplete id="loading">
                <Autocomplete.Input
                    className={classes.field}
                    placeholder="Search topics"
                    block
                    openOnFocus
                />
                <Autocomplete.Overlay>
                    <Autocomplete.Menu
                        items={loaded}
                        loading={loaded.length === 0}
                        onOpenChange={load}
                        aria-labelledby="loading-label"
                    />
                </Autocomplete.Overlay>
            </Autocomplete>
        </Stack>
    );
};

// Options That Say More About Themselves, with a visual and a line of secondary text. The
// secondary text stands below the label rather than beside it, so that it begins under the
// name it belongs to rather than wherever that name happens to end
export const WithDescriptionsAndVisuals: StoryFn<typeof Autocomplete> = () => (
    <Stack gap="condensed" align="start" className={classes.stage}>
        <Text as="label" id="people-label" htmlFor="people">
            Reviewer
        </Text>
        <Autocomplete id="people">
            <Autocomplete.Input
                className={classes.field}
                placeholder="Search people"
                leadingVisual={PersonRegular}
                block
                openOnFocus
            />
            <Autocomplete.Overlay>
                <Autocomplete.Menu items={people} aria-labelledby="people-label" />
            </Autocomplete.Overlay>
        </Autocomplete>
    </Stack>
);

// Nothing To Show, where the filter has left the list with no options at all
export const NothingToShow: StoryFn<typeof Autocomplete> = () => (
    <Stack gap="condensed" align="start" className={classes.stage}>
        <Text as="label" id="nothing-label" htmlFor="nothing">
            Topic
        </Text>
        <Autocomplete id="nothing">
            <Autocomplete.Input
                className={classes.field}
                placeholder="Search topics"
                block
                openOnFocus
            />
            <Autocomplete.Overlay>
                <Autocomplete.Menu
                    items={[]}
                    emptyStateText="No topics match what you have typed"
                    aria-labelledby="nothing-label"
                />
            </Autocomplete.Overlay>
        </Autocomplete>
    </Stack>
);

// Standing Against A Box Of The Caller's Own, rather than against the field itself
export const CustomMenuAnchor: StoryFn<typeof Autocomplete> = () => {
    const anchorRef = React.useRef<HTMLDivElement>(null);

    return (
        <Stack gap="condensed" align="start" className={classes.stage}>
            <Text as="label" id="anchored-label" htmlFor="anchored">
                Topic
            </Text>
            <div ref={anchorRef} className={classes.anchor}>
                <Autocomplete id="anchored">
                    <Autocomplete.Input
                        className={classes.field}
                        placeholder="Search topics"
                        block
                        openOnFocus
                    />
                    <Autocomplete.Overlay menuAnchorRef={anchorRef}>
                        <Autocomplete.Menu items={topics} aria-labelledby="anchored-label" />
                    </Autocomplete.Overlay>
                </Autocomplete>
            </div>

            <Text size="small">
                The list stands against the bordered box rather than against the field
            </Text>
        </Stack>
    );
};

// Drawn Where It Stands, for a list that belongs on the page rather than over it
export const WithoutAnOverlay: StoryFn<typeof Autocomplete> = () => (
    <Stack gap="condensed" align="start">
        <Text as="label" id="inline-label" htmlFor="inline">
            Topic
        </Text>
        <Autocomplete id="inline">
            <Autocomplete.Input
                className={classes.field}
                placeholder="Search topics"
                leadingVisual={TagRegular}
                block
            />
            <Autocomplete.Menu
                items={topics}
                className={classes.inlineMenu}
                aria-labelledby="inline-label"
            />
        </Autocomplete>
    </Stack>
);
