import {
    AspectRatio as AspectRatioComponent,
    Heading,
    Placeholder,
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
    // The box works its height out from the width it stands in, so the examples give it one to
    // work from. Run out to the card, a square would be drawn as deep as the card is wide and a
    // reader would have the whole of it to scroll past before reaching the listing under it
    preview: "w-[20rem]",
    // The same again for a box standing beside others rather than alone, held to what a row of
    // three has room for. They are all held to the one width, since what tells the shapes apart
    // is then the height each of them worked out from it
    ratio: "w-[12rem]",
};

// The plainest box there is: a shape to keep, and something inside it to show it being kept. What
// shape is left out, so it comes to the square a box is drawn as when it is not told otherwise.
//
// The box holds its place before anything has arrived rather than drawing anything itself, so what
// is put in it here is the placeholder the library ships for standing in. The Stack that stands it
// in the middle of the card and the width it is held to are the page's own furniture, as the card
// around it is, so the listing beneath is of the box alone: standing on its own, a box takes its
// width from whatever an application already put it in.
//
// The page and the component it is about are both called AspectRatio, so the component is brought
// in under a name saying which of the two it is. The listing beneath says AspectRatio, as an
// application importing it would
const defaultPreview = (
    <Stack align="center">
        <AspectRatioComponent className={classes.preview}>
            <Placeholder height="100%" label="1 / 1" />
        </AspectRatioComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<AspectRatio>
    <Placeholder height="100%" label="1 / 1" />
</AspectRatio>`;

// The one thing the box is told, which is the shape to keep. The three are drawn together rather
// than one to an example, since a shape is read against the others rather than on its own: apart
// they are three boxes, and side by side they are a scale.
//
// They stand in a row in the middle of the card, as the box above them does, each held to the same
// width, so the height is the whole of what tells them apart and the three shapes are read off one
// another at a glance. A row hands its full height to what stands in it unless it is told
// otherwise, which would settle a height these boxes are meant to work out for themselves, so they
// are held to the top of it instead. A viewport with no room for three of them across takes them
// in as many rows as it has room for, each row set in the middle as the one above it was.
//
// Each is named for the shape it was asked for, so what is read off the box is the ratio that drew
// it. The square comes first and is left untold, as the plainest example above it is, so what the
// two that follow have been given is the whole of the difference between them
const ratiosPreview = (
    <Stack direction="horizontal" gap="normal" align="start" justify="center" wrap="wrap">
        <AspectRatioComponent className={classes.ratio}>
            <Placeholder height="100%" label="1 / 1" />
        </AspectRatioComponent>
        <AspectRatioComponent ratio={16 / 9} className={classes.ratio}>
            <Placeholder height="100%" label="16 / 9" />
        </AspectRatioComponent>
        <AspectRatioComponent ratio={4 / 3} className={classes.ratio}>
            <Placeholder height="100%" label="4 / 3" />
        </AspectRatioComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the three read beside one another, so it is written out with them, and
// everything it was told with it, where it stands included. The example above is set in the middle
// by a Stack that does nothing else, which is the page's own and is left out; nothing is held back
// from one already being shown.
//
// The width is written out too, where above it was the page's own: a box standing alone takes its
// width from whatever it was put in, but one standing in a row has to be told, and it is the three
// being held to the same width that makes a scale of them. It is written out as the class it
// stands for rather than as the name the page holds it under, since what is copied out of here has
// only itself to reach for
const ratiosCode = `<Stack direction="horizontal" gap="normal" align="start" justify="center" wrap="wrap">
    <AspectRatio className="w-[12rem]">
        <Placeholder height="100%" label="1 / 1" />
    </AspectRatio>
    <AspectRatio ratio={16 / 9} className="w-[12rem]">
        <Placeholder height="100%" label="16 / 9" />
    </AspectRatio>
    <AspectRatio ratio={4 / 3} className="w-[12rem]">
        <Placeholder height="100%" label="4 / 3" />
    </AspectRatio>
</Stack>`;

// The box as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Ratios",
        description:
            "The shape the box keeps, as its width divided by its height. It is written the way it is worked out rather than as the number that falls out of it, so what is read is the shape being asked for. A box that is not told one is square.",
        preview: ratiosPreview,
        code: ratiosCode,
    },
];

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

// Every prop the box takes. It is drawn as the one element rather than as a component with parts
// hanging off it, so there is the one table
const groups: ComponentPropGroup[] = [
    {
        name: "AspectRatio",
        props: [
            {
                name: "ratio",
                type: "number",
                default: "1",
                description:
                    "The shape the box keeps, as its width divided by its height. It is written the way it is worked out, so 16 / 9 rather than the number that falls out of it",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the box is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const AspectRatio = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                AspectRatio
            </Heading>
            <Text as="p" size="large">
                A box that works its height out from the width it is given, so it holds its place on
                the page before whatever goes in it has arrived. What is put inside is laid over the
                whole of it and cropped to it, so an image is set down as it comes rather than
                measured first.
            </Text>
        </Stack>
        <ComponentExamples component="AspectRatio" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default AspectRatio;
