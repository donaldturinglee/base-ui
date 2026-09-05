import {
    ActionList as ActionListComponent,
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
};

// The plainest list there is: a run of actions on one thing, with a line setting the one that
// cannot be taken back apart from the rest.
//
// The page and the component it is about are both called ActionList, so the component is brought
// in under a name saying which of the two it is. The listing beneath says ActionList, as an
// application importing it would
const defaultPreview = (
    <ActionListComponent>
        <ActionListComponent.Item>Copy link</ActionListComponent.Item>
        <ActionListComponent.Item>Rename</ActionListComponent.Item>
        <ActionListComponent.Item>Archive</ActionListComponent.Item>
        <ActionListComponent.Divider />
        <ActionListComponent.Item variant="danger">Delete</ActionListComponent.Item>
    </ActionListComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<ActionList>
    <ActionList.Item>Copy link</ActionList.Item>
    <ActionList.Item>Rename</ActionList.Item>
    <ActionList.Item>Archive</ActionList.Item>
    <ActionList.Divider />
    <ActionList.Item variant="danger">Delete</ActionList.Item>
</ActionList>`;

// The list as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
];

// How far the items are held in from the edges of whatever the list is drawn on
const variant = '"inset" | "full"';

// Whether one item or several can be picked
const selectionVariant = '"single" | "multiple"';

// What an item is, where one of them is the one that cannot be taken back
const itemVariant = '"default" | "danger"';

// How much room an item is given
const itemSize = '"medium" | "large"';

// Whether the secondary text stands beside the label or below it
const descriptionVariant = '"inline" | "block"';

// How much a group is set apart from what surrounds it
const groupVariant = '"subtle" | "filled"';

// What a heading is as a heading. It stands as the levels themselves rather than as the name they
// are collected under, since one of them is what a caller actually hands over
const headingLevel = '"h1" | "h2" | "h3" | "h4" | "h5" | "h6"';

// What a visual is handed over as: the component to draw, or an element already built
const visual = "React.ElementType | React.ReactElement | null";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the list and its parts take, under the one that takes it.
//
// A part that draws whatever it is handed and takes nothing else of its own is still written up,
// since a reader looking one up is looking for what it takes rather than for whether it is there
const groups: ComponentPropGroup[] = [
    {
        name: "ActionList",
        props: [
            {
                name: "variant",
                type: variant,
                default: '"inset"',
                description:
                    "How far the items are held in from the edges of whatever the list is drawn on",
            },
            {
                name: "selectionVariant",
                type: selectionVariant,
                description:
                    "Whether one item or several can be picked. A list inside a container is told this by the container where it does not say so itself",
            },
            {
                name: "showDividers",
                type: "boolean",
                default: "false",
                description: "Draws a line above every item that does not already follow one",
            },
            {
                name: "disableFocusZone",
                type: "boolean",
                default: "false",
                description:
                    "Leaves the arrow keys alone, for a list that is navigated some other way",
            },
            styling,
        ],
    },
    {
        name: "ActionList.Item",
        props: [
            {
                name: "variant",
                type: itemVariant,
                default: '"default"',
                description:
                    "What the item is, where taking it is not something that can be undone",
            },
            {
                name: "size",
                type: itemSize,
                default: '"medium"',
                description: "How much room the item is given",
            },
            {
                name: "selected",
                type: "boolean",
                description: "Whether the item is one of the ones that have been picked",
            },
            {
                name: "active",
                type: "boolean",
                description:
                    "The one item the list is currently showing. There is never more than one",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description: "Stops the item being picked at all",
            },
            {
                name: "loading",
                type: "boolean",
                default: "false",
                description:
                    "Stops the item being picked while whatever it is waiting on is still coming",
            },
            {
                name: "inactiveText",
                type: "string",
                description:
                    "Says why the item cannot be used at the moment, and stops it being used",
            },
            styling,
            {
                name: "onSelect",
                type: "(event: ActionListSelectEvent) => void",
                description:
                    "Called when the item is picked, by pointer or by key. An item that is disabled, inactive or loading is never picked",
            },
        ],
    },
    {
        name: "ActionList.LinkItem",
        props: [
            {
                name: "href",
                type: "string",
                description: "Where the item leads",
            },
            {
                name: "variant",
                type: itemVariant,
                default: '"default"',
                description:
                    "What the item is, where following it is not something that can be undone",
            },
            {
                name: "size",
                type: itemSize,
                default: '"medium"',
                description: "How much room the item is given",
            },
            {
                name: "active",
                type: "boolean",
                description: "The one item the list is currently showing",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description: "Stops the item being followed",
            },
            {
                name: "inactiveText",
                type: "string",
                description:
                    "Says why the item cannot be followed at the moment, and stops it being followed",
            },
            styling,
        ],
    },
    {
        name: "ActionList.Group",
        props: [
            {
                name: "variant",
                type: groupVariant,
                default: '"subtle"',
                description: "How much the group is set apart from what surrounds it",
            },
            {
                name: "selectionVariant",
                type: `${selectionVariant} | false`,
                description:
                    "Overrides what the list itself says about picking items, where the group is picked from differently or not at all",
            },
            styling,
        ],
    },
    {
        name: "ActionList.GroupHeading",
        props: [
            {
                name: "as",
                type: headingLevel,
                description:
                    "What the heading is as a heading. It is given where the list is a plain list, since a heading there is a real one and needs a level; a menu or a listbox draws it as presentation instead",
            },
            {
                name: "variant",
                type: groupVariant,
                default: '"subtle"',
                description: "How much the heading is set apart from what surrounds it",
            },
            {
                name: "auxiliaryText",
                type: "string",
                description: "Secondary text below the heading",
            },
            styling,
        ],
    },
    {
        name: "ActionList.Heading",
        props: [
            {
                name: "as",
                type: headingLevel,
                required: true,
                description:
                    "What the heading is as a heading, so that the list sits at the right depth in the document outline",
            },
            {
                name: "visuallyHidden",
                type: "boolean",
                default: "false",
                description: "Names the list for a screen reader without being drawn on the page",
            },
            styling,
        ],
    },
    {
        name: "ActionList.Description",
        props: [
            {
                name: "variant",
                type: descriptionVariant,
                default: '"inline"',
                description: "Whether the secondary text stands beside the label or below it",
            },
            styling,
        ],
    },
    {
        name: "ActionList.LeadingVisual",
        props: [styling],
    },
    {
        name: "ActionList.TrailingVisual",
        props: [styling],
    },
    {
        name: "ActionList.TrailingAction",
        props: [
            {
                name: "label",
                type: "string",
                required: true,
                description:
                    "Names the action, and is the label itself where there is no icon. It is always given, since the action stands beside the item's own rather than inside it",
            },
            {
                name: "icon",
                type: visual,
                description: "Drawn in place of the label",
            },
            styling,
        ],
    },
    {
        name: "ActionList.Divider",
        props: [styling],
    },
    {
        name: "ActionList.SubItem",
        props: [],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the list is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const ActionList = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                ActionList
            </Heading>
            <Text as="p" size="large">
                A list of actions, links or things to pick. What it is read as is the caller's to
                decide, or the container's where it has been put inside one.
            </Text>
        </Stack>
        <ComponentExamples component="ActionList" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default ActionList;
