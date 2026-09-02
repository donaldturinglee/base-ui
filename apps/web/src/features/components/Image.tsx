import { Heading, Image as ImageComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // The picture is held to the width of whatever it stands in, so on a card as wide as the page
    // it would be drawn at the size it was fetched at and a reader would have the whole of it to
    // scroll past. It is given a width to be read at instead
    preview: "w-[12rem]",
    // A box wider than it is tall, and both smaller than the picture, so every way of fitting one
    // into the other has something to answer. The same box is given to each of them, since what
    // tells the specimens apart is then the fitting alone
    box: "w-[8rem] h-[6rem]",
};

// Where the picture is fetched from. It is the one the avatar pages are drawn with, so whoever is
// shown here and whoever is shown there are the same person
const source = "https://avatars.githubusercontent.com/u/7143434?v=4";

// What an example has to have in hand before it can be drawn. The address is written once and
// reached for by each of them, rather than run out along a line that would then have to be read
// across
const sourceSetup = `const source = "https://avatars.githubusercontent.com/u/7143434?v=4";`;

// And the box the specimens are fitted into, for the examples that stand more than one of them
// beside each other. It is the page's own, but it is part of what those examples are showing
// rather than furniture around them, so it is written out with the source
const boxSetup = `${sourceSetup}
const box = "w-[8rem] h-[6rem]";`;

// The plainest picture there is: where it is fetched from, and what it tells a reader who cannot
// see it. Nothing is said about how it sits or how its corners are drawn.
//
// The width it is held to, and its standing in the middle of the card, are the page's own
// furniture, as the card around it is, so the listing beneath is of the picture alone: standing on
// its own it is held to the width of whatever an application already put it in. It is set in the
// middle the way the pictures on the avatar and aspect ratio pages are, since a picture drawn to a
// width of its own leaves room either side of it and reads as having been put down rather than
// left where it fell.
//
// The page and the component it is about are both called Image, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Image, as an application
// importing it would
const defaultPreview = (
    <Stack align="center">
        <ImageComponent src={source} alt="Mona Lisa Octocat" className={classes.preview} />
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Image src={source} alt="Mona Lisa Octocat" />`;

// How the picture is made to sit in a box that is a shape of its own rather than one the picture
// settled for itself. The five are drawn together rather than one to an example, since a fitting
// is read against the others rather than on its own.
//
// Each is named by the value that drew it, so what is read off the box is the fitting it was
// given, and the name stands in the middle of the box it belongs to rather than at the start of
// it, so which name goes with which box is not left to be worked out along a row of them.
//
// The specimens are held to the top of the row rather than stretched down it, since a box told
// how tall to be is what the fitting has to answer, and the row is set in the middle of the card,
// so the line the five stand on reads as one thing however many of them a viewport has room for
const fitPreview = (
    <Stack direction="horizontal" gap="normal" align="start" justify="center" wrap="wrap">
        <Stack gap="condensed" align="center">
            <ImageComponent
                src={source}
                alt="Mona Lisa Octocat"
                fit="contain"
                className={classes.box}
            />
            <Text size="small">contain</Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <ImageComponent
                src={source}
                alt="Mona Lisa Octocat"
                fit="cover"
                className={classes.box}
            />
            <Text size="small">cover</Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <ImageComponent
                src={source}
                alt="Mona Lisa Octocat"
                fit="fill"
                className={classes.box}
            />
            <Text size="small">fill</Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <ImageComponent
                src={source}
                alt="Mona Lisa Octocat"
                fit="none"
                className={classes.box}
            />
            <Text size="small">none</Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <ImageComponent
                src={source}
                alt="Mona Lisa Octocat"
                fit="scale-down"
                className={classes.box}
            />
            <Text size="small">scale-down</Text>
        </Stack>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the five read beside one another, so it is written out with them. The box is
// named as the const the example was given rather than spelled out five times over, which is how
// the page holds it as well
const fitCode = `<Stack direction="horizontal" gap="normal" align="start" justify="center" wrap="wrap">
    <Stack gap="condensed" align="center">
        <Image src={source} alt="Mona Lisa Octocat" fit="contain" className={box} />
        <Text size="small">contain</Text>
    </Stack>
    <Stack gap="condensed" align="center">
        <Image src={source} alt="Mona Lisa Octocat" fit="cover" className={box} />
        <Text size="small">cover</Text>
    </Stack>
    <Stack gap="condensed" align="center">
        <Image src={source} alt="Mona Lisa Octocat" fit="fill" className={box} />
        <Text size="small">fill</Text>
    </Stack>
    <Stack gap="condensed" align="center">
        <Image src={source} alt="Mona Lisa Octocat" fit="none" className={box} />
        <Text size="small">none</Text>
    </Stack>
    <Stack gap="condensed" align="center">
        <Image src={source} alt="Mona Lisa Octocat" fit="scale-down" className={box} />
        <Text size="small">scale-down</Text>
    </Stack>
</Stack>`;

// How far the corners are taken off, read and named the same way the fittings are. Each is given
// the same box and the same fitting, so the corners are the whole of what tells them apart
const radiusPreview = (
    <Stack direction="horizontal" gap="normal" align="start" justify="center" wrap="wrap">
        <Stack gap="condensed" align="center">
            <ImageComponent
                src={source}
                alt="Mona Lisa Octocat"
                borderRadius="none"
                className={classes.box}
            />
            <Text size="small">none</Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <ImageComponent
                src={source}
                alt="Mona Lisa Octocat"
                borderRadius="small"
                className={classes.box}
            />
            <Text size="small">small</Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <ImageComponent
                src={source}
                alt="Mona Lisa Octocat"
                borderRadius="medium"
                className={classes.box}
            />
            <Text size="small">medium</Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <ImageComponent
                src={source}
                alt="Mona Lisa Octocat"
                borderRadius="large"
                className={classes.box}
            />
            <Text size="small">large</Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <ImageComponent
                src={source}
                alt="Mona Lisa Octocat"
                borderRadius="full"
                className={classes.box}
            />
            <Text size="small">full</Text>
        </Stack>
    </Stack>
);

const radiusCode = `<Stack direction="horizontal" gap="normal" align="start" justify="center" wrap="wrap">
    <Stack gap="condensed" align="center">
        <Image src={source} alt="Mona Lisa Octocat" borderRadius="none" className={box} />
        <Text size="small">none</Text>
    </Stack>
    <Stack gap="condensed" align="center">
        <Image src={source} alt="Mona Lisa Octocat" borderRadius="small" className={box} />
        <Text size="small">small</Text>
    </Stack>
    <Stack gap="condensed" align="center">
        <Image src={source} alt="Mona Lisa Octocat" borderRadius="medium" className={box} />
        <Text size="small">medium</Text>
    </Stack>
    <Stack gap="condensed" align="center">
        <Image src={source} alt="Mona Lisa Octocat" borderRadius="large" className={box} />
        <Text size="small">large</Text>
    </Stack>
    <Stack gap="condensed" align="center">
        <Image src={source} alt="Mona Lisa Octocat" borderRadius="full" className={box} />
        <Text size="small">full</Text>
    </Stack>
</Stack>`;

// A source that cannot be reached, and the one held in reserve for it. The address is written out
// here rather than held in a const, since a source that goes nowhere is the whole of what the
// example is about
const fallbackPreview = (
    <Stack align="center">
        <ImageComponent
            src="https://example.invalid/missing.png"
            fallbackSrc={source}
            alt="Mona Lisa Octocat"
            className={classes.box}
        />
    </Stack>
);

const fallbackCode = `<Image
    src="https://example.invalid/missing.png"
    fallbackSrc={source}
    alt="Mona Lisa Octocat"
    className={box}
/>`;

// The picture as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: sourceSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Fit",
        description:
            "How the picture is made to sit in a box that is a shape of its own. It is cropped to fill the box unless it is told otherwise, which is what a picture standing in a place already laid out for it wants; contain shows the whole of it and leaves the room around it empty.",
        setup: boxSetup,
        preview: fitPreview,
        code: fitCode,
    },
    {
        name: "Border radius",
        description:
            "How far the corners are taken off. The full one draws the picture as an ellipse rather than a circle where the box it is given is not square, since it is the box being rounded rather than the picture.",
        setup: boxSetup,
        preview: radiusPreview,
        code: radiusCode,
    },
    {
        name: "A source that cannot be reached",
        description:
            "What is drawn in place of a picture that fails to load. What is remembered is the source that failed rather than the failure itself, so a source put in its place afterwards is given a chance of its own rather than inheriting the reserve the last one was answered with.",
        setup: boxSetup,
        preview: fallbackPreview,
        code: fallbackCode,
    },
];

// How the picture sits in the box it is given
const fit = '"contain" | "cover" | "fill" | "none" | "scale-down"';

// How far the corners are taken off
const borderRadius = '"none" | "small" | "medium" | "large" | "full"';

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
    default: '"img"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the picture takes. It is drawn as the one element rather than as a component with
// parts hanging off it, so there is the one table.
//
// How it is drawn is written up first, then what stands in for it where it cannot be fetched, and
// then the two the element carries already and the library answers differently. Where it is
// fetched from is the element's own and is left to say for itself
const groups: ComponentPropGroup[] = [
    {
        name: "Image",
        props: [
            {
                name: "fit",
                type: fit,
                default: '"cover"',
                description:
                    "How the picture sits in the box it is given, where that box is a shape of its own rather than one the picture settled for itself. It is cropped to fill the box unless it is told otherwise",
            },
            {
                name: "borderRadius",
                type: borderRadius,
                default: '"none"',
                description:
                    "How far the corners are taken off. The full one rounds the box rather than the picture, so a box that is not square is drawn as an ellipse",
            },
            {
                name: "fallbackSrc",
                type: "string",
                description:
                    "Put in the place of a source that fails to load. It is the source that failed that is remembered rather than the failure, so a source given afterwards is tried on its own account",
            },
            {
                name: "alt",
                type: "string",
                default: '""',
                description:
                    "What the picture tells a reader who cannot see it. It comes to nothing at all, which is what says a picture is decorative, so one carrying anything the words around it do not already say has to be given this",
            },
            {
                name: "loading",
                type: '"lazy" | "eager"',
                default: '"lazy"',
                description:
                    "Whether the picture is held back until it is near the viewport. The element's own default is to fetch at once and the library's is not, so a picture already in view when the page is opened asks for eager",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the picture is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Image = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Image
            </Heading>
            <Text as="p" size="large">
                A picture, held to the width of whatever it is put in so a source larger than its
                place on the page cannot push the page wider. Given a box of its own it is fitted to
                that box rather than stretching it, it is held back until it is near the viewport,
                and it can be given something to fall back on where it cannot be fetched.
            </Text>
        </Stack>
        <ComponentExamples component="Image" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Image;
