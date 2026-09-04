import { Heading, List as ListComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// The plainest list there is: three things that belong together, each marked off from the next by
// a bullet, with nothing said about how they are marked or how far apart they sit. It comes to the
// bullet, and to the step a run read as prose is given.
//
// The words are the ones the library's own stories set, so what is read here and what is read
// there are the same run.
//
// The page and the component it is about are both called List, so the component is brought in
// under a name saying which of the two it is. The listing beneath says List, as an application
// importing it would
const defaultPreview = (
    <ListComponent>
        <ListComponent.Item>Fork the repository</ListComponent.Item>
        <ListComponent.Item>Create a branch for your change</ListComponent.Item>
        <ListComponent.Item>Open a pull request</ListComponent.Item>
    </ListComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<List>
    <List.Item>Fork the repository</List.Item>
    <List.Item>Create a branch for your change</List.Item>
    <List.Item>Open a pull request</List.Item>
</List>`;

// The same run numbered rather than bulleted, which is drawn as an ordered list rather than an
// unordered one. The order is then part of what the list says rather than only part of what it
// draws, so a reader who is told the items rather than shown them is told it too
const numberedPreview = (
    <ListComponent variant="number">
        <ListComponent.Item>Fork the repository</ListComponent.Item>
        <ListComponent.Item>Create a branch for your change</ListComponent.Item>
        <ListComponent.Item>Open a pull request</ListComponent.Item>
    </ListComponent>
);

const numberedCode = `<List variant="number">
    <List.Item>Fork the repository</List.Item>
    <List.Item>Create a branch for your change</List.Item>
    <List.Item>Open a pull request</List.Item>
</List>`;

// The same run with nothing marking the items. There is then nothing for the indent to make room
// for, so it is given back and the list stands where the writing around it does — which is the
// whole of what there is to see, and the reason the list says outright that it is one
const plainPreview = (
    <ListComponent variant="plain">
        <ListComponent.Item>Fork the repository</ListComponent.Item>
        <ListComponent.Item>Create a branch for your change</ListComponent.Item>
        <ListComponent.Item>Open a pull request</ListComponent.Item>
    </ListComponent>
);

const plainCode = `<List variant="plain">
    <List.Item>Fork the repository</List.Item>
    <List.Item>Create a branch for your change</List.Item>
    <List.Item>Open a pull request</List.Item>
</List>`;

// How far apart the items sit. The three are drawn together rather than one to an example, since a
// step is read against the others rather than on its own: apart they are three lists, and one
// under another they are a scale.
//
// Each is named by the value that drew it, since what tells the runs apart is a few pixels between
// their lines and nothing a reader would name from looking
const spacingsPreview = (
    <Stack gap="spacious" align="start">
        <Stack gap="condensed">
            <Text size="small" weight="semibold">
                condensed
            </Text>
            <ListComponent spacing="condensed">
                <ListComponent.Item>Fork the repository</ListComponent.Item>
                <ListComponent.Item>Create a branch for your change</ListComponent.Item>
                <ListComponent.Item>Open a pull request</ListComponent.Item>
            </ListComponent>
        </Stack>
        <Stack gap="condensed">
            <Text size="small" weight="semibold">
                normal
            </Text>
            <ListComponent spacing="normal">
                <ListComponent.Item>Fork the repository</ListComponent.Item>
                <ListComponent.Item>Create a branch for your change</ListComponent.Item>
                <ListComponent.Item>Open a pull request</ListComponent.Item>
            </ListComponent>
        </Stack>
        <Stack gap="condensed">
            <Text size="small" weight="semibold">
                spacious
            </Text>
            <ListComponent spacing="spacious">
                <ListComponent.Item>Fork the repository</ListComponent.Item>
                <ListComponent.Item>Create a branch for your change</ListComponent.Item>
                <ListComponent.Item>Open a pull request</ListComponent.Item>
            </ListComponent>
        </Stack>
    </Stack>
);

// The stacks are part of what is being shown rather than the page's own furniture, since what the
// example is about is the three read against one another and each of them named, so they are
// written out with the lists
const spacingsCode = `<Stack gap="spacious" align="start">
    <Stack gap="condensed">
        <Text size="small" weight="semibold">
            condensed
        </Text>
        <List spacing="condensed">
            <List.Item>Fork the repository</List.Item>
            <List.Item>Create a branch for your change</List.Item>
            <List.Item>Open a pull request</List.Item>
        </List>
    </Stack>
    <Stack gap="condensed">
        <Text size="small" weight="semibold">
            normal
        </Text>
        <List spacing="normal">
            <List.Item>Fork the repository</List.Item>
            <List.Item>Create a branch for your change</List.Item>
            <List.Item>Open a pull request</List.Item>
        </List>
    </Stack>
    <Stack gap="condensed">
        <Text size="small" weight="semibold">
            spacious
        </Text>
        <List spacing="spacious">
            <List.Item>Fork the repository</List.Item>
            <List.Item>Create a branch for your change</List.Item>
            <List.Item>Open a pull request</List.Item>
        </List>
    </Stack>
</Stack>`;

// A run hanging under an item rather than beside it. It stands inside the item it belongs to, which
// is what makes it part of that item rather than the next thing in the run above, and it is marked
// differently at every depth, so how deep an item sits can be read from the marker beside it.
//
// Three deep is drawn rather than two, since the marker only changes again at the third and two
// runs would leave that unsaid
const nestedPreview = (
    <ListComponent>
        <ListComponent.Item>Fork the repository</ListComponent.Item>
        <ListComponent.Item>
            Create a branch for your change
            <ListComponent>
                <ListComponent.Item>Name it after the change</ListComponent.Item>
                <ListComponent.Item>
                    Keep it up to date
                    <ListComponent>
                        <ListComponent.Item>Rebase on the default branch</ListComponent.Item>
                    </ListComponent>
                </ListComponent.Item>
            </ListComponent>
        </ListComponent.Item>
        <ListComponent.Item>Open a pull request</ListComponent.Item>
    </ListComponent>
);

const nestedCode = `<List>
    <List.Item>Fork the repository</List.Item>
    <List.Item>
        Create a branch for your change
        <List>
            <List.Item>Name it after the change</List.Item>
            <List.Item>
                Keep it up to date
                <List>
                    <List.Item>Rebase on the default branch</List.Item>
                </List>
            </List.Item>
        </List>
    </List.Item>
    <List.Item>Open a pull request</List.Item>
</List>`;

// The list as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Numbered",
        description:
            "The items numbered rather than bulleted, which draws the run as an ordered list rather than an unordered one. The order is then part of what the list says as well as part of what it draws, so a reader who is told the items rather than shown them is told it too. It is what a run of steps taken in turn is given, where a bulleted run would leave the order to be guessed at.",
        preview: numberedPreview,
        code: numberedCode,
    },
    {
        name: "Plain",
        description:
            "The items with nothing marking them. There is then nothing for the indent to make room for, so it is given back and the run stands where the writing around it does, which is what a set of things laid out for their own sake wants rather than a run read as prose. It says outright that it is a list, since a browser that finds no markers on one takes the semantics away, and a reader who is told the items rather than shown them would otherwise not be told they are a run at all.",
        preview: plainPreview,
        code: plainCode,
    },
    {
        name: "Spacing",
        description:
            "How far apart the items sit. Condensed leaves them on their line spacing alone, for a run read as prose; the two steps above it give the run room to be counted, for one read as a set of things. The three are drawn together because a step is read against the others rather than on its own.",
        preview: spacingsPreview,
        code: spacingsCode,
    },
    {
        name: "Nested",
        description:
            "A run hanging under an item rather than beside it. It stands inside the item it belongs to, which is what makes it part of that item rather than the next thing in the run above, and it is marked differently at each depth, so how deep an item sits can be read from the marker beside it. It is set off by the same step the items are spaced by, so a nested run is spaced with the one above it rather than standing apart from it.",
        preview: nestedPreview,
        code: nestedCode,
    },
];

// What marks each item off from the next. The words are the ones the markdown renderer already
// draws its lists by, so a bulleted list is a bulleted list wherever it came from
const variant = '"bullet" | "number" | "plain"';

// How far apart the items sit
const spacing = '"condensed" | "normal" | "spacious"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the list and its items take, under the part that takes it. Both are drawn as an
// element the caller can name, and on top of what is said here each takes what the element it is
// drawn as takes.
//
// What marks the items comes first, since it settles what the list is as well as what it draws;
// how far apart they sit follows, and the item after them, which declares nothing of its own
// beyond what it is drawn as
const groups: ComponentPropGroup[] = [
    {
        name: "List",
        props: [
            {
                name: "variant",
                type: variant,
                default: '"bullet"',
                description:
                    "What marks each item off from the next, which settles what the list is drawn as too. A numbered list is an ordered one, so a reader who is told the items rather than shown them is told the order as well; the other two are unordered. A plain list carries no markers and gives back the indent that made room for them, and says outright that it is a list, since a browser that finds no markers on one takes the semantics away",
            },
            {
                name: "spacing",
                type: spacing,
                default: '"normal"',
                description:
                    "How far apart the items sit. Condensed leaves them on their line spacing alone, for a run read as prose; the two steps above it give the run room to be counted, for one read as a set of things. A run hanging under an item is set off by the same step, so it is spaced with the run above it rather than standing apart from it",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"ul"',
                description:
                    "The element or component this is drawn as, in place of the one the variant would have chosen. A numbered list is otherwise an ordered list and the other two unordered, so this is for a run that has to be one thing and marked as another",
            },
        ],
    },
    {
        name: "ListItem",
        props: [
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"li"',
                description:
                    "The element or component this is drawn as, in place of its default. Whatever the item holds sits in the run rather than parting it, so how far apart the items stand stays the list's to settle whichever element they are drawn as",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the list is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const List = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                List
            </Heading>
            <Text as="p" size="large">
                A run of related things, read as prose rather than laid out as a set of controls.
                The items carry a bullet, a number, or nothing at all, and what the run is for
                settles which: a numbered list is drawn as an ordered one, so a reader who is told
                the items rather than shown them is told the order as well. A run hanging under an
                item carries on from the one above it, marked differently so the two can be told
                apart and set off by the same step the items are spaced by.
            </Text>
        </Stack>
        <ComponentExamples component="List" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default List;
