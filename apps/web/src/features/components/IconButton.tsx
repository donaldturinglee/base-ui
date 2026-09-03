import {
    AddRegular,
    ArrowSyncRegular,
    DeleteRegular,
    DismissRegular,
    SearchRegular,
    StarRegular,
} from "@gamecrafters/base-ui-icons";
import {
    Heading,
    IconButton as IconButtonComponent,
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

// The plainest icon button there is: the icon it carries, the name standing in for the words it
// does not, and nothing else said with a prop. It comes to the one that stands beside other actions
// rather than ahead of them, drawn at the size the rest of the library's controls are.
//
// The name is given here as it is on every other example, since it is not a prop among the rest but
// the one thing an icon button cannot be drawn without: a mark says nothing to a reader who is
// being read to, so what the button is for is said outright.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the button alone. The card lays what it is handed out in a
// column, and a column stretches what it holds the whole way across unless it is told otherwise,
// which would draw a square button as a long one.
//
// The page and the component it is about are both called IconButton, so the component is brought in
// under a name saying which of the two it is. The listing beneath says IconButton, as an
// application importing it would
const defaultPreview = (
    <Stack align="start">
        <IconButtonComponent icon={SearchRegular} aria-label="Search" />
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<IconButton icon={SearchRegular} aria-label="Search" />`;

// How much weight the button carries against the page. The five are drawn together rather than one
// to an example, since weight is read against the others rather than on its own: apart they are
// five buttons, and beside each other they are a scale.
//
// The five carry the one icon, since what is being read between them is the weight and a different
// mark in each would be read instead. What tells them apart on the page is the eye; what tells them
// apart to a screen reader is the name, so each says which of the five it is
const variantsPreview = (
    <Stack direction="horizontal" gap="condensed" align="center">
        <IconButtonComponent icon={StarRegular} aria-label="Star (default)" />
        <IconButtonComponent icon={StarRegular} variant="primary" aria-label="Star (primary)" />
        <IconButtonComponent icon={StarRegular} variant="danger" aria-label="Star (danger)" />
        <IconButtonComponent icon={StarRegular} variant="invisible" aria-label="Star (invisible)" />
        <IconButtonComponent icon={StarRegular} variant="link" aria-label="Star (link)" />
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the five read beside one another, so it is written out with them
const variantsCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <IconButton icon={StarRegular} aria-label="Star (default)" />
    <IconButton icon={StarRegular} variant="primary" aria-label="Star (primary)" />
    <IconButton icon={StarRegular} variant="danger" aria-label="Star (danger)" />
    <IconButton icon={StarRegular} variant="invisible" aria-label="Star (invisible)" />
    <IconButton icon={StarRegular} variant="link" aria-label="Star (link)" />
</Stack>`;

// How large the square is drawn. The three are drawn together for the same reason the variants are,
// and are lined up on their centres rather than at their feet, so what is read between them is the
// size and not where each of them was set down.
//
// A button carrying words is only as wide as they are, and one carrying none is as wide as it is
// tall, so a size here settles both sides of it at once
const sizesPreview = (
    <Stack direction="horizontal" gap="condensed" align="center">
        <IconButtonComponent icon={AddRegular} size="small" aria-label="Add (small)" />
        <IconButtonComponent icon={AddRegular} size="medium" aria-label="Add (medium)" />
        <IconButtonComponent icon={AddRegular} size="large" aria-label="Add (large)" />
    </Stack>
);

const sizesCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <IconButton icon={AddRegular} size="small" aria-label="Add (small)" />
    <IconButton icon={AddRegular} size="medium" aria-label="Add (medium)" />
    <IconButton icon={AddRegular} size="large" aria-label="Add (large)" />
</Stack>`;

// The button while what it set off is still going on. The two are drawn together because what the
// spinner does is only read against the button it replaced: the icon is the whole of what an icon
// button carries, so the spinner takes its place outright rather than standing beside it, and the
// square keeps the size it had.
//
// The name is what the button is doing rather than what it would do, since it is the name that
// carries the change to a reader who is being read to
const loadingPreview = (
    <Stack direction="horizontal" gap="condensed" align="center">
        <IconButtonComponent icon={ArrowSyncRegular} aria-label="Refresh" />
        <IconButtonComponent icon={ArrowSyncRegular} loading aria-label="Refreshing" />
    </Stack>
);

const loadingCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <IconButton icon={ArrowSyncRegular} aria-label="Refresh" />
    <IconButton icon={ArrowSyncRegular} loading aria-label="Refreshing" />
</Stack>`;

// The action that cannot be taken and has nothing to say about why. It is drawn on its own rather
// than beside the state it is chosen over, since what tells the two apart is not how they look but
// what becomes of the button in the tab order, which is read rather than seen.
//
// The Stack holding it to the start of the card is the page's own furniture, as it is on the
// plainest example, so the listing beneath is of the button alone
const disabledPreview = (
    <Stack align="start">
        <IconButtonComponent icon={DeleteRegular} disabled aria-label="Delete" />
    </Stack>
);

const disabledCode = `<IconButton icon={DeleteRegular} disabled aria-label="Delete" />`;

// The action that cannot be taken but can still be arrived at, so that why it cannot be is there to
// be asked for. It is drawn as its own example rather than beside the disabled one for the reason
// that one is: the difference between them is in what a reader can reach, not in what is on the page
const inactivePreview = (
    <Stack align="start">
        <IconButtonComponent icon={DismissRegular} inactive aria-label="Dismiss" />
    </Stack>
);

const inactiveCode = `<IconButton icon={DismissRegular} inactive aria-label="Dismiss" />`;

// The icon button as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Variants",
        description:
            "How much weight the button carries against the page, on the same scale the library's button is held to. Invisible is the one an icon button is reached for with most often: a mark standing on the page with no shape drawn around it until it is pointed at, which is what a toolbar or the corner of a card wants.",
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "Sizes",
        description:
            "How large the square is drawn. It is the scale the rest of the library's controls are held on, so an icon button standing beside an input or a button is told the same size as the thing beside it. Carrying no label, the button is as wide as it is tall, so the one prop settles both sides of it.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Loading",
        description:
            "The button while what it set off is still going on. The icon is the whole of what the button carries, so the spinner takes its place rather than standing beside it, and the square keeps the size it had. It reads as unavailable so it cannot be pressed again, and says as much through a live region of its own rather than leaving the wait to be noticed.",
        preview: loadingPreview,
        code: loadingCode,
    },
    {
        name: "Disabled",
        description:
            "Stops the button being pressed and takes it out of the tab order, which is what an action with nothing to explain is given. A reader moving through the page by keyboard never arrives at it, so nothing about it can be asked for either — where there is a reason worth arriving at, inactive is what to reach for in its place.",
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Inactive",
        description:
            "Reads as unavailable while staying in the tab order, so that whatever cannot be done can still be reached and said. It matters more on an icon button than on one carrying words: a mark on its own offers a reader nothing to go on, and a button out of the tab order cannot be asked about at all.",
        preview: inactivePreview,
        code: inactiveCode,
    },
];

// How much weight the button carries against the page
const variant = '"default" | "primary" | "danger" | "invisible" | "link"';

// How large the square is drawn
const size = '"small" | "medium" | "large"';

// What the icon is handed over as: the component to draw, or an element already built. There is no
// null among them, as there is wherever a visual is one thing a component lays out among several,
// since the icon is the whole of what this button carries
const icon = "React.ElementType | React.ReactElement";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. Those props are
// the element's own and are documented wherever elements are, so what is said here is what the
// library adds to them
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"button"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the icon button takes. It is drawn as the one element rather than as a component with
// parts hanging off it, so there is the one table.
//
// The icon comes first, since it is the whole of what the button carries, and the two ways of
// naming it follow, since one of them has to be given for the button to reach a reader at all. What
// the button is drawn as comes after them, and last the states it can be left in
const groups: ComponentPropGroup[] = [
    {
        name: "IconButton",
        props: [
            {
                name: "icon",
                type: icon,
                required: true,
                description:
                    "The icon drawn in place of a label. It is handed over as the icon itself rather than as an element built from it, so the button draws it at the size and in the colour it is being drawn at",
            },
            {
                name: "aria-label",
                type: "string",
                description:
                    "Names the button in words, where there are none on the page to point at. One of this and aria-labelledby has to be given, and the two are refused together, since a button carrying no words reaches a reader as nothing at all without one of them",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "Names the button by whatever on the page already says what it is, in place of aria-label",
            },
            {
                name: "variant",
                type: variant,
                default: '"default"',
                description:
                    "How much weight the button carries against the page, on the same scale the library's button is held to. Invisible draws no shape around the mark until it is pointed at, which is what a toolbar or the corner of a card wants",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How large the square is drawn. It is the scale the rest of the library's controls are held on, and since the button carries no label it is as wide as it is tall",
            },
            {
                name: "loading",
                type: "boolean",
                description:
                    "Swaps the icon for a spinner and stops the button being pressed. The icon is the whole of what the button carries, so the spinner takes its place rather than standing beside it, and the square keeps the size it had",
            },
            {
                name: "loadingAnnouncement",
                type: "string",
                default: '"Loading"',
                description:
                    "What is read out while the button is loading. It stands in a live region beside the button, which is there for as long as the button can load rather than only while it is, so it is already being read from when the wait begins",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the button being pressed and takes it out of the tab order, which is what an action with nothing to explain is given",
            },
            {
                name: "inactive",
                type: "boolean",
                default: "false",
                description:
                    "Reads as unavailable while staying in the tab order, so that whatever cannot be done can still be reached and said. It is what an action is given in place of disabled where there is a reason worth arriving at",
            },
            {
                name: "type",
                type: "string",
                default: '"button"',
                description:
                    "What the button does inside a form. The element's own default is to submit, and the library's is not, so a button standing in a form says what it is for rather than submitting by having said nothing",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the icon button is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const IconButton = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                IconButton
            </Heading>
            <Text as="p" size="large">
                A press carrying a mark in place of words, drawn as a square on the same scale the
                rest of the library's controls are. It is Button underneath, so it takes the same
                weights and is left in the same states; what it does not take is a label, so the
                name a reader is read out is asked for rather than guessed at from the icon. It is
                what a toolbar, the corner of a card, or anywhere too tight for words is built from.
            </Text>
        </Stack>
        <ComponentExamples component="IconButton" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default IconButton;
