import { CopyRegular, EditRegular, ShareRegular } from "@gamecrafters/base-ui-icons";
import { ActionBar as ActionBarComponent, Heading, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// The plainest bar there is: a run of actions on one thing, each drawn as the mark it is known by.
// The bar is a landmark of its own, so it is named, and that name is the one thing it cannot be
// drawn without.
//
// An icon button is named for a stronger reason still. A mark says nothing that can be read out, so
// the words the label would have been are handed to the button instead, and that name is then doing
// two jobs at once: it is what the button is called to anybody not looking at the mark, and it is
// what the bar shows in its place once the row runs out of room and the button is offered from the
// overflow menu rather than being lost.
//
// The icon is handed over as the icon itself rather than as an element built from it, so the button
// draws it at the size and in the colour the bar is drawing its items at.
//
// The page and the component it is about are both called ActionBar, so the component is brought in
// under a name saying which of the two it is. The listing beneath says ActionBar, as an application
// importing it would
const defaultPreview = (
    <ActionBarComponent aria-label="Review actions">
        <ActionBarComponent.IconButton icon={EditRegular} aria-label="Rename" />
        <ActionBarComponent.IconButton icon={CopyRegular} aria-label="Copy link" />
        <ActionBarComponent.IconButton icon={ShareRegular} aria-label="Share" />
    </ActionBarComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<ActionBar aria-label="Review actions">
    <ActionBar.IconButton icon={EditRegular} aria-label="Rename" />
    <ActionBar.IconButton icon={CopyRegular} aria-label="Copy link" />
    <ActionBar.IconButton icon={ShareRegular} aria-label="Share" />
</ActionBar>`;

// The bar as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
];

// How much room each item of the bar is given. The bar sets it once and every item within it is
// drawn at that size, so it stands as the sizes themselves rather than as the name they are
// collected under
const size = '"small" | "medium" | "large"';

// What is left between one item and the next
const gap = '"none" | "condensed"';

// What a visual is handed over as: the component to draw, or an element already built
const visual = "React.ElementType | React.ReactElement | null";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// How a part that carries no words of its own is named. A toolbar and an icon button are both
// reached for without anything to read, so each takes one of the two and answers the other with
// nothing. They say the same thing wherever they stand, so they are named once here
const ariaLabel = {
    name: "aria-label",
    type: "string",
    description: "Names it in words, where there are none on the page to point at",
};

const ariaLabelledBy = {
    name: "aria-labelledby",
    type: "string",
    description: "Names it by whatever on the page already says what it is, in place of aria-label",
};

// Every prop the bar and its parts take, under the one that takes it.
//
// A button in the bar is the library's own button, and an icon button its icon button, so what is
// written out under each of them is what it is reached for with here. Everything else those two
// take is what they take anywhere, and is written up where they are
const groups: ComponentPropGroup[] = [
    {
        name: "ActionBar",
        props: [
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How much room each item of the bar is given. It is set on the bar rather than on the items, so they are all drawn to the same size",
            },
            {
                name: "flush",
                type: "boolean",
                default: "false",
                description:
                    "Lets the bar sit flush with whatever holds it, rather than held in from the edges",
            },
            {
                name: "gap",
                type: gap,
                default: '"condensed"',
                description: "How much room is left between one item and the next",
            },
            styling,
            ariaLabel,
            ariaLabelledBy,
        ],
    },
    {
        name: "ActionBar.Button",
        props: [
            {
                name: "leadingVisual",
                type: visual,
                description:
                    "Drawn before the label, where an icon says something the words leave out",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the action being taken, in the bar and in the overflow menu alike",
            },
            styling,
            {
                name: "onClick",
                type: "React.MouseEventHandler",
                description: "Called when the action is taken",
            },
        ],
    },
    {
        name: "ActionBar.IconButton",
        props: [
            {
                name: "icon",
                type: visual,
                required: true,
                description: "The icon drawn in place of a label",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the action being taken, in the bar and in the overflow menu alike",
            },
            styling,
            ariaLabel,
            ariaLabelledBy,
            {
                name: "onClick",
                type: "React.MouseEventHandler",
                description: "Called when the action is taken",
            },
        ],
    },
    {
        name: "ActionBar.Divider",
        props: [styling],
    },
    {
        name: "ActionBar.Group",
        props: [styling],
    },
    {
        name: "ActionBar.Menu",
        props: [
            {
                name: "icon",
                type: visual,
                required: true,
                description: "The icon the menu is opened from",
            },
            {
                name: "items",
                type: "ActionBarMenuItem[]",
                required: true,
                description:
                    "What the menu holds, handed over as plain objects rather than as elements, so that the same items can be drawn in the bar's own overflow menu",
            },
            {
                name: "overflowIcon",
                type: visual,
                description:
                    "Stands in for the icon once the menu itself has moved into the overflow menu",
            },
            {
                name: "returnFocusRef",
                type: "React.RefObject<HTMLElement | null>",
                description:
                    "Takes focus once the menu closes, in place of the button that opened it",
            },
            styling,
            {
                ...ariaLabel,
                required: true,
                description:
                    "Names the menu. It is always given, since the overflow menu shows that name as the label of the item the menu becomes",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the bar is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const ActionBar = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                ActionBar
            </Heading>
            <Text as="p" size="large">
                A row of actions on one thing. Where the row runs out of room, whatever no longer
                fits is offered from a menu at the end of it instead of being lost.
            </Text>
        </Stack>
        <ComponentExamples component="ActionBar" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default ActionBar;
