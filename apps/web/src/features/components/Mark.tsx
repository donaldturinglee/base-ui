import { Heading, Mark as MarkComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // The ground takes its colour through a custom property rather than off the class it came with,
    // so a caller repainting it sets the property rather than unpicking anything. It is painted a
    // colour none of the five variants carries, so what is read is the repaint rather than one of
    // them said another way
    repainted: "[--mark-background-color:var(--background-color-done-muted)]",
};

// What the example that repaints the ground has to have in hand before it can be drawn. It is the
// property the stylesheet reads the colour from rather than the class it came with
const repaintedSetup = `const repainted = "[--mark-background-color:var(--background-color-done-muted)]";`;

// The plainest mark there is: a word inside a line, with nothing said about how it is set. It is
// drawn where a mark belongs rather than on its own, since a word picked out of nothing is not what
// the component is for, so the line around it is part of what the example is showing and is written
// out with it.
//
// The sentence is the one the library's own stories mark up, so what is read here and what is read
// there are the same words.
//
// The page and the component it is about are both called Mark, so the component is brought in under
// a name saying which of the two it is. The listing beneath says Mark, as an application importing
// it would
const defaultPreview = (
    <Stack align="start">
        <Text as="p">
            Deleting this repository takes it away from <MarkComponent>everyone</MarkComponent> who
            can reach it.
        </Text>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Text as="p">
    Deleting this repository takes it away from <Mark>everyone</Mark> who can reach it.
</Text>`;

// What the ground is painted. The five are drawn together rather than one to an example, since a
// colour is read against the others rather than on its own: apart they are five marked words, and
// beside each other they are the palette a reader is choosing from.
//
// Each is named for the variant it was given, so what is read off the mark is the value that drew
// it. They are laid across rather than down, since a mark is drawn to its words and a column of
// them would be read as a list of things rather than as a set to choose from
const variantsPreview = (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <MarkComponent variant="attention">attention</MarkComponent>
        <MarkComponent variant="accent">accent</MarkComponent>
        <MarkComponent variant="success">success</MarkComponent>
        <MarkComponent variant="danger">danger</MarkComponent>
        <MarkComponent variant="neutral">neutral</MarkComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the five read beside one another, so it is written out with them
const variantsCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    <Mark variant="attention">attention</Mark>
    <Mark variant="accent">accent</Mark>
    <Mark variant="success">success</Mark>
    <Mark variant="danger">danger</Mark>
    <Mark variant="neutral">neutral</Mark>
</Stack>`;

// What the mark is set at where it is told nothing, which is whatever the line it sits in is set
// at. The same words are marked out in three paragraphs, each read at a different size, and the
// mark follows every one of them.
//
// They are not named the way the specimens on the other pages are: what is being shown is that the
// three agree with the lines they stand in, and a name beside each would be one more thing to read
// rather than the difference itself
const runningPreview = (
    <Stack gap="normal" align="start">
        <Text as="p" size="large">
            Deleting this repository takes it away from <MarkComponent>everyone</MarkComponent> who
            can reach it.
        </Text>
        <Text as="p" size="medium">
            Deleting this repository takes it away from <MarkComponent>everyone</MarkComponent> who
            can reach it.
        </Text>
        <Text as="p" size="small">
            Deleting this repository takes it away from <MarkComponent>everyone</MarkComponent> who
            can reach it.
        </Text>
    </Stack>
);

const runningCode = `<Stack gap="normal" align="start">
    <Text as="p" size="large">
        Deleting this repository takes it away from <Mark>everyone</Mark> who can reach it.
    </Text>
    <Text as="p" size="medium">
        Deleting this repository takes it away from <Mark>everyone</Mark> who can reach it.
    </Text>
    <Text as="p" size="small">
        Deleting this repository takes it away from <Mark>everyone</Mark> who can reach it.
    </Text>
</Stack>`;

// A size of its own, for a mark with no line to take one from. The three are drawn together rather
// than one to an example, since a size is read against the others rather than on its own, and each
// is named by the value that drew it
const sizesPreview = (
    <Stack gap="condensed" align="start">
        <MarkComponent size="large">large</MarkComponent>
        <MarkComponent size="medium">medium</MarkComponent>
        <MarkComponent size="small">small</MarkComponent>
    </Stack>
);

const sizesCode = `<Stack gap="condensed" align="start">
    <Mark size="large">large</Mark>
    <Mark size="medium">medium</Mark>
    <Mark size="small">small</Mark>
</Stack>`;

// And a weight of its own, read and named the same way the sizes are
const weightsPreview = (
    <Stack gap="condensed" align="start">
        <MarkComponent weight="light">light</MarkComponent>
        <MarkComponent weight="normal">normal</MarkComponent>
        <MarkComponent weight="medium">medium</MarkComponent>
        <MarkComponent weight="semibold">semibold</MarkComponent>
    </Stack>
);

const weightsCode = `<Stack gap="condensed" align="start">
    <Mark weight="light">light</Mark>
    <Mark weight="normal">normal</Mark>
    <Mark weight="medium">medium</Mark>
    <Mark weight="semibold">semibold</Mark>
</Stack>`;

// The ground given a colour of its own rather than one off the five. It is set through the property
// the stylesheet reads the colour from, so nothing the class carries has to be unpicked to change
// it
const repaintedPreview = (
    <Stack align="start">
        <Text as="p">
            Deleting this repository takes it away from{" "}
            <MarkComponent className={classes.repainted}>everyone</MarkComponent> who can reach it.
        </Text>
    </Stack>
);

const repaintedCode = `<Text as="p">
    Deleting this repository takes it away from <Mark className={repainted}>everyone</Mark> who
    can reach it.
</Text>`;

// The mark as it is reached for, drawn and written out one above the other. The plainest one comes
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
            "What the ground is painted, rather than the colour it happens to come out, so the scheme underneath can be changed without the names going stale. Every one of them is a muted tint, since the words on it are left in the ordinary foreground and have to go on being read.",
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "Taking the line it is read in",
        description:
            "The mark sets no size and no weight of its own, so it takes whatever the line it sits in is set at. The same words are marked out in three paragraphs here, each read at a different size, and the mark follows every one of them without being told anything.",
        preview: runningPreview,
        code: runningCode,
    },
    {
        name: "Sizes",
        description:
            "A size of its own, for a mark standing outside running text and so with no line to take one from. Asked for inside a paragraph it would set the words against the ones around them by size as well as by the ground they sit on.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Weights",
        description:
            "And a weight of its own, given for the same reason and with the same caution. The picking out is done by the ground, so a heavier weight is a second thing said rather than the mark being said louder.",
        preview: weightsPreview,
        code: weightsCode,
    },
    {
        name: "Repainting the ground",
        description:
            "The ground given a colour of its own rather than one off the five. Its colour comes through a custom property, so it is repainted by setting that property rather than by unpicking the class the mark came with, and everything else the class carries is left where it is.",
        setup: repaintedSetup,
        preview: repaintedPreview,
        code: repaintedCode,
    },
];

// What the ground is painted, rather than the colour it happens to come out
const variant = '"attention" | "accent" | "success" | "danger" | "neutral"';

// How big the mark is set, where it is told rather than taking the line it is read in
const size = '"large" | "medium" | "small"';

// And how heavily
const weight = '"light" | "normal" | "medium" | "semibold"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the mark takes. It is drawn as the one element rather than as a component with parts
// hanging off it, so there is the one table.
//
// What the ground is painted is written up first, since it is the whole of how a mark picks
// anything out; the two that are almost always left out follow, since what they come to where they
// are left out is most of the rest of what makes the component what it is, and what it is drawn as
// comes last, where it decides why the words are picked out rather than how they look
const groups: ComponentPropGroup[] = [
    {
        name: "Mark",
        props: [
            {
                name: "variant",
                type: variant,
                default: '"attention"',
                description:
                    "What the ground is painted, rather than the colour it happens to come out, so the scheme underneath can be changed without the names going stale. Every one of them is a muted tint, since the words on it are left in the ordinary foreground and have to go on being read",
            },
            {
                name: "size",
                type: size,
                description:
                    "How big the mark is set. Left out, it takes the size of the line it is read in, which is what a run picked out inside a paragraph wants",
            },
            {
                name: "weight",
                type: weight,
                description:
                    "How heavily it is set. Left out, it takes the weight of the line it is read in. The picking out is done by the ground, so this is a second thing said rather than more of the same",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"mark"',
                description:
                    "What the element being drawn is. A mark is a run picked out because it matters to what the reader is doing just now, a search hit or a term being pointed at; a span is for a run picked out somewhere the mark element would not be read as part of the running text",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the mark is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Mark = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Mark
            </Heading>
            <Text as="p" size="large">
                A run of text picked out for the reader rather than by the writer&apos;s stress: a
                search hit, a term being pointed at, the part of a line that answers what was asked.
                The ground it sits on does the picking out and the letters are left alone, so a
                marked phrase keeps the family, the size and the weight of the line it is read in.
                Where Em and Strong say the writer meant these words to carry, a mark says only that
                these are the ones the reader was looking for.
            </Text>
        </Stack>
        <ComponentExamples component="Mark" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Mark;
