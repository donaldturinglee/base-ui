import { Heading, Resizable as ResizableComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A group lays its panels out within whatever room it was given rather than within a size of
    // its own, so standing in a box of no height it draws nothing. The height is given here, and an
    // edge with it, so that where the group ends can be seen as well as where the panels are parted
    frame: "h-[16rem] rounded-[var(--border-radius-medium)] border border-solid border-[var(--border-color-default)]",
    // What a panel holds is set in the middle of it, so a panel being made wider or narrower is
    // read by the room around its words rather than by the words themselves moving
    panel: "flex items-center justify-center p-[var(--base-size-8)]",
    // A ground of its own for the one panel an example is about, where what is worth watching is
    // that panel rather than the one beside it
    inset: "bg-[var(--background-color-inset)]",
};

// What the examples have to have in hand before they can be drawn: the room the group is laid out
// in, since it has no size of its own, and how a panel sets out what it holds. They are written
// once and reached for by each example rather than run out along lines that would then have to be
// read across
const frameSetup = `const frame =
    "h-[16rem] rounded-[var(--border-radius-medium)] " +
    "border border-solid border-[var(--border-color-default)]";
const panel = "flex items-center justify-center p-[var(--base-size-8)]";`;

const insetSetup = `${frameSetup}
const inset = "bg-[var(--background-color-inset)]";`;

// The plainest group there is: a sidebar and the content beside it, parted by a line the reader
// drags. The sidebar is given the share of the group it starts at and the panel beside it is left
// to take whatever is over.
//
// The box the group stands in is part of what is being shown rather than the page's own furniture,
// since a group given no room draws nothing at all, and the edge around it is there so that where
// the group ends can be told from where the panels are parted.
//
// The trigger is given a line and nothing else, which is the whole of what a trigger only meant to
// part two panels is drawn as.
//
// The page and the component it is about are both called Resizable, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Resizable, as an application
// importing it would
const defaultPreview = (
    <div className={classes.frame}>
        <ResizableComponent>
            <ResizableComponent.Panel defaultSize="30" className={classes.panel}>
                Sidebar
            </ResizableComponent.Panel>
            <ResizableComponent.ResizeTrigger>
                <ResizableComponent.ResizeTriggerSeparator />
            </ResizableComponent.ResizeTrigger>
            <ResizableComponent.Panel className={classes.panel}>Content</ResizableComponent.Panel>
        </ResizableComponent>
    </div>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<div className={frame}>
    <Resizable>
        <Resizable.Panel defaultSize="30" className={panel}>
            Sidebar
        </Resizable.Panel>
        <Resizable.ResizeTrigger>
            <Resizable.ResizeTriggerSeparator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel className={panel}>Content</Resizable.Panel>
    </Resizable>
</div>`;

// The grip standing on the line, which says the line is something to take hold of rather than one
// only there to part two panels. Which of the two a trigger is is told by what it is given rather
// than by a prop, so the pair above and here are the same trigger drawn with one thing more
const indicatorPreview = (
    <div className={classes.frame}>
        <ResizableComponent>
            <ResizableComponent.Panel defaultSize="30" className={classes.panel}>
                Sidebar
            </ResizableComponent.Panel>
            <ResizableComponent.ResizeTrigger>
                <ResizableComponent.ResizeTriggerSeparator />
                <ResizableComponent.ResizeTriggerIndicator />
            </ResizableComponent.ResizeTrigger>
            <ResizableComponent.Panel className={classes.panel}>Content</ResizableComponent.Panel>
        </ResizableComponent>
    </div>
);

const indicatorCode = `<div className={frame}>
    <Resizable>
        <Resizable.Panel defaultSize="30" className={panel}>
            Sidebar
        </Resizable.Panel>
        <Resizable.ResizeTrigger>
            <Resizable.ResizeTriggerSeparator />
            <Resizable.ResizeTriggerIndicator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel className={panel}>Content</Resizable.Panel>
    </Resizable>
</div>`;

// Panels stacked one on another rather than set side by side. Which way a trigger runs is the
// group's, the other way about: panels side by side are parted by a line standing up, and panels
// stacked one on another by a line lying down. The trigger is told so by the group rather than by
// a prop, so there is nothing here that has to be kept in step with the orientation
const verticalPreview = (
    <div className={classes.frame}>
        <ResizableComponent orientation="vertical">
            <ResizableComponent.Panel defaultSize="40" className={classes.panel}>
                Above
            </ResizableComponent.Panel>
            <ResizableComponent.ResizeTrigger>
                <ResizableComponent.ResizeTriggerSeparator />
                <ResizableComponent.ResizeTriggerIndicator />
            </ResizableComponent.ResizeTrigger>
            <ResizableComponent.Panel className={classes.panel}>Below</ResizableComponent.Panel>
        </ResizableComponent>
    </div>
);

const verticalCode = `<div className={frame}>
    <Resizable orientation="vertical">
        <Resizable.Panel defaultSize="40" className={panel}>
            Above
        </Resizable.Panel>
        <Resizable.ResizeTrigger>
            <Resizable.ResizeTriggerSeparator />
            <Resizable.ResizeTriggerIndicator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel className={panel}>Below</Resizable.Panel>
    </Resizable>
</div>`;

// How little and how much room a panel will take, said on the panel rather than on the group, so
// that a panel carries its own bounds wherever it is put. The sidebar will not go below a fifth of
// the group nor past half of it, however far the trigger is dragged
const boundsPreview = (
    <div className={classes.frame}>
        <ResizableComponent>
            <ResizableComponent.Panel
                defaultSize="30"
                minSize="20"
                maxSize="50"
                className={`${classes.panel} ${classes.inset}`}
            >
                Between a fifth and half
            </ResizableComponent.Panel>
            <ResizableComponent.ResizeTrigger>
                <ResizableComponent.ResizeTriggerSeparator />
                <ResizableComponent.ResizeTriggerIndicator />
            </ResizableComponent.ResizeTrigger>
            <ResizableComponent.Panel className={classes.panel}>Content</ResizableComponent.Panel>
        </ResizableComponent>
    </div>
);

const boundsCode = `<div className={frame}>
    <Resizable>
        <Resizable.Panel
            defaultSize="30"
            minSize="20"
            maxSize="50"
            className={\`\${panel} \${inset}\`}
        >
            Between a fifth and half
        </Resizable.Panel>
        <Resizable.ResizeTrigger>
            <Resizable.ResizeTriggerSeparator />
            <Resizable.ResizeTriggerIndicator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel className={panel}>Content</Resizable.Panel>
    </Resizable>
</div>`;

// A panel that folds away rather than going on shrinking once it is dragged below what it will
// take. Pressing Enter on the trigger folds it away and brings it back, as double-clicking the
// trigger does, so a panel can be shut and opened again without the pointer ever being dragged
const collapsiblePreview = (
    <div className={classes.frame}>
        <ResizableComponent>
            <ResizableComponent.Panel
                defaultSize="30"
                minSize="20"
                collapsible
                className={`${classes.panel} ${classes.inset}`}
            >
                Drag me shut
            </ResizableComponent.Panel>
            <ResizableComponent.ResizeTrigger>
                <ResizableComponent.ResizeTriggerSeparator />
                <ResizableComponent.ResizeTriggerIndicator />
            </ResizableComponent.ResizeTrigger>
            <ResizableComponent.Panel className={classes.panel}>Content</ResizableComponent.Panel>
        </ResizableComponent>
    </div>
);

const collapsibleCode = `<div className={frame}>
    <Resizable>
        <Resizable.Panel
            defaultSize="30"
            minSize="20"
            collapsible
            className={\`\${panel} \${inset}\`}
        >
            Drag me shut
        </Resizable.Panel>
        <Resizable.ResizeTrigger>
            <Resizable.ResizeTriggerSeparator />
            <Resizable.ResizeTriggerIndicator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel className={panel}>Content</Resizable.Panel>
    </Resizable>
</div>`;

// Panels held where they stand, for a layout a reader is shown rather than one they arrange.
// Nothing moves them: neither dragging a trigger nor stepping it with the arrow keys.
//
// The trigger is left drawn as it was and left where it was in the tab order, since the panels it
// stands between still need parting. It is a trigger given a disabled of its own that is marked as
// one and taken off the keyboard's way
const disabledPreview = (
    <div className={classes.frame}>
        <ResizableComponent disabled>
            <ResizableComponent.Panel defaultSize="30" className={classes.panel}>
                Sidebar
            </ResizableComponent.Panel>
            <ResizableComponent.ResizeTrigger>
                <ResizableComponent.ResizeTriggerSeparator />
                <ResizableComponent.ResizeTriggerIndicator />
            </ResizableComponent.ResizeTrigger>
            <ResizableComponent.Panel className={classes.panel}>Content</ResizableComponent.Panel>
        </ResizableComponent>
    </div>
);

const disabledCode = `<div className={frame}>
    <Resizable disabled>
        <Resizable.Panel defaultSize="30" className={panel}>
            Sidebar
        </Resizable.Panel>
        <Resizable.ResizeTrigger>
            <Resizable.ResizeTriggerSeparator />
            <Resizable.ResizeTriggerIndicator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel className={panel}>Content</Resizable.Panel>
    </Resizable>
</div>`;

// The group as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: frameSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "A grip on the line",
        description:
            "The indicator standing in the middle of the trigger, which says the line is something to take hold of rather than one only there to part two panels. Which of the two a trigger is is told by what it is given rather than by a prop, so this is the example above drawn with one thing more. The grip is thicker than the line and stands out either side of it, so the line stays a line everywhere the grip is not.",
        setup: frameSetup,
        preview: indicatorPreview,
        code: indicatorCode,
    },
    {
        name: "Stacked rather than side by side",
        description:
            "Panels laid out one above another. Which way a trigger runs is the group's, the other way about: panels side by side are parted by a line standing up, and panels stacked one on another by a line lying down. The group says which on the trigger itself, so nothing on the trigger has to be kept in step with the orientation it stands in.",
        setup: frameSetup,
        preview: verticalPreview,
        code: verticalCode,
    },
    {
        name: "How little and how much a panel will take",
        description:
            'The bounds are said on the panel rather than on the group, so a panel carries its own wherever it is put. The sidebar will not go below a fifth of the group nor past half of it, however far the trigger is dragged. A size given as a number is read as pixels and one given as a string without units as a share of the group, so 20 and "20" are two different sizes; anything ending in a unit is read as that unit, which is what "20rem" and "50%" say.',
        setup: insetSetup,
        preview: boundsPreview,
        code: boundsCode,
    },
    {
        name: "Folding away",
        description:
            "A panel dragged below what it will take folds shut rather than going on shrinking, and comes back where it is dragged open again. Pressing Enter on the trigger does the same, as double-clicking it does, so a panel can be shut and opened without the pointer ever being dragged. A panel that folds away wants a minimum as well, since that is the size it has to be taken under before it will go.",
        setup: insetSetup,
        preview: collapsiblePreview,
        code: collapsibleCode,
    },
    {
        name: "Held where they stand",
        description:
            "Every panel held where it is, for a layout a reader is shown rather than one they arrange. Nothing moves them: neither dragging a trigger nor stepping it with the arrow keys. The trigger is left drawn as it was and left where it was in the tab order, since the panels it stands between still need parting — it is a trigger given a disabled of its own that is marked as one and taken off the keyboard's way.",
        setup: frameSetup,
        preview: disabledPreview,
        code: disabledCode,
    },
];

// Which way the panels are laid out
const orientation = '"horizontal" | "vertical"';

// How much room a panel is given. A number is read as pixels and a string without units as a share
// of the group, so the two are the one type saying two different things
const panelSizeProp = "number | string";

// What a panel is handed about its own size, both ways of reading it at once
const panelSize = "{ asPercentage: number; inPixels: number }";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the group and its parts take, under the part that takes it. The group is built on
// react-resizable-panels, so on top of what is said here the group and the panels take what that
// library takes.
//
// The group comes first, since which way the panels run and whether they move at all are settled
// there; the panel follows, carrying the whole of what settles where it comes to rest, then the
// trigger, and last the two parts a trigger is drawn out of
const groups: ComponentPropGroup[] = [
    {
        name: "Resizable",
        props: [
            {
                name: "orientation",
                type: orientation,
                default: '"horizontal"',
                description:
                    "Which way the panels are laid out. The triggers are told the other way about, since panels side by side are parted by a line standing up and panels stacked one on another by a line lying down",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Holds every panel where it stands, so neither dragging a trigger nor stepping it with the arrow keys moves them. The triggers are left drawn as they were and left where they were in the tab order, since the panels they stand between still need parting; it is a trigger given a disabled of its own that is marked as one and taken off the keyboard's way",
            },
            {
                name: "disableCursor",
                type: "boolean",
                default: "false",
                description:
                    "Leaves the pointer as it is rather than changing it to say which way a trigger will move",
            },
            {
                name: "defaultLayout",
                type: "ResizableLayout",
                description:
                    "Where the panels start, kept against the id of each of them. It is what a layout saved from a previous visit is handed back through, so the panels come back where the reader left them",
            },
            {
                name: "onLayoutChange",
                type: "(layout: ResizableLayout) => void",
                description:
                    "Called as the layout is changing, which for a drag is every time the pointer moves. It is onLayoutChanged that a layout being saved somewhere wants",
            },
            {
                name: "onLayoutChanged",
                type: "(layout: ResizableLayout, meta: { isUserInteraction: boolean }) => void",
                description:
                    "Called once the layout has changed, which for a drag is not until the trigger has been let go of. This is what a layout being saved somewhere is read from; the second argument says whether the change came from the reader or from somewhere else, such as the group being set a layout outright",
            },
            {
                name: "resizableRef",
                type: "React.Ref<ResizableInstance>",
                description:
                    "Exposes what the group can be asked to do from outside it: reading the layout back, and setting a fresh one",
            },
            styling,
        ],
    },
    {
        name: "Resizable.Panel",
        props: [
            {
                name: "defaultSize",
                type: panelSizeProp,
                description:
                    "How much room the panel starts with. Given none, it takes an even share of whatever the panels beside it leave",
            },
            {
                name: "minSize",
                type: panelSizeProp,
                default: '"0"',
                description:
                    "How little room the panel will take, however far the trigger is dragged. It is also the size a panel that may be folded away has to be taken under before it will go",
            },
            {
                name: "maxSize",
                type: panelSizeProp,
                default: '"100"',
                description:
                    "How much room the panel will take, however far the trigger is dragged",
            },
            {
                name: "collapsible",
                type: "boolean",
                default: "false",
                description:
                    "Lets the panel fold shut where it is dragged below its minimum, rather than going on shrinking. Pressing Enter on the trigger beside it folds it away and brings it back, as double-clicking that trigger does",
            },
            {
                name: "collapsedSize",
                type: panelSizeProp,
                default: '"0"',
                description:
                    "How much room a folded panel is left with, for one folded to a stub rather than shut",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Holds this panel where it stands, whether it is reached for directly or moved by a panel beside it",
            },
            {
                name: "id",
                type: "string | number",
                description:
                    "Names the panel within its group, which is what a saved layout is kept against. One is made where the caller does not give one, so a layout that has to outlive the page wants a name of the caller's own",
            },
            {
                name: "onResize",
                type: `(size: ${panelSize}, id?: string | number, previous?: ${panelSize}) => void`,
                description:
                    "Called as the panel's own size changes, with the size read both as a share of the group and in pixels",
            },
            {
                name: "panelRef",
                type: "React.Ref<ResizablePanelInstance>",
                description:
                    "Exposes what the panel can be asked to do from outside it: folding it away, bringing it back, reading its size, and setting a fresh one",
            },
            styling,
        ],
    },
    {
        name: "Resizable.ResizeTrigger",
        props: [
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Holds this one trigger where it stands, leaving the rest of the group as it was. It is drawn back rather than taken away, and taken off the keyboard's way",
            },
            styling,
        ],
    },
    {
        name: "Resizable.ResizeTriggerSeparator",
        props: [styling],
    },
    {
        name: "Resizable.ResizeTriggerIndicator",
        props: [styling],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the group is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Resizable = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Resizable
            </Heading>
            <Text as="p" size="large">
                A row or a column of panels with a handle between each pair, which a reader drags to
                give room to one panel by taking it from the next. The panels are laid out within
                whatever room the group is given rather than within a size of its own, so it has to
                be given some: standing in a box of no height it draws nothing. Where they come to
                rest is the panels&apos; own to settle, each saying how much room it starts with and
                how little or how much it will take.
            </Text>
        </Stack>
        <ComponentExamples component="Resizable" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Resizable;
