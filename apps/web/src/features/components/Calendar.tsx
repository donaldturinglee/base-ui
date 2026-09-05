import * as React from "react";
import {
    Button,
    Calendar as CalendarComponent,
    Heading,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { CalendarRange } from "@gamecrafters/base-ui/react";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// A day so many days from this one, which is how the examples that are about a stretch of days name
// their ends. They are worked out from today rather than written down, so that a page read in a
// year's time still shows the days around whenever it is being read
const daysFromToday = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);

    return date;
};

const daysFromTodaySetup = `const daysFromToday = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);

    return date;
};`;

// How far a stretch of days has been picked, written out so that both ends can be read as they are
// taken. A stretch with only one end to it is one still being picked, which is worth saying rather
// than leaving the reader to wonder whether the second press was taken
const describeRange = ({ from, to }: CalendarRange) => {
    if (from === null) {
        return "No days picked";
    }

    if (to === null) {
        return `${from.toDateString()} — now pick the day it runs to`;
    }

    return `${from.toDateString()} to ${to.toDateString()}`;
};

// The plainest calendar there is: this month, with nothing picked on it and nothing said with a
// prop. It keeps what is picked for itself, since nothing was handed it to hold.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the calendar alone. The card lays what it is handed out in a
// column, and a column stretches what it holds the whole way across unless it is told otherwise,
// which would pull the two chevrons above the grid out to the edges of the page.
//
// The page and the component it is about are both called Calendar, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Calendar, as an application
// importing it would
const defaultPreview = (
    <Stack align="start">
        <CalendarComponent />
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Calendar />`;

// The calendar with the day held by whoever is drawing it rather than by the calendar. It is a
// component of its own rather than an element the page holds ready, since the day has to be kept
// somewhere for it to be handed back down.
//
// What the caller does with the day is the reason for holding it at all, so it is put to use beside
// the grid rather than only stored: the two presses move the day from outside the calendar, which is
// the whole of what holding it is for
const ControlledPreview = () => {
    const [value, setValue] = React.useState<Date | null>(null);

    return (
        <Stack gap="condensed" align="start">
            <CalendarComponent value={value} onChange={setValue} />
            <Stack direction="horizontal" gap="condensed">
                <Button size="small" onClick={() => setValue(new Date())}>
                    Today
                </Button>
                <Button size="small" onClick={() => setValue(null)}>
                    Clear
                </Button>
            </Stack>
            <Text size="small">{value ? value.toDateString() : "No day picked"}</Text>
        </Stack>
    );
};

// What the example has to have in hand before it can be drawn. The calendar is told which day
// stands picked rather than keeping it, so the day is the caller's and is got ready here
const controlledSetup = `const [value, setValue] = React.useState<Date | null>(null);`;

const controlledCode = `<Stack gap="condensed" align="start">
    <Calendar value={value} onChange={setValue} />
    <Stack direction="horizontal" gap="condensed">
        <Button size="small" onClick={() => setValue(new Date())}>Today</Button>
        <Button size="small" onClick={() => setValue(null)}>Clear</Button>
    </Stack>
    <Text size="small">{value ? value.toDateString() : "No day picked"}</Text>
</Stack>`;

// A stretch of days rather than one: the first day pressed opens it, the second closes it, and a
// third starts a new one. Running the pointer across the grid while a stretch is half picked shows
// where it would run to before it is taken, and the arrow keys do the same
const RangePreview = () => {
    const [range, setRange] = React.useState<CalendarRange>({ from: null, to: null });

    return (
        <Stack gap="condensed" align="start">
            <CalendarComponent mode="range" value={range} onChange={setRange} />
            <Text size="small">{describeRange(range)}</Text>
        </Stack>
    );
};

// What the example has to have in hand. The handler is called on both presses, so the line under the
// grid has to say what a stretch with only one end to it is
const rangeSetup = `const describeRange = ({ from, to }: CalendarRange) => {
    if (from === null) {
        return "No days picked";
    }

    if (to === null) {
        return \`\${from.toDateString()} — now pick the day it runs to\`;
    }

    return \`\${from.toDateString()} to \${to.toDateString()}\`;
};

const [range, setRange] = React.useState<CalendarRange>({ from: null, to: null });`;

const rangeCode = `<Stack gap="condensed" align="start">
    <Calendar mode="range" value={range} onChange={setRange} />
    <Text size="small">{describeRange(range)}</Text>
</Stack>`;

// The earliest and the latest day that can be picked, past which there is nowhere left to go: the
// chevron for a month with nothing pickable in it is stopped rather than left to be pressed. This is
// the stretch the days are picked out of rather than a stretch of days being picked
const limitsPreview = (
    <Stack align="start">
        <CalendarComponent min={daysFromToday(-3)} max={daysFromToday(10)} />
    </Stack>
);

const limitsCode = `<Calendar min={daysFromToday(-3)} max={daysFromToday(10)} />`;

// Days ruled out one by one, for a reason the calendar has no way of knowing. A day that cannot be
// picked says so rather than being taken out of the grid, so that a reader can still reach it and be
// told why
const ruledOutPreview = (
    <Stack gap="condensed" align="start">
        <Text size="small">Weekends cannot be picked</Text>
        <CalendarComponent isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6} />
    </Stack>
);

// The line above the grid is part of what is being shown rather than the page's own furniture, since
// a rule the calendar was handed says nothing about itself and a reader would otherwise be left to
// work out what the greyed days have in common
const ruledOutCode = `<Stack gap="condensed" align="start">
    <Text size="small">Weekends cannot be picked</Text>
    <Calendar isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6} />
</Stack>`;

// Which day the week starts on. The two are drawn together rather than one to an example, since
// where a week begins is read against the other rather than on its own, and each is named by the day
// it was told to start on
const weekStartPreview = (
    <Stack direction="horizontal" gap="spacious" wrap="wrap">
        <Stack gap="condensed" align="start">
            <Text size="small">Sunday</Text>
            <CalendarComponent weekStartsOn={0} />
        </Stack>
        <Stack gap="condensed" align="start">
            <Text size="small">Monday</Text>
            <CalendarComponent weekStartsOn={1} />
        </Stack>
    </Stack>
);

const weekStartCode = `<Stack direction="horizontal" gap="spacious" wrap="wrap">
    <Stack gap="condensed" align="start">
        <Text size="small">Sunday</Text>
        <Calendar weekStartsOn={0} />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text size="small">Monday</Text>
        <Calendar weekStartsOn={1} />
    </Stack>
</Stack>`;

// Every month held to six weeks, so that whatever stands below the calendar does not move as the
// reader goes from one month to the next. A month that would have run to five rows is given a sixth
// out of the month after it
const fixedWeeksPreview = (
    <Stack align="start">
        <CalendarComponent fixedWeeks />
    </Stack>
);

const fixedWeeksCode = `<Calendar fixedWeeks />`;

// Only the month itself, with the weeks at either end left part empty. The days are still there in
// the grid, so the shape of it holds; it is what fills them that is left out
const withoutOutsideDaysPreview = (
    <Stack align="start">
        <CalendarComponent showOutsideDays={false} />
    </Stack>
);

const withoutOutsideDaysCode = `<Calendar showOutsideDays={false} />`;

// The week of the year, written before each row. It is a column of the table rather than something
// set beside it, so the numbers keep step with the rows however tall they are drawn
const weekNumbersPreview = (
    <Stack align="start">
        <CalendarComponent showWeekNumbers />
    </Stack>
);

const weekNumbersCode = `<Calendar showWeekNumbers />`;

// The same month a year either side of itself, which is the one step the two chevrons above the grid
// do not offer
const shiftYear = (date: Date, years: number) => {
    const next = new Date(date);
    next.setFullYear(next.getFullYear() + years);

    return next;
};

// The month on show, held by the caller rather than by the calendar, so that it can be moved from
// somewhere other than the two chevrons above the grid. It is a component of its own for the reason
// the controlled day is one: the month has to be kept somewhere to be handed back down.
//
// The calendar still moves itself where a reader presses a chevron or walks off the end of a month
// with the arrow keys — it says so rather than doing it, and what it says is put straight back
const MonthPreview = () => {
    const [month, setMonth] = React.useState(new Date());

    return (
        <Stack gap="condensed" align="start">
            <Stack direction="horizontal" gap="condensed">
                <Button size="small" onClick={() => setMonth(shiftYear(month, -1))}>
                    A year back
                </Button>
                <Button size="small" onClick={() => setMonth(shiftYear(month, 1))}>
                    A year on
                </Button>
            </Stack>
            <CalendarComponent month={month} onMonthChange={setMonth} />
        </Stack>
    );
};

const monthSetup = `const shiftYear = (date: Date, years: number) => {
    const next = new Date(date);
    next.setFullYear(next.getFullYear() + years);

    return next;
};

const [month, setMonth] = React.useState(new Date());`;

const monthCode = `<Stack gap="condensed" align="start">
    <Stack direction="horizontal" gap="condensed">
        <Button size="small" onClick={() => setMonth(shiftYear(month, -1))}>A year back</Button>
        <Button size="small" onClick={() => setMonth(shiftYear(month, 1))}>A year on</Button>
    </Stack>
    <Calendar month={month} onMonthChange={setMonth} />
</Stack>`;

// How the month above the grid is written, in the tokens Day.js reads. The default writes it out in
// full; this is the same month said shorter, for a calendar standing somewhere narrow
const monthFormatPreview = (
    <Stack align="start">
        <CalendarComponent monthFormat="MMM YYYY" />
    </Stack>
);

const monthFormatCode = `<Calendar monthFormat="MMM YYYY" />`;

// The calendar as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then who holds what has been picked, then what can be picked at all, and after those
// what the grid is made to look like
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "A day the caller holds",
        description:
            "The day held by whoever is drawing the calendar rather than by the calendar, which is what anything else on the page having a say over it wants. Handed nothing to hold, the calendar keeps the day itself and a starting one is given as defaultValue instead.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
    {
        name: "A stretch of days",
        description:
            "A stretch of days rather than one. The first day pressed opens it and the second closes it; a third starts a new one, and pressing the day it was opened on lets go of it again. Running the pointer across the grid while a stretch is half picked shows where it would run to before it is taken, and moving through the grid by keyboard does the same. The handler is called on both presses, so the first hands back a stretch with only one end to it.",
        setup: rangeSetup,
        preview: <RangePreview />,
        code: rangeCode,
    },
    {
        name: "The earliest and the latest day",
        description:
            "The two ends of what can be picked at all, which is the stretch the days are picked out of rather than a stretch of days being picked. A month with nothing in it that could be picked is nowhere worth going, so the chevron that would lead there is stopped rather than left to be pressed.",
        setup: daysFromTodaySetup,
        preview: limitsPreview,
        code: limitsCode,
    },
    {
        name: "Days ruled out one by one",
        description:
            "Days that cannot be picked for a reason the calendar has no way of knowing — a weekend, a day already taken, a day the reader is not allowed. A ruled-out day says so rather than being taken out of the grid, so a reader moving through it by keyboard still arrives at the day and can be told why it is not to be had.",
        preview: ruledOutPreview,
        code: ruledOutCode,
    },
    {
        name: "Which day the week starts on",
        description:
            "Where the week begins, counted from Sunday. Left out, it is taken from whatever locale Day.js is set to, so a calendar that says nothing already starts the week where the reader expects it to.",
        preview: weekStartPreview,
        code: weekStartCode,
    },
    {
        name: "A steady height",
        description:
            "Every month held to six weeks, so that whatever stands below the calendar does not move as the reader goes from one month to the next. It is what a calendar inside an overlay wants most, since an overlay that changes height under the pointer moves the day being reached for out from under it.",
        preview: fixedWeeksPreview,
        code: fixedWeeksCode,
    },
    {
        name: "Only the month itself",
        description:
            "The days of the months either side left out, so the weeks at either end are part empty. The cells are still there and the grid keeps its shape; it is what fills them that goes. Shown, those days can be picked like any other, and picking one brings its own month into view.",
        preview: withoutOutsideDaysPreview,
        code: withoutOutsideDaysCode,
    },
    {
        name: "The week of the year",
        description:
            "The week each row falls in, written before the days themselves. It is a column of the same table rather than something set beside it, so the numbers keep step with the rows.",
        preview: weekNumbersPreview,
        code: weekNumbersCode,
    },
    {
        name: "The month on show",
        description:
            "Which month is laid out, held by the caller rather than by the calendar, so it can be moved from somewhere other than the two chevrons above the grid. The calendar still asks to be moved when a chevron is pressed or the arrow keys walk off the end of a month — it says so rather than doing it, and here what it says is put straight back.",
        setup: monthSetup,
        preview: <MonthPreview />,
        code: monthCode,
    },
    {
        name: "How the month is written",
        description:
            "The line above the grid, in the tokens Day.js reads. It is written out in full where nothing is said, and shortened here for a calendar standing somewhere narrow. The days have a format of their own, which is what a screen reader is read in their place rather than anything on the page.",
        preview: monthFormatPreview,
        code: monthFormatCode,
    },
];

// Whether one day is picked at a time, or a stretch of them from one end to the other. It stands as
// the values themselves rather than as the name they are collected under, since one of them is what
// a caller actually hands over
const mode = '"single" | "range"';

// How a date is handed over: however the caller already holds one. It is written as the library
// names it rather than as it resolves, since that is the name a caller is held to
const dateInput = "CalendarDateInput";

// A stretch of days as it is given, either end of which may not be there yet, and the same as the
// calendar hands it back
const rangeInput = "CalendarRangeInput";

const range = "CalendarRange";

// Which day the week starts on, counted from Sunday
const weekStart = "0 | 1 | 2 | 3 | 4 | 5 | 6";

// What every part takes to be styled from outside
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the calendar takes. It is drawn as the one thing rather than as a component with parts
// hanging off it, so there is the one table: the day in the grid is the calendar's own doing rather
// than something a caller reaches for, so there is nothing to say about it here.
//
// What is picked comes first, then which month is laid out, then what can be picked at all, then
// what the grid is made to look like, and last the words the calendar says to a reader being read to.
//
// A date is taken however the caller already holds one — as a Date, as text, as the number of
// milliseconds since the epoch, or as a Day.js date — which is what CalendarDateInput stands for
const groups: ComponentPropGroup[] = [
    {
        name: "Calendar",
        props: [
            {
                name: "mode",
                type: mode,
                default: '"single"',
                description:
                    "Whether one day is picked at a time, or a stretch of them from one end to the other. It settles what value carries and what onChange hands back, so the two are read together rather than each on its own",
            },
            {
                name: "value",
                type: `${dateInput} | ${rangeInput} | null`,
                description:
                    "What stands picked, held by the caller. It is a date in the single mode and a stretch of them in the range mode; null is a calendar with nothing picked on it",
            },
            {
                name: "defaultValue",
                type: `${dateInput} | ${rangeInput} | null`,
                description:
                    "What starts out picked, where the calendar keeps hold of it itself. The calendar also opens on the month this day falls in, so a starting day settles where the reader arrives as well as what is picked",
            },
            {
                name: "onChange",
                type: `(date: Date) => void | (range: ${range}) => void`,
                description:
                    "Called with the day that was picked, or with the stretch so far in the range mode — where it is called on both presses, so the first hands back a stretch with only one end to it",
            },
            {
                name: "month",
                type: dateInput,
                description:
                    "The month laid out in the grid, held by the caller. The calendar asks to be moved rather than moving itself, so a chevron press or a walk off the end of a month arrives at onMonthChange",
            },
            {
                name: "defaultMonth",
                type: dateInput,
                description:
                    "The month the calendar opens on, where it keeps hold of the month itself. Left out, it opens on the month the picked day falls in, and on this one where nothing is picked",
            },
            {
                name: "onMonthChange",
                type: "(month: Date) => void",
                description:
                    "Called with the first of whatever month the calendar has moved to, however it was moved there",
            },
            {
                name: "min",
                type: dateInput,
                description:
                    "The earliest day that can be picked. A month with nothing pickable in it is nowhere worth going, so the chevron that leads back past this is stopped",
            },
            {
                name: "max",
                type: dateInput,
                description: "The latest day that can be picked, which stops the other chevron",
            },
            {
                name: "isDateDisabled",
                type: "(date: Date) => boolean",
                description:
                    "Rules out days one by one, for a reason the calendar has no way of knowing. A ruled-out day says so rather than leaving the grid, so a reader can still arrive at it and be told why",
            },
            {
                name: "weekStartsOn",
                type: weekStart,
                description:
                    "Which day the week starts on, counted from Sunday. Taken from whatever locale Day.js is set to where it is left out",
            },
            {
                name: "fixedWeeks",
                type: "boolean",
                default: "false",
                description:
                    "Holds every month to six weeks, so that whatever stands below the calendar does not move as the reader goes from one month to the next",
            },
            {
                name: "showOutsideDays",
                type: "boolean",
                default: "true",
                description:
                    "Shows the days of the months either side that fill out the first and the last week. They can be picked like any other, and picking one brings its own month into view",
            },
            {
                name: "showWeekNumbers",
                type: "boolean",
                default: "false",
                description:
                    "Shows the week of the year each row falls in, before the days themselves",
            },
            {
                name: "monthFormat",
                type: "string",
                default: '"MMMM YYYY"',
                description: "How the month above the grid is written, in the tokens Day.js reads",
            },
            {
                name: "dayFormat",
                type: "string",
                default: '"LL"',
                description:
                    "How a day is named to a screen reader, in the tokens Day.js reads. Only the day of the month is written in the cell, so this is what is read in its place",
            },
            {
                name: "focusableDayRef",
                type: "React.RefObject<HTMLButtonElement | null>",
                description:
                    "Points at the one day the tab key reaches, so that whatever holds the calendar can put focus there as it opens. It is what an overlay's focus trap has to be handed",
            },
            {
                name: "previousMonthLabel",
                type: "string",
                default: '"Previous month"',
                description: "Names the chevron that leads back a month",
            },
            {
                name: "nextMonthLabel",
                type: "string",
                default: '"Next month"',
                description: "Names the chevron that leads on a month",
            },
            {
                name: "weekNumberLabel",
                type: "string",
                default: '"Week"',
                description:
                    "Names the column of week numbers, which carries no heading on the page for a reader being read to to take one from",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the calendar is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Calendar = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Calendar
            </Heading>
            <Text as="p" size="large">
                A month laid out a week to a row, for picking a day out of or a stretch of them from
                one end to the other. Only one day in the grid is ever tabbed to: the arrow keys
                move around it a day and a week at a time, Home and End run to the ends of the week,
                and PageUp and PageDown carry a month at a time — a year, with Shift held. It is
                only as wide as the grid it holds, so it stands on a page or inside an overlay
                without either having to say how much room to give it.
            </Text>
        </Stack>
        <ComponentExamples component="Calendar" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Calendar;
