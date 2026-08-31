import {
    ActionList,
    ActionMenu as ActionMenuComponent,
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

// The plainest menu there is: a button, and the list it brings out. Nothing is held for it from
// outside, so it opens and closes itself, and the list is the library's own rather than anything
// the menu declares.
//
// The card draws what it is handed in a column, and a column runs what stands in it out to its
// width. A menu is opened from a button, and a button is as wide as the words on it, so the
// example is held to the start of the column: run out, the label would sit in the middle of the
// card with the chevron off at the far edge, and the menu would come out under a button several
// times its width. The Stack is the page's own furniture, as the card around it is, so the
// listing beneath is of the menu alone.
//
// The page and the component it is about are both called ActionMenu, so the component is brought
// in under a name saying which of the two it is. The listing beneath says ActionMenu, as an
// application importing it would
const defaultPreview = (
    <Stack align="start">
        <ActionMenuComponent>
            <ActionMenuComponent.Button>Actions</ActionMenuComponent.Button>
            <ActionMenuComponent.Overlay>
                <ActionList>
                    <ActionList.Item>Copy link</ActionList.Item>
                    <ActionList.Item>Rename</ActionList.Item>
                    <ActionList.Item>Archive</ActionList.Item>
                    <ActionList.Divider />
                    <ActionList.Item variant="danger">Delete</ActionList.Item>
                </ActionList>
            </ActionMenuComponent.Overlay>
        </ActionMenuComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<ActionMenu>
    <ActionMenu.Button>Actions</ActionMenu.Button>
    <ActionMenu.Overlay>
        <ActionList>
            <ActionList.Item>Copy link</ActionList.Item>
            <ActionList.Item>Rename</ActionList.Item>
            <ActionList.Item>Archive</ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item variant="danger">Delete</ActionList.Item>
        </ActionList>
    </ActionMenu.Overlay>
</ActionMenu>`;

// The menu as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
];

// Which end of the anchor the overlay is lined up with
const align = '"start" | "center" | "end"';

// Which side of the anchor the overlay stands on
const side = '"outside-top" | "outside-right" | "outside-bottom" | "outside-left"';

// A step of the overlay width scale, or the width of whatever the overlay holds
const width = '"xsmall" | "small" | "medium" | "large" | "xlarge" | "auto"';

// A step of the overlay height scale, or the height of whatever the overlay holds
const height = '"small" | "medium" | "large" | "xlarge" | "auto"';

// A narrow viewport has no room to stand an overlay beside its anchor, so it can be given the
// whole screen instead. It is written as the library writes it, since what a caller is held to is
// one value or one value to a breakpoint rather than either on its own
const variant = 'ResponsiveValue<"anchored", "anchored" | "fullscreen">';

// What a visual is handed over as: the component to draw, or an element already built
const visual = "React.ElementType | React.ReactElement | null";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the menu and its parts take, under the one that takes it.
//
// The button is the library's own button, so what is written out under it is what it is reached
// for with here; everything else it takes is what it takes anywhere, and is written up where it
// is. `ActionMenu.Divider` is the list's own divider rather than anything the menu declares, and
// is written up with the list
const groups: ComponentPropGroup[] = [
    {
        name: "ActionMenu",
        props: [
            {
                name: "open",
                type: "boolean",
                description: "Whether the menu is open, where the caller keeps hold of the state",
            },
            {
                name: "anchorRef",
                type: "React.RefObject<HTMLElement | null>",
                description:
                    "Stands in for the ref the menu would otherwise hold its anchor with, for a menu opened from something it was not given",
            },
            {
                name: "onOpenChange",
                type: "(open: boolean) => void",
                description: "Called whenever the menu opens or closes",
            },
        ],
    },
    {
        name: "ActionMenuButton",
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
                description: "Stops the menu being opened",
            },
            styling,
        ],
    },
    {
        name: "ActionMenuAnchor",
        props: [
            {
                // The one prop of the menu that is a constraint rather than a choice, so it is
                // written out where a caller would otherwise have to find it out by being wrong
                name: "children",
                type: "React.ReactElement",
                required: true,
                description:
                    "The one element the menu opens from. Everything the overlay needs of an anchor is spread onto it, so it is a single element rather than whatever was written",
            },
            {
                name: "id",
                type: "string",
                description: "Names the anchor, for a menu that has to point at it by name",
            },
        ],
    },
    {
        name: "ActionMenuOverlay",
        props: [
            {
                name: "align",
                type: align,
                default: '"start"',
                description: "Which end of the anchor the overlay is lined up with",
            },
            {
                name: "side",
                type: side,
                default: '"outside-bottom"',
                description: "Which side of the anchor the overlay stands on",
            },
            {
                name: "width",
                type: width,
                default: '"auto"',
                description: "How wide the overlay is drawn, or the width of whatever it holds",
            },
            {
                name: "height",
                type: height,
                default: '"auto"',
                description: "How tall the overlay is drawn, or the height of whatever it holds",
            },
            {
                name: "variant",
                type: variant,
                default: '{ regular: "anchored", narrow: "anchored" }',
                description:
                    "Whether the overlay stands against its anchor or takes the whole screen, which is what a viewport with no room beside the anchor is given",
            },
            {
                name: "preventOverflow",
                type: "boolean",
                default: "true",
                description:
                    "Keeps the overlay within the viewport, moving it where it would run past an edge",
            },
            {
                name: "returnFocusRef",
                type: "React.RefObject<HTMLElement | null>",
                description: "Takes focus once the menu closes, in place of the anchor",
            },
            styling,
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "Names the menu by whatever on the page already says what it is, in place of the button that opens it",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the menu is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const ActionMenu = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                ActionMenu
            </Heading>
            <Text as="p" size="large">
                A list of actions brought out from a button. What the menu holds is an ActionList,
                so the items are the same ones a list is built from anywhere else.
            </Text>
        </Stack>
        <ComponentExamples component="ActionMenu" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default ActionMenu;
