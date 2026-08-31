import { Box as BoxComponent, Heading, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// The box as it is reached for: room left around what it holds, and the surface it stands on drawn
// under it. A box told nothing draws nothing at all, since every one of its props falls back to
// none, so the plainest example there is of it is still one that has been asked for something —
// there would otherwise be a card on the page with an unmarked element inside it.
//
// The page and the component it is about are both called Box, so the component is brought in under
// a name saying which of the two it is. The listing beneath says Box, as an application importing
// it would
const defaultPreview = (
    <BoxComponent padding="normal" background="muted" border="default" radius="medium">
        <Text>A box leaves room around what it holds and draws the surface it stands on</Text>
    </BoxComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Box padding="normal" background="muted" border="default" radius="medium">
    <Text>A box leaves room around what it holds and draws the surface it stands on</Text>
</Box>`;

// The fill drawn behind what the box holds. The five are drawn together rather than one to an
// example, since a fill is read against the others rather than on its own: apart they are five
// boxes, and one under the other they are a scale.
//
// Each is given the line and the corners so that the fill is the whole of the difference between
// them, and is named for the fill it was given, so what is read off the box is the value that drew
// it
const backgroundsPreview = (
    <Stack gap="condensed">
        <BoxComponent padding="normal" border="muted" radius="medium">
            <Text>none</Text>
        </BoxComponent>
        <BoxComponent padding="normal" background="default" border="muted" radius="medium">
            <Text>default</Text>
        </BoxComponent>
        <BoxComponent padding="normal" background="muted" border="muted" radius="medium">
            <Text>muted</Text>
        </BoxComponent>
        <BoxComponent padding="normal" background="inset" border="muted" radius="medium">
            <Text>inset</Text>
        </BoxComponent>
        <BoxComponent padding="normal" background="emphasis" border="muted" radius="medium">
            <Text>emphasis</Text>
        </BoxComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the five read one under the other, so it is written out with them
const backgroundsCode = `<Stack gap="condensed">
    <Box padding="normal" border="muted" radius="medium">
        <Text>none</Text>
    </Box>
    <Box padding="normal" background="default" border="muted" radius="medium">
        <Text>default</Text>
    </Box>
    <Box padding="normal" background="muted" border="muted" radius="medium">
        <Text>muted</Text>
    </Box>
    <Box padding="normal" background="inset" border="muted" radius="medium">
        <Text>inset</Text>
    </Box>
    <Box padding="normal" background="emphasis" border="muted" radius="medium">
        <Text>emphasis</Text>
    </Box>
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
        name: "Backgrounds",
        description:
            "The fill drawn behind whatever the box holds. Emphasis is the one fill dark enough to be read against, so the box turns the text standing on it over itself rather than leaving that to the caller.",
        preview: backgroundsPreview,
        code: backgroundsCode,
    },
];

// The room left inside the box, on the same scale a stack leaves between its children, so the room
// inside a box and the room between boxes read the same
const padding = '"none" | "tight" | "condensed" | "cozy" | "normal" | "spacious"';

// The fill drawn behind whatever the box holds
const background = '"none" | "default" | "muted" | "inset" | "emphasis"';

// The line drawn around the box
const border = '"none" | "default" | "muted"';

// How far the corners are turned in
const radius = '"none" | "small" | "medium" | "large" | "full"';

// How far the box is lifted off the page. The steps are the resting ones, since a box sits on the
// page rather than floating over it
const shadow = '"none" | "xsmall" | "small" | "medium"';

// Whether what is inside spills past the edges or is cropped to them
const overflow = '"visible" | "hidden"';

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
// hanging off it, so there is the one table.
//
// The room left inside is written up first, since it is what a box is most often reached for, and
// what is drawn around that room follows it: the fill, the line, the corners, the lift, and last
// what becomes of anything that will not fit
const groups: ComponentPropGroup[] = [
    {
        name: "Box",
        props: [
            {
                name: "padding",
                type: padding,
                default: '"none"',
                description: "The room left inside the box, on every side of what it holds",
            },
            {
                name: "paddingBlock",
                type: padding,
                description:
                    "The room left above and below what the box holds, in place of whatever padding left there",
            },
            {
                name: "paddingInline",
                type: padding,
                description:
                    "The room left at either end of what the box holds, in place of whatever padding left there",
            },
            {
                name: "background",
                type: background,
                default: '"none"',
                description:
                    "The fill drawn behind whatever the box holds. Emphasis turns the text standing on it over, since it is the one fill dark enough to have to",
            },
            {
                name: "border",
                type: border,
                default: '"none"',
                description: "The line drawn around the box",
            },
            {
                name: "radius",
                type: radius,
                default: '"none"',
                description: "How far the corners are turned in",
            },
            {
                name: "shadow",
                type: shadow,
                default: '"none"',
                description:
                    "How far the box is lifted off the page. The steps are the resting ones, since a box sits on the page rather than floating over it",
            },
            {
                name: "overflow",
                type: overflow,
                default: '"visible"',
                description:
                    "Whether what is inside spills past the edges or is cropped to them, which is what turned corners need of anything drawn out to them. A box that should scroll what it cannot show is a scrollable region instead",
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
const Box = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Box
            </Heading>
            <Text as="p" size="large">
                The plain surface of the system: the room, the fill, the line, the corners and the
                lift the library already names, without the layout a Stack or a Card brings along
                with them. It draws nothing it was not asked for, so what it is drawn as is left to
                say what it means.
            </Text>
        </Stack>
        <ComponentExamples component="Box" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Box;
