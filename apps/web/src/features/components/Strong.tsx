import { Heading, Stack, Strong as StrongComponent, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// The plainest one there is: a few words inside a line, with nothing said about how they are set.
// They are drawn where they belong rather than on their own, since words marked out of nothing are
// not what the component is for, so the line around them is part of what the example is showing
// and is written out with it.
//
// The sentence is the one the library's own stories mark up, so what is read here and what is read
// there are the same words.
//
// The page and the component it is about are both called Strong, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Strong, as an application
// importing it would
const defaultPreview = (
    <Stack align="start">
        <Text as="p">
            Deleting this repository <StrongComponent>cannot be undone</StrongComponent>.
        </Text>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Text as="p">
    Deleting this repository <Strong>cannot be undone</Strong>.
</Text>`;

// What the words are set at where they are told nothing, which is whatever the line they sit in is
// set at. The same words are marked out in three paragraphs, each read at a different size, and
// they follow every one of them while staying heavier than the words around them.
//
// They are not named the way the specimens on the other pages are: what is being shown is that the
// three agree with the lines they stand in, and a name beside each would be one more thing to read
// rather than the difference itself
const runningPreview = (
    <Stack gap="normal" align="start">
        <Text as="p" size="large">
            Deleting this repository <StrongComponent>cannot be undone</StrongComponent>.
        </Text>
        <Text as="p" size="medium">
            Deleting this repository <StrongComponent>cannot be undone</StrongComponent>.
        </Text>
        <Text as="p" size="small">
            Deleting this repository <StrongComponent>cannot be undone</StrongComponent>.
        </Text>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the three read against one another, so it is written out with them
const runningCode = `<Stack gap="normal" align="start">
    <Text as="p" size="large">
        Deleting this repository <Strong>cannot be undone</Strong>.
    </Text>
    <Text as="p" size="medium">
        Deleting this repository <Strong>cannot be undone</Strong>.
    </Text>
    <Text as="p" size="small">
        Deleting this repository <Strong>cannot be undone</Strong>.
    </Text>
</Stack>`;

// A size of its own, for words with no line to take one from. The three are drawn together rather
// than one to an example, since a size is read against the others rather than on its own, and each
// is named by the value that drew it
const sizesPreview = (
    <Stack gap="condensed" align="start">
        <StrongComponent size="large">large</StrongComponent>
        <StrongComponent size="medium">medium</StrongComponent>
        <StrongComponent size="small">small</StrongComponent>
    </Stack>
);

const sizesCode = `<Stack gap="condensed" align="start">
    <Strong size="large">large</Strong>
    <Strong size="medium">medium</Strong>
    <Strong size="small">small</Strong>
</Stack>`;

// The component as it is reached for, drawn and written out one above the other. The plainest one
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
            "The words set no size of their own, so they take whatever the line they sit in is set at and stand out from it by weight alone. The same words are marked out in three paragraphs here, each read at a different size, and they follow every one of them without being told anything.",
        preview: runningPreview,
        code: runningCode,
    },
    {
        name: "Sizes",
        description:
            "A size of its own, for words standing outside running text and so with no line to take one from. Asked for inside a paragraph it would set the words against the ones around them by size as well as weight, which says the same thing twice.",
        preview: sizesPreview,
        code: sizesCode,
    },
];

// How big the words are set, where they are told rather than taking the line they are read in
const size = '"large" | "medium" | "small"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the component takes. It is drawn as the one element rather than as a component with
// parts hanging off it, so there is the one table.
//
// The one that is almost always left out is written up first, since what it comes to where it is
// left out is most of what makes the component what it is, and what it is drawn as comes last,
// where it decides why the words are set apart rather than how they look.
//
// There is no weight among them. The weight is what says the words matter, so it is the
// component's own rather than a knob on it
const groups: ComponentPropGroup[] = [
    {
        name: "Strong",
        props: [
            {
                name: "size",
                type: size,
                description:
                    "How big the words are set. Left out, they take the size of the line they are read in and stand out from it by weight alone, which is what words marked out inside a paragraph want",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"strong"',
                description:
                    "What the element being drawn is. A strong is words the reader is not to pass over; a b is words set apart for some other reason, a term being introduced or a name to be picked out of the line, which are set in the same weight but carry no weight of meaning",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the component is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Strong = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Strong
            </Heading>
            <Text as="p" size="large">
                Words the reader is not to pass over: what cannot be undone, what has to be done
                first, what will be lost. The weight is what says so, so it is the component&apos;s
                own rather than something to be set, and everything else is left to the line the
                words are read in.
            </Text>
        </Stack>
        <ComponentExamples component="Strong" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Strong;
