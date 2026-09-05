import * as React from "react";
import {
    CheckmarkRegular,
    ClipboardPasteRegular,
    CopyRegular,
    CutRegular,
    DeleteRegular,
} from "@gamecrafters/base-ui-icons";
import {
    Button,
    ContextMenu as ContextMenuComponent,
    Heading,
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
    // The area the menu is opened from. A menu is about whatever was pressed, and an area drawn
    // with nothing in it would be nothing to press, so it is given a size and an edge saying where
    // it begins and ends. It is part of what the example is showing rather than the page's own
    // furniture, so it is written out with the listing
    area: "flex h-40 w-full max-w-[20rem] select-none items-center justify-center rounded-md border border-dashed border-border-default text-foreground-muted",
    // What the menu last said, read back beside the area it belongs to
    readout: "text-foreground-muted",
};

// What the examples have to have in hand before they can be drawn. The area is what makes the
// trigger something a reader can find and press, so it is got ready with the example rather than
// left out of it
const areaSetup = `const area =
    "flex h-40 w-full max-w-[20rem] select-none items-center justify-center rounded-md border border-dashed border-border-default text-foreground-muted";`;

// The plainest menu there is: an area to press, and the actions the press brings out. A right
// click opens it where the press landed, and a finger resting on the area does the same, so the
// menu stands in for the one the browser would otherwise have shown.
//
// The area is what the menu is about, so nothing is drawn around it: the menu belongs to the
// content rather than to anything the trigger would add to it.
//
// The page and the component it is about are both called ContextMenu, so the component is brought
// in under a name saying which of the two it is. The listing beneath says ContextMenu, as an
// application importing it would
const defaultPreview = (
    <ContextMenuComponent>
        <ContextMenuComponent.Trigger className={classes.area}>
            Right click here
        </ContextMenuComponent.Trigger>
        <ContextMenuComponent.Positioner>
            <ContextMenuComponent.Content>
                <ContextMenuComponent.Item value="cut">
                    <CutRegular />
                    Cut
                </ContextMenuComponent.Item>
                <ContextMenuComponent.Item value="copy">
                    <CopyRegular />
                    Copy
                </ContextMenuComponent.Item>
                <ContextMenuComponent.Item value="paste">
                    <ClipboardPasteRegular />
                    Paste
                </ContextMenuComponent.Item>
                <ContextMenuComponent.Separator />
                <ContextMenuComponent.Item value="delete" variant="danger">
                    <DeleteRegular />
                    Delete
                </ContextMenuComponent.Item>
            </ContextMenuComponent.Content>
        </ContextMenuComponent.Positioner>
    </ContextMenuComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<ContextMenu>
    <ContextMenu.Trigger className={area}>Right click here</ContextMenu.Trigger>
    <ContextMenu.Positioner>
        <ContextMenu.Content>
            <ContextMenu.Item value="cut">
                <CutRegular />
                Cut
            </ContextMenu.Item>
            <ContextMenu.Item value="copy">
                <CopyRegular />
                Copy
            </ContextMenu.Item>
            <ContextMenu.Item value="paste">
                <ClipboardPasteRegular />
                Paste
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item value="delete" variant="danger">
                <DeleteRegular />
                Delete
            </ContextMenu.Item>
        </ContextMenu.Content>
    </ContextMenu.Positioner>
</ContextMenu>`;

// Related items collected under a label of their own, which is what names the group to a screen
// reader as well as heading it
const groupsPreview = (
    <ContextMenuComponent>
        <ContextMenuComponent.Trigger className={classes.area}>
            Right click here
        </ContextMenuComponent.Trigger>
        <ContextMenuComponent.Positioner>
            <ContextMenuComponent.Content>
                <ContextMenuComponent.ItemGroup>
                    <ContextMenuComponent.ItemGroupLabel>
                        Clipboard
                    </ContextMenuComponent.ItemGroupLabel>
                    <ContextMenuComponent.Item value="cut">Cut</ContextMenuComponent.Item>
                    <ContextMenuComponent.Item value="copy">Copy</ContextMenuComponent.Item>
                    <ContextMenuComponent.Item value="paste">Paste</ContextMenuComponent.Item>
                </ContextMenuComponent.ItemGroup>
                <ContextMenuComponent.ItemGroup>
                    <ContextMenuComponent.ItemGroupLabel>
                        Selection
                    </ContextMenuComponent.ItemGroupLabel>
                    <ContextMenuComponent.Item value="select-all">
                        Select all
                    </ContextMenuComponent.Item>
                    <ContextMenuComponent.Item value="deselect">Deselect</ContextMenuComponent.Item>
                </ContextMenuComponent.ItemGroup>
            </ContextMenuComponent.Content>
        </ContextMenuComponent.Positioner>
    </ContextMenuComponent>
);

const groupsCode = `<ContextMenu>
    <ContextMenu.Trigger className={area}>Right click here</ContextMenu.Trigger>
    <ContextMenu.Positioner>
        <ContextMenu.Content>
            <ContextMenu.ItemGroup>
                <ContextMenu.ItemGroupLabel>Clipboard</ContextMenu.ItemGroupLabel>
                <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
                <ContextMenu.Item value="copy">Copy</ContextMenu.Item>
                <ContextMenu.Item value="paste">Paste</ContextMenu.Item>
            </ContextMenu.ItemGroup>
            <ContextMenu.ItemGroup>
                <ContextMenu.ItemGroupLabel>Selection</ContextMenu.ItemGroupLabel>
                <ContextMenu.Item value="select-all">Select all</ContextMenu.Item>
                <ContextMenu.Item value="deselect">Deselect</ContextMenu.Item>
            </ContextMenu.ItemGroup>
        </ContextMenu.Content>
    </ContextMenu.Positioner>
</ContextMenu>`;

// Items picked and put back on their own, so a menu can hold as many of them picked at once as it
// likes. The menu is left standing as each is turned over, since more than one can be picked from
// it, and the mark keeps its room whether or not it is showing so the words stay in line
const CheckboxPreview = () => {
    const [showToolbar, setShowToolbar] = React.useState(true);
    const [showStatusBar, setShowStatusBar] = React.useState(false);

    return (
        <ContextMenuComponent closeOnSelect={false}>
            <ContextMenuComponent.Trigger className={classes.area}>
                Right click here
            </ContextMenuComponent.Trigger>
            <ContextMenuComponent.Positioner>
                <ContextMenuComponent.Content>
                    <ContextMenuComponent.CheckboxItem
                        value="toolbar"
                        checked={showToolbar}
                        onCheckedChange={setShowToolbar}
                    >
                        <ContextMenuComponent.ItemIndicator>
                            <CheckmarkRegular />
                        </ContextMenuComponent.ItemIndicator>
                        <ContextMenuComponent.ItemText>Show toolbar</ContextMenuComponent.ItemText>
                    </ContextMenuComponent.CheckboxItem>
                    <ContextMenuComponent.CheckboxItem
                        value="status-bar"
                        checked={showStatusBar}
                        onCheckedChange={setShowStatusBar}
                    >
                        <ContextMenuComponent.ItemIndicator>
                            <CheckmarkRegular />
                        </ContextMenuComponent.ItemIndicator>
                        <ContextMenuComponent.ItemText>
                            Show status bar
                        </ContextMenuComponent.ItemText>
                    </ContextMenuComponent.CheckboxItem>
                </ContextMenuComponent.Content>
            </ContextMenuComponent.Positioner>
        </ContextMenuComponent>
    );
};

const checkboxSetup = `${areaSetup}

const [showToolbar, setShowToolbar] = React.useState(true);
const [showStatusBar, setShowStatusBar] = React.useState(false);`;

const checkboxCode = `<ContextMenu closeOnSelect={false}>
    <ContextMenu.Trigger className={area}>Right click here</ContextMenu.Trigger>
    <ContextMenu.Positioner>
        <ContextMenu.Content>
            <ContextMenu.CheckboxItem
                value="toolbar"
                checked={showToolbar}
                onCheckedChange={setShowToolbar}
            >
                <ContextMenu.ItemIndicator>
                    <CheckmarkRegular />
                </ContextMenu.ItemIndicator>
                <ContextMenu.ItemText>Show toolbar</ContextMenu.ItemText>
            </ContextMenu.CheckboxItem>
            <ContextMenu.CheckboxItem
                value="status-bar"
                checked={showStatusBar}
                onCheckedChange={setShowStatusBar}
            >
                <ContextMenu.ItemIndicator>
                    <CheckmarkRegular />
                </ContextMenu.ItemIndicator>
                <ContextMenu.ItemText>Show status bar</ContextMenu.ItemText>
            </ContextMenu.CheckboxItem>
        </ContextMenu.Content>
    </ContextMenu.Positioner>
</ContextMenu>`;

// A run of items of which one at a time is picked. The group holds which one, so the items inside
// it have only to say what they stand for
const RadioPreview = () => {
    const [sortBy, setSortBy] = React.useState("date");

    const options = [
        { value: "name", label: "Name" },
        { value: "date", label: "Date modified" },
        { value: "size", label: "Size" },
    ];

    return (
        <ContextMenuComponent>
            <ContextMenuComponent.Trigger className={classes.area}>
                Right click here
            </ContextMenuComponent.Trigger>
            <ContextMenuComponent.Positioner>
                <ContextMenuComponent.Content>
                    <ContextMenuComponent.RadioItemGroup value={sortBy} onValueChange={setSortBy}>
                        <ContextMenuComponent.ItemGroupLabel>
                            Sort by
                        </ContextMenuComponent.ItemGroupLabel>
                        {options.map((option) => (
                            <ContextMenuComponent.RadioItem key={option.value} value={option.value}>
                                <ContextMenuComponent.ItemIndicator>
                                    <CheckmarkRegular />
                                </ContextMenuComponent.ItemIndicator>
                                <ContextMenuComponent.ItemText>
                                    {option.label}
                                </ContextMenuComponent.ItemText>
                            </ContextMenuComponent.RadioItem>
                        ))}
                    </ContextMenuComponent.RadioItemGroup>
                </ContextMenuComponent.Content>
            </ContextMenuComponent.Positioner>
        </ContextMenuComponent>
    );
};

const radioSetup = `${areaSetup}

const options = [
    { value: "name", label: "Name" },
    { value: "date", label: "Date modified" },
    { value: "size", label: "Size" },
];

const [sortBy, setSortBy] = React.useState("date");`;

const radioCode = `<ContextMenu>
    <ContextMenu.Trigger className={area}>Right click here</ContextMenu.Trigger>
    <ContextMenu.Positioner>
        <ContextMenu.Content>
            <ContextMenu.RadioItemGroup value={sortBy} onValueChange={setSortBy}>
                <ContextMenu.ItemGroupLabel>Sort by</ContextMenu.ItemGroupLabel>
                {options.map((option) => (
                    <ContextMenu.RadioItem key={option.value} value={option.value}>
                        <ContextMenu.ItemIndicator>
                            <CheckmarkRegular />
                        </ContextMenu.ItemIndicator>
                        <ContextMenu.ItemText>{option.label}</ContextMenu.ItemText>
                    </ContextMenu.RadioItem>
                ))}
            </ContextMenu.RadioItemGroup>
        </ContextMenu.Content>
    </ContextMenu.Positioner>
</ContextMenu>`;

// Items that cannot be picked. They are still shown, so a reader can see what is there and why it
// is out of reach, and the arrows and the pointer both step over them
const disabledItemsPreview = (
    <ContextMenuComponent>
        <ContextMenuComponent.Trigger className={classes.area}>
            Right click here
        </ContextMenuComponent.Trigger>
        <ContextMenuComponent.Positioner>
            <ContextMenuComponent.Content>
                <ContextMenuComponent.Item value="cut">Cut</ContextMenuComponent.Item>
                <ContextMenuComponent.Item value="copy">Copy</ContextMenuComponent.Item>
                <ContextMenuComponent.Item value="paste" disabled>
                    Paste
                </ContextMenuComponent.Item>
                <ContextMenuComponent.Separator />
                <ContextMenuComponent.Item value="delete" variant="danger" disabled>
                    Delete
                </ContextMenuComponent.Item>
            </ContextMenuComponent.Content>
        </ContextMenuComponent.Positioner>
    </ContextMenuComponent>
);

const disabledItemsCode = `<ContextMenu>
    <ContextMenu.Trigger className={area}>Right click here</ContextMenu.Trigger>
    <ContextMenu.Positioner>
        <ContextMenu.Content>
            <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
            <ContextMenu.Item value="copy">Copy</ContextMenu.Item>
            <ContextMenu.Item value="paste" disabled>
                Paste
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item value="delete" variant="danger" disabled>
                Delete
            </ContextMenu.Item>
        </ContextMenu.Content>
    </ContextMenu.Positioner>
</ContextMenu>`;

// What the menu says was picked, whichever item it was. The value is read back beside the area,
// since a menu that only closes says nothing about what it did
const WhatWasPickedPreview = () => {
    const [picked, setPicked] = React.useState<string | null>(null);

    return (
        <Stack gap="condensed" align="start">
            <ContextMenuComponent onSelect={setPicked}>
                <ContextMenuComponent.Trigger className={classes.area}>
                    Right click here
                </ContextMenuComponent.Trigger>
                <ContextMenuComponent.Positioner>
                    <ContextMenuComponent.Content>
                        <ContextMenuComponent.Item value="cut">Cut</ContextMenuComponent.Item>
                        <ContextMenuComponent.Item value="copy">Copy</ContextMenuComponent.Item>
                        <ContextMenuComponent.Item value="paste">Paste</ContextMenuComponent.Item>
                    </ContextMenuComponent.Content>
                </ContextMenuComponent.Positioner>
            </ContextMenuComponent>
            <Text as="p" className={classes.readout}>
                {picked ? `You picked "${picked}"` : "Nothing picked yet"}
            </Text>
        </Stack>
    );
};

const whatWasPickedSetup = `${areaSetup}

const [picked, setPicked] = React.useState(null);`;

const whatWasPickedCode = `<Stack gap="condensed" align="start">
    <ContextMenu onSelect={setPicked}>
        <ContextMenu.Trigger className={area}>Right click here</ContextMenu.Trigger>
        <ContextMenu.Positioner>
            <ContextMenu.Content>
                <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
                <ContextMenu.Item value="copy">Copy</ContextMenu.Item>
                <ContextMenu.Item value="paste">Paste</ContextMenu.Item>
            </ContextMenu.Content>
        </ContextMenu.Positioner>
    </ContextMenu>
    <Text as="p">{picked ? \`You picked "\${picked}"\` : "Nothing picked yet"}</Text>
</Stack>`;

// The menu with whether it is open held by whoever is drawing it rather than by the menu. It still
// stands where it was last pressed open, since a menu opened from outside was never pressed
// anywhere and has nothing else to be measured against
const ControlledPreview = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <Stack gap="condensed" align="start">
            <ContextMenuComponent open={open} onOpenChange={setOpen}>
                <ContextMenuComponent.Trigger className={classes.area}>
                    Right click here
                </ContextMenuComponent.Trigger>
                <ContextMenuComponent.Positioner>
                    <ContextMenuComponent.Content>
                        <ContextMenuComponent.Item value="cut">Cut</ContextMenuComponent.Item>
                        <ContextMenuComponent.Item value="copy">Copy</ContextMenuComponent.Item>
                        <ContextMenuComponent.Item value="paste">Paste</ContextMenuComponent.Item>
                    </ContextMenuComponent.Content>
                </ContextMenuComponent.Positioner>
            </ContextMenuComponent>
            <Button onClick={() => setOpen((current) => !current)}>
                {open ? "Close" : "Open"} the menu
            </Button>
        </Stack>
    );
};

const controlledSetup = `${areaSetup}

const [open, setOpen] = React.useState(false);`;

const controlledCode = `<Stack gap="condensed" align="start">
    <ContextMenu open={open} onOpenChange={setOpen}>
        <ContextMenu.Trigger className={area}>Right click here</ContextMenu.Trigger>
        <ContextMenu.Positioner>
            <ContextMenu.Content>
                <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
                <ContextMenu.Item value="copy">Copy</ContextMenu.Item>
                <ContextMenu.Item value="paste">Paste</ContextMenu.Item>
            </ContextMenu.Content>
        </ContextMenu.Positioner>
    </ContextMenu>
    <Button onClick={() => setOpen((current) => !current)}>
        {open ? "Close" : "Open"} the menu
    </Button>
</Stack>`;

// A menu that has been turned off, which leaves the press to the browser and the menu it would
// have shown. It is what an area with nothing of its own to offer wants, rather than a menu with
// every item in it disabled
const disabledPreview = (
    <ContextMenuComponent disabled>
        <ContextMenuComponent.Trigger className={classes.area}>
            Right click here for the browser&rsquo;s own menu
        </ContextMenuComponent.Trigger>
        <ContextMenuComponent.Positioner>
            <ContextMenuComponent.Content>
                <ContextMenuComponent.Item value="cut">Cut</ContextMenuComponent.Item>
                <ContextMenuComponent.Item value="copy">Copy</ContextMenuComponent.Item>
            </ContextMenuComponent.Content>
        </ContextMenuComponent.Positioner>
    </ContextMenuComponent>
);

const disabledCode = `<ContextMenu disabled>
    <ContextMenu.Trigger className={area}>Right click here</ContextMenu.Trigger>
    <ContextMenu.Positioner>
        <ContextMenu.Content>
            <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
            <ContextMenu.Item value="copy">Copy</ContextMenu.Item>
        </ContextMenu.Content>
    </ContextMenu.Positioner>
</ContextMenu>`;

// The menu as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: areaSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Groups",
        description:
            "Related items collected under a label of their own, which names the group to a screen reader as well as heading it. Two groups in a row are held apart by their spacing rather than by a line, so a line is only drawn where one is meant to be read.",
        setup: areaSetup,
        preview: groupsPreview,
        code: groupsCode,
    },
    {
        name: "Items picked and put back",
        description:
            "An item that is turned over rather than run, so a menu can hold as many of them picked at once as it likes. The menu is left standing as each is turned over, since more than one can be picked from it. The mark keeps its room whether or not it is showing, so the words stay in line down the menu.",
        setup: checkboxSetup,
        preview: <CheckboxPreview />,
        code: checkboxCode,
    },
    {
        name: "One of several",
        description:
            "A run of items of which one at a time is picked. The group holds which one, so the items inside it have only to say what they stand for, and picking one tells the group rather than the menu.",
        setup: radioSetup,
        preview: <RadioPreview />,
        code: radioCode,
    },
    {
        name: "Items that cannot be picked",
        description:
            "An item that is still shown but cannot be run, so a reader can see what is there and why it is out of reach. The arrows and the pointer both step over it rather than resting on something there is nothing to do with.",
        setup: areaSetup,
        preview: disabledItemsPreview,
        code: disabledItemsCode,
    },
    {
        name: "What was picked",
        description:
            "The menu says which item was picked, by its value rather than by the words it was drawn with, so what a caller reads does not change when the wording does.",
        setup: whatWasPickedSetup,
        preview: <WhatWasPickedPreview />,
        code: whatWasPickedCode,
    },
    {
        name: "Controlled",
        description:
            "Whether the menu is open held by whoever is drawing it rather than by the menu. It still stands where it was last pressed open, since a menu opened from outside was never pressed anywhere and has nothing else to be measured against.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
    {
        name: "Turned off",
        description:
            "The press left to the browser and the menu it would have shown. It is what an area with nothing of its own to offer wants, rather than a menu with every item in it disabled.",
        setup: areaSetup,
        preview: disabledPreview,
        code: disabledCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What an item that is picked one way or another takes on top of what it is drawn with. The three
// kinds of item differ in what picking them means rather than in how they are written, so what is
// the same for all of them is named once
const value = {
    name: "value",
    type: "string",
    required: true,
    description: "What the item stands for, which is what the menu says was picked",
};

const valueText = {
    name: "valueText",
    type: "string",
    description:
        "The words the item is found by when the reader types, where the text it is drawn with does not say. An item drawn from more than words needs this, since what it reads as is no longer only its name",
};

const itemDisabled = {
    name: "disabled",
    type: "boolean",
    default: "false",
    description:
        "Stops the item being picked. It is still shown, so a reader can see what is there, and the arrows and the pointer step over it",
};

const itemCloseOnSelect = {
    name: "closeOnSelect",
    type: "boolean",
    description:
        "Whether picking this item closes the menu, in place of what the menu says. Left out, the menu decides",
};

// Every prop the menu and its parts take, under the part that takes it.
//
// The menu comes first, since whether it is open and everything about how it is read are settled
// there and every part reads them. The parts follow in the order they are written: the area the
// menu is opened from, where it stands, the menu itself, then the kinds of item and the parts an
// item is drawn from
const groups: ComponentPropGroup[] = [
    {
        name: "ContextMenu",
        props: [
            {
                name: "open",
                type: "boolean",
                description:
                    "Whether the menu is open, where the state is held by whoever is drawing it. A menu opened this way stands where it was last pressed open, and at the top left corner until it has been",
            },
            {
                name: "defaultOpen",
                type: "boolean",
                default: "false",
                description:
                    "Opens the menu as it is first drawn, for a menu keeping its own state",
            },
            {
                name: "onOpenChange",
                type: "(open: boolean) => void",
                description: "Called with whether the menu is open whenever that changes",
            },
            {
                name: "onSelect",
                type: "(value: string) => void",
                description:
                    "Called with the value of whichever item is picked, by pointer or by key",
            },
            {
                name: "closeOnSelect",
                type: "boolean",
                default: "true",
                description:
                    "Whether picking an item closes the menu. A menu whose items are turned over rather than run wants this off, and an item can say otherwise for itself",
            },
            {
                name: "loopFocus",
                type: "boolean",
                default: "false",
                description:
                    "Whether the arrow keys come round from the last item to the first, and back again, rather than stopping at either end",
            },
            {
                name: "typeahead",
                type: "boolean",
                default: "true",
                description:
                    "Whether typing moves the reader to the item that starts with what they typed. The same letter pressed again walks on to the next item starting with it",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Leaves the press alone, so the browser answers it with the menu it would have shown. It is what an area with nothing of its own to offer wants",
            },
            {
                name: "portalContainerName",
                type: "string",
                description:
                    "Which registered portal the menu is drawn into, for a page that keeps more than one. The menu is drawn out of the page so that an area standing in a region that clips or scrolls still has its menu drawn whole",
            },
        ],
    },
    {
        name: "ContextMenu.Trigger",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "Whatever the menu is about, drawn as it was given. The menu belongs to the content rather than to anything the trigger adds to it, so nothing is drawn around it",
            },
            styling,
        ],
    },
    {
        name: "ContextMenu.Positioner",
        props: [styling],
    },
    {
        name: "ContextMenu.Content",
        props: [
            {
                name: "aria-label",
                type: "string",
                description:
                    "Names the menu. Left out, it is named after the area it was opened from, since there is no button standing on the page for it to take a name from",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "Names the menu after something already on the page, in place of a label",
            },
            styling,
        ],
    },
    {
        name: "ContextMenu.Item",
        props: [
            value,
            valueText,
            itemDisabled,
            itemCloseOnSelect,
            {
                name: "variant",
                type: '"default" | "danger"',
                default: '"default"',
                options: ["default", "danger"],
                description:
                    "How grave the item is. A danger item is coloured as a warning and warns louder under the reader, for something that cannot be undone",
            },
            {
                name: "onSelect",
                type: "() => void",
                description:
                    "Called when the item is picked, before the menu is told. An item that is disabled is never picked",
            },
            styling,
        ],
    },
    {
        name: "ContextMenu.CheckboxItem",
        props: [
            value,
            valueText,
            {
                name: "checked",
                type: "boolean",
                required: true,
                description: "Whether the item is picked. The state is always the caller's to hold",
            },
            {
                name: "onCheckedChange",
                type: "(checked: boolean) => void",
                description:
                    "Called with what the item is to become, since picking it turns it over rather than setting it",
            },
            itemDisabled,
            itemCloseOnSelect,
            styling,
        ],
    },
    {
        name: "ContextMenu.RadioItemGroup",
        props: [
            {
                name: "value",
                type: "string",
                description: "The value of whichever item in the group is picked",
            },
            {
                name: "onValueChange",
                type: "(value: string) => void",
                description: "Called with the value of the item that was picked",
            },
            styling,
        ],
    },
    {
        name: "ContextMenu.RadioItem",
        props: [value, valueText, itemDisabled, itemCloseOnSelect, styling],
    },
    {
        name: "ContextMenu.ItemGroup",
        props: [styling],
    },
    {
        name: "ContextMenu.ItemGroupLabel",
        props: [styling],
    },
    {
        name: "ContextMenu.ItemText",
        props: [styling],
    },
    {
        name: "ContextMenu.ItemIndicator",
        props: [styling],
    },
    {
        name: "ContextMenu.Separator",
        props: [styling],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the menu is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const ContextMenu = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                ContextMenu
            </Heading>
            <Text as="p" size="large">
                A list of actions brought out from the thing they are about rather than from a
                button, by a right click or by a finger resting on it. It stands where the press
                landed and takes the place of the menu the browser would have shown. The arrow keys
                run down it, typing moves to the item that starts with what was typed, and Escape or
                a press landing anywhere else takes it down and hands focus back to where it came
                from. A list of actions brought out from a button is an ActionMenu instead.
            </Text>
        </Stack>
        <ComponentExamples component="ContextMenu" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default ContextMenu;
