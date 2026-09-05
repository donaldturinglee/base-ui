import * as React from "react";
import { PersonRegular, TagRegular } from "@gamecrafters/base-ui-icons";
import {
    Autocomplete as AutocompleteComponent,
    Heading,
    Stack,
    Text,
    Token,
} from "@gamecrafters/base-ui/react";
import type { AutocompleteItem } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // The field is held to a column rather than run across the card. The list stands under the
    // whole of the field, so a field the width of the page would take the list with it
    field: "w-[var(--overlay-width-small)]",
    // A box of the caller's own for the list to stand against, in place of the field inside it
    anchor: "inline-flex p-[var(--base-size-8)] rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-border-default",
    // A list drawn where it stands rather than on a surface over the page has nothing around it to
    // be told apart from, so it is given a box of its own
    inlineMenu:
        "w-[var(--overlay-width-small)] rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-border-default",
};

// The options every example but one is drawn from. They are the ones the library's own stories
// use, and several of them begin the same way, which is what a field completing what is typed is
// worth reading against
const topics: AutocompleteItem[] = [
    { id: "css", text: "css" },
    { id: "css-in-js", text: "css-in-js" },
    { id: "design-systems", text: "design-systems" },
    { id: "javascript", text: "javascript" },
    { id: "react", text: "react" },
    { id: "typescript", text: "typescript" },
];

// The secondary text stands below the label rather than beside it, so that every line of it begins
// in the same place down the list rather than after a name of its own length
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
];

// What an example has to have in hand before it can be drawn, written a line to the thing it
// settles so that an example takes only the lines it actually reaches for
const topicsSetup = `const topics = [
    { id: "css", text: "css" },
    { id: "css-in-js", text: "css-in-js" },
    { id: "design-systems", text: "design-systems" },
    { id: "javascript", text: "javascript" },
    { id: "react", text: "react" },
    { id: "typescript", text: "typescript" },
];`;

const peopleSetup = `const people = [
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
];`;

const fieldSetup = `const field = "w-[var(--overlay-width-small)]";`;

const anchorSetup = `const anchor = "inline-flex p-[var(--base-size-8)] rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-border-default";`;

const inlineMenuSetup = `const inlineMenu = "w-[var(--overlay-width-small)] rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-border-default";`;

// What a field built the way they usually are has to have in hand: the options it completes from,
// and the column it is held to
const topicFieldSetup = `${topicsSetup}\n${fieldSetup}`;

// The three parts as they are most often put together: the field, the surface the list is drawn
// on, and the list itself. They are separate parts rather than one component drawing all three, so
// that the list can be put wherever it belongs on the page.
//
// The words above the field are a label pointed at it rather than text set down over it, and the
// list is pointed at the same words, since the field is what carries the label and a list named
// again would be named twice.
//
// The page and the component it is about are both called Autocomplete, so the component is brought
// in under a name saying which of the two it is. The listing beneath says Autocomplete, as an
// application importing it would
const defaultPreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" id="default-topic-label" htmlFor="default-topic">
            Topic
        </Text>
        <AutocompleteComponent id="default-topic">
            <AutocompleteComponent.Input
                className={classes.field}
                placeholder="Search topics"
                block
            />
            <AutocompleteComponent.Overlay>
                <AutocompleteComponent.Menu items={topics} aria-labelledby="default-topic-label" />
            </AutocompleteComponent.Overlay>
        </AutocompleteComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Stack gap="condensed" align="start">
    <Text as="label" id="default-topic-label" htmlFor="default-topic">
        Topic
    </Text>
    <Autocomplete id="default-topic">
        <Autocomplete.Input className={field} placeholder="Search topics" block />
        <Autocomplete.Overlay>
            <Autocomplete.Menu items={topics} aria-labelledby="default-topic-label" />
        </Autocomplete.Overlay>
    </Autocomplete>
</Stack>`;

// The list shown as the field is reached rather than waited for. It is what a field whose whole
// purpose is the list under it is given: a reader who arrives at it has nothing to type until they
// have seen what there is
const openOnFocusPreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" id="focus-topic-label" htmlFor="focus-topic">
            Topic
        </Text>
        <AutocompleteComponent id="focus-topic">
            <AutocompleteComponent.Input
                className={classes.field}
                placeholder="Search topics"
                block
                openOnFocus
            />
            <AutocompleteComponent.Overlay>
                <AutocompleteComponent.Menu items={topics} aria-labelledby="focus-topic-label" />
            </AutocompleteComponent.Overlay>
        </AutocompleteComponent>
    </Stack>
);

const openOnFocusCode = `<Stack gap="condensed" align="start">
    <Text as="label" id="focus-topic-label" htmlFor="focus-topic">
        Topic
    </Text>
    <Autocomplete id="focus-topic">
        <Autocomplete.Input className={field} placeholder="Search topics" block openOnFocus />
        <Autocomplete.Overlay>
            <Autocomplete.Menu items={topics} aria-labelledby="focus-topic-label" />
        </Autocomplete.Overlay>
    </Autocomplete>
</Stack>`;

// More than one option at a time. What has been picked is the caller's to keep, since the field is
// emptied after each one and has nowhere left to show it, so what was picked stands below the
// field as tokens rather than in it.
//
// The list stays showing after each one is picked, which is what tells picking several apart from
// picking one: a reader taking three options should not have to open the list three times
const PickingSeveralPreview = () => {
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    const remove = (id: string) =>
        setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));

    return (
        <Stack gap="condensed" align="start">
            <Text as="label" id="several-label" htmlFor="several">
                Topics
            </Text>
            <AutocompleteComponent id="several">
                <AutocompleteComponent.Input
                    className={classes.field}
                    placeholder="Search topics"
                    block
                />
                <AutocompleteComponent.Overlay>
                    <AutocompleteComponent.Menu
                        items={topics}
                        selectionVariant="multiple"
                        selectedItemIds={selectedIds}
                        onSelectedChange={(items) => setSelectedIds(items.map((item) => item.id))}
                        aria-labelledby="several-label"
                    />
                </AutocompleteComponent.Overlay>
            </AutocompleteComponent>
            <Stack direction="horizontal" gap="condensed" wrap="wrap">
                {selectedIds.map((id) => (
                    <Token key={id} text={id} onRemove={() => remove(id)} />
                ))}
            </Stack>
        </Stack>
    );
};

const pickingSeveralSetup = `${topicFieldSetup}

const [selectedIds, setSelectedIds] = React.useState([]);

const remove = (id) =>
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));`;

const pickingSeveralCode = `<Stack gap="condensed" align="start">
    <Text as="label" id="several-label" htmlFor="several">
        Topics
    </Text>
    <Autocomplete id="several">
        <Autocomplete.Input className={field} placeholder="Search topics" block />
        <Autocomplete.Overlay>
            <Autocomplete.Menu
                items={topics}
                selectionVariant="multiple"
                selectedItemIds={selectedIds}
                onSelectedChange={(items) => setSelectedIds(items.map((item) => item.id))}
                aria-labelledby="several-label"
            />
        </Autocomplete.Overlay>
    </Autocomplete>
    <Stack direction="horizontal" gap="condensed" wrap="wrap">
        {selectedIds.map((id) => (
            <Token key={id} text={id} onRemove={() => remove(id)} />
        ))}
    </Stack>
</Stack>`;

// An option standing for whatever has been typed, so that something the list does not hold can
// still be picked. It is drawn at the end of the list and marked as the one that adds rather than
// picks, and what it does is held beside it rather than on it, since only the option itself is
// ever drawn.
//
// What has been typed is read off the field rather than out of the list, since the option has to
// be built from it before there is anything for the list to show
const AddingAnOptionPreview = () => {
    const [typed, setTyped] = React.useState("");
    const [added, setAdded] = React.useState<string[]>([]);

    const isNew = Boolean(typed) && !topics.some((topic) => topic.text === typed);

    const addNew = isNew
        ? {
              item: { id: typed, text: `Add "${typed}"` },
              onAdd: (item: AutocompleteItem) => setAdded((current) => [...current, item.id]),
          }
        : undefined;

    return (
        <Stack gap="condensed" align="start">
            <Text as="label" id="adding-label" htmlFor="adding">
                Topic
            </Text>
            <AutocompleteComponent id="adding">
                <AutocompleteComponent.Input
                    className={classes.field}
                    placeholder="Search topics"
                    block
                    onChange={(event) => setTyped(event.currentTarget.value)}
                />
                <AutocompleteComponent.Overlay>
                    <AutocompleteComponent.Menu
                        items={topics}
                        addNewItem={addNew}
                        aria-labelledby="adding-label"
                    />
                </AutocompleteComponent.Overlay>
            </AutocompleteComponent>
            <Text size="small">Added: {added.length ? added.join(", ") : "nothing yet"}</Text>
        </Stack>
    );
};

const addingAnOptionSetup = `${topicFieldSetup}

const [typed, setTyped] = React.useState("");
const [added, setAdded] = React.useState([]);

const isNew = Boolean(typed) && !topics.some((topic) => topic.text === typed);

const addNew = isNew
    ? {
          item: { id: typed, text: \`Add "\${typed}"\` },
          onAdd: (item) => setAdded((current) => [...current, item.id]),
      }
    : undefined;`;

const addingAnOptionCode = `<Stack gap="condensed" align="start">
    <Text as="label" id="adding-label" htmlFor="adding">
        Topic
    </Text>
    <Autocomplete id="adding">
        <Autocomplete.Input
            className={field}
            placeholder="Search topics"
            block
            onChange={(event) => setTyped(event.currentTarget.value)}
        />
        <Autocomplete.Overlay>
            <Autocomplete.Menu items={topics} addNewItem={addNew} aria-labelledby="adding-label" />
        </Autocomplete.Overlay>
    </Autocomplete>
    <Text size="small">Added: {added.length ? added.join(", ") : "nothing yet"}</Text>
</Stack>`;

// How the options are narrowed, in place of the one thing the list does when it is left to itself.
// An option is kept here where any part of it matches rather than only where it begins with what
// was typed, so typing "systems" keeps design-systems, which the list on its own would have
// dropped.
//
// What has been typed is read off the field, since a filter of the caller's own is written against
// it rather than handed it
const CustomFilterPreview = () => {
    const [typed, setTyped] = React.useState("");

    return (
        <Stack gap="condensed" align="start">
            <Text as="label" id="filter-label" htmlFor="filter">
                Topic
            </Text>
            <AutocompleteComponent id="filter">
                <AutocompleteComponent.Input
                    className={classes.field}
                    placeholder="Search topics"
                    block
                    onChange={(event) => setTyped(event.currentTarget.value)}
                />
                <AutocompleteComponent.Overlay>
                    <AutocompleteComponent.Menu
                        items={topics}
                        filter={(item) =>
                            Boolean(item.text?.toLowerCase().includes(typed.toLowerCase()))
                        }
                        aria-labelledby="filter-label"
                    />
                </AutocompleteComponent.Overlay>
            </AutocompleteComponent>
        </Stack>
    );
};

const customFilterSetup = `${topicFieldSetup}

const [typed, setTyped] = React.useState("");`;

const customFilterCode = `<Stack gap="condensed" align="start">
    <Text as="label" id="filter-label" htmlFor="filter">
        Topic
    </Text>
    <Autocomplete id="filter">
        <Autocomplete.Input
            className={field}
            placeholder="Search topics"
            block
            onChange={(event) => setTyped(event.currentTarget.value)}
        />
        <Autocomplete.Overlay>
            <Autocomplete.Menu
                items={topics}
                filter={(item) => Boolean(item.text?.toLowerCase().includes(typed.toLowerCase()))}
                aria-labelledby="filter-label"
            />
        </Autocomplete.Overlay>
    </Autocomplete>
</Stack>`;

// The order the options are left in, applied once the list closes rather than while it is being
// read. Picked options are sent to the end here, which is the other way round from what the list
// does when it is left to itself.
//
// It is only ever done on close, since reordering a list a reader is reading would move an option
// out from under them as they reached for it
const CustomOrderPreview = () => {
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    const pickedLast = (itemIdA: string, itemIdB: string) => {
        const isPicked = (id: string) => selectedIds.includes(id);

        return isPicked(itemIdA) === isPicked(itemIdB) ? 0 : isPicked(itemIdA) ? 1 : -1;
    };

    return (
        <Stack gap="condensed" align="start">
            <Text as="label" id="order-label" htmlFor="order">
                Topics
            </Text>
            <AutocompleteComponent id="order">
                <AutocompleteComponent.Input
                    className={classes.field}
                    placeholder="Search topics"
                    block
                />
                <AutocompleteComponent.Overlay>
                    <AutocompleteComponent.Menu
                        items={topics}
                        selectionVariant="multiple"
                        selectedItemIds={selectedIds}
                        onSelectedChange={(items) => setSelectedIds(items.map((item) => item.id))}
                        sortOnClose={pickedLast}
                        aria-labelledby="order-label"
                    />
                </AutocompleteComponent.Overlay>
            </AutocompleteComponent>
        </Stack>
    );
};

const customOrderSetup = `${topicFieldSetup}

const [selectedIds, setSelectedIds] = React.useState([]);

const pickedLast = (itemIdA, itemIdB) => {
    const isPicked = (id) => selectedIds.includes(id);

    return isPicked(itemIdA) === isPicked(itemIdB) ? 0 : isPicked(itemIdA) ? 1 : -1;
};`;

const customOrderCode = `<Stack gap="condensed" align="start">
    <Text as="label" id="order-label" htmlFor="order">
        Topics
    </Text>
    <Autocomplete id="order">
        <Autocomplete.Input className={field} placeholder="Search topics" block />
        <Autocomplete.Overlay>
            <Autocomplete.Menu
                items={topics}
                selectionVariant="multiple"
                selectedItemIds={selectedIds}
                onSelectedChange={(items) => setSelectedIds(items.map((item) => item.id))}
                sortOnClose={pickedLast}
                aria-labelledby="order-label"
            />
        </Autocomplete.Overlay>
    </Autocomplete>
</Stack>`;

// What an option can say about itself beyond its name: a mark before it, and a line of secondary
// text under it. The list draws its options from what it is told about them rather than from
// elements it is handed, since it has to filter and complete them itself, so all of it is written
// in the options rather than around them.
//
// The secondary text stands below the name rather than beside it, so that it begins under the name
// it belongs to rather than wherever that name happens to end
const descriptionsPreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" id="people-label" htmlFor="people">
            Reviewer
        </Text>
        <AutocompleteComponent id="people">
            <AutocompleteComponent.Input
                className={classes.field}
                placeholder="Search people"
                leadingVisual={PersonRegular}
                block
                openOnFocus
            />
            <AutocompleteComponent.Overlay>
                <AutocompleteComponent.Menu items={people} aria-labelledby="people-label" />
            </AutocompleteComponent.Overlay>
        </AutocompleteComponent>
    </Stack>
);

const descriptionsCode = `<Stack gap="condensed" align="start">
    <Text as="label" id="people-label" htmlFor="people">
        Reviewer
    </Text>
    <Autocomplete id="people">
        <Autocomplete.Input
            className={field}
            placeholder="Search people"
            leadingVisual={PersonRegular}
            block
            openOnFocus
        />
        <Autocomplete.Overlay>
            <Autocomplete.Menu items={people} aria-labelledby="people-label" />
        </Autocomplete.Overlay>
    </Autocomplete>
</Stack>`;

// The list while it is still waiting for what it is to show. The options are only fetched once the
// list is opened, which is what the list reports as it opens rather than as it renders, so a
// caller loading them is not asked for them again and again
const LoadingPreview = () => {
    const [loaded, setLoaded] = React.useState<AutocompleteItem[]>([]);

    const load = (open: boolean) => {
        if (open && loaded.length === 0) {
            window.setTimeout(() => setLoaded(topics), 1500);
        }
    };

    return (
        <Stack gap="condensed" align="start">
            <Text as="label" id="loading-label" htmlFor="loading">
                Topic
            </Text>
            <AutocompleteComponent id="loading">
                <AutocompleteComponent.Input
                    className={classes.field}
                    placeholder="Search topics"
                    block
                    openOnFocus
                />
                <AutocompleteComponent.Overlay>
                    <AutocompleteComponent.Menu
                        items={loaded}
                        loading={loaded.length === 0}
                        onOpenChange={load}
                        aria-labelledby="loading-label"
                    />
                </AutocompleteComponent.Overlay>
            </AutocompleteComponent>
        </Stack>
    );
};

const loadingSetup = `${topicFieldSetup}

const [loaded, setLoaded] = React.useState([]);

const load = (open) => {
    if (open && loaded.length === 0) {
        window.setTimeout(() => setLoaded(topics), 1500);
    }
};`;

const loadingCode = `<Stack gap="condensed" align="start">
    <Text as="label" id="loading-label" htmlFor="loading">
        Topic
    </Text>
    <Autocomplete id="loading">
        <Autocomplete.Input className={field} placeholder="Search topics" block openOnFocus />
        <Autocomplete.Overlay>
            <Autocomplete.Menu
                items={loaded}
                loading={loaded.length === 0}
                onOpenChange={load}
                aria-labelledby="loading-label"
            />
        </Autocomplete.Overlay>
    </Autocomplete>
</Stack>`;

// What stands in place of the list where there is nothing left to show. The list is handed no
// options at all here, which is the same thing a filter that has matched none of them leaves
// behind
const emptyPreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" id="empty-label" htmlFor="empty">
            Topic
        </Text>
        <AutocompleteComponent id="empty">
            <AutocompleteComponent.Input
                className={classes.field}
                placeholder="Search topics"
                block
                openOnFocus
            />
            <AutocompleteComponent.Overlay>
                <AutocompleteComponent.Menu
                    items={[]}
                    emptyStateText="No topics match what you have typed"
                    aria-labelledby="empty-label"
                />
            </AutocompleteComponent.Overlay>
        </AutocompleteComponent>
    </Stack>
);

const emptyCode = `<Stack gap="condensed" align="start">
    <Text as="label" id="empty-label" htmlFor="empty">
        Topic
    </Text>
    <Autocomplete id="empty">
        <Autocomplete.Input className={field} placeholder="Search topics" block openOnFocus />
        <Autocomplete.Overlay>
            <Autocomplete.Menu
                items={[]}
                emptyStateText="No topics match what you have typed"
                aria-labelledby="empty-label"
            />
        </Autocomplete.Overlay>
    </Autocomplete>
</Stack>`;

// What the list is measured against, in place of the field it stands under. It is what a field
// standing inside a box of its own is given, so that the list is drawn to the box rather than to
// the field within it
const CustomAnchorPreview = () => {
    const anchorRef = React.useRef<HTMLDivElement>(null);

    return (
        <Stack gap="condensed" align="start">
            <Text as="label" id="anchored-label" htmlFor="anchored">
                Topic
            </Text>
            <div ref={anchorRef} className={classes.anchor}>
                <AutocompleteComponent id="anchored">
                    <AutocompleteComponent.Input
                        className={classes.field}
                        placeholder="Search topics"
                        block
                        openOnFocus
                    />
                    <AutocompleteComponent.Overlay menuAnchorRef={anchorRef}>
                        <AutocompleteComponent.Menu
                            items={topics}
                            aria-labelledby="anchored-label"
                        />
                    </AutocompleteComponent.Overlay>
                </AutocompleteComponent>
            </div>
        </Stack>
    );
};

const customAnchorSetup = `${topicFieldSetup}
${anchorSetup}

const anchorRef = React.useRef(null);`;

const customAnchorCode = `<Stack gap="condensed" align="start">
    <Text as="label" id="anchored-label" htmlFor="anchored">
        Topic
    </Text>
    <div ref={anchorRef} className={anchor}>
        <Autocomplete id="anchored">
            <Autocomplete.Input className={field} placeholder="Search topics" block openOnFocus />
            <Autocomplete.Overlay menuAnchorRef={anchorRef}>
                <Autocomplete.Menu items={topics} aria-labelledby="anchored-label" />
            </Autocomplete.Overlay>
        </Autocomplete>
    </div>
</Stack>`;

// The list drawn where it stands rather than on a surface over the page. The three parts are
// separate, so the surface is the one that can be left out: what is left is a list that belongs on
// the page, standing under its field and always showing.
//
// It carries no surface of its own, so it is given a box here to be told apart from what surrounds
// it
const inlinePreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" id="inline-label" htmlFor="inline">
            Topic
        </Text>
        <AutocompleteComponent id="inline">
            <AutocompleteComponent.Input
                className={classes.field}
                placeholder="Search topics"
                leadingVisual={TagRegular}
                block
            />
            <AutocompleteComponent.Menu
                items={topics}
                className={classes.inlineMenu}
                aria-labelledby="inline-label"
            />
        </AutocompleteComponent>
    </Stack>
);

const inlineCode = `<Stack gap="condensed" align="start">
    <Text as="label" id="inline-label" htmlFor="inline">
        Topic
    </Text>
    <Autocomplete id="inline">
        <Autocomplete.Input
            className={field}
            placeholder="Search topics"
            leadingVisual={TagRegular}
            block
        />
        <Autocomplete.Menu items={topics} className={inlineMenu} aria-labelledby="inline-label" />
    </Autocomplete>
</Stack>`;

// The field as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: topicFieldSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Opening as the field is reached",
        description:
            "The list is shown as soon as the field takes focus, rather than waiting for something to be typed, and is shown again when a reader comes back and clicks a field they have already picked from. It is what a field whose whole purpose is the list under it is given: a reader arriving at one has nothing to type until they have seen what there is.",
        setup: topicFieldSetup,
        preview: openOnFocusPreview,
        code: openOnFocusCode,
    },
    {
        name: "Picking several",
        description:
            "The field is emptied after each option is picked and the list stays showing, so a reader taking three options does not have to open the list three times. What has been picked is the caller's to keep, since the field has nowhere left to show it, which is why it stands below the field as tokens instead.",
        setup: pickingSeveralSetup,
        preview: <PickingSeveralPreview />,
        code: pickingSeveralCode,
    },
    {
        name: "Adding what is not there",
        description:
            "An option standing for whatever has been typed, drawn at the end of the list and marked as the one that adds rather than picks. What it does is held beside it rather than on it, since only the option itself is ever drawn. What has been typed is read off the field, since the option has to be built from it before there is anything for the list to show.",
        setup: addingAnOptionSetup,
        preview: <AddingAnOptionPreview />,
        code: addingAnOptionCode,
    },
    {
        name: "A filter of the caller's own",
        description:
            "How the options are narrowed, in place of keeping the ones whose text begins with what was typed. An option is kept here where any part of it matches, so typing systems keeps design-systems, which the list on its own would have dropped. The field still completes what is typed with the highlighted option, but only where that option does begin with it.",
        setup: customFilterSetup,
        preview: <CustomFilterPreview />,
        code: customFilterCode,
    },
    {
        name: "An order of the caller's own",
        description:
            "The order the options are left in, applied once the list closes rather than while it is being read. Picked options are sent to the end here, which is the other way round from the list's own order. It is only ever done on close, since reordering a list a reader is reading would move an option out from under them as they reached for it.",
        setup: customOrderSetup,
        preview: <CustomOrderPreview />,
        code: customOrderCode,
    },
    {
        name: "Options that say more about themselves",
        description:
            "What an option can say beyond its name: a mark before it, and a line of secondary text under it. The list draws its options from what it is told about them rather than from elements it is handed, since it has to filter and complete them itself, so all of it is written in the options rather than around them.",
        setup: `${peopleSetup}\n${fieldSetup}`,
        preview: descriptionsPreview,
        code: descriptionsCode,
    },
    {
        name: "Waiting on its options",
        description:
            "The list while it is still waiting for what it is to show. Whether it is open is reported as it changes rather than as it renders, so a caller fetching its options when the list opens is not asked for them again and again. Nothing is announced while it is waiting, since there is as yet nothing to say.",
        setup: loadingSetup,
        preview: <LoadingPreview />,
        code: loadingCode,
    },
    {
        name: "Nothing to show",
        description:
            "What stands in place of the list where the filter has left it with nothing. It is read out as well as shown, since a reader whose focus never leaves the field would otherwise be typing into a list they cannot see has emptied. Passing false draws nothing at all, for a field that should look no different for having matched nothing.",
        setup: fieldSetup,
        preview: emptyPreview,
        code: emptyCode,
    },
    {
        name: "Standing against something else",
        description:
            "What the list is measured against, in place of the field it stands under. It is what a field standing inside a box of its own is given, so that the list is drawn to the box rather than to the field within it. Left to itself the list stands against the whole field rather than the typing area inside it, since a field carrying a visual or an action is wider than the part that is typed into.",
        setup: customAnchorSetup,
        preview: <CustomAnchorPreview />,
        code: customAnchorCode,
    },
    {
        name: "Drawn where it stands",
        description:
            "The list on the page rather than over it. The three parts are separate, so the surface is the one that can be left out: what is left is a list standing under its field and always showing. It carries no surface of its own, so it is given a box here to be told apart from what surrounds it.",
        setup: `${topicsSetup}\n${fieldSetup}\n${inlineMenuSetup}`,
        preview: inlinePreview,
        code: inlineCode,
    },
];

// Whether one option or several can be picked from the list
const selectionVariant = '"single" | "multiple"';

// A step of the overlay width scale, the width of whatever the list holds, or the width of the
// field it stands under
const overlayWidth = '"xsmall" | "small" | "medium" | "large" | "xlarge" | "auto" | "anchor"';

// A step of the overlay height scale, or the height of whatever the list holds
const overlayHeight = '"small" | "medium" | "large" | "xlarge" | "auto"';

// How far the list grows before it scrolls within itself
const overlayMaxHeight = '"small" | "medium" | "large" | "xlarge"';

// Which edge of the anchor the list stands off
const side = '"outside-top" | "outside-right" | "outside-bottom" | "outside-left"';

// Where along that edge it lines up
const align = '"start" | "center" | "end"';

// A visual is handed over as the component to draw, or as something already built: an element, or
// plain text such as a count
const visual = "React.ElementType | React.ReactNode";

// Whether the secondary text stands beside the name or below it
const descriptionVariant = '"inline" | "block"';

// How much weight an option carries
const itemVariant = '"default" | "danger"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the field and its parts take, under the part that takes it. What the three parts
// agree on comes first, then the field they are typed into, the list they are completed from, and
// the surface it is drawn on. The shape of one option comes last, since it is what the list is
// handed rather than a part in its own right.
//
// The root declares almost nothing: what it is is the id the field and the list are tied together
// by, and everything else it does is held between them rather than asked for
const groups: ComponentPropGroup[] = [
    {
        name: "Autocomplete",
        props: [
            {
                name: "id",
                type: "string",
                description:
                    "Stands in for the id the combobox would otherwise give itself, which is what the field and the list are named and tied together by. It is worth giving where the field carries a label of its own, since the label has to point at the field by the same id",
            },
        ],
    },
    {
        name: "AutocompleteInput",
        props: [
            {
                name: "openOnFocus",
                type: "boolean",
                default: "false",
                description:
                    "Shows the list as soon as the field takes focus, rather than waiting for something to be typed, and shows it again when a field that has already been picked from is clicked. Without it the list is reached by typing, or by the arrow keys",
            },
            {
                name: "value",
                type: "string | number | readonly string[]",
                description:
                    "What the field is to hold, for a caller keeping the text themselves. It is only ever read: the field holds its own text, so that a completion can be written over what was typed and taken back off again, and it is never passed down to the element",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: "TextInput",
                description:
                    "The element or component the field is drawn as, in place of the library's text input. Whatever it is drawn as is handed everything that makes the field a combobox and has to spread it onto what it renders",
            },
        ],
    },
    {
        name: "AutocompleteMenu",
        props: [
            {
                name: "items",
                type: "AutocompleteItem[]",
                required: true,
                description:
                    "The options to pick from. They are described to the list rather than handed to it as elements, since the list filters, orders and completes them itself and cannot do any of that with elements it has only been given to draw",
            },
            {
                name: "aria-labelledby",
                type: "string",
                required: true,
                description:
                    "Names the list, by pointing at whatever names the field. The field is what carries the label, so the list is pointed at it rather than named a second time",
            },
            {
                name: "selectionVariant",
                type: selectionVariant,
                default: '"single"',
                description:
                    "Whether one option or several can be picked. Picking one closes the list; picking several empties the field and leaves the list showing, so the next option can be typed for",
            },
            {
                name: "selectedItemIds",
                type: "string[]",
                default: "[]",
                description:
                    "The ids of the options that are picked. A list nobody is holding the selection of puts the picked option's text in the field instead, which is what a field completing what is typed is for",
            },
            {
                name: "filter",
                type: "(item: AutocompleteItem, index: number) => boolean",
                description:
                    "Narrows the options against what has been typed. Without one an option is kept where its text begins with what was typed, whatever the case, which is what the field completes with. What has been typed is held back a moment before it is filtered against, so that a long list does not make typing slow",
            },
            {
                name: "sortOnClose",
                type: "(itemIdA: string, itemIdB: string) => number",
                description:
                    "Orders the options once the list closes. Without one the picked ones are brought to the top, so they are where they were left next time it opens. It is only ever applied on close, since reordering a list being read would move an option out from under the reader",
            },
            {
                name: "emptyStateText",
                type: "React.ReactNode | false",
                default: '"No selectable options"',
                description:
                    "Stands in place of the list where the filter has left it with nothing, and is read out as well as shown. False draws nothing at all, for a field that should look no different for having matched nothing",
            },
            {
                name: "addNewItem",
                type: "AutocompleteAddNewItem",
                description:
                    "An option standing for whatever has been typed, drawn at the end of the list and marked as the one that adds rather than picks. It is the option itself and what to call once it is picked, held beside each other, since only the option is ever drawn",
            },
            {
                name: "loading",
                type: "boolean",
                default: "false",
                description:
                    "Draws a spinner in place of the list, for options that are still being fetched. Nothing is announced while it is waiting, since there is as yet nothing to say",
            },
            {
                name: "onSelectedChange",
                type: "(items: AutocompleteItem[]) => void",
                description:
                    "Called with every picked option whenever one is picked or dropped, rather than with the one that changed, so a caller keeping the selection is handed it whole",
            },
            {
                name: "onOpenChange",
                type: "(open: boolean) => void",
                description:
                    "Called whenever the list opens or closes. It is reported as it changes rather than as the list renders, so a caller fetching its options on open is not asked for them again and again",
            },
            {
                name: "customScrollContainerRef",
                type: "React.RefObject<HTMLElement | null>",
                description:
                    "The box the list scrolls within, for a list drawn somewhere other than inside an overlay. The highlighted option is brought into view by scrolling this, since focus stays on the field and cannot bring it there",
            },
            styling,
        ],
    },
    {
        name: "AutocompleteOverlay",
        props: [
            {
                name: "menuAnchorRef",
                type: "React.RefObject<HTMLElement | null>",
                description:
                    "The element the list is measured against. Without one it stands against the whole field rather than the typing area inside it, since a field carrying a visual or an action is wider than the part that is typed into",
            },
            {
                name: "side",
                type: side,
                default: '"outside-bottom"',
                description:
                    "Which edge of the anchor the list stands off. It is moved to the opposite edge where the one it was asked for has no room left for it",
            },
            {
                name: "align",
                type: align,
                default: '"start"',
                description: "Where along that edge the list lines up",
            },
            {
                name: "width",
                type: overlayWidth,
                default: '"anchor"',
                description:
                    "How wide the list is drawn. Anchor is the width of the field it stands under, which is where a reader looks for the list belonging to a field, and it is measured again whenever the field changes width",
            },
            {
                name: "height",
                type: overlayHeight,
                default: '"auto"',
                description: "How tall the list is drawn, or the height of whatever it holds",
            },
            {
                name: "maxHeight",
                type: overlayMaxHeight,
                default: '"medium"',
                description:
                    "How far the list grows before it scrolls within itself, which is what keeps a long list from running off the foot of the page",
            },
            {
                name: "portalContainerName",
                type: "string",
                description:
                    "The portal container the list is rendered into, in place of the default one. The list is drawn outside the page's own tree so that nothing it stands in can clip it",
            },
            styling,
        ],
    },
    {
        name: "AutocompleteItem",
        props: [
            {
                name: "id",
                type: "string",
                required: true,
                description:
                    "Tells one option from another, and is unique within the list. The list points at an option by an id of its own built from this, so that two fields offering the same options do not both lay claim to the same element",
            },
            {
                name: "text",
                type: "string",
                description:
                    "What the option is filtered and completed by, and what is drawn as its label. An option without it is drawn but never matched, since there is nothing for what was typed to be read against",
            },
            {
                name: "description",
                type: "string",
                description: "Secondary text, which says more about the option than its name does",
            },
            {
                name: "descriptionVariant",
                type: descriptionVariant,
                default: '"inline"',
                description:
                    "Whether the secondary text stands beside the name or below it. Below is what a list of them wants, so that every line begins in the same place down the list rather than after a name of its own length",
            },
            {
                name: "leadingVisual",
                type: visual,
                description:
                    "A mark standing before the text. An option that adds what was typed is drawn with the library's own mark instead, whatever this says",
            },
            {
                name: "trailingVisual",
                type: visual,
                description:
                    "A mark or a few words standing after the text, such as a count of what the option holds",
            },
            {
                name: "variant",
                type: itemVariant,
                default: '"default"',
                description:
                    "How much weight the option carries. Danger is for an option that destroys something, and is drawn in the colour the rest of the library says as much in",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the option being picked. It is passed over by the arrow keys and left unhighlighted by the pointer rather than only refusing the press, since the highlight says what pressing Enter will take",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the field is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Autocomplete = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Autocomplete
            </Heading>
            <Text as="p" size="large">
                A field that completes what is typed into it from a list of options standing under
                it. The field, the list and the surface the list is drawn on are three parts rather
                than one, so the list can be put wherever it belongs on the page. Nothing in the
                list ever takes focus: the arrow keys move a highlight the field points at, and the
                field is left holding the caret throughout, which is why what the list is left
                holding is read out rather than left to be noticed.
            </Text>
        </Stack>
        <ComponentExamples component="Autocomplete" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Autocomplete;
