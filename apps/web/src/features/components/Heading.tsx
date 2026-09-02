import { Heading as HeadingComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// The plainest heading there is: the words it stands over, with nothing said about how big it is
// drawn or what it is in the outline. It comes to the largest size, and to the level a heading
// most often takes, which is the one under the title of the page.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the heading alone.
//
// The page and the component it is about are both called Heading, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Heading, as an application
// importing it would
const defaultPreview = (
    <Stack align="start">
        <HeadingComponent>Content heading</HeadingComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Heading>Content heading</Heading>`;

// How big the heading is drawn. The three are drawn together rather than one to an example, since
// a size is read against the others rather than on its own: apart they are three lines, and one
// above another they are a scale.
//
// Each is named by the value that drew it, so what is read off the line is the size it was given.
// The two larger ones are set in the face the library keeps for display and the small one in the
// face it sets everything else in, which is why the last of them reads as body copy given weight
// rather than as a smaller title
const sizesPreview = (
    <Stack gap="condensed" align="start">
        <HeadingComponent size="large">large</HeadingComponent>
        <HeadingComponent size="medium">medium</HeadingComponent>
        <HeadingComponent size="small">small</HeadingComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the three read against one another, so it is written out with them
const sizesCode = `<Stack gap="condensed" align="start">
    <Heading size="large">large</Heading>
    <Heading size="medium">medium</Heading>
    <Heading size="small">small</Heading>
</Stack>`;

// What the heading is in the document outline, which is a different question from how big it is
// drawn. The three are given the one size on purpose: they are drawn alike because the level is
// not what is drawn, and that is the whole of what the example has to say.
//
// They run from the level under the title of a page downwards rather than starting at the title
// itself, since the page being read already has one of those and a second would leave it with two
// things claiming to name it
const levelsPreview = (
    <Stack gap="condensed" align="start">
        <HeadingComponent as="h2" size="medium">
            h2
        </HeadingComponent>
        <HeadingComponent as="h3" size="medium">
            h3
        </HeadingComponent>
        <HeadingComponent as="h4" size="medium">
            h4
        </HeadingComponent>
    </Stack>
);

const levelsCode = `<Stack gap="condensed" align="start">
    <Heading as="h2" size="medium">h2</Heading>
    <Heading as="h3" size="medium">h3</Heading>
    <Heading as="h4" size="medium">h4</Heading>
</Stack>`;

// The heading as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Sizes",
        description:
            "How big the heading is drawn. The large one heads a page, the medium one a section within it, and the small one is the size body copy is read at with the weight of a heading, for a run of short sections where a larger one would be read as a page of its own.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Levels",
        description:
            "What the heading is in the document outline, which is what a screen reader reads it as and what the reader moves between. These three are drawn alike on purpose: the level is not what is drawn, so it follows the shape of the page while the size follows the design, and a section that is deeper than the one above it need not be smaller than it.",
        preview: levelsPreview,
        code: levelsCode,
    },
];

// How big the heading is drawn
const size = '"large" | "medium" | "small"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the heading takes. It is drawn as the one element rather than as a component with
// parts hanging off it, so there is the one table.
//
// How big it is drawn is written up first, since that is what a heading is told about how it
// looks, and what it is in the outline comes last, where it decides how the heading is read
// rather than how it is drawn
const groups: ComponentPropGroup[] = [
    {
        name: "Heading",
        props: [
            {
                name: "size",
                type: size,
                default: '"large"',
                description:
                    "How big the heading is drawn. It is told apart from the level, so a heading can be drawn at whatever size the design asks for without moving where it sits in the outline",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"h2"',
                description:
                    "What the heading is in the document outline, given as h1 through h6. It follows the shape of the page rather than how big the heading is drawn, and a page has the one h1, which is what names it",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the heading is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Heading = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <HeadingComponent as="h1" size="large">
                Heading
            </HeadingComponent>
            <Text as="p" size="large">
                A heading over what it heads. What it is in the document outline and how big it is
                drawn are told separately, so the level follows the shape of the page and can be
                read down by whoever is moving through it, while the size follows the design.
            </Text>
        </Stack>
        <ComponentExamples component="Heading" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Heading;
