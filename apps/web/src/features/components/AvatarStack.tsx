import {
    Avatar,
    AvatarStack as AvatarStackComponent,
    Heading,
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

// Whoever the examples are of. There are four of them because the run is drawn solid for the first
// two and set a step further back for each one after, so a shorter list would leave that unsaid
const people = [
    { name: "Mona Lisa Octocat", src: "https://avatars.githubusercontent.com/u/7143434?v=4" },
    { name: "Hubot", src: "https://avatars.githubusercontent.com/u/13171334?v=4" },
    { name: "Octo Cat", src: "https://avatars.githubusercontent.com/atom" },
    { name: "Robot Octocat", src: "https://avatars.githubusercontent.com/github" },
];

// What every example has to have in hand before it can be drawn. The run is written out of a list
// rather than an avatar at a time, since that is how a stack is come by: a stack is of whoever did
// something, and who that was is answered somewhere else
const setup = `const people = [
    { name: "Mona Lisa Octocat", src: "https://avatars.githubusercontent.com/u/7143434?v=4" },
    { name: "Hubot", src: "https://avatars.githubusercontent.com/u/13171334?v=4" },
    { name: "Octo Cat", src: "https://avatars.githubusercontent.com/atom" },
    { name: "Robot Octocat", src: "https://avatars.githubusercontent.com/github" },
];`;

// Every one of them as an avatar, which is the one thing a stack deals a place in the run to. Each
// is given the letters to fall back on as well as the picture, so a stack is never a hole in the
// page where a picture does not arrive.
//
// The size is asked for on the avatars rather than on the stack around them, since a stack told
// nothing takes the smallest size its avatars asked for: the run is drawn large enough to be read
// at without the stack itself having been told anything, which is what the examples are of
const avatars = people.map((person) => (
    <Avatar key={person.name} size={48}>
        <Avatar.Image src={person.src} alt={person.name} />
        <Avatar.Fallback name={person.name} />
    </Avatar>
));

// The run written as it is come by, which is what every listing on the page is written from: the
// list mapped over rather than an avatar at a time, since a stack is of however many people there
// turn out to be
const run = `    {people.map((person) => (
        <Avatar key={person.name} size={48}>
            <Avatar.Image src={person.src} alt={person.name} />
            <Avatar.Fallback name={person.name} />
        </Avatar>
    ))}`;

// The plainest stack there is: the run, and nothing said with a prop. It comes to a cascade
// anchored at the left, drawn at the size the smallest of its avatars asked for, which is the one
// thing a stack works out for itself rather than being told.
//
// The Stack that stands it in the middle of the card is the page's own furniture, as the card
// around it is, so the listing beneath is of the stack alone.
//
// The page and the component it is about are both called AvatarStack, so the component is brought
// in under a name saying which of the two it is. The listing beneath says AvatarStack, as an
// application importing it would
const defaultPreview = (
    <Stack align="center">
        <AvatarStackComponent>{avatars}</AvatarStackComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<AvatarStack>
${run}
</AvatarStack>`;

// What the run is drawn as. A cascade sets each avatar after the second a step further back, so
// the run reads as one thing trailing off; a stack keeps every one of them solid
const variantPreview = (
    <Stack align="center">
        <AvatarStackComponent variant="stack">{avatars}</AvatarStackComponent>
    </Stack>
);

const variantCode = `<AvatarStack variant="stack">
${run}
</AvatarStack>`;

// Which end the run is anchored to, which is the end the avatars are dealt from and so the one
// whose avatar is left uncovered
const alignPreview = (
    <Stack align="center">
        <AvatarStackComponent align="right">{avatars}</AvatarStackComponent>
    </Stack>
);

const alignCode = `<AvatarStack align="right">
${run}
</AvatarStack>`;

// The stack as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The run opens out under the pointer and under focus, so that every avatar in it can be read rather than only the ones left uncovered.",
        setup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Variant",
        description:
            "What the run is drawn as. The cascade above sets each avatar after the second a step further back, so the run reads as one thing trailing off; a stack keeps every one of them solid.",
        setup,
        preview: variantPreview,
        code: variantCode,
    },
    {
        name: "Align",
        description:
            "Which end the run is anchored to. It is the end the avatars are dealt from, and so the one whose avatar is left uncovered, which the cascade above leaves at the left.",
        setup,
        preview: alignPreview,
        code: alignCode,
    },
];

// What a stack is made of. It is written as the library names it rather than as what it resolves
// to, since the name is what a caller is held to
const children = "AvatarStackChild | AvatarStackChild[]";

// What the run is drawn as
const variant = '"cascade" | "stack"';

// Whether the avatars are drawn round or with their corners turned in
const shape = '"circle" | "square"';

// How wide each avatar in the run is drawn, in pixels, or a width to a breakpoint
const size = "number | ResponsiveValue<number>";

// Which end the run is anchored to
const align = '"left" | "right"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. The stack is the
// ground the run is laid on rather than a picture of its own, so it is drawn as a span, as the
// avatars within it are
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"span"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the stack takes. It is the one component rather than a component with parts hanging
// off it, so there is the one table.
//
// What it holds is written up first, since a stack cannot be drawn without a run to draw, and how
// that run is laid out follows: what it is drawn as, what shape, at what size, from which end, and
// last whether it opens out at all
const groups: ComponentPropGroup[] = [
    {
        name: "AvatarStack",
        props: [
            {
                // The one prop of the stack that is a constraint rather than a choice, so it is
                // written out where a caller would otherwise have to find it out by being wrong
                name: "children",
                type: children,
                description:
                    "The run the stack is of. Only an avatar is dealt a place in it, since an avatar is what carries the size the run is cut to and the class the edge between two of them is drawn on. Anything else is left out rather than laid down half dressed, and is not counted either",
            },
            {
                name: "variant",
                type: variant,
                default: '"cascade"',
                description:
                    "What the run is drawn as. A cascade sets each avatar after the second a step further back; a stack keeps every one of them solid",
            },
            {
                name: "shape",
                type: shape,
                default: '"circle"',
                description:
                    "Whether the avatars are drawn round or with their corners turned in. It is said once for the run rather than on each of them, so a stack cannot come out half one and half the other",
            },
            {
                name: "size",
                type: size,
                description:
                    "How wide each avatar in the run is drawn. A stack that is told nothing takes the smallest size its avatars asked for, so that none of them is cropped",
            },
            {
                name: "align",
                type: align,
                default: '"left"',
                description:
                    "Which end the run is anchored to, which is the end the avatars are dealt from and so the one whose avatar is left uncovered",
            },
            {
                name: "disableExpand",
                type: "boolean",
                default: "false",
                description:
                    "Holds the run closed, in place of opening it out under the pointer and under focus. A stack that cannot be opened is not given a focus stop of its own either",
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
const AvatarStack = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                AvatarStack
            </Heading>
            <Text as="p" size="large">
                A run of avatars laid over one another, for the several people who did something
                between them. It takes its size from the avatars it was handed rather than being
                told one, and opens out under the pointer so that every one of them can be read.
            </Text>
        </Stack>
        <ComponentExamples component="AvatarStack" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default AvatarStack;
