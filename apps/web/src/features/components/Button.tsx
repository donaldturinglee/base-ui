import { AddRegular, ChevronDownRegular } from "@gamecrafters/base-ui-icons";
import { Button as ButtonComponent, Heading, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// The plainest button there is: the words it carries, and nothing said with a prop. It comes to the
// one that stands beside other actions rather than ahead of them, drawn at the size the rest of the
// library's controls are.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the button alone. The card lays what it is handed out in a
// column, and a column draws what it holds the whole way across unless it is told otherwise, which
// would leave the plainest button on the page drawn as a block one.
//
// The page and the component it is about are both called Button, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Button, as an application
// importing it would
const defaultPreview = (
    <Stack align="start">
        <ButtonComponent>Save changes</ButtonComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Button>Save changes</Button>`;

// How much weight the button carries against the page. The five are drawn together rather than one
// to an example, since weight is read against the others rather than on its own: apart they are
// five buttons, and beside each other they are a scale.
//
// Each is named for the variant it was given, so what is read off the button is the value that drew
// it. They are laid across rather than down, since a button is drawn to its content and a column of
// them would be read as a list of choices rather than as a scale
const variantsPreview = (
    <Stack direction="horizontal" gap="condensed" align="center">
        <ButtonComponent>default</ButtonComponent>
        <ButtonComponent variant="primary">primary</ButtonComponent>
        <ButtonComponent variant="danger">danger</ButtonComponent>
        <ButtonComponent variant="invisible">invisible</ButtonComponent>
        <ButtonComponent variant="link">link</ButtonComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the five read beside one another, so it is written out with them
const variantsCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <Button>default</Button>
    <Button variant="primary">primary</Button>
    <Button variant="danger">danger</Button>
    <Button variant="invisible">invisible</Button>
    <Button variant="link">link</Button>
</Stack>`;

// How tall the button is drawn. The three are drawn together for the same reason the variants are,
// and are lined up on their centres rather than at their feet, so what is read between them is the
// height and not where each of them was set down
const sizesPreview = (
    <Stack direction="horizontal" gap="condensed" align="center">
        <ButtonComponent size="small">small</ButtonComponent>
        <ButtonComponent size="medium">medium</ButtonComponent>
        <ButtonComponent size="large">large</ButtonComponent>
    </Stack>
);

const sizesCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <Button size="small">small</Button>
    <Button size="medium">medium</Button>
    <Button size="large">large</Button>
</Stack>`;

// What the button lays out around its label. Each of the four places is shown once, since what is
// worth seeing is where a thing is put rather than which icon was put there: before the label,
// after it, outside it, and the count that takes the place a trailing visual would.
//
// A visual is handed over as the icon itself rather than as an element built from it, so the button
// draws it at the size and in the colour it is being drawn at, rather than being handed one already
// settled
const visualsPreview = (
    <Stack direction="horizontal" gap="condensed" align="center">
        <ButtonComponent leadingVisual={AddRegular}>New issue</ButtonComponent>
        <ButtonComponent trailingVisual={ChevronDownRegular}>Filters</ButtonComponent>
        <ButtonComponent trailingAction={ChevronDownRegular}>Merge</ButtonComponent>
        <ButtonComponent count={16}>Watch</ButtonComponent>
    </Stack>
);

const visualsCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <Button leadingVisual={AddRegular}>New issue</Button>
    <Button trailingVisual={ChevronDownRegular}>Filters</Button>
    <Button trailingAction={ChevronDownRegular}>Merge</Button>
    <Button count={16}>Watch</Button>
</Stack>`;

// The button drawn to the width of whatever holds it rather than to what it carries. There is the
// one button and nothing beside it, since what is being shown is the whole of the line it takes, and
// anything set down next to it would be taking part of that line away.
//
// It is left where the card puts it rather than being given something of its own to fill, so the
// line it takes is the whole of the one the examples above it are drawn on
const blockPreview = <ButtonComponent block>Save changes</ButtonComponent>;

// The button stands on its own, as the plainest one on the page does, so the listing is of the
// button alone and there is no furniture in it to be held back
const blockCode = `<Button block>Save changes</Button>`;

// The button while what it set off is still going on. The two are drawn together because the
// spinner is put in a different place in each: where there is a visual it takes that visual's
// place, and where there is none it stands in for the label, which is left where it was so that the
// button keeps the width it had
const loadingPreview = (
    <Stack direction="horizontal" gap="condensed" align="center">
        <ButtonComponent loading>Saving</ButtonComponent>
        <ButtonComponent loading leadingVisual={AddRegular}>
            Creating
        </ButtonComponent>
    </Stack>
);

const loadingCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <Button loading>Saving</Button>
    <Button loading leadingVisual={AddRegular}>
        Creating
    </Button>
</Stack>`;

// The button as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Variants",
        description:
            "How much weight the button carries against the page. A view has the one action it is really about, so that one is drawn as primary and everything beside it as default; invisible and link are for what should carry no weight at all.",
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "Sizes",
        description:
            "How tall the button is drawn, and with it how much room is left around its label. It is the scale the rest of the library's controls are held on, so a button standing beside an input is told the same size as the input.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Visuals",
        description:
            "What the button lays out around its label, handed to it rather than written inside it, so that it is drawn in the place and at the size the button keeps for it. A trailing visual and a count stand in that same place, so where both are given the visual is what is drawn.",
        preview: visualsPreview,
        code: visualsCode,
    },
    {
        name: "Block",
        description:
            "Whether the button is drawn to what it carries or to the width of whatever holds it. It is what a button at the foot of a form or in a column of its own is given, where one drawn to its label would be read as narrower than everything it stands under. It is also what alignContent is there for, since a button is only wider than what it carries once it has been given a width to fill.",
        preview: blockPreview,
        code: blockCode,
    },
    {
        name: "Loading",
        description:
            "The button while what it set off is still going on. It reads as unavailable so it cannot be pressed again, keeps the look of a working button while it waits, and says as much through a live region of its own rather than leaving the wait to be noticed.",
        preview: loadingPreview,
        code: loadingCode,
    },
];

// How much weight the button carries against the page
const variant = '"default" | "primary" | "danger" | "invisible" | "link"';

// How tall the button is drawn, and how much room it leaves around its label
const size = '"small" | "medium" | "large"';

// Where what the button holds sits once the button is wider than it
const alignContent = '"start" | "center"';

// What a visual is handed over as: the component to draw, or an element already built
const visual = "React.ElementType | React.ReactElement | null";

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

// Every prop the button takes. It is drawn as the one element rather than as a component with parts
// hanging off it, so there is the one table.
//
// What the button is drawn as is written up first, since it is what a button is told before
// anything else; what it lays out around its label follows, then how it is sized against whatever
// holds it, and last the states it can be left in
const groups: ComponentPropGroup[] = [
    {
        name: "Button",
        props: [
            {
                name: "variant",
                type: variant,
                default: '"default"',
                description:
                    "How much weight the button carries against the page. A view has the one action it is really about, so that one is drawn as primary and everything beside it as default",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How tall the button is drawn, and how much room is left around its label. It is the scale the rest of the library's controls are held on",
            },
            {
                name: "leadingVisual",
                type: visual,
                description:
                    "Drawn before the label, where an icon says something the words leave out",
            },
            {
                name: "trailingVisual",
                type: visual,
                description:
                    "Drawn after the label, in the place a count would take. Where both are given the visual is what is drawn",
            },
            {
                name: "trailingAction",
                type: visual,
                description:
                    "Drawn after the label and outside it, for what acts on the button itself rather than saying something about it, as the chevron of a button that opens a menu does",
            },
            {
                name: "count",
                type: "number | string",
                description:
                    "A count shown after the label, in the place a trailing visual would take. Given with a leading visual and no label, the button draws the two together and is padded in to suit",
            },
            {
                name: "alignContent",
                type: alignContent,
                default: '"center"',
                description:
                    "Where what the button holds sits once the button is wider than it, which is only the case where it was given a width to fill",
            },
            {
                name: "block",
                type: "boolean",
                default: "false",
                description:
                    "Fills the width of whatever holds it, in place of being drawn to what it carries",
            },
            {
                name: "labelWrap",
                type: "boolean",
                default: "false",
                description:
                    "Lets a label too long for one line run onto another, in place of the button being drawn as wide as the label takes",
            },
            {
                name: "loading",
                type: "boolean",
                description:
                    "Swaps whatever visuals the button carries for a spinner and stops it being pressed. With no visual to swap, the spinner stands in for the label, which is left where it was so the button keeps its width",
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
// was asked for, so what the button is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Button = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Button
            </Heading>
            <Text as="p" size="large">
                The press that does something. What it is drawn as says how much weight the action
                carries against the page, and whatever is laid out around its label — an icon, a
                count, a spinner — is handed to it rather than written inside it, so the button
                keeps the places it draws them in.
            </Text>
        </Stack>
        <ComponentExamples component="Button" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Button;
