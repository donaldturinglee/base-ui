import { Heading, Stack, Text as TextComponent } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// The plainest text there is: words, with nothing said about how big they are set or how heavily.
// It comes to the size the rest of the page is read at, in the weight body copy is set in.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the text alone. Text is drawn as a span, which is read along
// a line rather than starting one of its own, so a column is what puts each specimen on a line of
// its own where more than one of them is being shown.
//
// The page and the component it is about are both called Text, so the component is brought in under
// a name saying which of the two it is. The listing beneath says Text, as an application importing
// it would
const defaultPreview = (
    <Stack align="start">
        <TextComponent>Body copy, set at the size the page is read at.</TextComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Text>Body copy, set at the size the page is read at.</Text>`;

// How big the words are set. The three are drawn together rather than one to an example, since a
// size is read against the others rather than on its own: apart they are three lines, and one above
// another they are a scale.
//
// Each is named by the value that drew it, so what is read off the line is the size it was given
// rather than a label standing beside it, which on a page about text would be more text
const sizesPreview = (
    <Stack gap="condensed" align="start">
        <TextComponent size="large">large</TextComponent>
        <TextComponent size="medium">medium</TextComponent>
        <TextComponent size="small">small</TextComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the three read against one another, so it is written out with them
const sizesCode = `<Stack gap="condensed" align="start">
    <Text size="large">large</Text>
    <Text size="medium">medium</Text>
    <Text size="small">small</Text>
</Stack>`;

// How heavily the words are set, read the same way the sizes are and named the same way. The four
// stand at the one size, so the weight is the whole of what tells them apart
const weightsPreview = (
    <Stack gap="condensed" align="start">
        <TextComponent weight="light">light</TextComponent>
        <TextComponent weight="normal">normal</TextComponent>
        <TextComponent weight="medium">medium</TextComponent>
        <TextComponent weight="semibold">semibold</TextComponent>
    </Stack>
);

const weightsCode = `<Stack gap="condensed" align="start">
    <Text weight="light">light</Text>
    <Text weight="normal">normal</Text>
    <Text weight="medium">medium</Text>
    <Text weight="semibold">semibold</Text>
</Stack>`;

// What becomes of the spaces and the line breaks the words were written with. Text is set the way
// the browser sets everything else unless it is told otherwise, so the runs are closed up and the
// breaks are dropped; this keeps them as they were typed.
//
// What is being shown is the spacing rather than the words, so the words say what was done to them
const whiteSpacePreview = (
    <Stack align="start">
        <TextComponent whiteSpace="pre">
            {"Two    spaces kept,\nand the line break after them."}
        </TextComponent>
    </Stack>
);

const whiteSpaceCode = `<Text whiteSpace="pre">
    {"Two    spaces kept,\\nand the line break after them."}
</Text>`;

// The text as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Sizes",
        description:
            "How big the words are set. The medium size is the one the page is read at and the one text comes to; the large one is for a line that opens a section, and the small one for an aside beside something already read.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Weights",
        description:
            "How heavily the words are set. Text that is given no weight is set in the weight body copy is set in, and a weight given here replaces that rather than being laid over it.",
        preview: weightsPreview,
        code: weightsCode,
    },
    {
        name: "White space",
        description:
            "What becomes of the spaces and the line breaks the words were written with. They are closed up and dropped unless this says otherwise, which is what a value copied out of somewhere else needs where the shape it was written in is part of what it says.",
        preview: whiteSpacePreview,
        code: whiteSpaceCode,
    },
];

// How big the words are set
const size = '"large" | "medium" | "small"';

// How heavily they are set
const weight = '"light" | "normal" | "medium" | "semibold"';

// What becomes of the spaces and the line breaks they were written with
const whiteSpace = '"pre" | "normal" | "nowrap" | "pre-wrap" | "pre-line"';

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
    default: '"span"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the text takes. It is drawn as the one element rather than as a component with parts
// hanging off it, so there is the one table.
//
// How it is set is written up first, since that is what text is told before anything else, and what
// it is drawn as comes last, where it decides what the words are rather than how they look
const groups: ComponentPropGroup[] = [
    {
        name: "Text",
        props: [
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How big the words are set, and with them how far apart the lines fall. It is the scale the rest of the library's prose is held on",
            },
            {
                name: "weight",
                type: weight,
                description:
                    "How heavily the words are set. Left out, they are set in the weight body copy is set in; a weight given here replaces that rather than being laid over it",
            },
            {
                name: "whiteSpace",
                type: whiteSpace,
                description:
                    "What becomes of the spaces and the line breaks the words were written with. They are closed up and dropped where this is left out, which is how the browser sets everything else",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the text is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Text = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Text
            </Heading>
            <TextComponent as="p" size="large">
                Words, set the way the rest of the library sets them. It is drawn along a line
                rather than starting one of its own, so a paragraph says it is a paragraph and a
                name over a field says it is a label, and what it is drawn as is what decides how it
                is read rather than how it looks.
            </TextComponent>
        </Stack>
        <ComponentExamples component="Text" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Text;
