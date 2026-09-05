import {
    Breadcrumbs as BreadcrumbsComponent,
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

// The plainest trail there is: three steps, the last of them the page being read. It is short
// enough to fit wherever it is put, so nothing has to be said about what becomes of it when it
// does not.
//
// The last step is marked rather than left plain, since it is the one step that is not somewhere to
// go, and saying so is what tells a reader where in the trail they are standing.
//
// The page and the component it is about are both called Breadcrumbs, so the component is brought
// in under a name saying which of the two it is. The listing beneath says Breadcrumbs, as an
// application importing it would
const defaultPreview = (
    <BreadcrumbsComponent>
        <BreadcrumbsComponent.Item href="#">Home</BreadcrumbsComponent.Item>
        <BreadcrumbsComponent.Item href="#">About</BreadcrumbsComponent.Item>
        <BreadcrumbsComponent.Item href="#" selected>
            Team
        </BreadcrumbsComponent.Item>
    </BreadcrumbsComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Breadcrumbs>
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
        Team
    </Breadcrumbs.Item>
</Breadcrumbs>`;

// The trail as it is reached for, drawn and written out one above the other. It is the plainest one
// alone: everything else the trail will do is said in the tables beneath rather than shown
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
];

// What becomes of the trail once it no longer fits across the page
const overflow = '"wrap" | "menu" | "menu-with-root"';

// How much room each step of the trail is given
const variant = '"normal" | "spacious"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the trail and its steps take, under the part that takes it.
//
// The trail comes first, since what becomes of it when it does not fit and how much room its steps
// are given are both settled there; the step follows, with the one prop that is its own
const groups: ComponentPropGroup[] = [
    {
        name: "Breadcrumbs",
        props: [
            {
                name: "overflow",
                type: overflow,
                default: '"wrap"',
                description:
                    "What becomes of the trail once it no longer fits across the page. Wrap runs it onto another line, which keeps every step in sight; menu moves whatever it can no longer show into a menu standing where those steps were, keeping the page the reader is on and giving up the first step along with the middle where room is short; menu-with-root does the same but holds that first step back, so where the trail begins can still be seen",
            },
            {
                name: "variant",
                type: variant,
                default: '"normal"',
                description:
                    "How much room each step of the trail is given. Normal draws a line of links, for a trail read as a note above the page; spacious draws a row of boxes, for one that is the way around it",
            },
            styling,
            {
                name: "style",
                type: "React.CSSProperties",
                description: "Inline styles for the trail itself",
            },
        ],
    },
    {
        name: "Breadcrumbs.Item",
        props: [
            {
                name: "selected",
                type: "boolean",
                default: "false",
                description:
                    "Marks the step as the page the reader is already on, which is the last step of the trail and the one step that is not somewhere to go. It is what a screen reader is told the current page by, so it is said rather than left to the position in the list",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"a"',
                description:
                    "The element or component this is drawn as, in place of its default. It is what a trail built on a router's own link is given, so that following a step redraws the page rather than asking for another one",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the trail is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Breadcrumbs = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Breadcrumbs
            </Heading>
            <Text as="p" size="large">
                The trail of steps between the top of a site and the page the reader is on: where
                they are, and every way back from it. The last step is the page itself and is the
                one that goes nowhere. A trail with more steps than the room it was given either
                runs onto another line or gives up its middle to a menu, which is worked out from
                what the steps actually measure rather than from how many there are.
            </Text>
        </Stack>
        <ComponentExamples component="Breadcrumbs" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Breadcrumbs;
