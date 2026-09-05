import * as React from "react";
import { AddRegular, DocumentRegular, SettingsRegular } from "@gamecrafters/base-ui-icons";
import {
    Button,
    CommandPalette as CommandPaletteComponent,
    Heading,
    KeybindingHint,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // The panel is held to the width a palette is reached at rather than run across the card. It
    // is the same width the library's own stories give it, so what is read here and what is read
    // there are the same size
    frame: "w-[var(--overlay-width-large)] max-w-full",
    // A row inside an item, for an item drawn from more than words. The name takes whatever room
    // is left between the icon and whatever stands at the end
    row: "flex w-full items-center gap-[var(--base-size-8)]",
    icon: "size-[var(--base-size-16)] shrink-0 text-foreground-muted",
    trailing: "ms-auto",
};

// What most of the examples are drawn from. The keywords are the other words an item can be found
// under, which is most of what makes a palette worth typing at rather than reading down
const commands = [
    { name: "Dashboard", keywords: ["home", "overview"] },
    { name: "Projects", keywords: ["work"] },
    { name: "Settings", keywords: ["preferences", "config"] },
];

const actions = [
    { name: "New project", keywords: ["add", "make", "create"] },
    { name: "Invite a teammate", keywords: ["ask", "share"] },
];

// More than the panel can hold at once, which is the state a palette is usually reached in: there
// is too much to go looking through, so it is typed at or run down instead
const files = Array.from({ length: 40 }, (_, index) => `src/components/Component${index + 1}.tsx`);

// What the examples have to have in hand before they can be drawn, written a line to the thing it
// settles so that an example takes only the lines it actually reaches for
const commandsSetup = `const commands = [
    { name: "Dashboard", keywords: ["home", "overview"] },
    { name: "Projects", keywords: ["work"] },
    { name: "Settings", keywords: ["preferences", "config"] },
];

const actions = [
    { name: "New project", keywords: ["add", "make", "create"] },
    { name: "Invite a teammate", keywords: ["ask", "share"] },
];`;

const filesSetup = `const files = Array.from(
    { length: 40 },
    (_, index) => \`src/components/Component\${index + 1}.tsx\`,
);`;

// One row of the list, written once and read out into each example, since what the examples are
// about is the palette rather than what is listed in it
const commandItem = ({ name, keywords }: { name: string; keywords: string[] }) => (
    <CommandPaletteComponent.Item key={name} keywords={keywords}>
        {name}
    </CommandPaletteComponent.Item>
);

// The plainest palette there is, and the whole of it: a field to type at and a list under it,
// broken into runs with names of their own. An item is known by the text it is written with, so
// nothing has to be said twice, and the keywords are the other words it can be found under.
//
// The width it is held to is the page's own furniture, as the card around it is, so the listing
// beneath is of the palette alone: standing in an application, it fills whatever it was put in.
//
// The page and the component it is about are both called CommandPalette, so the component is
// brought in under a name saying which of the two it is. The listing beneath says CommandPalette,
// as an application importing it would
const defaultPreview = (
    <CommandPaletteComponent className={classes.frame}>
        <CommandPaletteComponent.Input />
        <CommandPaletteComponent.List>
            <CommandPaletteComponent.Empty />
            <CommandPaletteComponent.Group heading="Pages">
                {commands.map(commandItem)}
            </CommandPaletteComponent.Group>
            <CommandPaletteComponent.Separator />
            <CommandPaletteComponent.Group heading="Actions">
                {actions.map(commandItem)}
            </CommandPaletteComponent.Group>
        </CommandPaletteComponent.List>
    </CommandPaletteComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<CommandPalette>
    <CommandPalette.Input />
    <CommandPalette.List>
        <CommandPalette.Empty />
        <CommandPalette.Group heading="Pages">
            {commands.map((command) => (
                <CommandPalette.Item key={command.name} keywords={command.keywords}>
                    {command.name}
                </CommandPalette.Item>
            ))}
        </CommandPalette.Group>
        <CommandPalette.Separator />
        <CommandPalette.Group heading="Actions">
            {actions.map((action) => (
                <CommandPalette.Item key={action.name} keywords={action.keywords}>
                    {action.name}
                </CommandPalette.Item>
            ))}
        </CommandPalette.Group>
    </CommandPalette.List>
</CommandPalette>`;

// The palette brought out over the page, which is how one is usually reached: from a key pressed
// anywhere rather than from something on the page that has to be found first. It takes focus as it
// opens, with the field the first thing that can hold it, and hands focus back once it closes.
//
// What was picked is read back beside the button, since a palette that only closes says nothing
// about what it did
const DialogPreview = () => {
    const [open, setOpen] = React.useState(false);
    const [picked, setPicked] = React.useState("");

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setOpen((current) => !current);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <Stack gap="condensed" align="start">
            <Button onClick={() => setOpen(true)}>
                Open the palette <KeybindingHint keys="Mod+K" />
            </Button>
            <Text>{picked === "" ? "Nothing picked yet" : `Picked ${picked}`}</Text>
            <CommandPaletteComponent.Dialog
                open={open}
                onOpenChange={setOpen}
                onSelect={(value) => {
                    setPicked(value);
                    setOpen(false);
                }}
            >
                <CommandPaletteComponent.Input />
                <CommandPaletteComponent.List>
                    <CommandPaletteComponent.Empty />
                    <CommandPaletteComponent.Group heading="Pages">
                        {commands.map(commandItem)}
                    </CommandPaletteComponent.Group>
                </CommandPaletteComponent.List>
            </CommandPaletteComponent.Dialog>
        </Stack>
    );
};

const dialogSetup = `${commandsSetup}

const [open, setOpen] = React.useState(false);
const [picked, setPicked] = React.useState("");

// The palette answers to a key from anywhere on the page, which is the whole point of one
React.useEffect(() => {
    const handleKeyDown = (event) => {
        if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            setOpen((current) => !current);
        }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
        document.removeEventListener("keydown", handleKeyDown);
    };
}, []);`;

const dialogCode = `<Stack gap="condensed" align="start">
    <Button onClick={() => setOpen(true)}>
        Open the palette <KeybindingHint keys="Mod+K" />
    </Button>
    <Text>{picked === "" ? "Nothing picked yet" : \`Picked \${picked}\`}</Text>
    <CommandPalette.Dialog
        open={open}
        onOpenChange={setOpen}
        onSelect={(value) => {
            setPicked(value);
            setOpen(false);
        }}
    >
        <CommandPalette.Input />
        <CommandPalette.List>
            <CommandPalette.Empty />
            <CommandPalette.Group heading="Pages">
                {commands.map((command) => (
                    <CommandPalette.Item key={command.name} keywords={command.keywords}>
                        {command.name}
                    </CommandPalette.Item>
                ))}
            </CommandPalette.Group>
        </CommandPalette.List>
    </CommandPalette.Dialog>
</Stack>`;

// Items drawn from more than words: an icon before the name, and the key that would run it after.
// The text an item is written with is no longer only its name, so the name is given outright and
// the item is found by that rather than by everything it is drawn from
const visualsPreview = (
    <CommandPaletteComponent className={classes.frame}>
        <CommandPaletteComponent.Input />
        <CommandPaletteComponent.List>
            <CommandPaletteComponent.Empty />
            <CommandPaletteComponent.Item value="Dashboard" keywords={["home", "overview"]}>
                <span className={classes.row}>
                    <DocumentRegular className={classes.icon} />
                    Dashboard
                    <KeybindingHint keys="Mod+1" className={classes.trailing} />
                </span>
            </CommandPaletteComponent.Item>
            <CommandPaletteComponent.Item value="Settings" keywords={["preferences", "config"]}>
                <span className={classes.row}>
                    <SettingsRegular className={classes.icon} />
                    Settings
                    <KeybindingHint keys="Mod+," className={classes.trailing} />
                </span>
            </CommandPaletteComponent.Item>
            <CommandPaletteComponent.Item value="New project" keywords={["add", "make"]}>
                <span className={classes.row}>
                    <AddRegular className={classes.icon} />
                    New project
                    <KeybindingHint keys="Mod+N" className={classes.trailing} />
                </span>
            </CommandPaletteComponent.Item>
        </CommandPaletteComponent.List>
    </CommandPaletteComponent>
);

const visualsSetup = `const row = "flex w-full items-center gap-[var(--base-size-8)]";
const icon = "size-[var(--base-size-16)] shrink-0 text-foreground-muted";
const trailing = "ms-auto";`;

const visualsCode = `<CommandPalette>
    <CommandPalette.Input />
    <CommandPalette.List>
        <CommandPalette.Empty />
        <CommandPalette.Item value="Dashboard" keywords={["home", "overview"]}>
            <span className={row}>
                <DocumentRegular className={icon} />
                Dashboard
                <KeybindingHint keys="Mod+1" className={trailing} />
            </span>
        </CommandPalette.Item>
        <CommandPalette.Item value="Settings" keywords={["preferences", "config"]}>
            <span className={row}>
                <SettingsRegular className={icon} />
                Settings
                <KeybindingHint keys="Mod+," className={trailing} />
            </span>
        </CommandPalette.Item>
        <CommandPalette.Item value="New project" keywords={["add", "make"]}>
            <span className={row}>
                <AddRegular className={icon} />
                New project
                <KeybindingHint keys="Mod+N" className={trailing} />
            </span>
        </CommandPalette.Item>
    </CommandPalette.List>
</CommandPalette>`;

// Items that cannot be picked. They are still shown and still read out, so a reader can see what
// is there and why it is out of reach, and the arrows step over them rather than stopping on
// something there is nothing to do with
const disabledPreview = (
    <CommandPaletteComponent className={classes.frame}>
        <CommandPaletteComponent.Input />
        <CommandPaletteComponent.List>
            <CommandPaletteComponent.Empty />
            <CommandPaletteComponent.Item>New project</CommandPaletteComponent.Item>
            <CommandPaletteComponent.Item disabled>
                Delete this project
            </CommandPaletteComponent.Item>
            <CommandPaletteComponent.Item>Invite a teammate</CommandPaletteComponent.Item>
        </CommandPaletteComponent.List>
    </CommandPaletteComponent>
);

const disabledCode = `<CommandPalette>
    <CommandPalette.Input />
    <CommandPalette.List>
        <CommandPalette.Empty />
        <CommandPalette.Item>New project</CommandPalette.Item>
        <CommandPalette.Item disabled>Delete this project</CommandPalette.Item>
        <CommandPalette.Item>Invite a teammate</CommandPalette.Item>
    </CommandPalette.List>
</CommandPalette>`;

// More than can be seen at once, which is the state a palette is usually reached in. The list
// gives way at the height it was allowed rather than running the panel off the screen, and
// whatever is in hand is brought back into view as the arrows carry it past either edge
const scrollingPreview = (
    <CommandPaletteComponent className={classes.frame}>
        <CommandPaletteComponent.Input placeholder="Hold the down arrow to run past what is showing" />
        <CommandPaletteComponent.List>
            <CommandPaletteComponent.Empty />
            <CommandPaletteComponent.Group heading="Files">
                {files.map((file) => (
                    <CommandPaletteComponent.Item key={file}>{file}</CommandPaletteComponent.Item>
                ))}
            </CommandPaletteComponent.Group>
        </CommandPaletteComponent.List>
    </CommandPaletteComponent>
);

const scrollingCode = `<CommandPalette>
    <CommandPalette.Input placeholder="Hold the down arrow to run past what is showing" />
    <CommandPalette.List>
        <CommandPalette.Empty />
        <CommandPalette.Group heading="Files">
            {files.map((file) => (
                <CommandPalette.Item key={file}>{file}</CommandPalette.Item>
            ))}
        </CommandPalette.Group>
    </CommandPalette.List>
</CommandPalette>`;

// The list narrowed by whoever is drawing it rather than by the palette, for items that come from
// somewhere the palette cannot see. Nothing is filtered away here: what arrives is what is shown,
// and what was typed is handed out for the caller to answer
const FilteredElsewherePreview = () => {
    const [search, setSearch] = React.useState("");

    const matches = commands.filter((command) =>
        command.name.toLowerCase().includes(search.trim().toLowerCase()),
    );

    return (
        <CommandPaletteComponent
            shouldFilter={false}
            search={search}
            onSearchChange={setSearch}
            className={classes.frame}
        >
            <CommandPaletteComponent.Input placeholder="Narrowed against the list itself" />
            <CommandPaletteComponent.List>
                <CommandPaletteComponent.Empty>Nothing came back</CommandPaletteComponent.Empty>
                {matches.map((command) => (
                    <CommandPaletteComponent.Item key={command.name}>
                        {command.name}
                    </CommandPaletteComponent.Item>
                ))}
            </CommandPaletteComponent.List>
        </CommandPaletteComponent>
    );
};

const filteredElsewhereSetup = `${commandsSetup}

const [search, setSearch] = React.useState("");

const matches = commands.filter((command) =>
    command.name.toLowerCase().includes(search.trim().toLowerCase()),
);`;

const filteredElsewhereCode = `<CommandPalette shouldFilter={false} search={search} onSearchChange={setSearch}>
    <CommandPalette.Input placeholder="Narrowed against the list itself" />
    <CommandPalette.List>
        <CommandPalette.Empty>Nothing came back</CommandPalette.Empty>
        {matches.map((command) => (
            <CommandPalette.Item key={command.name}>{command.name}</CommandPalette.Item>
        ))}
    </CommandPalette.List>
</CommandPalette>`;

// Waiting on what is still coming, which stands in place of the list rather than beside it, so
// nothing is read out as being there until it is
const LoadingPreview = () => {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const timeout = window.setTimeout(() => setLoading(false), 2000);

        return () => {
            window.clearTimeout(timeout);
        };
    }, []);

    return (
        <CommandPaletteComponent className={classes.frame}>
            <CommandPaletteComponent.Input />
            <CommandPaletteComponent.List>
                {loading ? <CommandPaletteComponent.Loading /> : null}
                {loading ? null : commands.map(commandItem)}
            </CommandPaletteComponent.List>
        </CommandPaletteComponent>
    );
};

const loadingSetup = `${commandsSetup}

const [loading, setLoading] = React.useState(true);

React.useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 2000);

    return () => {
        window.clearTimeout(timeout);
    };
}, []);`;

const loadingCode = `<CommandPalette>
    <CommandPalette.Input />
    <CommandPalette.List>
        {loading ? <CommandPalette.Loading /> : null}
        {loading
            ? null
            : commands.map((command) => (
                  <CommandPalette.Item key={command.name} keywords={command.keywords}>
                      {command.name}
                  </CommandPalette.Item>
              ))}
    </CommandPalette.List>
</CommandPalette>`;

// Coming round at either end, so that running past the last item lands back on the first and the
// up arrow from the top starts at the end
const loopPreview = (
    <CommandPaletteComponent loop className={classes.frame}>
        <CommandPaletteComponent.Input placeholder="Press the up arrow to start at the end" />
        <CommandPaletteComponent.List>
            <CommandPaletteComponent.Empty />
            {commands.map(commandItem)}
        </CommandPaletteComponent.List>
    </CommandPaletteComponent>
);

const loopCode = `<CommandPalette loop>
    <CommandPalette.Input placeholder="Press the up arrow to start at the end" />
    <CommandPalette.List>
        <CommandPalette.Empty />
        {commands.map((command) => (
            <CommandPalette.Item key={command.name} keywords={command.keywords}>
                {command.name}
            </CommandPalette.Item>
        ))}
    </CommandPalette.List>
</CommandPalette>`;

// The palette as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: commandsSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Brought out over the page",
        description:
            "How a palette is usually reached: from a key pressed anywhere rather than from something that has to be found first. It takes focus as it opens, with the field the first thing that can hold it, and hands focus back to whatever had it once it closes. Escape closes it, and so does a press that both starts and ends off the panel.",
        setup: dialogSetup,
        preview: <DialogPreview />,
        code: dialogCode,
    },
    {
        name: "Items drawn from more than words",
        description:
            "An icon before the name and the key that would run it after. The text the item is written with is no longer only its name, so the name is given outright and the item is found by that rather than by everything it is drawn from.",
        setup: visualsSetup,
        preview: visualsPreview,
        code: visualsCode,
    },
    {
        name: "Items that cannot be picked",
        description:
            "An item that is still shown and still read out, so a reader can see what is there and why it is out of reach. The arrows step over it rather than stopping on something there is nothing to do with.",
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "More than can be seen at once",
        description:
            "The list gives way at the height it was allowed rather than running the panel off the screen, and whatever is in hand is brought back into view as the arrows carry it past either edge of what is showing. How tall it is allowed to get before it scrolls is the caller's to set.",
        setup: filesSetup,
        preview: scrollingPreview,
        code: scrollingCode,
    },
    {
        name: "Narrowed somewhere else",
        description:
            "The list narrowed by whoever is drawing it rather than by the palette, for items that come from somewhere the palette cannot see. Nothing is filtered away: what arrives is what is shown, and what was typed is handed out for the caller to answer.",
        setup: filteredElsewhereSetup,
        preview: <FilteredElsewherePreview />,
        code: filteredElsewhereCode,
    },
    {
        name: "Waiting on what is still coming",
        description:
            "What stands in place of the list while the items are on their way, rather than beside it, so nothing is read out as being there until it is. A screen reader is told the palette is waiting.",
        setup: loadingSetup,
        preview: <LoadingPreview />,
        code: loadingCode,
    },
    {
        name: "Coming round at either end",
        description:
            "Running past the last item lands back on the first, and the up arrow from the top starts at the end. Left to itself the list stops at either end rather than coming round.",
        setup: commandsSetup,
        preview: loopPreview,
        code: loopCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the palette and its parts take, under the part that takes it.
//
// The palette comes first, since what has been typed, what is in hand and how the list is narrowed
// are all settled there and every part reads them. The parts follow in the order they are written:
// what is brought out over the page, then the field, the list, and everything down to the row
// inside it
const groups: ComponentPropGroup[] = [
    {
        name: "CommandPalette",
        props: [
            {
                name: "search",
                type: "string",
                description:
                    "What has been typed, where the state is held by whoever is drawing the palette. It is what a caller narrowing the list themselves reads",
            },
            {
                name: "defaultSearch",
                type: "string",
                default: '""',
                description:
                    "What has been typed to start with, for a palette keeping its own state",
            },
            {
                name: "onSearchChange",
                type: "(search: string) => void",
                description: "Called with what has been typed whenever it changes",
            },
            {
                name: "value",
                type: "string",
                description:
                    "The item in hand, which Enter picks and the field points at, where the caller holds the state",
            },
            {
                name: "defaultValue",
                type: "string",
                default: '""',
                description:
                    "The item in hand to start with. Left out, the palette settles it on the best answer to what has been typed",
            },
            {
                name: "onValueChange",
                type: "(value: string) => void",
                description: "Called with the item in hand whenever it changes",
            },
            {
                name: "onSelect",
                type: "(value: string) => void",
                description: "Called with the value of the item that was picked",
            },
            {
                name: "filter",
                type: "(value: string, search: string, keywords: string[]) => number",
                default: "commandScore",
                description:
                    "Stands in for the ranking the palette does itself. It answers with how well an item matches, from 1 for an outright match down to 0 for none at all, and an item worth nothing is left out of the list",
            },
            {
                name: "shouldFilter",
                type: "boolean",
                default: "true",
                description:
                    "Whether the palette narrows the list at all. Turned off, the items are left exactly as they were written, which is what a caller narrowing them against something the palette cannot see wants",
            },
            {
                name: "loop",
                type: "boolean",
                default: "false",
                description:
                    "Whether moving off either end of the list comes round to the other rather than stopping",
            },
            {
                name: "label",
                type: "string",
                default: '"Command palette"',
                description:
                    "Names the palette to a screen reader. There is nothing on the page naming it, since a palette is reached from a key rather than from something standing beside it",
            },
            styling,
        ],
    },
    {
        name: "CommandPalette.Dialog",
        props: [
            {
                name: "open",
                type: "boolean",
                required: true,
                description:
                    "Whether the palette is showing. It is always the caller's to hold, since what opens a palette is a key pressed somewhere else on the page",
            },
            {
                name: "onOpenChange",
                type: "(open: boolean) => void",
                required: true,
                description:
                    "Called with whether the palette is showing whenever it is dismissed by Escape or by a press landing off the panel",
            },
            {
                name: "returnFocusRef",
                type: "React.RefObject<HTMLElement | null>",
                description:
                    "Takes focus once the palette closes, in place of whatever held it beforehand",
            },
            {
                name: "overlayClassName",
                type: "string",
                description: "Class name for the ground the panel is drawn over",
            },
            styling,
        ],
    },
    {
        name: "CommandPalette.Input",
        props: [
            {
                name: "placeholder",
                type: "string",
                default: '"Type a command or search"',
                description: "Stands in the field until something has been typed into it",
            },
            styling,
        ],
    },
    {
        name: "CommandPalette.List",
        props: [
            {
                name: "maxHeight",
                type: "number",
                default: "400",
                description:
                    "How tall the list is allowed to get, in pixels, before it scrolls rather than running the panel off the screen",
            },
            styling,
        ],
    },
    {
        name: "CommandPalette.Group",
        props: [
            {
                name: "heading",
                type: "React.ReactNode",
                description: "Names the run of items below it",
            },
            {
                name: "forceMount",
                type: "boolean",
                default: "false",
                description:
                    "Keeps the group standing even where the filter has left it with nothing in it. Left out, a group with nothing left to head stands down along with its heading",
            },
            styling,
        ],
    },
    {
        name: "CommandPalette.Item",
        props: [
            {
                name: "value",
                type: "string",
                description:
                    "What the item is known by, which is what is handed back when it is picked and what the filter reads. Taken from the text the item is written with where it is left out, so it is only given where the item is drawn from more than words",
            },
            {
                name: "keywords",
                type: "string[]",
                description:
                    "Other words the item can be found under, so that something named one thing is still reached by what a reader would have called it",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the item being picked. It is still shown and still read out, and the arrows step over it",
            },
            {
                name: "forceMount",
                type: "boolean",
                default: "false",
                description:
                    "Keeps the item showing whatever was typed, for one the list is not to narrow away",
            },
            {
                name: "onSelect",
                type: "(value: string) => void",
                description: "Called with the item's own value when it is picked",
            },
            styling,
        ],
    },
    {
        name: "CommandPalette.Separator",
        props: [
            {
                name: "alwaysRender",
                type: "boolean",
                default: "false",
                description:
                    "Keeps the line standing while something has been typed. Left out it stands down, since a line between runs says nothing once the runs it divided have been narrowed away",
            },
            styling,
        ],
    },
    {
        name: "CommandPalette.Empty",
        props: [styling],
    },
    {
        name: "CommandPalette.Loading",
        props: [
            {
                name: "label",
                type: "string",
                default: '"Loading"',
                description: "What a screen reader is told while the palette is waiting",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the palette is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const CommandPalette = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                CommandPalette
            </Heading>
            <Text as="p" size="large">
                Everything an application can do, reached by typing at it rather than by going
                looking for it. What is typed is ranked against every item rather than merely
                matched, so the best answer comes to the top and is taken by pressing Enter. An item
                can be given other words it is found under, so something named one thing is still
                reached by what a reader would have called it. Every part is the caller's to place:
                the palette itself only says which of the items are still worth showing, and in what
                order.
            </Text>
        </Stack>
        <ComponentExamples component="CommandPalette" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default CommandPalette;
