import { Heading, Label as LabelComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// The plainest label there is: the word it carries, and nothing said with a prop. It comes to the
// one drawn in the ordinary foreground with the ordinary border, at the smallest of the steps,
// which is what a label read beside a line of text wants.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the label alone. The card lays what it is handed out in a
// column, and a column stretches what it holds the whole way across unless it is told otherwise,
// which would draw a pill the width of the page.
//
// The page and the component it is about are both called Label, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Label, as an application
// importing it would
const defaultPreview = (
    <Stack align="start">
        <LabelComponent>Draft</LabelComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Label>Draft</Label>`;

// What the label is saying. The seven are drawn together rather than one to an example, since a
// role is read against the others rather than on its own: apart they are seven labels, and beside
// each other they are the palette a reader is choosing from.
//
// Each is named for the variant it was given, so what is read off the label is the value that drew
// it. They are laid across rather than down, since a label is drawn to its word and a column of
// them would be read as a list of things rather than as a set to choose from
const variantsPreview = (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <LabelComponent variant="accent">accent</LabelComponent>
        <LabelComponent variant="success">success</LabelComponent>
        <LabelComponent variant="attention">attention</LabelComponent>
        <LabelComponent variant="severe">severe</LabelComponent>
        <LabelComponent variant="danger">danger</LabelComponent>
        <LabelComponent variant="done">done</LabelComponent>
        <LabelComponent variant="sponsors">sponsors</LabelComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the seven read beside one another, so it is written out with them
const variantsCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    <Label variant="accent">accent</Label>
    <Label variant="success">success</Label>
    <Label variant="attention">attention</Label>
    <Label variant="severe">severe</Label>
    <Label variant="danger">danger</Label>
    <Label variant="done">done</Label>
    <Label variant="sponsors">sponsors</Label>
</Stack>`;

// The three that name no role. They carry no colour of their own, so what tells them apart is how
// dark the border is drawn and whether the words are muted with it, and none of that can be read
// off one of them standing among the coloured ones. They are drawn together and alone, from the
// quietest to the loudest, so the three are read as the scale they are
const neutralPreview = (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <LabelComponent variant="secondary">secondary</LabelComponent>
        <LabelComponent>default</LabelComponent>
        <LabelComponent variant="primary">primary</LabelComponent>
    </Stack>
);

const neutralCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    <Label variant="secondary">secondary</Label>
    <Label>default</Label>
    <Label variant="primary">primary</Label>
</Stack>`;

// How much room the label takes. The three are drawn together for the same reason the variants
// are, and are lined up on their centres rather than at their feet, so what is read between them
// is the height and not where each of them was set down
const sizesPreview = (
    <Stack direction="horizontal" gap="condensed" align="center">
        <LabelComponent size="small">small</LabelComponent>
        <LabelComponent size="medium">medium</LabelComponent>
        <LabelComponent size="large">large</LabelComponent>
    </Stack>
);

const sizesCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <Label size="small">small</Label>
    <Label size="medium">medium</Label>
    <Label size="large">large</Label>
</Stack>`;

// The label as it is reached for, drawn and written out one above the other. The plainest one comes
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
            "What the label is saying, rather than the colour it happens to be drawn in, so the scheme underneath can be changed without every name going stale. The words are set in the colour the role is read in and the border is drawn to match, and the ground is left alone, so a row of them stays a row of tags rather than a row of colours.",
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "Default, primary and secondary",
        description:
            "The three that name no role. They say how much the outline is meant to carry rather than what the label is for: secondary is drawn in the quietest border with the words muted to match, default in the ordinary one, and primary in the strongest the scheme has, which is the label that has to be seen before the others beside it.",
        preview: neutralPreview,
        code: neutralCode,
    },
    {
        name: "Sizes",
        description:
            "How much room the label takes. The steps are Badge's as well, so a label and a badge given the same size stand the same height beside each other. The larger two are the same height and differ in the room they leave to either side of the word.",
        preview: sizesPreview,
        code: sizesCode,
    },
];

// What the label is saying, rather than the colour it happens to be drawn in. The three that name
// no role come first, since they are what a label comes to where it is told nothing, and the seven
// that name one follow
const variant =
    '"default" | "primary" | "secondary" | "accent" | "success" | "attention" | "severe" | ' +
    '"danger" | "done" | "sponsors"';

// How much room the label takes
const size = '"small" | "medium" | "large"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the label takes. It is drawn as the one element rather than as a component with parts
// hanging off it, so there is the one table.
//
// What the label is saying is written up first, since it is the whole of what a label is for; how
// much room it takes follows, and what it is drawn as comes last
const groups: ComponentPropGroup[] = [
    {
        name: "Label",
        props: [
            {
                name: "variant",
                type: variant,
                default: '"default"',
                description:
                    "What the label is saying, rather than the colour it happens to be drawn in, so the scheme underneath can be changed without every name going stale. Default, primary and secondary name no role: they say how much the outline is meant to carry, from the quietest border to the strongest the scheme has",
            },
            {
                name: "size",
                type: size,
                default: '"small"',
                description:
                    "How much room the label takes. The steps are Badge's as well, so a label and a badge given the same size stand the same height; the larger two are the same height and differ in the room they leave to either side of the word",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"span"',
                description:
                    "What the element being drawn is. A span is a word set beside something and is what a label usually is; an anchor is one that leads somewhere, to whatever it is a label of. A label standing in a LabelGroup is left as it is, since the group wraps each of the things it holds in a list item of its own",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the label is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Label = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Label
            </Heading>
            <Text as="p" size="large">
                A small outlined pill saying what something is or where it belongs: a word or two,
                read at a glance beside whatever it is attached to. The words are set in the colour
                the role is read in and the border is drawn to match, and the ground is left alone,
                so several of them beside a title read as a set of tags rather than as a row of
                colours pulling against it. Where Badge fills the same word in, a label leaves the
                ground where it was, which is what makes it the one to reach for where labels stand
                together. A row holding more of them than it has room for is a LabelGroup.
            </Text>
        </Stack>
        <ComponentExamples component="Label" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Label;
