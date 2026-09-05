import { Avatar as AvatarComponent, Heading, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// Where the picture is fetched from. It is the one the library's own stories are drawn with, so
// whoever is shown here and whoever is shown there are the same person
const source = "https://avatars.githubusercontent.com/u/7143434?v=4";

// What every example has to have in hand before it can be drawn. The address is written once and
// reached for by each of them, rather than run out along a line that would then have to be read
// across
const setup = `const source = "https://avatars.githubusercontent.com/u/7143434?v=4";`;

// The plainest avatar there is: the ground, and the picture laid on it. Nothing is said with a
// prop, so it comes to a round one drawn at the size of a line of text, which is where an avatar
// most often stands.
//
// The picture is given the name of whoever it is of rather than left to say nothing. An avatar
// beside a name already written out is decorative and says as much by staying silent; one standing
// on its own, as it does here, is all there is to go on.
//
// The Stack that stands it in the middle of the card is the page's own furniture, as the card
// around it is, so the listing beneath is of the avatar alone.
//
// The page and the component it is about are both called Avatar, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Avatar, as an application
// importing it would
const defaultPreview = (
    <Stack align="center">
        <AvatarComponent>
            <AvatarComponent.Image src={source} alt="Mona Lisa Octocat" />
        </AvatarComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Avatar>
    <Avatar.Image src={source} alt="Mona Lisa Octocat" />
</Avatar>`;

// Whether the avatar is drawn round or squared off. The two are drawn together rather than one to
// an example, since a shape is read against the other rather than on its own, and both are given a
// size the shape can be seen at
const shapePreview = (
    <Stack direction="horizontal" gap="normal" align="center" justify="center">
        <AvatarComponent size={48}>
            <AvatarComponent.Image src={source} alt="Mona Lisa Octocat" />
        </AvatarComponent>
        <AvatarComponent size={48} shape="square">
            <AvatarComponent.Image src={source} alt="Mona Lisa Octocat" />
        </AvatarComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the two read beside one another, so it is written out with them, and
// everything it was told with it. The example above is set in the middle by a Stack that does
// nothing else, which is the page's own and is left out; nothing is held back from one that is
// already being shown
const shapeCode = `<Stack direction="horizontal" gap="normal" align="center" justify="center">
    <Avatar size={48}>
        <Avatar.Image src={source} alt="Mona Lisa Octocat" />
    </Avatar>
    <Avatar size={48} shape="square">
        <Avatar.Image src={source} alt="Mona Lisa Octocat" />
    </Avatar>
</Stack>`;

// What stands where the picture cannot. The first is written as an avatar is written when there is
// a picture to show: both parts, so that the letters hold the place until the picture arrives and
// keep it where it never does. The second is whoever has no picture at all, which is the same
// fallback standing on its own
const fallbackPreview = (
    <Stack direction="horizontal" gap="normal" align="center" justify="center">
        <AvatarComponent size={48}>
            <AvatarComponent.Image src={source} alt="Mona Lisa Octocat" />
            <AvatarComponent.Fallback name="Mona Lisa Octocat" />
        </AvatarComponent>
        <AvatarComponent size={48}>
            <AvatarComponent.Fallback name="Hubot" />
        </AvatarComponent>
    </Stack>
);

const fallbackCode = `<Stack direction="horizontal" gap="normal" align="center" justify="center">
    <Avatar size={48}>
        <Avatar.Image src={source} alt="Mona Lisa Octocat" />
        <Avatar.Fallback name="Mona Lisa Octocat" />
    </Avatar>
    <Avatar size={48}>
        <Avatar.Fallback name="Hubot" />
    </Avatar>
</Stack>`;

// The avatar as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Shape",
        description:
            "Whether the avatar is drawn round or with its corners turned in. A round one stands for a person and a squared one for anything else that has a picture, which is what tells a reader which of the two they are looking at.",
        setup,
        preview: shapePreview,
        code: shapeCode,
    },
    {
        name: "Fallback",
        description:
            "The initials of whoever the avatar is of, standing while the picture is on its way, where it never arrived, and where there was never one to begin with, so an avatar is never a hole in the page. Once the picture has arrived it says everything the letters stood in for, so they are taken out of the tree rather than only hidden.",
        setup,
        preview: fallbackPreview,
        code: fallbackCode,
    },
];

// How wide the avatar is drawn, in pixels, or a width to a breakpoint. It is written as the library
// writes it, since what a caller is held to is one number or one number to a range rather than
// either on its own
const size = "number | ResponsiveValue<number>";

// Whether the avatar is drawn round or with its corners turned in
const shape = '"circle" | "square"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. The avatar is the
// ground its parts are laid on rather than a picture of its own, so it is drawn as a span rather
// than as the div most of the library falls back to
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"span"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the avatar and its parts take, under the one that takes it.
//
// The ground is written up first, since the parts are laid on it and take their size from it, and
// the picture and the letters that stand in for it follow. `Avatar.Image` is an ordinary image, so
// what is written out under it is what it takes on top of that
const groups: ComponentPropGroup[] = [
    {
        name: "Avatar",
        props: [
            {
                name: "size",
                type: size,
                default: "20",
                description:
                    "How wide the avatar is drawn, which is also how tall. The step it comes to is the size of a line of text, since that is where an avatar most often stands",
            },
            {
                name: "shape",
                type: shape,
                default: '"circle"',
                description: "Whether the avatar is drawn round or with its corners turned in",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "Avatar.Image",
        props: [
            {
                name: "src",
                type: "string",
                description: "Where the picture is fetched from",
            },
            {
                name: "alt",
                type: "string",
                default: '""',
                description:
                    "What the picture is of. A picture standing beside a name already written out says nothing, which is what it comes to; one standing on its own is given the name it is of",
            },
            styling,
        ],
    },
    {
        name: "Avatar.Fallback",
        props: [
            {
                name: "name",
                type: "string",
                required: true,
                description:
                    "Whoever the avatar is of. The initials are worked out from it — the first letter of the first word and of the last, so a middle name is passed over — and it is what a screen reader is given, in place of letters it would otherwise spell out one at a time",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the avatar is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Avatar = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Avatar
            </Heading>
            <Text as="p" size="large">
                The picture that stands for whoever did something. It is the ground the picture and
                the letters behind it take turns on rather than a picture of its own, so it is
                composed of the parts it is handed. What is laid inside is an ordinary image, and
                takes everything one takes.
            </Text>
        </Stack>
        <ComponentExamples component="Avatar" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Avatar;
