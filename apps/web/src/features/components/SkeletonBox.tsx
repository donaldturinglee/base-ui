import {
    Heading,
    SkeletonBox as SkeletonBoxComponent,
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

// The plainest box there is: nothing said with a prop, so it comes to one line tall and the width
// of whatever holds it, which is what a box standing in for a line of text wants.
//
// The page and the component it is about are both called SkeletonBox, so the component is brought
// in under a name saying which of the two it is. The listing beneath says SkeletonBox, as an
// application importing it would
const defaultPreview = <SkeletonBoxComponent />;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<SkeletonBox />`;

// How much room the box holds. The three are drawn together rather than one to an example, since
// what is being shown is what each of them was told rather than any one of the shapes: the first is
// told nothing, the second is told how wide, and the third is told how tall as well, so what has
// been added is the whole of the difference between them
const dimensionsPreview = (
    <Stack gap="condensed">
        <SkeletonBoxComponent />
        <SkeletonBoxComponent width="320px" />
        <SkeletonBoxComponent width="320px" height="64px" />
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the three read one under the other, so it is written out with them
const dimensionsCode = `<Stack gap="condensed">
    <SkeletonBox />
    <SkeletonBox width="320px" />
    <SkeletonBox width="320px" height="64px" />
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
        name: "Width and height",
        description:
            "How much room the box holds, each as a CSS length. A dimension left out is itself a choice: no width fills whatever holds the box, and no height comes to one line, which between them are what a box standing in for a line of text is already drawn as. It is told the room whatever it stands in for will take, so the page does not move when that arrives.",
        preview: dimensionsPreview,
        code: dimensionsCode,
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
// hanging off it, so there is the one table.
//
// How wide it is drawn comes first and how tall follows, since between them they are the whole of
// what the box is. There is nothing here about the shimmer: it is what says the box is waiting
// rather than a knob on it, so it is the component's own and is left off wherever the reader has
// asked for less motion
const groups: ComponentPropGroup[] = [
    {
        name: "SkeletonBox",
        props: [
            {
                name: "width",
                type: "string",
                description:
                    "How wide the box is drawn, as a CSS length. Left out, it fills the width of whatever holds it, since the box is drawn as a block",
            },
            {
                name: "height",
                type: "string",
                default: '"1rem"',
                description:
                    "How tall the box is drawn, as a CSS length. Left out, it comes to one line, which is what a box standing in for a line of text wants",
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
const SkeletonBox = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                SkeletonBox
            </Heading>
            <Text as="p" size="large">
                The room something will take, held while it is on its way. It is one line tall and
                the width of whatever holds it unless it is told otherwise, and it shimmers while it
                waits, unless the reader has asked for less motion. It is what the rest of the
                skeletons are made of: an avatar-shaped one is this box drawn round and to the
                avatar scale. A box standing in for something undecided rather than on its way is a
                placeholder instead.
            </Text>
        </Stack>
        <ComponentExamples component="SkeletonBox" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default SkeletonBox;
