import { Heading, Spinner as SpinnerComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// The plainest spinner there is: nothing said about how big it is drawn or what it is waiting on,
// so it comes to the middle size and says "Loading" to a reader who cannot see it turning.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the spinner alone. The card lays what it is handed out in a
// column, and a column draws what it holds the whole way across unless it is told otherwise, which
// would leave a mark the size of a word sitting in the middle of the page.
//
// The page and the component it is about are both called Spinner, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Spinner, as an application
// importing it would
const defaultPreview = (
    <Stack align="start">
        <SpinnerComponent />
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Spinner />`;

// How big the mark is drawn. The three are drawn together rather than one to an example, since a
// size is read against the others rather than on its own: apart they are three spinners, and beside
// each other they are a scale.
//
// They are lined up on their centres rather than at their feet, so what is read between them is the
// size and not where each of them was set down. Each is named by a Text beside it, which is part of
// what is being shown rather than the page's own furniture: without it the three would be three
// marks with nothing to say which is which
const sizesPreview = (
    <Stack direction="horizontal" gap="normal" align="center">
        <Stack direction="horizontal" gap="condensed" align="center">
            <SpinnerComponent size="small" />
            <Text size="small">small</Text>
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="center">
            <SpinnerComponent size="medium" />
            <Text size="small">medium</Text>
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="center">
            <SpinnerComponent size="large" />
            <Text size="small">large</Text>
        </Stack>
    </Stack>
);

const sizesCode = `<Stack direction="horizontal" gap="normal" align="center">
    <Stack direction="horizontal" gap="condensed" align="center">
        <Spinner size="small" />
        <Text size="small">small</Text>
    </Stack>
    <Stack direction="horizontal" gap="condensed" align="center">
        <Spinner size="medium" />
        <Text size="small">medium</Text>
    </Stack>
    <Stack direction="horizontal" gap="condensed" align="center">
        <Spinner size="large" />
        <Text size="small">large</Text>
    </Stack>
</Stack>`;

// What the spinner says it is waiting on. It is heard rather than seen, so the mark is drawn no
// differently and this example looks like the plainest one above it. What has changed is what a
// reader who cannot see it turning is told
const waitPreview = (
    <Stack align="start">
        <SpinnerComponent srText="Saving changes" />
    </Stack>
);

const waitCode = `<Spinner srText="Saving changes" />`;

// The spinner as it is reached for, drawn and written out one above the other. The plainest one
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
            "How big the mark is drawn. The middle size is the one it comes to, and stands beside a line of text; the small one is for a wait inside a control that is already only as tall as its own label, and the large one for a page that has nothing on it yet.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Naming the wait",
        description:
            "What the spinner says it is waiting on. It is heard rather than seen, so this looks no different from the plainest spinner above: what changed is what a reader who cannot see it turning is told. A view with more than one wait on it says which is which rather than leaving every one of them to report itself as loading.",
        preview: waitPreview,
        code: waitCode,
    },
];

// How big the mark is drawn
const size = '"small" | "medium" | "large"';

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

// Every prop the spinner takes. It is drawn as the one element rather than as a component with
// parts hanging off it, so there is the one table.
//
// How big it is drawn is written up first, since it is the only thing about the spinner that is
// seen; what it says follows, and last what it is drawn as
const groups: ComponentPropGroup[] = [
    {
        name: "Spinner",
        props: [
            {
                name: "size",
                type: size,
                default: '"medium"',
                description: "How big the mark is drawn",
            },
            {
                name: "srText",
                type: "string | null",
                default: '"Loading"',
                description:
                    "What is heard in place of the mark turning. The spinner is a live region, so this is read out as it arrives; null draws the mark and says nothing, which is what a spinner standing inside something that already reports the wait is given",
            },
            {
                name: "aria-label",
                type: "string",
                description:
                    "Names the spinner in words. It takes the place of srText rather than standing beside it, so the wait is not reported twice",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the spinner is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Spinner = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Spinner
            </Heading>
            <Text as="p" size="large">
                A mark that turns while something is being waited on, for a wait with nothing to say
                about how far along it is. It reports itself as it arrives rather than leaving the
                turning to be noticed, so a reader who cannot see it is told what is being waited
                on. A wait that knows how far along it is is a ProgressBar instead.
            </Text>
        </Stack>
        <ComponentExamples component="Spinner" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Spinner;
