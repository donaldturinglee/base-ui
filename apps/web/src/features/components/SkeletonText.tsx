import {
    Heading,
    SkeletonText as SkeletonTextComponent,
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
    // The skeleton fills whatever holds it, and run out to the card the eight sizes would be read
    // as rules across the page rather than as lines of text. They are given a column instead, which
    // is what makes a scale of them
    preview: "w-[20rem]",
};

// The plainest one there is: nothing said with a prop, so it comes to a single line drawn at the
// height of body text, filling whatever holds it, which here is the card.
//
// The page and the component it is about are both called SkeletonText, so the component is brought
// in under a name saying which of the two it is. The listing beneath says SkeletonText, as an
// application importing it would
const defaultPreview = <SkeletonTextComponent />;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<SkeletonText />`;

// How many lines the block is drawn as. Every line but the last is set the leading apart from the
// next and the last is cut short, so what is read is a paragraph rather than a stack of bars
const linesPreview = <SkeletonTextComponent lines={3} />;

const linesCode = `<SkeletonText lines={3} />`;

// Which step of the type scale the line is drawn to. The eight are drawn together rather than one
// to an example, since a size is read against the others rather than on its own: apart they are
// eight bars, and one under the other they are the scale the text they stand in for is set on.
//
// None of them is named the way the specimens on the other pages are, since there is nothing inside
// a skeleton to write a name in; what each was given is read off the listing beneath instead. They
// are written in the order the library declares them, which runs down the scale and then puts the
// subtitle last, where it is read as an aside rather than as another step
const sizesPreview = (
    <Stack gap="normal" className={classes.preview}>
        <SkeletonTextComponent size="display" />
        <SkeletonTextComponent size="titleLarge" />
        <SkeletonTextComponent size="titleMedium" />
        <SkeletonTextComponent size="titleSmall" />
        <SkeletonTextComponent size="bodyLarge" />
        <SkeletonTextComponent size="bodyMedium" />
        <SkeletonTextComponent size="bodySmall" />
        <SkeletonTextComponent size="subtitle" />
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the eight read one under the other and the column they are read inside, so it
// is written out with them. It is written out as the class it stands for rather than as the name
// the page holds it under, since what is copied out of here has only itself to reach for
const sizesCode = `<Stack gap="normal" className="w-[20rem]">
    <SkeletonText size="display" />
    <SkeletonText size="titleLarge" />
    <SkeletonText size="titleMedium" />
    <SkeletonText size="titleSmall" />
    <SkeletonText size="bodyLarge" />
    <SkeletonText size="bodyMedium" />
    <SkeletonText size="bodySmall" />
    <SkeletonText size="subtitle" />
</Stack>`;

// How far the lines are allowed to run. The skeleton otherwise fills whatever holds it, which is
// what a line standing in a column of its own wants and what a line standing in the whole of a page
// does not
const maxWidthPreview = <SkeletonTextComponent maxWidth="200px" />;

const maxWidthCode = `<SkeletonText maxWidth="200px" />`;

// The skeleton as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Lines",
        description:
            "How many lines the block is drawn as. Every line but the last is set the leading apart from the next, and the last is cut short, so what is read is a paragraph rather than a stack of bars. It is told the number of lines the words it stands in for will run to, so the page does not move when they arrive.",
        preview: linesPreview,
        code: linesCode,
    },
    {
        name: "Sizes",
        description:
            "Which step of the type scale the line is drawn to. It is the height of the type it stands in for rather than a size of its own, so a heading holds a heading's room and a caption a caption's, and the room between lines is the leading that type carries. The largest two are drawn with their corners turned in further, since a bar that tall reads as a block rather than as a line.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Max width",
        description:
            "How far the lines are allowed to run. The skeleton otherwise fills whatever holds it, which is what a line standing in a column of its own wants; a line standing across the whole of a page is held to the measure the words that follow it will be read at.",
        preview: maxWidthPreview,
        code: maxWidthCode,
    },
];

// Which step of the type scale the line is drawn to. It is written in the order the library
// declares it, which runs down the scale and then puts the subtitle last
const size =
    '"display" | "titleLarge" | "titleMedium" | "titleSmall" | "bodyLarge" | "bodyMedium" | "bodySmall" | "subtitle"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the skeleton takes. It is drawn as the one element rather than as a component with
// parts hanging off it, so there is the one table.
//
// Which step of the scale it is drawn to comes first, since it is what settles how much room a line
// holds, and how many lines there are follows; how far they run comes last, since it is the only
// one of the three that is about the page around the skeleton rather than the words it stands in
// for
const groups: ComponentPropGroup[] = [
    {
        name: "SkeletonText",
        props: [
            {
                name: "size",
                type: size,
                default: '"bodyMedium"',
                description:
                    "Which step of the type scale the line is drawn to. It is the height of the type it stands in for rather than a size of its own, so the room a line holds and the room left between lines are both the ones that type carries",
            },
            {
                name: "lines",
                type: "number",
                default: "1",
                description:
                    "How many lines the block is drawn as. Every line but the last is set the leading apart from the next and the last is cut short, so what is read is a paragraph rather than a stack of bars. Given more than one, the lines are wrapped in an element of their own, which is what takes the max width; the class is put on each of the lines",
            },
            {
                name: "maxWidth",
                type: 'React.CSSProperties["maxWidth"]',
                description:
                    "How far the lines are allowed to run. Left out, the skeleton fills the width of whatever holds it",
            },
            styling,
            {
                name: "...div props",
                type: 'React.ComponentPropsWithoutRef<"div">',
                description:
                    "It is drawn as a div, so it takes what one takes. The width and the height are not among them, since both are worked out from the size",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the skeleton is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const SkeletonText = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                SkeletonText
            </Heading>
            <Text as="p" size="large">
                The room a line or a paragraph of words will take, held while they are on their way.
                Each line is a skeleton box drawn to the height of the type it stands in for, so a
                heading holds a heading&apos;s room and a caption a caption&apos;s. A block of
                several reads as a paragraph rather than a stack of bars: the lines are set the
                leading apart and the last is cut short. It fills whatever holds it unless it is
                told how far to run.
            </Text>
        </Stack>
        <ComponentExamples component="SkeletonText" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default SkeletonText;
