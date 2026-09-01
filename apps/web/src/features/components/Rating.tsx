import * as React from "react";
import { Heading, Rating as RatingComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// The plainest rating there is: a row of stars standing where it was started at, with nothing said
// about how many of them there are or how big they are drawn. It keeps its own value, since nothing
// was handed one to hold.
//
// It is named for what it is asking rather than for the stars in it. A rating that can be moved is
// a group of radios, and a group says what it is a group of; the stars themselves only say which
// of the group each of them is.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the rating alone. The card lays what it is handed out in a
// column, and a column draws what it holds the whole way across unless it is told otherwise, which
// would leave the row of stars sitting in a target the width of the page.
//
// The page and the component it is about are both called Rating, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Rating, as an application
// importing it would
const defaultPreview = (
    <Stack align="start">
        <RatingComponent defaultValue={3} aria-label="Rate this article" />
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Rating defaultValue={3} aria-label="Rate this article" />`;

// How big the stars are drawn, and with them how far apart they sit. The three are drawn together
// rather than one to an example, since a size is read against the others rather than on its own.
//
// A rating carries no words to be named by, so each is named by a Text beside it. That naming is
// part of what is being shown rather than the page's own furniture, since without it the three
// would be three rows of stars with nothing to say which of them is which
const sizesPreview = (
    <Stack gap="condensed" align="start">
        <Stack direction="horizontal" gap="condensed" align="center">
            <RatingComponent size="small" defaultValue={3} aria-label="Rated in small" />
            <Text size="small">small</Text>
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="center">
            <RatingComponent size="medium" defaultValue={3} aria-label="Rated in medium" />
            <Text size="small">medium</Text>
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="center">
            <RatingComponent size="large" defaultValue={3} aria-label="Rated in large" />
            <Text size="small">large</Text>
        </Stack>
    </Stack>
);

const sizesCode = `<Stack gap="condensed" align="start">
    <Stack direction="horizontal" gap="condensed" align="center">
        <Rating size="small" defaultValue={3} aria-label="Rated in small" />
        <Text size="small">small</Text>
    </Stack>
    <Stack direction="horizontal" gap="condensed" align="center">
        <Rating size="medium" defaultValue={3} aria-label="Rated in medium" />
        <Text size="small">medium</Text>
    </Stack>
    <Stack direction="horizontal" gap="condensed" align="center">
        <Rating size="large" defaultValue={3} aria-label="Rated in large" />
        <Text size="small">large</Text>
    </Stack>
</Stack>`;

// How many stars the rating is read out of. It comes to five where it is not told, so the one worth
// showing is a row of some other length, and the name it is given says what it is out of rather
// than leaving that to be counted off the stars
const countPreview = (
    <Stack align="start">
        <RatingComponent count={10} defaultValue={7} aria-label="Rate this article out of ten" />
    </Stack>
);

const countCode = `<Rating count={10} defaultValue={7} aria-label="Rate this article out of ten" />`;

// The rating as something read rather than something given: the same stars, with nothing behind
// them to pick. It is what an average of many ratings is shown as, and an average rarely lands on a
// star, so the value is drawn standing where it fell rather than moved to the nearer one.
//
// It is not named here. A reading with nothing said about it names itself by what it reads, which
// is the whole of what it has to say; the number beside it is for whoever is reading the page
// rather than being read to
const readingPreview = (
    <Stack direction="horizontal" gap="condensed" align="center">
        <RatingComponent value={3.5} readOnly size="large" />
        <Text size="small">3.5 out of 5</Text>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the stars and the number read together, so it is written out with them
const readingCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <Rating value={3.5} readOnly size="large" />
    <Text size="small">3.5 out of 5</Text>
</Stack>`;

// The rating with the value held by whoever is drawing it rather than by the rating. It is a
// component of its own rather than an element the page holds ready, since the value has to be kept
// somewhere for it to be handed back down.
//
// What the caller does with the value is the reason for holding it at all, so it is put to use
// beside the stars rather than only stored
const ControlledPreview = () => {
    const [value, setValue] = React.useState(2);

    return (
        <Stack direction="horizontal" gap="condensed" align="center">
            <RatingComponent value={value} onChange={setValue} aria-label="Rate this article" />
            <Text size="small">{value} out of 5</Text>
        </Stack>
    );
};

// What the example has to have in hand before it can be drawn. The rating is told where it stands
// rather than keeping it, so the value is the caller's and is got ready here
const controlledSetup = `const [value, setValue] = React.useState(2);`;

const controlledCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <Rating value={value} onChange={setValue} aria-label="Rate this article" />
    <Text size="small">{value} out of 5</Text>
</Stack>`;

// The rating as it is reached for, drawn and written out one above the other. The plainest one comes
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
            "How big the stars are drawn, and how far apart they sit. The room between them is carried by the stars themselves rather than by the row, so the row is one unbroken target and a pointer resting between two stars is still resting on one of them.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Count",
        description:
            "How many stars the rating is read out of. The scale is said in the name as well as drawn, since a reader who is hearing the rating rather than seeing it has no row of stars to count.",
        preview: countPreview,
        code: countCode,
    },
    {
        name: "Reading",
        description:
            "The rating as something read rather than something given. There is nothing behind the stars to pick, so a value standing between two of them is left standing there, which is what an average of many ratings usually does. It is read as one thing rather than as a row of stars, and names itself by what it reads where it is given no name of its own.",
        preview: readingPreview,
        code: readingCode,
    },
    {
        name: "Controlled",
        description:
            "The value held by whoever is drawing the rating rather than by the rating. It is told where it stands and says where it has been moved to, which is what a rating standing beside anything else that has to agree with it is given.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
];

// How big the stars are drawn, and how far apart they sit
const size = '"small" | "medium" | "large"';

// What the rating says when it is moved. It is handed the star it has moved to rather than an
// event, since the star is the whole of what happened
const onChange = "(value: number) => void";

// What is put into words for a screen reader. The count is handed over with the value, so the words
// can say what the value is out of rather than being written for the one scale
const label = "(value: number, count: number) => string";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the rating takes. It is drawn as the one element rather than as a component with parts
// hanging off it, so there is the one table. It is drawn as a span and takes what a span takes, and
// is not drawn as anything else, so there is no `as` among them.
//
// How many stars there are is written up first, since it is what the value is read against; where
// the rating stands and what it says when it moves follow, then how it is drawn, then what it can
// and cannot be asked to do, and last what is submitted and what is heard
const groups: ComponentPropGroup[] = [
    {
        name: "Rating",
        props: [
            {
                name: "count",
                type: "number",
                default: "5",
                description:
                    "How many stars the rating is read out of. The row is drawn from whole stars, so a count between two of them is taken down to the one below it",
            },
            {
                name: "value",
                type: "number",
                description:
                    "Which star the rating stands at, where the caller is holding the value. A value past either end of the row is brought back to the end it ran past before the stars are filled from it",
            },
            {
                name: "defaultValue",
                type: "number",
                default: "0",
                description:
                    "Which star the rating starts out at, where it is keeping the value itself. It is read once, so a rating started this way is moved by whoever is using it rather than from outside",
            },
            {
                name: "onChange",
                type: onChange,
                description:
                    "Called with the star the rating has moved to, which is nought where it has been cleared",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description: "How big the stars are drawn, and how far apart they sit",
            },
            {
                name: "readOnly",
                type: "boolean",
                default: "false",
                description:
                    "Draws the rating as a reading rather than a control. The stars are drawn without the radios behind them, so there is nothing to pick and a value standing between two stars is left standing there",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the rating being moved and takes it out of the tab order, the way a disabled radio is. It is for a control that is not available just now; a reading that was never a control is read-only instead",
            },
            {
                name: "clearable",
                type: "boolean",
                default: "false",
                description:
                    "Lets the star the rating already stands at be picked again to take it back to none, which is otherwise the one value a rating cannot be moved to once it has left it",
            },
            {
                name: "name",
                type: "string",
                description:
                    "What the browser groups the stars under, and the name the value is submitted with. One is made up where none is given, since a radio without a name is a group of its own and every rating on the page would otherwise be the same group",
            },
            {
                name: "itemLabel",
                type: label,
                description:
                    "What is heard for each star as it is moved through. It comes to the star's own place in the row, said in stars, which is what a scale of no particular kind counts in",
            },
            {
                name: "valueLabel",
                type: label,
                description:
                    "What is heard for a reading, which is read as one thing rather than as a row of stars. It comes to the value out of the count, and is what names a reading that was given no name of its own",
            },
            styling,
            {
                name: "aria-label",
                type: "string",
                description:
                    "Names the rating in words. A rating that can be moved is a group of radios and is named by what it is asking, since the stars only say which of the group each of them is. A reading names itself by what it reads, so it takes one of these only where there is more to say than the value",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the rating is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Rating = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Rating
            </Heading>
            <Text as="p" size="large">
                How well a thing was thought of, read as a row of stars. One that can be moved is a
                group of radios drawn over as stars, so the picking, the arrow keys and the tab stop
                are the browser's own; one that is only read is the same stars with nothing behind
                them, and stands where the value put it rather than at the nearer star.
            </Text>
        </Stack>
        <ComponentExamples component="Rating" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Rating;
