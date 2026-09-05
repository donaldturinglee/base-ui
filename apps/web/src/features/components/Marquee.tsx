import * as React from "react";
import {
    Button,
    Heading,
    Marquee as MarqueeComponent,
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
    // The window the run is seen through, held to a width the handful of things travelling through
    // it are longer than. A marquee is as wide as it is let be, and one run out to the card would
    // be a window wider than the run, which leaves a gap behind it at every turn. On a page a run
    // is as long as whatever it is carrying, so this is the page's own furniture, as the card
    // around it is, and the listing beneath is of the marquee alone
    preview: "max-w-[36rem]",
    // A run reading down is given a height as well. The marquee is the window itself, and one that
    // was given no height is as tall as everything it is carrying, which leaves it nothing to
    // travel through. It is part of what the example is showing rather than the page's own
    // furniture, since a run reading down has the same to say wherever it stands
    column: "h-[var(--base-size-128)]",
    // The fade is drawn to the ground the page is on, and inside a card that is not the ground the
    // run stands on: in a dark theme a card is the muted background rather than the default one, so
    // the fade would be drawn to a colour that is not there. It is part of what the example is
    // showing rather than the page's own furniture, since a run standing on anything but the page
    // itself has the same to say
    onCard: "[--marquee-edge-color:var(--card-background-color)]",
};

// What every run is made of. It is written once and read out into each of the examples, since what
// they are about is the run rather than the things being carried in it, and things that changed
// between them would be read as though they were the point.
//
// The page and the component it is about are both called Marquee, so the component is brought in
// under a name saying which of the two it is. The listings beneath say Marquee, as an application
// importing it would
const fruits = [
    "🍎 Apple",
    "🍌 Banana",
    "🍒 Cherry",
    "🍇 Grape",
    "🍉 Watermelon",
    "🍓 Strawberry",
    "🍑 Peach",
    "🍍 Pineapple",
];

const items = fruits.map((fruit) => (
    <MarqueeComponent.Item key={fruit}>{fruit}</MarqueeComponent.Item>
));

// The same run with too little left in it to cover the window, which is the one thing asking for
// the window to be filled is for
const two = items.slice(0, 2);

// What the examples have to have in hand before they can be drawn. The run is written once and
// reached for by every example, rather than laid out again inside each of them, where what changed
// between one and the next would be lost among what did not
const setup = `const fruits = [
    "🍎 Apple",
    "🍌 Banana",
    "🍒 Cherry",
    "🍇 Grape",
    "🍉 Watermelon",
    "🍓 Strawberry",
    "🍑 Peach",
    "🍍 Pineapple",
];

const items = fruits.map((fruit) => <Marquee.Item key={fruit}>{fruit}</Marquee.Item>);`;

// The plainest run there is: a window, a run written the once, and the things travelling in it.
// Everything else is left out, so it heads for the start of the line at the speed a marquee takes
// where it has not been told one, and goes round for as long as it is on the page.
//
// The marquee itself draws nothing but the ground the parts stand on. The window is what cuts off
// whatever is standing outside it, the run is what is laid out as many times as the window takes,
// and each thing in it carries the gap to the next
const defaultPreview = (
    <MarqueeComponent className={classes.preview}>
        <MarqueeComponent.Viewport>
            <MarqueeComponent.Content>{items}</MarqueeComponent.Content>
        </MarqueeComponent.Viewport>
    </MarqueeComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Marquee>
    <Marquee.Viewport>
        <Marquee.Content>{items}</Marquee.Content>
    </Marquee.Viewport>
</Marquee>`;

// A run reading down rather than across, which follows from the end it was told to head for rather
// than being asked for on its own. It is given a height to travel through, since the marquee is the
// window and one that was given none is as tall as everything it holds
const verticalPreview = (
    <MarqueeComponent side="top" className={`${classes.preview} ${classes.column}`}>
        <MarqueeComponent.Viewport>
            <MarqueeComponent.Content>{items}</MarqueeComponent.Content>
        </MarqueeComponent.Viewport>
    </MarqueeComponent>
);

// The height is part of what is being shown rather than the page's own furniture, so it is got
// ready with the example rather than left out of it
const columnSetup = `${setup}

const column = "h-[var(--base-size-128)]";`;

const verticalCode = `<Marquee side="top" className={column}>
    <Marquee.Viewport>
        <Marquee.Content>{items}</Marquee.Content>
    </Marquee.Viewport>
</Marquee>`;

// A run sent the other way. The two are drawn together rather than one alone, since which way a run
// is travelling is read against another rather than off itself
const reversePreview = (
    <Stack gap="normal">
        <MarqueeComponent className={classes.preview}>
            <MarqueeComponent.Viewport>
                <MarqueeComponent.Content>{items}</MarqueeComponent.Content>
            </MarqueeComponent.Viewport>
        </MarqueeComponent>
        <MarqueeComponent reverse className={classes.preview}>
            <MarqueeComponent.Viewport>
                <MarqueeComponent.Content>{items}</MarqueeComponent.Content>
            </MarqueeComponent.Viewport>
        </MarqueeComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the two read one under the other
const reverseCode = `<Stack gap="normal">
    <Marquee>
        <Marquee.Viewport>
            <Marquee.Content>{items}</Marquee.Content>
        </Marquee.Viewport>
    </Marquee>
    <Marquee reverse>
        <Marquee.Viewport>
            <Marquee.Content>{items}</Marquee.Content>
        </Marquee.Viewport>
    </Marquee>
</Stack>`;

// How far the run travels in a second. The two are drawn together, since a pace is read against
// another rather than counted off on its own
const speedPreview = (
    <Stack gap="normal">
        <MarqueeComponent speed={20} className={classes.preview}>
            <MarqueeComponent.Viewport>
                <MarqueeComponent.Content>{items}</MarqueeComponent.Content>
            </MarqueeComponent.Viewport>
        </MarqueeComponent>
        <MarqueeComponent speed={120} className={classes.preview}>
            <MarqueeComponent.Viewport>
                <MarqueeComponent.Content>{items}</MarqueeComponent.Content>
            </MarqueeComponent.Viewport>
        </MarqueeComponent>
    </Stack>
);

const speedCode = `<Stack gap="normal">
    <Marquee speed={20}>
        <Marquee.Viewport>
            <Marquee.Content>{items}</Marquee.Content>
        </Marquee.Viewport>
    </Marquee>
    <Marquee speed={120}>
        <Marquee.Viewport>
            <Marquee.Content>{items}</Marquee.Content>
        </Marquee.Viewport>
    </Marquee>
</Stack>`;

// A run drawn out to fill the window. The one that was not asked to is drawn above it, since what
// the gap behind a short run looks like is the whole of the reason for asking
const autoFillPreview = (
    <Stack gap="normal">
        <MarqueeComponent className={classes.preview}>
            <MarqueeComponent.Viewport>
                <MarqueeComponent.Content>{two}</MarqueeComponent.Content>
            </MarqueeComponent.Viewport>
        </MarqueeComponent>
        <MarqueeComponent autoFill className={classes.preview}>
            <MarqueeComponent.Viewport>
                <MarqueeComponent.Content>{two}</MarqueeComponent.Content>
            </MarqueeComponent.Viewport>
        </MarqueeComponent>
    </Stack>
);

// The shorter run is part of what is being shown rather than the page's own furniture, since
// nothing is drawn out to fill a window a run already covers
const autoFillSetup = `${setup}

const two = items.slice(0, 2);`;

const autoFillCode = `<Stack gap="normal">
    <Marquee>
        <Marquee.Viewport>
            <Marquee.Content>{two}</Marquee.Content>
        </Marquee.Viewport>
    </Marquee>
    <Marquee autoFill>
        <Marquee.Viewport>
            <Marquee.Content>{two}</Marquee.Content>
        </Marquee.Viewport>
    </Marquee>
</Stack>`;

// The gap between one thing in the run and the next, given as a length rather than a step on a
// scale, since what it is set against is whatever is being carried rather than the rest of the
// controls on the page
const spacingPreview = (
    <MarqueeComponent spacing="var(--base-size-48)" className={classes.preview}>
        <MarqueeComponent.Viewport>
            <MarqueeComponent.Content>{items}</MarqueeComponent.Content>
        </MarqueeComponent.Viewport>
    </MarqueeComponent>
);

const spacingCode = `<Marquee spacing="var(--base-size-48)">
    <Marquee.Viewport>
        <Marquee.Content>{items}</Marquee.Content>
    </Marquee.Viewport>
</Marquee>`;

// The run faded out where it meets the window rather than cut off at it. The edges are placed by
// hand and each is named for the edge it is drawn at, so a run can be faded at one end alone
const edgesPreview = (
    <MarqueeComponent className={`${classes.preview} ${classes.onCard}`}>
        <MarqueeComponent.Edge side="start" />
        <MarqueeComponent.Viewport>
            <MarqueeComponent.Content>{items}</MarqueeComponent.Content>
        </MarqueeComponent.Viewport>
        <MarqueeComponent.Edge side="end" />
    </MarqueeComponent>
);

// What the fade is drawn to is part of what is being shown rather than the page's own furniture,
// since a run standing on anything but the page itself has to say what it is fading into
const edgesSetup = `${setup}

const onCard = "[--marquee-edge-color:var(--card-background-color)]";`;

const edgesCode = `<Marquee className={onCard}>
    <Marquee.Edge side="start" />
    <Marquee.Viewport>
        <Marquee.Content>{items}</Marquee.Content>
    </Marquee.Viewport>
    <Marquee.Edge side="end" />
</Marquee>`;

// A run that waits before it sets off, for one that is not the first thing a reader is meant to
// read. It stands where it starts until the wait is over rather than being held off the page
const delayPreview = (
    <MarqueeComponent delay={2000} className={classes.preview}>
        <MarqueeComponent.Viewport>
            <MarqueeComponent.Content>{items}</MarqueeComponent.Content>
        </MarqueeComponent.Viewport>
    </MarqueeComponent>
);

const delayCode = `<Marquee delay={2000}>
    <Marquee.Viewport>
        <Marquee.Content>{items}</Marquee.Content>
    </Marquee.Viewport>
</Marquee>`;

// A run that goes round a set number of times and says so on the way. It is a component of its own
// rather than an element the page holds ready, since what it is reporting has to be kept somewhere
// to be read back out.
//
// What the run reports is the reason for hearing about it at all, so the count is put to use beside
// the run rather than only stored
const LoopsPreview = () => {
    const [loops, setLoops] = React.useState(0);
    const [isDone, setDone] = React.useState(false);

    return (
        <Stack gap="normal">
            <MarqueeComponent
                loopCount={3}
                speed={120}
                onLoopComplete={setLoops}
                onComplete={() => setDone(true)}
                className={classes.preview}
            >
                <MarqueeComponent.Viewport>
                    <MarqueeComponent.Content>{items}</MarqueeComponent.Content>
                </MarqueeComponent.Viewport>
            </MarqueeComponent>
            <Text size="small">
                {isDone ? `Finished after ${loops} times round` : `${loops} times round`}
            </Text>
        </Stack>
    );
};

// What the run has come to is the caller's to keep, so it is got ready here, beside the run every
// example is drawn from
const loopsSetup = `${setup}

const [loops, setLoops] = React.useState(0);
const [isDone, setDone] = React.useState(false);`;

const loopsCode = `<Stack gap="normal">
    <Marquee
        loopCount={3}
        speed={120}
        onLoopComplete={setLoops}
        onComplete={() => setDone(true)}
    >
        <Marquee.Viewport>
            <Marquee.Content>{items}</Marquee.Content>
        </Marquee.Viewport>
    </Marquee>
    <Text size="small">
        {isDone ? \`Finished after \${loops} times round\` : \`\${loops} times round\`}
    </Text>
</Stack>`;

// A run left going under the pointer, for one that is a backdrop rather than something to be read
// on the way past
const withoutPausePreview = (
    <MarqueeComponent pauseOnInteraction={false} className={classes.preview}>
        <MarqueeComponent.Viewport>
            <MarqueeComponent.Content>{items}</MarqueeComponent.Content>
        </MarqueeComponent.Viewport>
    </MarqueeComponent>
);

const withoutPauseCode = `<Marquee pauseOnInteraction={false}>
    <Marquee.Viewport>
        <Marquee.Content>{items}</Marquee.Content>
    </Marquee.Viewport>
</Marquee>`;

// A run that starts out held, for one that waits to be asked for. The marquee is still keeping the
// state itself, so it is let go of by a reader arriving on it and leaving again rather than from
// outside
const defaultPausedPreview = (
    <MarqueeComponent defaultPaused className={classes.preview}>
        <MarqueeComponent.Viewport>
            <MarqueeComponent.Content>{items}</MarqueeComponent.Content>
        </MarqueeComponent.Viewport>
    </MarqueeComponent>
);

const defaultPausedCode = `<Marquee defaultPaused>
    <Marquee.Viewport>
        <Marquee.Content>{items}</Marquee.Content>
    </Marquee.Viewport>
</Marquee>`;

// The run with whether it is standing still held by whoever is drawing it rather than by the
// marquee. It is a component of its own rather than an element the page holds ready, since the
// state has to be kept somewhere for it to be handed back down.
//
// What the caller does with the state is the reason for holding it at all, so it is put to use
// beside the run rather than only stored: the button holds the run and lets it go, and says which
// of the two pressing it would do. A run a reader can hold from outside is not held under the
// pointer as well, since the button would then say one thing while the run did another
const ControlledPreview = () => {
    const [paused, setPaused] = React.useState(false);

    return (
        <Stack gap="normal">
            <MarqueeComponent
                paused={paused}
                pauseOnInteraction={false}
                className={classes.preview}
            >
                <MarqueeComponent.Viewport>
                    <MarqueeComponent.Content>{items}</MarqueeComponent.Content>
                </MarqueeComponent.Viewport>
            </MarqueeComponent>
            <Stack align="start">
                <Button onClick={() => setPaused(!paused)}>{paused ? "Play" : "Pause"}</Button>
            </Stack>
        </Stack>
    );
};

// The marquee is told whether it is standing still rather than keeping it, so the state is the
// caller's and is got ready here
const controlledSetup = `${setup}

const [paused, setPaused] = React.useState(false);`;

const controlledCode = `<Stack gap="normal">
    <Marquee paused={paused} pauseOnInteraction={false}>
        <Marquee.Viewport>
            <Marquee.Content>{items}</Marquee.Content>
        </Marquee.Viewport>
    </Marquee>
    <Stack align="start">
        <Button onClick={() => setPaused(!paused)}>{paused ? "Play" : "Pause"}</Button>
    </Stack>
</Stack>`;

// The run as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Reading down rather than across",
        description:
            "Which way the run reads follows from the end of the window it was told to head for rather than being asked for on its own: start and end read across, top and bottom read down. The two along the line are named for the end rather than for a hand, so a run heading for the start goes rightwards where the page is read right to left. A run reading down is given a height to travel through, since the marquee is the window itself and one that was given none is as tall as everything it is carrying.",
        setup: columnSetup,
        preview: verticalPreview,
        code: verticalCode,
    },
    {
        name: "The other way round",
        description:
            "The run sent the other way without renaming the end it heads towards, which is the same steps played backwards. It is what a second run set under the first is given, so that the two read against each other rather than together.",
        setup,
        preview: reversePreview,
        code: reverseCode,
    },
    {
        name: "How fast it travels",
        description:
            "How far the run travels in a second, in pixels. It is a speed rather than a length of time, so a run that is given more to carry takes longer to go by instead of going by faster, and two runs of different lengths set side by side travel at the same pace.",
        setup,
        preview: speedPreview,
        code: speedCode,
    },
    {
        name: "Filling the window",
        description:
            "A run with too little in it to cover the window is drawn out into as many copies as it takes to fill one. Without this it travels with a gap behind it, which is what the run above is showing: two copies are enough for a run longer than the window it is seen through, and nothing else is drawn out unless it is asked for.",
        setup: autoFillSetup,
        preview: autoFillPreview,
        code: autoFillCode,
    },
    {
        name: "The gap between one thing and the next",
        description:
            "The room left between one thing in the run and the next, as a CSS length. It is carried by the things themselves rather than by the copy holding them, so the last thing in a copy is followed by the same gap as everything else and the join between one copy and the next cannot be picked out.",
        setup,
        preview: spacingPreview,
        code: spacingCode,
    },
    {
        name: "Faded at the ends",
        description:
            "The run faded out where it meets the window rather than cut off at it, so that something on its way in or out is not simply there and then gone. Each edge is placed by hand and named for the edge it is drawn at, so a run can be faded at one end alone. It says nothing to a reader who cannot see it and takes no presses, since a fade is a way of drawing the window rather than a thing standing in it, and it is drawn to the ground the page is on unless it is told otherwise.",
        setup: edgesSetup,
        preview: edgesPreview,
        code: edgesCode,
    },
    {
        name: "Waiting before it sets off",
        description:
            "How long the run stands where it starts before it travels, in milliseconds, for one that is not the first thing a reader is meant to read. It is on the page for the whole of the wait, so what it is carrying can be read before any of it has moved.",
        setup,
        preview: delayPreview,
        code: delayCode,
    },
    {
        name: "A set number of times round",
        description:
            "How many times the run goes round, where it is an announcement rather than a backdrop. It reports each time it comes round and once more when it has finished the last of them, and then stands where it ended rather than going back to the start. A run given no number goes round for as long as it is on the page and never reaches the end.",
        setup: loopsSetup,
        preview: <LoopsPreview />,
        code: loopsCode,
    },
    {
        name: "Left going under the pointer",
        description:
            "A run is held still while a reader is on it, whether they arrived with a pointer or with the keyboard, so that something on its way out of the window is not read on past. One that is a backdrop rather than something to be read has nothing to hold for, and is told to keep going.",
        setup,
        preview: withoutPausePreview,
        code: withoutPauseCode,
    },
    {
        name: "Starting out held",
        description:
            "A run that stands still until it is asked for, where the marquee keeps hold of the state itself. It is read once, so a run started this way is let go of by a reader arriving on it and leaving again rather than from outside.",
        setup,
        preview: defaultPausedPreview,
        code: defaultPausedCode,
    },
    {
        name: "Held from outside",
        description:
            "Whether the run is standing still held by whoever is drawing it rather than by the marquee, which is what a run standing beside a control that has to agree with it is given. The same state on its own comes from useMarquee, and a control standing among the parts reads it from useMarqueeContext. A run held from outside is not held under the pointer as well, since the control would then say one thing while the run did another.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
];

// Which end of the window the run heads towards, and with it whether the run reads across or down
const side = '"start" | "end" | "top" | "bottom"';

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

// Every prop the marquee and its parts take, under the part that takes it.
//
// The marquee comes first, since the run is named, timed and held there and the parts read it from
// the marquee rather than being handed it again; the window, the run and the things in it follow in
// the order they are written in; and the edge last, with the one prop that is its own
const groups: ComponentPropGroup[] = [
    {
        name: "Marquee",
        props: [
            {
                name: "side",
                type: side,
                default: '"start"',
                description:
                    "Which end of the window the run heads towards, and with it whether the run reads across or down. The two along the line are named for the end rather than for a hand, so a run heading for the start goes rightwards where the page is read right to left",
            },
            {
                name: "speed",
                type: "number",
                default: "50",
                description:
                    "How far the run travels in a second, in pixels. A speed rather than a length of time, so a run that is given more to carry takes longer to go by instead of going by faster",
            },
            {
                name: "delay",
                type: "number",
                default: "0",
                description:
                    "How long the run stands where it starts before it travels, in milliseconds. It is on the page for the whole of the wait rather than held off it",
            },
            {
                name: "loopCount",
                type: "number",
                default: "0",
                description:
                    "How many times the run goes round. Nought goes round for as long as it is on the page, and a run given a number stands where it ended rather than going back to the start",
            },
            {
                name: "autoFill",
                type: "boolean",
                default: "false",
                description:
                    "Draws the run out into as many copies as it takes to fill the window, for one with too little in it to cover the window on its own and which would otherwise travel with a gap behind it",
            },
            {
                name: "spacing",
                type: "string",
                default: "var(--base-size-16)",
                description:
                    "The gap left between one thing in the run and the next, as a CSS length. It is carried by the things themselves, so the join between one copy and the next cannot be picked out",
            },
            {
                name: "reverse",
                type: "boolean",
                default: "false",
                description:
                    "Sends the run the other way without renaming the end it heads towards, which is the same steps played backwards",
            },
            {
                name: "paused",
                type: "boolean",
                description:
                    "Whether the run is standing still, where the state is held by whoever is drawing it rather than by the marquee. Given this, the marquee stops keeping its own and takes where it stands from the prop",
            },
            {
                name: "defaultPaused",
                type: "boolean",
                default: "false",
                description:
                    "Whether the run starts out standing still, for a marquee that keeps hold of the state itself. It is read once, so a run started this way is let go of by a reader rather than from outside",
            },
            {
                name: "pauseOnInteraction",
                type: "boolean",
                default: "true",
                description:
                    "Holds the run still while a reader is on it, whether they arrived with a pointer or with the keyboard, so that something on its way out of the window is not read on past. It is kept apart from the state the caller holds, so a run held from outside is not fought over by a pointer resting on it",
            },
            {
                name: "onPauseChange",
                type: "(paused: boolean) => void",
                description:
                    "Called with whether the run has just been held still. It says nothing about a reader arriving on the run, which is held apart from the state, so what it reports is only what was asked for",
            },
            {
                name: "onLoopComplete",
                type: "(loops: number) => void",
                description:
                    "Called each time the run has come round, with how many times it has done so. It is counted rather than read off the run, which starts over the moment anything about it changes, and the first copy alone is counted so a run is not reported once for each of them",
            },
            {
                name: "onComplete",
                type: "() => void",
                description:
                    "Called once a run that was given a number of times to go round has finished the last of them. A run that goes round for good never reaches this",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "Marquee.Viewport",
        props: [styling, polymorphic],
    },
    {
        name: "Marquee.Content",
        props: [styling, polymorphic],
    },
    {
        name: "Marquee.Item",
        props: [styling, polymorphic],
    },
    {
        name: "Marquee.Edge",
        props: [
            {
                name: "side",
                type: side,
                required: true,
                description:
                    "Which edge of the window the run is faded out at. It is given rather than followed from the marquee, so a run can be faded at one end alone",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the marquee is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Marquee = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Marquee
            </Heading>
            <Text as="p" size="large">
                A run of things travelling past a window cut in the page: logos, headlines, anything
                short enough to be taken in as it goes by. The marquee draws nothing but the ground
                its parts stand on, and is where the run is named, timed and held, since every one
                of those is the run's rather than any one part's. It is given a speed rather than a
                length of time, so what it carries can change without it travelling any faster, and
                it holds still while a reader is on it, whether they arrived with a pointer or with
                the keyboard. Only the first copy of the run is read out, so a reader who cannot see
                it is told what is going by once rather than as many times as it is drawn.
            </Text>
        </Stack>
        <ComponentExamples component="Marquee" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Marquee;
