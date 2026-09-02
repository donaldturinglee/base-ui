import { Em as EmComponent, Heading, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// The plainest emphasis there is: a word inside a line, with nothing said about how it is set. It
// is drawn where an emphasis belongs rather than on its own, since a word marked out of nothing is
// not what the component is for, so the line around it is part of what the example is showing and
// is written out with it.
//
// The sentence is the one the library's own stories mark up, so what is read here and what is read
// there are the same words.
//
// The page and the component it is about are both called Em, so the component is brought in under
// a name saying which of the two it is. The listing beneath says Em, as an application importing it
// would
const defaultPreview = (
    <Stack align="start">
        <Text as="p">
            Deleting this repository takes it away from <EmComponent>everyone</EmComponent> who can
            reach it.
        </Text>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Text as="p">
    Deleting this repository takes it away from <Em>everyone</Em> who can reach it.
</Text>`;

// What the emphasis is set at where it is told nothing, which is whatever the line it sits in is
// set at. The same words are marked out in three paragraphs, each read at a different size, and
// the emphasis follows every one of them.
//
// They are not named the way the specimens on the other pages are: what is being shown is that the
// three agree with the lines they stand in, and a name beside each would be one more thing to read
// rather than the difference itself
const runningPreview = (
    <Stack gap="normal" align="start">
        <Text as="p" size="large">
            Deleting this repository takes it away from <EmComponent>everyone</EmComponent> who can
            reach it.
        </Text>
        <Text as="p" size="medium">
            Deleting this repository takes it away from <EmComponent>everyone</EmComponent> who can
            reach it.
        </Text>
        <Text as="p" size="small">
            Deleting this repository takes it away from <EmComponent>everyone</EmComponent> who can
            reach it.
        </Text>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the three read against one another, so it is written out with them
const runningCode = `<Stack gap="normal" align="start">
    <Text as="p" size="large">
        Deleting this repository takes it away from <Em>everyone</Em> who can reach it.
    </Text>
    <Text as="p" size="medium">
        Deleting this repository takes it away from <Em>everyone</Em> who can reach it.
    </Text>
    <Text as="p" size="small">
        Deleting this repository takes it away from <Em>everyone</Em> who can reach it.
    </Text>
</Stack>`;

// A size of its own, for an emphasis with no line to take one from. The three are drawn together
// rather than one to an example, since a size is read against the others rather than on its own,
// and each is named by the value that drew it
const sizesPreview = (
    <Stack gap="condensed" align="start">
        <EmComponent size="large">large</EmComponent>
        <EmComponent size="medium">medium</EmComponent>
        <EmComponent size="small">small</EmComponent>
    </Stack>
);

const sizesCode = `<Stack gap="condensed" align="start">
    <Em size="large">large</Em>
    <Em size="medium">medium</Em>
    <Em size="small">small</Em>
</Stack>`;

// And a weight of its own, read and named the same way the sizes are
const weightsPreview = (
    <Stack gap="condensed" align="start">
        <EmComponent weight="light">light</EmComponent>
        <EmComponent weight="normal">normal</EmComponent>
        <EmComponent weight="medium">medium</EmComponent>
        <EmComponent weight="semibold">semibold</EmComponent>
    </Stack>
);

const weightsCode = `<Stack gap="condensed" align="start">
    <Em weight="light">light</Em>
    <Em weight="normal">normal</Em>
    <Em weight="medium">medium</Em>
    <Em weight="semibold">semibold</Em>
</Stack>`;

// The emphasis as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Taking the line it is read in",
        description:
            "The emphasis sets no size and no weight of its own, so it takes whatever the line it sits in is set at. The same words are marked out in three paragraphs here, each read at a different size, and the emphasis follows every one of them without being told anything.",
        preview: runningPreview,
        code: runningCode,
    },
    {
        name: "Sizes",
        description:
            "A size of its own, for an emphasis standing outside running text and so with no line to take one from. Asked for inside a paragraph it would set itself against the words around it rather than reading as part of them.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Weights",
        description:
            "And a weight of its own, given for the same reason and with the same caution. The stress itself is carried by the slope of the letters, so a heavier weight is a second thing said rather than the emphasis being said louder.",
        preview: weightsPreview,
        code: weightsCode,
    },
];

// How big the emphasis is set, where it is told rather than taking the line it is read in
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

// Every prop the emphasis takes. It is drawn as the one element rather than as a component with
// parts hanging off it, so there is the one table.
//
// The two that are almost always left out are written up first, since what they come to where
// they are is the whole of what makes the component what it is, and what it is drawn as comes
// last, where it decides why the words are set apart rather than how they look
const groups: ComponentPropGroup[] = [
    {
        name: "Em",
        props: [
            {
                name: "size",
                type: size,
                description:
                    "How big the emphasis is set. Left out, it takes the size of the line it is read in, which is what a word marked out inside a paragraph wants",
            },
            {
                name: "weight",
                type: weight,
                description:
                    "How heavily it is set. Left out, it takes the weight of the line it is read in. The stress is carried by the slope of the letters, so this is a second thing said rather than more of the same",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"em"',
                description:
                    "What the element being drawn is. An em is words the sentence would be read differently without; an i is words set apart for some other reason, a term being introduced or a phrase in another language, which are sloped the same way but are not stressed",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the emphasis is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Em = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Em
            </Heading>
            <Text as="p" size="large">
                A word or two given the stress of the line they are read in. The stress is carried
                by the slope of the letters alone, so the emphasis keeps the family, the size and
                the weight of whatever it sits within rather than setting its own against them.
            </Text>
        </Stack>
        <ComponentExamples component="Em" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Em;
