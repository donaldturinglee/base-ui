import * as React from "react";
import {
    ArrowCounterclockwiseRegular,
    PauseRegular,
    PlayRegular,
} from "@gamecrafters/base-ui-icons";
import { Heading, Stack, Text, Timer as TimerComponent } from "@gamecrafters/base-ui/react";
import type { TimerUnit } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // The word naming a unit stands under its digits rather than beside them, so the face reads as
    // a row of units rather than as one long number
    unit: "flex flex-col items-center",
    label: "text-caption text-[var(--foreground-color-muted)]",
};

// What every example has to have in hand before it can be drawn: the two classes the face is laid
// out by. They are the same on every clock on the page, so they are written once and reached for
// by each of them
const faceSetup = `const unit = "flex flex-col items-center";
const label = "text-caption text-[var(--foreground-color-muted)]";`;

// One unit of the face, and the word saying which unit it is. Every clock on the page is built out
// of the same two, so they are written the once and the unit asked for each time.
//
// The word is what a reader who cannot see the face is told the units by, since what stands between
// them is drawn rather than read out
const renderUnit = (type: TimerUnit, word: string) => (
    <div className={classes.unit}>
        <TimerComponent.Item type={type} />
        <span className={classes.label}>{word}</span>
    </div>
);

// The same unit as it is written, at the depth it stands inside the area. It is worked out from the
// same two arguments the drawn one is, so what a reader is shown and what they are handed cannot
// fall out of step with each other
const unitCode = (type: TimerUnit, word: string) => `        <div className={unit}>
            <Timer.Item type="${type}" />
            <span className={label}>${word}</span>
        </div>`;

// What moves the clock. All four are laid out on every example, since which of them is there to be
// pressed is the clock's to say rather than the caller's: a trigger whose action the clock has no
// use for turns itself off, and the four together are what shows that.
//
// A start and a resume are two triggers rather than one that renames itself, because a button that
// changed its name under the reader's finger would be offering something other than what they
// pressed
const controls = (
    <TimerComponent.Control>
        <TimerComponent.ActionTrigger action="start" leadingVisual={PlayRegular}>
            Start
        </TimerComponent.ActionTrigger>
        <TimerComponent.ActionTrigger action="pause" leadingVisual={PauseRegular}>
            Pause
        </TimerComponent.ActionTrigger>
        <TimerComponent.ActionTrigger action="resume" leadingVisual={PlayRegular}>
            Resume
        </TimerComponent.ActionTrigger>
        <TimerComponent.ActionTrigger action="reset" leadingVisual={ArrowCounterclockwiseRegular}>
            Reset
        </TimerComponent.ActionTrigger>
    </TimerComponent.Control>
);

// The same row as it is written, set in one level from the timer it stands in
const controlsCode = `    <Timer.Control>
        <Timer.ActionTrigger action="start" leadingVisual={PlayRegular}>
            Start
        </Timer.ActionTrigger>
        <Timer.ActionTrigger action="pause" leadingVisual={PauseRegular}>
            Pause
        </Timer.ActionTrigger>
        <Timer.ActionTrigger action="resume" leadingVisual={PlayRegular}>
            Resume
        </Timer.ActionTrigger>
        <Timer.ActionTrigger action="reset" leadingVisual={ArrowCounterclockwiseRegular}>
            Reset
        </Timer.ActionTrigger>
    </Timer.Control>`;

// The plainest clock there is: five minutes counting down to nought, read to the second, with the
// four triggers under it. A countdown given nowhere to arrive is headed for nought, so nothing has
// to be said about where this one ends.
//
// Which units are shown is the caller's to lay out rather than the timer's to decide: a run of
// minutes laid out in days would carry two leading zeroes for days it will never reach.
//
// The page and the component it is about are both called Timer, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Timer, as an application
// importing it would
const defaultPreview = (
    <TimerComponent countdown startMs={5 * 60 * 1000}>
        <TimerComponent.Area>
            {renderUnit("minutes", "minutes")}
            <TimerComponent.Separator>:</TimerComponent.Separator>
            {renderUnit("seconds", "seconds")}
        </TimerComponent.Area>
        {controls}
    </TimerComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Timer countdown startMs={5 * 60 * 1000}>
    <Timer.Area>
${unitCode("minutes", "minutes")}
        <Timer.Separator>:</Timer.Separator>
${unitCode("seconds", "seconds")}
    </Timer.Area>
${controlsCode}
</Timer>`;

// A run counting up rather than down, from where it began to where it is headed. It stops on
// arrival rather than going past, so the face is left standing at the time it was headed for and
// drawn as having got there.
//
// A run counting up is the one that has to be told where it ends: given nowhere to arrive it goes
// on for as long as it is left to, where a countdown given none is headed for nought
const countUpPreview = (
    <TimerComponent startMs={40 * 60 * 1000} targetMs={60 * 60 * 1000}>
        <TimerComponent.Area>
            {renderUnit("hours", "hours")}
            <TimerComponent.Separator>:</TimerComponent.Separator>
            {renderUnit("minutes", "minutes")}
            <TimerComponent.Separator>:</TimerComponent.Separator>
            {renderUnit("seconds", "seconds")}
        </TimerComponent.Area>
        {controls}
    </TimerComponent>
);

const countUpCode = `<Timer startMs={40 * 60 * 1000} targetMs={60 * 60 * 1000}>
    <Timer.Area>
${unitCode("hours", "hours")}
        <Timer.Separator>:</Timer.Separator>
${unitCode("minutes", "minutes")}
        <Timer.Separator>:</Timer.Separator>
${unitCode("seconds", "seconds")}
    </Timer.Area>
${controlsCode}
</Timer>`;

// A clock read often enough for the milliseconds to move. The clock is looked at once an interval
// and stands at the last read in between, so a face showing milliseconds against the default of a
// second would show the same three figures the whole way down.
//
// What stands between the units is a full stop rather than a colon, since the milliseconds are part
// of the second above them rather than a unit counted alongside it
const intervalPreview = (
    <TimerComponent countdown startMs={30 * 1000} interval={50}>
        <TimerComponent.Area>
            {renderUnit("seconds", "seconds")}
            <TimerComponent.Separator>.</TimerComponent.Separator>
            {renderUnit("milliseconds", "ms")}
        </TimerComponent.Area>
        {controls}
    </TimerComponent>
);

const intervalCode = `<Timer countdown startMs={30 * 1000} interval={50}>
    <Timer.Area>
${unitCode("seconds", "seconds")}
        <Timer.Separator>.</Timer.Separator>
${unitCode("milliseconds", "ms")}
    </Timer.Area>
${controlsCode}
</Timer>`;

// A clock that is going as soon as it is drawn, for a run nobody has to press to set off. The
// triggers are laid out all the same, since a run already going is still one a reader can hold or
// put back — and the start turns itself off on its own, because there is nothing left for it to do
const autoStartPreview = (
    <TimerComponent autoStart countdown startMs={60 * 1000}>
        <TimerComponent.Area>
            {renderUnit("minutes", "minutes")}
            <TimerComponent.Separator>:</TimerComponent.Separator>
            {renderUnit("seconds", "seconds")}
        </TimerComponent.Area>
        {controls}
    </TimerComponent>
);

const autoStartCode = `<Timer autoStart countdown startMs={60 * 1000}>
    <Timer.Area>
${unitCode("minutes", "minutes")}
        <Timer.Separator>:</Timer.Separator>
${unitCode("seconds", "seconds")}
    </Timer.Area>
${controlsCode}
</Timer>`;

// What the clock says about the run: each time it has been read again, and the once when it
// arrives. It is a component of its own rather than an element the page holds ready, since what is
// reported has to be kept somewhere to be shown.
//
// Ten seconds rather than the five minutes above, so that a reader watching it sees it arrive
// rather than being told it would
const EventsPreview = () => {
    const [reads, setReads] = React.useState(0);
    const [arrivals, setArrivals] = React.useState(0);

    return (
        <TimerComponent
            countdown
            startMs={10 * 1000}
            onTick={() => setReads((count) => count + 1)}
            onComplete={() => setArrivals((count) => count + 1)}
        >
            <TimerComponent.Area>{renderUnit("seconds", "seconds")}</TimerComponent.Area>
            {controls}
            <Text size="small">
                Read {reads} times, arrived {arrivals} times
            </Text>
        </TimerComponent>
    );
};

// What the example has to have in hand before it can be drawn: the classes the face is laid out by,
// and what the run has reported so far, which is the caller's to keep
const eventsSetup = `${faceSetup}

const [reads, setReads] = React.useState(0);
const [arrivals, setArrivals] = React.useState(0);`;

const eventsCode = `<Timer
    countdown
    startMs={10 * 1000}
    onTick={() => setReads((count) => count + 1)}
    onComplete={() => setArrivals((count) => count + 1)}
>
    <Timer.Area>
${unitCode("seconds", "seconds")}
    </Timer.Area>
${controlsCode}
    <Text size="small">
        Read {reads} times, arrived {arrivals} times
    </Text>
</Timer>`;

// The timer as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: faceSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Counting up to somewhere",
        description:
            "A run counting up away from where it began rather than down towards nought, stopping where it is headed rather than going past it. A run counting up is the one that has to be told where it ends: given nowhere to arrive it goes on for as long as it is left to, where a countdown given none is headed for nought. The face is left standing at the time it arrived at and drawn as having got there, since a clock that cleared itself would leave a reader with nothing to read.",
        setup: faceSetup,
        preview: countUpPreview,
        code: countUpCode,
    },
    {
        name: "Read often enough for the milliseconds to move",
        description:
            "How often the clock is read again. It stands at the last read in between rather than at the moment something happens to ask it, so a face showing milliseconds against the default of a second would show the same three figures the whole way down. What stands between the units is a full stop rather than a colon, since the milliseconds are part of the second above them rather than a unit counted alongside it.",
        setup: faceSetup,
        preview: intervalPreview,
        code: intervalCode,
    },
    {
        name: "Going as soon as it is drawn",
        description:
            "A run set going as it arrives, for a clock nobody has to press to set off. The triggers are laid out all the same, since a run already going is still one a reader can hold or put back, and the start turns itself off on its own because there is nothing left for it to do.",
        setup: faceSetup,
        preview: autoStartPreview,
        code: autoStartCode,
    },
    {
        name: "Reporting the run",
        description:
            "What the clock says about the run as it goes: onTick each time it has been read again, with the time it now shows, and onComplete the once when it arrives. A run counting up with nowhere to arrive never reaches the second of them. Ten seconds rather than the five minutes above, so that a reader watching it sees it arrive rather than being told it would.",
        setup: eventsSetup,
        preview: <EventsPreview />,
        code: eventsCode,
    },
];

// Which unit of the time an item shows. A clock is laid out in whichever of them the caller wants
// rather than in all of them
const unitType = '"days" | "hours" | "minutes" | "seconds" | "milliseconds"';

// What pressing a trigger does. Start sets a run going from the beginning and resume picks up one
// that was held, which is what tells a clock that has finished from one that was only stopped
const action = '"start" | "pause" | "resume" | "reset"';

// What is handed to the handler each time the clock is read again
const tickDetails = "{ value: number; time: TimerTime; formattedTime: TimerFormattedTime }";

// What a visual is handed over as: the component to draw, or an element already built
const visual = "React.ElementType | React.ReactElement | null";

// How much weight the trigger carries against the page, and how tall it is drawn. They are the
// button's own, since the trigger is a button underneath
const variant = '"default" | "primary" | "danger" | "invisible" | "link"';

const size = '"small" | "medium" | "large"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. Every part but the
// trigger is drawn as an element the caller can name, and the trigger is a button
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"div"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the timer and its parts take, under the part that takes it. The run is named on the
// timer rather than on the parts, so the whole of what a clock is set up with is in the first table
// and the parts beneath it are about how the face is laid out.
//
// Where the run starts and which way it goes come first, then where it ends and how often it is
// read, then what it reports; the face follows, read from the outside in, and the triggers last
const groups: ComponentPropGroup[] = [
    {
        name: "Timer",
        props: [
            {
                name: "countdown",
                type: "boolean",
                default: "false",
                description:
                    "Counts down towards where it is headed rather than up away from where it began",
            },
            {
                name: "startMs",
                type: "number",
                default: "0",
                description:
                    "Where the clock stands before it is set going, and where putting it back returns it to, in milliseconds",
            },
            {
                name: "targetMs",
                type: "number",
                description:
                    "Where the run ends, in milliseconds. A countdown given none is headed for nought; a run counting up given none goes on for as long as it is left to. The clock is held at whichever end it was headed for, so a read that arrives late cannot carry it past the end of its own run",
            },
            {
                name: "interval",
                type: "number",
                default: "1000",
                description:
                    "How often the clock is read again, in milliseconds. It stands at the last read in between rather than at the moment something happens to ask it, so a face showing milliseconds wants a smaller step than a face read to the second",
            },
            {
                name: "autoStart",
                type: "boolean",
                default: "false",
                description:
                    "Sets the run going as soon as it is drawn, rather than waiting to be started",
            },
            {
                name: "onTick",
                type: `(details: ${tickDetails}) => void`,
                description:
                    "Called each time the clock has been read again, with where it stands in milliseconds and the same time split into units and written out",
            },
            {
                name: "onComplete",
                type: "() => void",
                description:
                    "Called once the run has arrived where it was headed. A run counting up with nowhere to arrive never reaches this",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "TimerArea",
        props: [styling, polymorphic],
    },
    {
        name: "TimerItem",
        props: [
            {
                name: "type",
                type: unitType,
                required: true,
                description:
                    "Which unit of the time this one shows. The unit is asked for rather than the figure handed in, so a caller lays out the face they want and the clock behind it goes on being the one run. It is written out padded to the width it is read at, and a caller who would rather show something else puts that in as children",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "TimerSeparator",
        props: [styling, polymorphic],
    },
    {
        name: "TimerControl",
        props: [styling, polymorphic],
    },
    {
        name: "TimerActionTrigger",
        props: [
            {
                name: "action",
                type: action,
                required: true,
                description:
                    "What pressing it does. Start sets a run going from the beginning, resume picks up one that was held, and reset puts the clock back without setting it going again. A trigger whose action the clock has no use for just now turns itself off, unless the caller has said whether it is disabled",
            },
            {
                name: "leadingVisual",
                type: visual,
                description:
                    "Drawn before the label, where an icon says something the words leave out. A control that moves a clock is usually found by its arrow before its word",
            },
            {
                name: "variant",
                type: variant,
                default: '"default"',
                description: "How much weight the trigger carries against the page",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How tall the trigger is drawn, and how much room it leaves around its label",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the timer is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Timer = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Timer
            </Heading>
            <Text as="p" size="large">
                A length of time laid out to be watched: the digits it is read in, and the controls
                that set it going, hold it and put it back. The run is named on the timer rather
                than on the digits, so every unit of the face is reading the one clock rather than
                keeping one of its own and drifting from the rest. Which units are shown is the
                caller&apos;s to lay out, since a run of minutes laid out in days would carry two
                leading zeroes for days it will never reach.
            </Text>
        </Stack>
        <ComponentExamples component="Timer" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Timer;
