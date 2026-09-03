import {
    Heading,
    SkeletonAvatar as SkeletonAvatarComponent,
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

// The plainest one there is: nothing said with a prop, so it comes to a round one drawn at the size
// of a line of text, which is the size the avatar it stands in for comes to.
//
// The Stack that stands it in the middle of the card is the page's own furniture, as the card
// around it is, so the listing beneath is of the skeleton alone.
//
// The page and the component it is about are both called SkeletonAvatar, so the component is
// brought in under a name saying which of the two it is. The listing beneath says SkeletonAvatar,
// as an application importing it would
const defaultPreview = (
    <Stack align="center">
        <SkeletonAvatarComponent />
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<SkeletonAvatar />`;

// Whether the skeleton is drawn round or squared off. The two are drawn together rather than one to
// an example, since a shape is read against the other rather than on its own, and both are given a
// size the shape can be seen at
const shapePreview = (
    <Stack direction="horizontal" gap="normal" align="center" justify="center">
        <SkeletonAvatarComponent size={48} />
        <SkeletonAvatarComponent size={48} shape="square" />
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the two read beside one another, so it is written out with them, and
// everything it was told with it. The example above is set in the middle by a Stack that does
// nothing else, which is the page's own and is left out; nothing is held back from one that is
// already being shown
const shapeCode = `<Stack direction="horizontal" gap="normal" align="center" justify="center">
    <SkeletonAvatar size={48} />
    <SkeletonAvatar size={48} shape="square" />
</Stack>`;

// How wide the skeleton is drawn, which is also how tall. The four are drawn together rather than
// one to an example, since a size is read against the others rather than on its own: apart they are
// four circles, and beside each other they are a scale.
//
// None of them is named the way the specimens on the other pages are, since there is nothing inside
// a skeleton to write a name in; what each was given is read off the listing beneath instead
const sizesPreview = (
    <Stack direction="horizontal" gap="normal" align="center" justify="center">
        <SkeletonAvatarComponent size={16} />
        <SkeletonAvatarComponent size={24} />
        <SkeletonAvatarComponent size={32} />
        <SkeletonAvatarComponent size={48} />
    </Stack>
);

const sizesCode = `<Stack direction="horizontal" gap="normal" align="center" justify="center">
    <SkeletonAvatar size={16} />
    <SkeletonAvatar size={24} />
    <SkeletonAvatar size={32} />
    <SkeletonAvatar size={48} />
</Stack>`;

// The skeleton as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Shape",
        description:
            "Whether the skeleton is drawn round or with its corners turned in. It is told whichever shape the avatar it stands in for was told, since a round skeleton giving way to a squared avatar is read as the page having changed its mind. The corners are turned in further as the skeleton grows, so a small square stays only slightly rounded.",
        preview: shapePreview,
        code: shapeCode,
    },
    {
        name: "Sizes",
        description:
            "How wide the skeleton is drawn, which is also how tall. It is the avatar's own scale, so the skeleton is told the same size as whatever it stands in for and the page does not move when the picture arrives. A size given to a range instead of outright is drawn at whichever of them the viewport is in.",
        preview: sizesPreview,
        code: sizesCode,
    },
];

// How wide the skeleton is drawn, in pixels, or a width to a breakpoint. It is written as the
// library writes it, since what a caller is held to is one number or one number to a range rather
// than either on its own
const size = "number | ResponsiveValue<number>";

// Whether the skeleton is drawn round or with its corners turned in
const shape = '"circle" | "square"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the skeleton takes. It is drawn as the one element rather than as a component with
// parts hanging off it, so there is the one table.
//
// How wide it is drawn comes first, since it is the one thing that has to agree with the avatar it
// stands in for, and what shape it is drawn in follows. There is no as among them: the skeleton is
// drawn as the box it is made of rather than as whatever it was asked for
const groups: ComponentPropGroup[] = [
    {
        name: "SkeletonAvatar",
        props: [
            {
                name: "size",
                type: size,
                default: "20",
                description:
                    "How wide the skeleton is drawn, which is also how tall. The step it comes to is the size of a line of text, as the avatar's is, and it is told the size of whatever it stands in for so the page does not move when the picture arrives. Given to a range instead of outright, it is drawn at whichever of them the viewport is in and falls back to the regular one for a range left out",
            },
            {
                name: "shape",
                type: shape,
                default: '"circle"',
                description:
                    "Whether the skeleton is drawn round or with its corners turned in. The corners are turned in further as the skeleton grows, so a small square stays only slightly rounded",
            },
            styling,
            {
                name: "...div props",
                type: 'React.ComponentPropsWithoutRef<"div">',
                description:
                    "It is a skeleton box underneath, drawn as a div, so it takes what one takes. The width and the height are not among them, since both are worked out from the size",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the skeleton is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const SkeletonAvatar = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                SkeletonAvatar
            </Heading>
            <Text as="p" size="large">
                The room an avatar will take, held while the picture is on its way. It is a skeleton
                box drawn round and to the avatar scale rather than a component of its own, so it is
                told the same size and the same shape as whatever it stands in for and the page does
                not move when the picture arrives. It shimmers while it waits, unless the reader has
                asked for less motion.
            </Text>
        </Stack>
        <ComponentExamples component="SkeletonAvatar" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default SkeletonAvatar;
