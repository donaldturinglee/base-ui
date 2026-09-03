import {
    Heading,
    Placeholder as PlaceholderComponent,
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

// The plainest box there is: how tall it is drawn, and a word or two saying what is going to stand
// there. It is told no width, so it fills whatever holds it, which here is the card.
//
// The page and the component it is about are both called Placeholder, so the component is brought
// in under a name saying which of the two it is. The listing beneath says Placeholder, as an
// application importing it would
const defaultPreview = <PlaceholderComponent height="64px" label="Placeholder" />;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Placeholder height="64px" label="Placeholder" />`;

// The box as it is reached for, drawn and written out one above the other. It is the plainest one
// alone: everything else the box will do is said in the tables beneath rather than shown
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
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
// How tall it is drawn comes first, since it is the one thing that has to be given, and how wide
// follows it; what is set down in the middle of it comes after the size, since a box that says
// nothing is still a box holding its room
const groups: ComponentPropGroup[] = [
    {
        name: "Placeholder",
        props: [
            {
                name: "height",
                type: "string",
                required: true,
                description:
                    "How tall the box is drawn, as a CSS length. It is the one thing that has to be given, since a box standing in for something that has not arrived has nothing inside it to take a height from",
            },
            {
                name: "width",
                type: "string",
                description:
                    "How wide the box is drawn, as a CSS length. Left out it fills the width of whatever holds it; given as a share, the share is of that same thing",
            },
            {
                name: "label",
                type: "string",
                description:
                    "The words set down in the middle of the box, saying what is going to stand there. Left out, the box is drawn blank",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "What is written into the box, for more than the word or two a label is for. Given both, it is drawn in place of the label",
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
const Placeholder = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Placeholder
            </Heading>
            <Text as="p" size="large">
                A box drawn where something is going to be, so the room it will take is on the page
                before it is. It says what is coming in a word or two and draws nothing else at all,
                which is what makes it the thing to lay a layout or an example out with while what
                goes there is still being settled. Something that is on its way rather than
                undecided is a skeleton instead.
            </Text>
        </Stack>
        <ComponentExamples component="Placeholder" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Placeholder;
