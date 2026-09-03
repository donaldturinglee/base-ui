import { CheckmarkCircleRegular, CloudRegular, DatabaseRegular } from "@gamecrafters/base-ui-icons";
import { Flow as FlowComponent, Heading, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A flow is drawn to whatever its steps and the room between them come to, so one with more
    // steps than a line has room for is scrolled to rather than wrapped. The example is held to a
    // width narrow enough for there to be something to scroll
    bounded: "max-w-[20rem]",
    // What a step holding more than a word is laid out as: the mark and the words on one line,
    // with the room between them the library's own
    step: "flex items-center gap-[var(--base-size-8)]",
    // A mark standing among words is drawn at the size of the words rather than at its own, and is
    // stopped from being squeezed by whatever it is read beside
    icon: "size-[var(--base-size-16)] shrink-0",
};

// What the examples have to have in hand before they can be drawn. Each is written once and
// reached for by the examples that need it, rather than run out along a line that would then have
// to be read across
const boundedSetup = `const bounded = "max-w-[20rem]";`;

const stepSetup = `const step = "flex items-center gap-[var(--base-size-8)]";
const icon = "size-[var(--base-size-16)] shrink-0";`;

// The plainest flow there is: the steps in the order they are taken, with the one place that
// branches written as a branch. The flow is itself a run, so the steps are put straight into it and
// only the branch needs a group around it.
//
// It is named outright rather than left to be read off its steps: a diagram is looked at, and what
// it is a diagram of is the one thing looking at it does not say. The name is what a flow too wide
// for its room is announced under once it is something to be scrolled through, so every example
// here gives one.
//
// Nothing holds it to the start of the card, as the plainest example on other pages is held: a flow
// draws its own canvas at the size its steps come to, so there is nothing for the card's column to
// stretch.
//
// The page and the component it is about are both called Flow, so the component is brought in under
// a name saying which of the two it is. The listing beneath says Flow, as an application importing
// it would
const defaultPreview = (
    <FlowComponent aria-label="How a request is served">
        <FlowComponent.Node>Request</FlowComponent.Node>
        <FlowComponent.Parallel>
            <FlowComponent.Node>Cache</FlowComponent.Node>
            <FlowComponent.Node>Worker</FlowComponent.Node>
        </FlowComponent.Parallel>
        <FlowComponent.Node>Response</FlowComponent.Node>
    </FlowComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Flow aria-label="How a request is served">
    <Flow.Node>Request</Flow.Node>
    <Flow.Parallel>
        <Flow.Node>Cache</Flow.Node>
        <Flow.Node>Worker</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Response</Flow.Node>
</Flow>`;

// Which way the flow runs. It is the one prop that changes what the diagram is rather than how it
// is spaced, so the same shape is drawn again downwards rather than a different one.
//
// The steps either side of a group are lined up down the middle of it, since a flow read as a
// column would read a step against its left edge as a branch of its own rather than as the trunk
const verticalPreview = (
    <FlowComponent orientation="vertical" align="center" aria-label="How a deployment runs">
        <FlowComponent.Node>Push</FlowComponent.Node>
        <FlowComponent.Node>Build</FlowComponent.Node>
        <FlowComponent.Parallel>
            <FlowComponent.Node>Unit tests</FlowComponent.Node>
            <FlowComponent.Node>Type check</FlowComponent.Node>
        </FlowComponent.Parallel>
        <FlowComponent.Node>Deploy</FlowComponent.Node>
    </FlowComponent>
);

const verticalCode = `<Flow orientation="vertical" align="center" aria-label="How a deployment runs">
    <Flow.Node>Push</Flow.Node>
    <Flow.Node>Build</Flow.Node>
    <Flow.Parallel>
        <Flow.Node>Unit tests</Flow.Node>
        <Flow.Node>Type check</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Deploy</Flow.Node>
</Flow>`;

// A branch holding more than one step, which is the whole of what Flow.List is for. The flow is
// already a run and a branch of a single step needs nothing around it, so this is the one place a
// list is reached for
const listPreview = (
    <FlowComponent aria-label="How a request is served">
        <FlowComponent.Node>Request</FlowComponent.Node>
        <FlowComponent.Parallel>
            <FlowComponent.List>
                <FlowComponent.Node>Cache</FlowComponent.Node>
                <FlowComponent.Node>Origin</FlowComponent.Node>
            </FlowComponent.List>
            <FlowComponent.Node>Worker</FlowComponent.Node>
        </FlowComponent.Parallel>
        <FlowComponent.Node>Response</FlowComponent.Node>
    </FlowComponent>
);

const listCode = `<Flow aria-label="How a request is served">
    <Flow.Node>Request</Flow.Node>
    <Flow.Parallel>
        <Flow.List>
            <Flow.Node>Cache</Flow.Node>
            <Flow.Node>Origin</Flow.Node>
        </Flow.List>
        <Flow.Node>Worker</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Response</Flow.Node>
</Flow>`;

// The same shape again with the short branch pushed along to finish beside the long one. It is the
// example above with the one prop added, so what the prop does is the only thing that has changed
// between them
const branchAlignPreview = (
    <FlowComponent aria-label="How a request is served">
        <FlowComponent.Node>Request</FlowComponent.Node>
        <FlowComponent.Parallel align="end">
            <FlowComponent.List>
                <FlowComponent.Node>Cache</FlowComponent.Node>
                <FlowComponent.Node>Origin</FlowComponent.Node>
            </FlowComponent.List>
            <FlowComponent.Node>Worker</FlowComponent.Node>
        </FlowComponent.Parallel>
        <FlowComponent.Node>Response</FlowComponent.Node>
    </FlowComponent>
);

const branchAlignCode = `<Flow aria-label="How a request is served">
    <Flow.Node>Request</Flow.Node>
    <Flow.Parallel align="end">
        <Flow.List>
            <Flow.Node>Cache</Flow.Node>
            <Flow.Node>Origin</Flow.Node>
        </Flow.List>
        <Flow.Node>Worker</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Response</Flow.Node>
</Flow>`;

// Where a step shorter than what it stands beside is put across the flow. Three branches are drawn
// rather than two, so that the trunk either side of them has something to be off the middle of
const alignPreview = (
    <FlowComponent align="center" aria-label="How a request is served">
        <FlowComponent.Node>Request</FlowComponent.Node>
        <FlowComponent.Parallel>
            <FlowComponent.Node>Cache</FlowComponent.Node>
            <FlowComponent.Node>Worker</FlowComponent.Node>
            <FlowComponent.Node>Origin</FlowComponent.Node>
        </FlowComponent.Parallel>
        <FlowComponent.Node>Response</FlowComponent.Node>
    </FlowComponent>
);

const alignCode = `<Flow align="center" aria-label="How a request is served">
    <Flow.Node>Request</Flow.Node>
    <Flow.Parallel>
        <Flow.Node>Cache</Flow.Node>
        <Flow.Node>Worker</Flow.Node>
        <Flow.Node>Origin</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Response</Flow.Node>
</Flow>`;

// A branch of a group holding a group of its own. Nothing is asked for to allow it: a branch is a
// run of steps, and a group is one of the things a run can hold, so the two nest by being what
// they already are
const nestedPreview = (
    <FlowComponent aria-label="How a request is served">
        <FlowComponent.Node>Request</FlowComponent.Node>
        <FlowComponent.Parallel>
            <FlowComponent.List>
                <FlowComponent.Node>Route</FlowComponent.Node>
                <FlowComponent.Parallel>
                    <FlowComponent.Node>Cache</FlowComponent.Node>
                    <FlowComponent.Node>Origin</FlowComponent.Node>
                </FlowComponent.Parallel>
            </FlowComponent.List>
            <FlowComponent.Node>Worker</FlowComponent.Node>
        </FlowComponent.Parallel>
        <FlowComponent.Node>Response</FlowComponent.Node>
    </FlowComponent>
);

const nestedCode = `<Flow aria-label="How a request is served">
    <Flow.Node>Request</Flow.Node>
    <Flow.Parallel>
        <Flow.List>
            <Flow.Node>Route</Flow.Node>
            <Flow.Parallel>
                <Flow.Node>Cache</Flow.Node>
                <Flow.Node>Origin</Flow.Node>
            </Flow.Parallel>
        </Flow.List>
        <Flow.Node>Worker</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Response</Flow.Node>
</Flow>`;

// A path that cannot be taken, drawn faintly rather than left out, so that the shape of the flow is
// still the shape of the flow. The joins either side of the step go faint with it, since a step
// nothing can reach is not reached by the lines that would have led to it either
const disabledPreview = (
    <FlowComponent aria-label="How a request is served">
        <FlowComponent.Node>Request</FlowComponent.Node>
        <FlowComponent.Parallel>
            <FlowComponent.Node>Cache</FlowComponent.Node>
            <FlowComponent.Node disabled>Origin (unreachable)</FlowComponent.Node>
        </FlowComponent.Parallel>
        <FlowComponent.Node>Response</FlowComponent.Node>
    </FlowComponent>
);

const disabledCode = `<Flow aria-label="How a request is served">
    <Flow.Node>Request</Flow.Node>
    <Flow.Parallel>
        <Flow.Node>Cache</Flow.Node>
        <Flow.Node disabled>Origin (unreachable)</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Response</Flow.Node>
</Flow>`;

// A step is whatever was put in it, so a mark and a word stand in one as readily as a word alone.
// The step measures itself and says so, which is what lets the layout be worked out from numbers
// rather than read back off the page, so nothing here has to be told how much room the marks take.
//
// The marks say what the words beside them already say, so they are kept out of the accessibility
// tree rather than read out twice
const richPreview = (
    <FlowComponent aria-label="Where the data goes">
        <FlowComponent.Node>
            <span className={classes.step}>
                <CloudRegular className={classes.icon} aria-hidden="true" />
                <Text>Edge</Text>
            </span>
        </FlowComponent.Node>
        <FlowComponent.Node>
            <span className={classes.step}>
                <DatabaseRegular className={classes.icon} aria-hidden="true" />
                <Text>Store</Text>
            </span>
        </FlowComponent.Node>
        <FlowComponent.Node>
            <span className={classes.step}>
                <CheckmarkCircleRegular className={classes.icon} aria-hidden="true" />
                <Text>Done</Text>
            </span>
        </FlowComponent.Node>
    </FlowComponent>
);

const richCode = `<Flow aria-label="Where the data goes">
    <Flow.Node>
        <span className={step}>
            <CloudRegular className={icon} aria-hidden="true" />
            <Text>Edge</Text>
        </span>
    </Flow.Node>
    <Flow.Node>
        <span className={step}>
            <DatabaseRegular className={icon} aria-hidden="true" />
            <Text>Store</Text>
        </span>
    </Flow.Node>
    <Flow.Node>
        <span className={step}>
            <CheckmarkCircleRegular className={icon} aria-hidden="true" />
            <Text>Done</Text>
        </span>
    </Flow.Node>
</Flow>`;

// A flow with more of itself than the room it was given, which is scrolled to rather than wrapped:
// a diagram that broke onto another line would be a different diagram. The width it is held to is
// the page's own, and is written out with the example, since without a bound there would be nothing
// to scroll within
const scrolledPreview = (
    <FlowComponent className={classes.bounded} aria-label="How a build runs">
        <FlowComponent.Node>Checkout</FlowComponent.Node>
        <FlowComponent.Node>Install</FlowComponent.Node>
        <FlowComponent.Node>Build</FlowComponent.Node>
        <FlowComponent.Node>Test</FlowComponent.Node>
        <FlowComponent.Node>Publish</FlowComponent.Node>
    </FlowComponent>
);

const scrolledCode = `<Flow className={bounded} aria-label="How a build runs">
    <Flow.Node>Checkout</Flow.Node>
    <Flow.Node>Install</Flow.Node>
    <Flow.Node>Build</Flow.Node>
    <Flow.Node>Test</Flow.Node>
    <Flow.Node>Publish</Flow.Node>
</Flow>`;

// The flow as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Orientation",
        description:
            "Which way the flow runs. A horizontal flow reads left to right and stacks its branches down the page; a vertical one reads top to bottom and stands its branches side by side. A flow with more steps than a line has room for is the one to turn downwards, since a page scrolls that way already.",
        preview: verticalPreview,
        code: verticalCode,
    },
    {
        name: "Branches of several steps",
        description:
            "A branch holding more than one step, which is what Flow.List is for. The flow is already a run of steps taken in order, so a branch of a single step needs nothing around it and only a longer one is written as a list.",
        preview: listPreview,
        code: listCode,
    },
    {
        name: "Branches ending together",
        description:
            "Where a branch shorter than the group it stands in is put along the flow: it begins with the group, or it is pushed along to end with it. It is the example above with the one prop added, so what changed between them is what the prop does.",
        preview: branchAlignPreview,
        code: branchAlignCode,
    },
    {
        name: "Alignment",
        description:
            "Where a step shorter than the run it stands in is put across the flow. It is what the trunk either side of a group is settled by: start leaves it level with the first branch, which reads as a run with branches hanging off it, and center stands it down the middle of them, which reads as a fan out and back in.",
        preview: alignPreview,
        code: alignCode,
    },
    {
        name: "Nested branches",
        description:
            "A branch of a group holding a group of its own. Nothing is asked for to allow it: a branch is a run of steps, and a group is one of the things a run can hold, so the two nest by being what they already are.",
        preview: nestedPreview,
        code: nestedCode,
    },
    {
        name: "A step out of use",
        description:
            "A path that cannot be taken, drawn faintly rather than left out, so that the shape of the flow is still the shape of the flow. The joins either side of the step go faint with it, since a step nothing can reach is not reached by the lines that would have led to it either.",
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Steps drawn however you like",
        description:
            "A step is whatever was put in it. Each one measures itself and says how much room it takes, so the layout is worked out from what the steps actually came to rather than from a size settled in advance, and a step holding a mark and a word needs to be told nothing about either.",
        setup: stepSetup,
        preview: richPreview,
        code: richCode,
    },
    {
        name: "Larger than the room it is given",
        description:
            "A flow with more of itself than it can show is scrolled to rather than wrapped, since a diagram broken onto another line would be a different diagram. It is put in the tab order once there is anything to scroll to, and stands as a named region there, so a keyboard reaches the rest of it as well as a pointer.",
        setup: boundedSetup,
        preview: scrolledPreview,
        code: scrolledCode,
    },
];

// Which way the flow runs
const orientation = '"horizontal" | "vertical"';

// How a step shorter than the run it stands in lines up across the flow
const align = '"start" | "center"';

// How a branch shorter than the group it stands in lines up along the flow
const branchAlign = '"start" | "end"';

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

// Every prop the flow and its parts take, under the part that takes it.
//
// The flow itself comes first, since everything about how the diagram is laid out is settled there;
// the step follows, as the only part with anything of its own to say; and the two that hold steps
// come last, since what they are for is said by where they are written rather than by a prop
const groups: ComponentPropGroup[] = [
    {
        name: "Flow",
        props: [
            {
                name: "orientation",
                type: orientation,
                default: '"horizontal"',
                description:
                    "Which way the flow runs. A horizontal flow reads left to right and stacks its branches down the page; a vertical one reads top to bottom and stands its branches side by side",
            },
            {
                name: "align",
                type: align,
                default: '"start"',
                description:
                    "Where a step shorter than the run it stands in is put across the flow. It is what settles the trunk either side of a group: start leaves it level with the first branch, and center stands it down the middle of them",
            },
            {
                name: "columnGap",
                type: "number",
                default: "64",
                description:
                    "The room left between one step and the next along the flow, in pixels. A join has to turn twice to reach a branch beside the one it left, so there is more room along the flow than across it for the turns to be made in",
            },
            {
                name: "rowGap",
                type: "number",
                default: "16",
                description:
                    "The room left between one branch and the next across the flow, in pixels",
            },
            {
                name: "cornerRadius",
                type: "number",
                default: "8",
                description: "How far a join is turned at its corners, in pixels",
            },
            {
                name: "aria-label",
                type: "string",
                description:
                    "Names the flow in words, where there are none on the page to point at. A flow larger than the room it was given is put in the tab order and stands as a region, which is announced under this name",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "Names the flow by whatever on the page already says what it is, in place of aria-label",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "FlowNode",
        props: [
            {
                name: "id",
                type: "string",
                description:
                    "What the step is called within the flow, which is what the joins either side of it are drawn to and from. It is written out as data-node-id rather than as the element's own id, so two flows on a page cannot name the same thing. One is made up from where the step stands where none is given",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Draws the step, and the joins either side of it, as a path that cannot be taken. It is drawn faintly rather than left out, so the shape of the flow is still the shape of the flow",
            },
            styling,
        ],
    },
    {
        name: "FlowList",
        props: [styling],
    },
    {
        name: "FlowParallel",
        props: [
            {
                name: "align",
                type: branchAlign,
                default: '"start"',
                description:
                    "Where a branch shorter than the group it stands in is put along the flow: it begins with the group, or it is pushed along to end with it",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the flow is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Flow = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Flow
            </Heading>
            <Text as="p" size="large">
                A diagram of the way something runs: the steps taken, in the order they are taken,
                with the places that branch drawn as branches. Every step is put where the layout
                says rather than where the markup would leave it, since a step standing beside a
                branch has to stand beside all of them at once. What the page keeps is the reading
                order — the steps are a list, and a branch is a list within it — so a reader who
                cannot see the lines is still told what follows what.
            </Text>
        </Stack>
        <ComponentExamples component="Flow" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Flow;
