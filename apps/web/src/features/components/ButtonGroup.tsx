import * as React from "react";
import {
    AddRegular,
    ChevronDownRegular,
    SubtractRegular,
    TextAlignCenterRegular,
    TextAlignLeftRegular,
    TextAlignRightRegular,
} from "@gamecrafters/base-ui-icons";
import {
    Button,
    ButtonGroup as ButtonGroupComponent,
    Heading,
    IconButton,
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

// The plainest group there is: the buttons it holds, and nothing said with a prop. The edges
// between them are squared off and the two ends left rounded, which is the whole of what a group
// does where it is told nothing else.
//
// The Stack holding it to the start of the card is the page's own furniture, as the card around it
// is, so the listing beneath is of the group alone. The card lays what it is handed out in a
// column, and a column stretches what it holds the whole way across unless it is told otherwise,
// which would draw a row of three buttons the width of the page.
//
// The page and the component it is about are both called ButtonGroup, so the component is brought
// in under a name saying which of the two it is. The listing beneath says ButtonGroup, as an
// application importing it would
const defaultPreview = (
    <Stack align="start">
        <ButtonGroupComponent>
            <Button>Undo</Button>
            <Button>Redo</Button>
            <Button>Reset</Button>
        </ButtonGroupComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<ButtonGroup>
    <Button>Undo</Button>
    <Button>Redo</Button>
    <Button>Reset</Button>
</ButtonGroup>`;

// How tall the row is drawn, which the group has nothing to say about: it is the buttons that are
// told a size, and every button in a group is told the same one. The three are drawn together
// rather than one to an example, since a size is read against the others rather than on its own,
// and they are lined up on their centres rather than at their feet, so what is read between them is
// the height and not where each of them was set down
const sizesPreview = (
    <Stack direction="horizontal" gap="condensed" align="center">
        <ButtonGroupComponent>
            <Button size="small">Undo</Button>
            <Button size="small">Redo</Button>
        </ButtonGroupComponent>
        <ButtonGroupComponent>
            <Button size="medium">Undo</Button>
            <Button size="medium">Redo</Button>
        </ButtonGroupComponent>
        <ButtonGroupComponent>
            <Button size="large">Undo</Button>
            <Button size="large">Redo</Button>
        </ButtonGroupComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the three read beside one another, so it is written out with them
const sizesCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <ButtonGroup>
        <Button size="small">Undo</Button>
        <Button size="small">Redo</Button>
    </ButtonGroup>
    <ButtonGroup>
        <Button size="medium">Undo</Button>
        <Button size="medium">Redo</Button>
    </ButtonGroup>
    <ButtonGroup>
        <Button size="large">Undo</Button>
        <Button size="large">Redo</Button>
    </ButtonGroup>
</Stack>`;

// A row of marks rather than words, for a set of related actions too tight for labels. The rounding
// is the item's rather than the button's, so an icon button takes it exactly as a button carrying
// words does. Each still says what it is for, since a mark says nothing to a reader being read to
const iconButtonsPreview = (
    <Stack align="start">
        <ButtonGroupComponent>
            <IconButton icon={SubtractRegular} aria-label="Zoom out" />
            <IconButton icon={AddRegular} aria-label="Zoom in" />
        </ButtonGroupComponent>
    </Stack>
);

const iconButtonsCode = `<ButtonGroup>
    <IconButton icon={SubtractRegular} aria-label="Zoom out" />
    <IconButton icon={AddRegular} aria-label="Zoom in" />
</ButtonGroup>`;

// The action, and a way to the rest of them beside it. Both are told the same weight, so the pair
// reads as one control that has been divided rather than as two that happen to be touching
const splitButtonPreview = (
    <Stack align="start">
        <ButtonGroupComponent>
            <Button variant="primary">Merge pull request</Button>
            <IconButton
                icon={ChevronDownRegular}
                variant="primary"
                aria-label="More merge options"
            />
        </ButtonGroupComponent>
    </Stack>
);

const splitButtonCode = `<ButtonGroup>
    <Button variant="primary">Merge pull request</Button>
    <IconButton icon={ChevronDownRegular} variant="primary" aria-label="More merge options" />
</ButtonGroup>`;

// A press and a link in the same row. The group squares off and rounds whatever it holds, so an
// anchor is laid out exactly as a button is
const buttonAndLinkPreview = (
    <Stack align="start">
        <ButtonGroupComponent>
            <Button>Clone</Button>
            <Button as="a" href="#download">
                Download ZIP
            </Button>
        </ButtonGroupComponent>
    </Stack>
);

const buttonAndLinkCode = `<ButtonGroup>
    <Button>Clone</Button>
    <Button as="a" href="#download">Download ZIP</Button>
</ButtonGroup>`;

// A button that is only there sometimes. It is a component of its own rather than an element the
// page holds ready, since whether the button is there has to be kept somewhere, and what is kept is
// put to use beside the group rather than only stored: the press below takes the middle button away
// and puts it back, which is the only way to see that the rounding follows it
const OptionalChildPreview = () => {
    const [showRedo, setShowRedo] = React.useState(true);

    return (
        <Stack gap="condensed" align="start">
            <ButtonGroupComponent>
                <Button>Undo</Button>
                {showRedo ? <Button>Redo</Button> : null}
                <Button>Reset</Button>
            </ButtonGroupComponent>
            <Button size="small" onClick={() => setShowRedo(!showRedo)}>
                {showRedo ? "Take Redo away" : "Put Redo back"}
            </Button>
        </Stack>
    );
};

// What the example has to have in hand before it can be drawn. Whether the middle button is there
// is the caller's, so it is got ready here
const optionalChildSetup = `const [showRedo, setShowRedo] = React.useState(true);`;

// The press below the group is part of what is being shown rather than the page's own furniture,
// since a group whose middle button never leaves says nothing about what happens when it does
const optionalChildCode = `<Stack gap="condensed" align="start">
    <ButtonGroup>
        <Button>Undo</Button>
        {showRedo ? <Button>Redo</Button> : null}
        <Button>Reset</Button>
    </ButtonGroup>
    <Button size="small" onClick={() => setShowRedo(!showRedo)}>
        {showRedo ? "Take Redo away" : "Put Redo back"}
    </Button>
</Stack>`;

// A single tab stop that the arrow keys move within, which is what a row of related controls should
// be: tabbing past a toolbar of six buttons should take one press rather than six. It is named,
// since a toolbar is a region a reader moves by landmark and one nothing names is arrived at
// without being told what it is
const toolbarPreview = (
    <Stack align="start">
        <ButtonGroupComponent role="toolbar" aria-label="Text alignment">
            <IconButton icon={TextAlignLeftRegular} aria-label="Align left" />
            <IconButton icon={TextAlignCenterRegular} aria-label="Align centre" />
            <IconButton icon={TextAlignRightRegular} aria-label="Align right" />
        </ButtonGroupComponent>
    </Stack>
);

const toolbarCode = `<ButtonGroup role="toolbar" aria-label="Text alignment">
    <IconButton icon={TextAlignLeftRegular} aria-label="Align left" />
    <IconButton icon={TextAlignCenterRegular} aria-label="Align centre" />
    <IconButton icon={TextAlignRightRegular} aria-label="Align right" />
</ButtonGroup>`;

// The group as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then how tall it is drawn, then what it can be made of, and last what it becomes where it
// is told it is a toolbar
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Sizes",
        description:
            "How tall the row is drawn, which the group has nothing to say about. It is the buttons that are told a size, and every button in a group is told the same one, since a row whose buttons are different heights would not read as the single control the squared-off edges are there to make it. The three are set beside each other here so the heights can be read against one another; standing in an application there would be the one group at the one size.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Icon buttons",
        description:
            "A row of marks rather than words, for a set of related actions too tight for labels. The rounding belongs to the item the group wraps each child in rather than to the button inside it, so an icon button takes it exactly as a button carrying words does. Each still says what it is for, since a mark on its own says nothing to a reader being read to.",
        preview: iconButtonsPreview,
        code: iconButtonsCode,
    },
    {
        name: "A split button",
        description:
            "The action, and a way to the rest of them beside it. Both are told the same weight, so the pair reads as one control that has been divided rather than as two that happen to be touching. The one that opens the rest is named in words, since a chevron says nothing on its own.",
        preview: splitButtonPreview,
        code: splitButtonCode,
    },
    {
        name: "A button and a link",
        description:
            "A press and a link standing in the same row. The group squares off and rounds whatever it holds rather than only buttons, so an anchor is laid out exactly as a button is, and the arrow keys of a toolbar move between the two alike.",
        preview: buttonAndLinkPreview,
        code: buttonAndLinkCode,
    },
    {
        name: "A button that comes and goes",
        description:
            "A button that is only there sometimes — one that appears while something is loading, or only for a reader who is allowed it. The group wraps the children that really are there rather than every slot it was written with, so a button that has been taken away leaves nothing behind: the rounding moves to whichever buttons are now at the ends, instead of being held by an item with nothing in it.",
        setup: optionalChildSetup,
        preview: <OptionalChildPreview />,
        code: optionalChildCode,
    },
    {
        name: "As a toolbar",
        description:
            "A single tab stop that the arrow keys move within, which is what a row of related controls should be: tabbing past a toolbar of six buttons should take one press rather than six. Focus wraps around the ends, and the tab stop stays with whichever button was last used. A disabled button is passed over, since there is nothing to be done with it; an inactive one is not, since the whole point of it is that a reader can arrive and be told why. The toolbar is named, since it is a region a reader moves by landmark.",
        preview: toolbarPreview,
        code: toolbarCode,
    },
];

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
    default: '"div"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the group takes. It is drawn as the one element rather than as a component with parts
// hanging off it, so there is the one table: the item each child is wrapped in is the group's own
// doing rather than something a caller reaches for, so there is nothing to say about it here.
//
// The role comes first, since it is the one prop that changes what the group does rather than only
// how it is drawn, and what names it follows, since a group it turns into a toolbar has to be named
const groups: ComponentPropGroup[] = [
    {
        name: "ButtonGroup",
        props: [
            {
                name: "role",
                type: "string",
                description:
                    'What the row is to a reader being read to. It is the element\'s own prop, and the group reads it as well: told "toolbar" it becomes a single tab stop that the arrow keys move within, and told anything else it leaves the buttons in the tab order as it found them',
            },
            {
                name: "aria-label",
                type: "string",
                description:
                    "Names the group in words. A toolbar is a region a reader moves by landmark, so one is named rather than arrived at without being told what it is",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the group is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const ButtonGroup = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                ButtonGroup
            </Heading>
            <Text as="p" size="large">
                A row of buttons drawn as one control: the edges between them are squared off and
                shared, so what is read as several presses is laid out as a single object rather
                than as buttons that happen to be touching. Each child is wrapped in an item of the
                group's own, which is what settles the rounding, and a child that is not there is
                passed over rather than left holding one — so a button that only appears sometimes
                does not leave the row with a squared-off end. Told it is a toolbar, it becomes a
                single tab stop that the arrow keys move within.
            </Text>
        </Stack>
        <ComponentExamples component="ButtonGroup" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default ButtonGroup;
