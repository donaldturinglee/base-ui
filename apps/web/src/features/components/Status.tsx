import { Heading, Stack, Status as StatusComponent, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// The plainest report there is: the dot, the words beside it, and nothing said with a prop. It
// comes to the grey a status is drawn in where nothing is being claimed about the condition, which
// is what a thing nobody is watching is in.
//
// What the row holds is written by the caller rather than drawn here, so the dot is put in where it
// is read: before the words, since it is what the eye arrives at first.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the status alone. The card lays what it is handed out in a
// column, and a column stretches what it holds the whole way across unless it is told otherwise.
//
// The page and the component it is about are both called Status, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Status, as an application
// importing it would
const defaultPreview = (
    <Stack align="start">
        <StatusComponent>
            <StatusComponent.Indicator />
            Not monitored
        </StatusComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Status>
    <Status.Indicator />
    Not monitored
</Status>`;

// What the status is saying. The seven are drawn together rather than one to an example, since a
// condition is read against the others rather than on its own: apart they are seven dots, and one
// under the other they are the palette a reader is choosing from.
//
// Each is named for the variant it was given, so what is read off the row is the value that drew
// it. They are laid down rather than across, since the colour is what draws the eye down a column
// of these, which is how a page reporting on several things is read
const variantsPreview = (
    <Stack gap="condensed" align="start">
        <StatusComponent variant="accent">
            <StatusComponent.Indicator />
            accent
        </StatusComponent>
        <StatusComponent variant="success">
            <StatusComponent.Indicator />
            success
        </StatusComponent>
        <StatusComponent variant="attention">
            <StatusComponent.Indicator />
            attention
        </StatusComponent>
        <StatusComponent variant="severe">
            <StatusComponent.Indicator />
            severe
        </StatusComponent>
        <StatusComponent variant="danger">
            <StatusComponent.Indicator />
            danger
        </StatusComponent>
        <StatusComponent variant="done">
            <StatusComponent.Indicator />
            done
        </StatusComponent>
        <StatusComponent variant="neutral">
            <StatusComponent.Indicator />
            neutral
        </StatusComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the seven read one under the other, so it is written out with them. The
// example above is held to the start of the card by a Stack that does nothing else, which is the
// page's own and is left out; nothing is held back from one that is already being shown
const variantsCode = `<Stack gap="condensed" align="start">
    <Status variant="accent">
        <Status.Indicator />
        accent
    </Status>
    <Status variant="success">
        <Status.Indicator />
        success
    </Status>
    <Status variant="attention">
        <Status.Indicator />
        attention
    </Status>
    <Status variant="severe">
        <Status.Indicator />
        severe
    </Status>
    <Status variant="danger">
        <Status.Indicator />
        danger
    </Status>
    <Status variant="done">
        <Status.Indicator />
        done
    </Status>
    <Status variant="neutral">
        <Status.Indicator />
        neutral
    </Status>
</Stack>`;

// How much room the row takes. The three are drawn together for the same reason the variants are,
// and are lined up on their centres rather than at their feet, so what is read between them is the
// size and not where each of them was set down.
//
// The dot and the words are sized together, and the room left between them grows with the dot, so
// the two stay the same distance apart to the eye at every step
const sizesPreview = (
    <Stack direction="horizontal" gap="normal" align="center" wrap="wrap">
        <StatusComponent size="small" variant="success">
            <StatusComponent.Indicator />
            small
        </StatusComponent>
        <StatusComponent size="medium" variant="success">
            <StatusComponent.Indicator />
            medium
        </StatusComponent>
        <StatusComponent size="large" variant="success">
            <StatusComponent.Indicator />
            large
        </StatusComponent>
    </Stack>
);

const sizesCode = `<Stack direction="horizontal" gap="normal" align="center" wrap="wrap">
    <Status size="small" variant="success">
        <Status.Indicator />
        small
    </Status>
    <Status size="medium" variant="success">
        <Status.Indicator />
        medium
    </Status>
    <Status size="large" variant="success">
        <Status.Indicator />
        large
    </Status>
</Stack>`;

// The row carrying the dot alone, for a cell too narrow for the words or a legend that has already
// said what the colours mean. The dot is drawn for the eye and kept from a screen reader, so the
// words it would otherwise miss are given to the status instead
const unlabelledPreview = (
    <Stack direction="horizontal" gap="condensed" align="center">
        <StatusComponent variant="success" srText="API">
            <StatusComponent.Indicator />
        </StatusComponent>
        <StatusComponent variant="attention" srText="Webhooks">
            <StatusComponent.Indicator />
        </StatusComponent>
        <StatusComponent variant="danger" srText="Packages">
            <StatusComponent.Indicator />
        </StatusComponent>
    </Stack>
);

const unlabelledCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <Status variant="success" srText="API">
        <Status.Indicator />
    </Status>
    <Status variant="attention" srText="Webhooks">
        <Status.Indicator />
    </Status>
    <Status variant="danger" srText="Packages">
        <Status.Indicator />
    </Status>
</Stack>`;

// The dot answering for itself. Above, one asked for a colour of its own inside a status that was
// told another, which is how the dot says something the words do not; below, a run of them standing
// where no status is, which is what a dot beside an avatar or in a cell too narrow for words comes
// to. Outside a status there is nothing to inherit from, so each is told its own colour and size
const indicatorPreview = (
    <Stack gap="normal" align="start">
        <StatusComponent variant="neutral">
            <StatusComponent.Indicator variant="danger" />
            Not monitored, last seen failing
        </StatusComponent>
        <Stack direction="horizontal" gap="condensed" align="center">
            <StatusComponent.Indicator variant="success" size="large" />
            <StatusComponent.Indicator variant="attention" size="large" />
            <StatusComponent.Indicator variant="danger" size="large" />
        </Stack>
    </Stack>
);

const indicatorCode = `<Stack gap="normal" align="start">
    <Status variant="neutral">
        <Status.Indicator variant="danger" />
        Not monitored, last seen failing
    </Status>
    <Stack direction="horizontal" gap="condensed" align="center">
        <Status.Indicator variant="success" size="large" />
        <Status.Indicator variant="attention" size="large" />
        <Status.Indicator variant="danger" size="large" />
    </Stack>
</Stack>`;

// The status as it is reached for, drawn and written out one above the other. The plainest one
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
            "What the status is saying, rather than the colour it happens to be drawn in, so the scheme underneath can be changed without every name going stale. Only the dot is painted: the words are left in the ordinary foreground, so the colour draws the eye down a column of these while the words say which one it stopped at.",
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "Sizes",
        description:
            "How much room the row takes. The dot and the words are sized together, and the room left between them grows with the dot, so the two stay the same distance apart to the eye at every step. The words are the body text's own steps, so a status read inside a line takes the size of that line.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Without a label",
        description:
            "The row carrying the dot alone, for a cell too narrow for the words or a legend that has already said what the colours mean. The dot is drawn for the eye and kept out of the accessibility tree, so srText gives the row the words a screen reader would otherwise have nothing to read.",
        preview: unlabelledPreview,
        code: unlabelledCode,
    },
    {
        name: "The indicator on its own terms",
        description:
            "The dot takes its colour and its size from the status it is written in, so neither is named twice. Named on the dot instead, they say something the words do not — a thing nobody is watching that was last seen failing. Named on a dot standing where no status is, they are all it has to go on, which is what a dot beside an avatar or in a cell too narrow for words needs.",
        preview: indicatorPreview,
        code: indicatorCode,
    },
];

// What the status is saying, rather than the colour it happens to be drawn in
const variant = '"accent" | "success" | "attention" | "severe" | "danger" | "done" | "neutral"';

// How much room the row takes, which is the dot, the words, and the room left between them
const size = '"small" | "medium" | "large"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the status and its one part take, under the one that takes it.
//
// The status comes first, since what is being said and how much room it takes are both settled
// there and the dot reads them off it; the dot follows, with the two it takes only to say something
// the status did not
const groups: ComponentPropGroup[] = [
    {
        name: "Status",
        props: [
            {
                name: "variant",
                type: variant,
                default: '"neutral"',
                description:
                    "What the status is saying, rather than the colour it happens to be drawn in, so the scheme underneath can be changed without every name going stale. It paints the dot alone; the words are left in the ordinary foreground, since the colour is what draws the eye and the words are what say which one it stopped at",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How much room the row takes. The dot and the words are sized together and the room left between them grows with the dot, so the two stay the same distance apart to the eye at every step. The words are the body text's own steps, so a status read inside a line takes the size of that line",
            },
            {
                name: "srText",
                type: "string",
                description:
                    "Words read in place of the dot where the row carries no others. The dot is kept out of the accessibility tree, so a row without words says nothing at all until this is given",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"span"',
                description:
                    "The element or component this is drawn as, in place of its default. A status is a span, so it can be read inside a line; a report that is a block of its own is drawn as a div instead",
            },
        ],
    },
    {
        name: "Status.Indicator",
        props: [
            {
                name: "variant",
                type: variant,
                description:
                    "What the dot is saying. Left out, it is the one the status around it was told, so it is named here only to say something the words do not, or where the dot is read outside a status and has nothing to take it from",
            },
            {
                name: "size",
                type: size,
                description:
                    "How large the dot is drawn. Left out, it is the one the status around it was told, and outside a status it comes to medium",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the status is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Status = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Status
            </Heading>
            <Text as="p" size="large">
                The condition something is in, read as a coloured dot with the words beside it. The
                dot carries the colour and the words are left in the ordinary foreground, so the
                colour draws the eye down a column of these while the words say which one it stopped
                at, and neither is asked to do the other&apos;s work. What the row holds is written
                by the caller rather than drawn here, so what is read is what was written, in the
                order it was written.
            </Text>
        </Stack>
        <ComponentExamples component="Status" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Status;
