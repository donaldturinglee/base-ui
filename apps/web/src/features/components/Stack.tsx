import { Heading, Placeholder, Stack as StackComponent, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// The plainest stack there is: three things, one under the other. Nothing is said with a prop, so
// it comes to a column with the normal step of room between what stands in it.
//
// What is put in it is the placeholder the library ships for standing in, since what the example
// is about is where things are laid rather than what they are.
//
// The page and the component it is about are both called Stack, and the page is laid out with the
// very component it is about, so the one import under a name saying which of the two it is serves
// both what is being shown and the furniture around it. The listing beneath says Stack, as an
// application importing it would
const defaultPreview = (
    <StackComponent>
        <Placeholder height="64px" label="First" />
        <Placeholder height="64px" label="Second" />
        <Placeholder height="64px" label="Third" />
    </StackComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Stack>
    <Placeholder height="64px" label="First" />
    <Placeholder height="64px" label="Second" />
    <Placeholder height="64px" label="Third" />
</Stack>`;

// Which way the stack runs. A stack is a column unless it is told otherwise, so the one worth
// showing is the row: the same three things and the same step of room between them, laid across
// rather than down
const directionPreview = (
    <StackComponent direction="horizontal">
        <Placeholder height="64px" label="First" />
        <Placeholder height="64px" label="Second" />
        <Placeholder height="64px" label="Third" />
    </StackComponent>
);

const directionCode = `<Stack direction="horizontal">
    <Placeholder height="64px" label="First" />
    <Placeholder height="64px" label="Second" />
    <Placeholder height="64px" label="Third" />
</Stack>`;

// What the stack holds keeps its own size, so the room left over at the end of a row stays there
// until something is asked to take it. `Stack.Item` is what asks: it is wrapped around whatever is
// to grow rather than being a size given to the thing itself
const growingPreview = (
    <StackComponent direction="horizontal">
        <Placeholder width="176px" height="64px" label="Its own width" />
        <StackComponent.Item grow>
            <Placeholder height="64px" label="Takes what is left" />
        </StackComponent.Item>
    </StackComponent>
);

const growingCode = `<Stack direction="horizontal">
    <Placeholder width="176px" height="64px" label="Its own width" />
    <Stack.Item grow>
        <Placeholder height="64px" label="Takes what is left" />
    </Stack.Item>
</Stack>`;

// The stack as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Direction",
        description:
            "Which way the stack runs. Everything else it is told is read against that: what it is lined up by runs across the way it runs, and what it is spread by runs along it.",
        preview: directionPreview,
        code: directionCode,
    },
    {
        name: "Growing",
        description:
            "What a stack holds is left at its own size. An item asked to grow takes the room left over, which is how a row is filled without a width being worked out for anything in it.",
        preview: growingPreview,
        code: growingCode,
    },
];

// The room left between what the stack holds. It is the same scale the padding is held on, so what
// is left between two things and what is left around them read as steps of the one thing
const gap = '"none" | "tight" | "condensed" | "cozy" | "normal" | "spacious"';

// Which way the stack runs, and with it which way everything else it is told is read
const direction = '"horizontal" | "vertical"';

// How what the stack holds is lined up across the way it runs
const align = '"stretch" | "start" | "center" | "end" | "baseline"';

// What becomes of a row with more in it than there is room for
const wrap = '"wrap" | "nowrap"';

// How what the stack holds is spread along the way it runs
const justify = '"start" | "center" | "end" | "space-between" | "space-evenly"';

// The room left inside the stack, around everything it holds
const padding = '"none" | "tight" | "condensed" | "cozy" | "normal" | "spacious"';

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
    default: '"div"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the stack and its one part take, under the one that takes it.
//
// Which way the stack runs is written up first, since everything after it is read against that,
// and how what it holds is laid out follows: lined up, spread, wrapped, and then the room left
// between and around
const groups: ComponentPropGroup[] = [
    {
        name: "Stack",
        props: [
            {
                name: "direction",
                type: direction,
                default: '"vertical"',
                description: "Which way the stack runs",
            },
            {
                name: "gap",
                type: gap,
                default: '"normal"',
                description:
                    "The room left between what the stack holds. The step it falls back to is settled in the stylesheet rather than here, so a stack told nothing is still spaced",
            },
            {
                name: "align",
                type: align,
                default: '"stretch"',
                description:
                    "How what the stack holds is lined up across the way it runs, which for a column is where each of them starts and for a row is how tall they are drawn",
            },
            {
                name: "justify",
                type: justify,
                default: '"start"',
                description: "How what the stack holds is spread along the way it runs",
            },
            {
                name: "wrap",
                type: wrap,
                default: '"nowrap"',
                description:
                    "Whether what will not fit is taken onto another line or left to run past the end",
            },
            {
                name: "padding",
                type: padding,
                default: '"none"',
                description: "The room left inside the stack, on every side of what it holds",
            },
            {
                name: "paddingBlock",
                type: padding,
                description:
                    "The room left above and below what the stack holds, in place of whatever padding left there",
            },
            {
                name: "paddingInline",
                type: padding,
                description:
                    "The room left at either end of what the stack holds, in place of whatever padding left there",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "StackItem",
        props: [
            {
                name: "grow",
                type: "boolean",
                default: "false",
                description: "Takes the room left over, in place of keeping to its own size",
            },
            {
                name: "shrink",
                type: "boolean",
                default: "false",
                description:
                    "Gives up room where there is not enough for everything, in place of running past the end",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the stack is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Stack = () => (
    <StackComponent gap="spacious" paddingBlock="spacious">
        <StackComponent gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Stack
            </Heading>
            <Text as="p" size="large">
                A row or a column, with the room left between what stands in it named rather than
                measured. It is what the rest of the library is laid out with, so what is left
                between two things and what is left around them are steps of the one scale.
            </Text>
        </StackComponent>
        <ComponentExamples component="Stack" examples={examples} />
        <ComponentProps groups={groups} />
    </StackComponent>
);

export default Stack;
