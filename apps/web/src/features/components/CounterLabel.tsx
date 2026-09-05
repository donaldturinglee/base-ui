import {
    CounterLabel as CounterLabelComponent,
    Heading,
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

// The plainest counter there is: the number it carries, and nothing said with a prop. It comes to
// the muted one, which is what a count read beside a word wants, since the word is what is being
// read and the count is what is being glanced at.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the counter alone. The card lays what it is handed out in a
// column, and a column stretches what it holds the whole way across unless it is told otherwise.
//
// The page and the component it is about are both called CounterLabel, so the component is brought
// in under a name saying which of the two it is. The listing beneath says CounterLabel, as an
// application importing it would
const defaultPreview = (
    <Stack align="start">
        <CounterLabelComponent>12</CounterLabelComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<CounterLabel>12</CounterLabel>`;

// How much the count is being made of. The two are drawn together rather than one to an example,
// since one is read against the other rather than on its own: apart they are two counters, and
// beside each other they are the choice being made.
//
// Each is named for the variant it was given, so what is read beside the counter is what drew it
const variantsPreview = (
    <Stack direction="horizontal" gap="normal" align="center" wrap="wrap">
        <Stack direction="horizontal" gap="condensed" align="center">
            <Text>secondary</Text>
            <CounterLabelComponent>12</CounterLabelComponent>
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="center">
            <Text>primary</Text>
            <CounterLabelComponent variant="primary">12</CounterLabelComponent>
        </Stack>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the two read beside one another, so it is written out with them
const variantsCode = `<Stack direction="horizontal" gap="normal" align="center" wrap="wrap">
    <Stack direction="horizontal" gap="condensed" align="center">
        <Text>secondary</Text>
        <CounterLabel>12</CounterLabel>
    </Stack>
    <Stack direction="horizontal" gap="condensed" align="center">
        <Text>primary</Text>
        <CounterLabel variant="primary">12</CounterLabel>
    </Stack>
</Stack>`;

// Where a counter actually stands: after the thing it is counting, in a row of them, so that what
// is read down the row is the names and what is glanced at is the numbers.
//
// A counter on its own says nothing, which is why it is never drawn on its own. The number is kept
// from a screen reader where it is drawn and announced in a hidden sibling instead, so it is heard
// as part of the name rather than as a number of its own after it
const besidePreview = (
    <Stack gap="condensed" align="start">
        <Stack direction="horizontal" gap="condensed" align="center">
            <Text>Open</Text>
            <CounterLabelComponent variant="primary">24</CounterLabelComponent>
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="center">
            <Text>Closed</Text>
            <CounterLabelComponent>1,204</CounterLabelComponent>
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="center">
            <Text>Draft</Text>
            <CounterLabelComponent>3</CounterLabelComponent>
        </Stack>
    </Stack>
);

const besideCode = `<Stack gap="condensed" align="start">
    <Stack direction="horizontal" gap="condensed" align="center">
        <Text>Open</Text>
        <CounterLabel variant="primary">24</CounterLabel>
    </Stack>
    <Stack direction="horizontal" gap="condensed" align="center">
        <Text>Closed</Text>
        <CounterLabel>1,204</CounterLabel>
    </Stack>
    <Stack direction="horizontal" gap="condensed" align="center">
        <Text>Draft</Text>
        <CounterLabel>3</CounterLabel>
    </Stack>
</Stack>`;

// A counter with nothing in it. It is drawn as nothing at all rather than as an empty pill, so a
// row whose count has run out closes up behind it rather than keeping a gap where a number used to
// be. The row is written the same way either side of it, so what is being shown is the counter
// standing down rather than the caller leaving it out
const emptyPreview = (
    <Stack gap="condensed" align="start">
        <Stack direction="horizontal" gap="condensed" align="center">
            <Text>Unread</Text>
            <CounterLabelComponent variant="primary">7</CounterLabelComponent>
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="center">
            <Text>Archived</Text>
            <CounterLabelComponent variant="primary">{null}</CounterLabelComponent>
        </Stack>
    </Stack>
);

const emptySetup = `const counts = { unread: 7, archived: 0 };`;

const emptyCode = `<Stack gap="condensed" align="start">
    <Stack direction="horizontal" gap="condensed" align="center">
        <Text>Unread</Text>
        <CounterLabel variant="primary">{counts.unread || null}</CounterLabel>
    </Stack>
    <Stack direction="horizontal" gap="condensed" align="center">
        <Text>Archived</Text>
        <CounterLabel variant="primary">{counts.archived || null}</CounterLabel>
    </Stack>
</Stack>`;

// The counter as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Variants",
        description:
            "How much the count is being made of. The muted one is what a count read beside a word wants, since the word is what is being read and the count is what is being glanced at. The emphasised one fills the pill and inverts the number, for the one count in a row that is worth seeing before the rest.",
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "Beside what it counts",
        description:
            "Where a counter actually stands: after the thing it is counting, so what is read down a row is the names and what is glanced at is the numbers. A counter on its own says nothing, which is why it is never drawn on its own. The number is kept from a screen reader where it is drawn and announced in a hidden sibling instead, so it is heard as part of the name rather than as a bare number after it.",
        preview: besidePreview,
        code: besideCode,
    },
    {
        name: "Nothing to count",
        description:
            "A counter with nothing in it is drawn as nothing at all rather than as an empty pill, so a row whose count has run out closes up behind it rather than keeping a gap where a number used to be. Both rows here are written the same way, so what is being shown is the counter standing down of its own accord rather than the caller leaving it out.",
        setup: emptySetup,
        preview: emptyPreview,
        code: emptyCode,
    },
];

// How much the count is being made of
const variant = '"primary" | "secondary"';

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

// Every prop the counter takes. It is drawn as the one element rather than as a component with
// parts hanging off it, so there is the one table.
//
// The count comes first, since it is the whole of what a counter carries, and how much is made of
// it follows
const groups: ComponentPropGroup[] = [
    {
        name: "CounterLabel",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The count itself, already written the way it is to be read: a number, or a number shortened the way a large one is. Given nothing, the counter is drawn as nothing at all rather than as an empty pill",
            },
            {
                name: "variant",
                type: variant,
                default: '"secondary"',
                options: ["primary", "secondary"],
                description:
                    "How much the count is being made of. The muted one is what a count read beside a word wants; the emphasised one fills the pill and inverts the number, for the one count in a row worth seeing before the rest",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the counter is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const CounterLabel = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                CounterLabel
            </Heading>
            <Text as="p" size="large">
                A number in a pill, standing after the thing it counts. It is never read on its own:
                what gives the number its meaning is the word in front of it, so the number is kept
                from a screen reader where it is drawn and announced in a hidden sibling instead,
                where it is heard as part of that word rather than as a bare number after it. A
                counter with nothing to count is drawn as nothing at all.
            </Text>
        </Stack>
        <ComponentExamples component="CounterLabel" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default CounterLabel;
