import * as React from "react";
import {
    Button,
    DatePicker as DatePickerComponent,
    Heading,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import type { CalendarRange, TextInputSize } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // Fields read across rather than down where several of them are being read against one
    // another, and are lined up on their feet so the labels above them do not push them out of
    // step with each other
    row: "flex flex-wrap items-end gap-[var(--base-size-16)]",
    // A column for the field that fills whatever holds it, since it has to be given something to
    // fill before there is anything to see
    form: "w-[var(--overlay-width-small)]",
};

// The days the examples are drawn around. They are worked out from today rather than written down,
// so that a page read in a year's time still shows the days around whenever it is being read
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

const sizes: TextInputSize[] = ["small", "medium", "large"];

// How far a stretch of days has been picked, written out so that both ends can be read as they are
// taken. The first press hands back a stretch with only one end to it, which is worth saying rather
// than leaving the reader wondering whether anything happened
const describeRange = ({ from, to }: CalendarRange) => {
    if (!from) {
        return "No days picked";
    }

    if (!to) {
        return `${from.toDateString()} — now pick the day it runs to`;
    }

    return `${from.toDateString()} to ${to.toDateString()}`;
};

const describeRangeSetup = `const describeRange = ({ from, to }) => {
    if (!from) {
        return "No days picked";
    }

    if (!to) {
        return \`\${from.toDateString()} — now pick the day it runs to\`;
    }

    return \`\${from.toDateString()} to \${to.toDateString()}\`;
};`;

// A field asked for on a form: the label above it, pointed at the field by name. The picker draws
// the field and the button that brings the calendar out, but not the label, since what the date is
// for is the form's to say
const Field = ({ id, label, children }: React.PropsWithChildren<{ id: string; label: string }>) => (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor={id}>
            {label}
        </Text>
        {children}
    </Stack>
);

// The plainest picker there is: a field to type a date into, and a button that brings out a
// calendar to pick one from instead. Either way of giving the date answers the other, so what is
// typed is what the calendar opens on and what is picked is what the field is left holding.
//
// The label is the form's own rather than the picker's, so it is written out with the example: the
// picker draws the field and the button, and what the date is for is said above them.
//
// The page and the component it is about are both called DatePicker, so the component is brought in
// under a name saying which of the two it is. The listing beneath says DatePicker, as an
// application importing it would
const defaultPreview = (
    <Field id="starts-on" label="Starts on">
        <DatePickerComponent id="starts-on" />
    </Field>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="starts-on">
        Starts on
    </Text>
    <DatePicker id="starts-on" />
</Stack>`;

// How a date is written into the field, which is also the form it is read back out in. Typing is
// only taken where the whole of what was typed reads as a date in that form, so a field expecting
// one form does not quietly accept another
const formatsPreview = (
    <div className={classes.row}>
        <Field id="format-iso" label="YYYY-MM-DD">
            <DatePickerComponent id="format-iso" defaultValue={daysFromToday(0)} />
        </Field>
        <Field id="format-day-first" label="DD/MM/YYYY">
            <DatePickerComponent
                id="format-day-first"
                format="DD/MM/YYYY"
                defaultValue={daysFromToday(0)}
            />
        </Field>
        <Field id="format-long" label="LL">
            <DatePickerComponent id="format-long" format="LL" defaultValue={daysFromToday(0)} />
        </Field>
    </div>
);

const rowSetup = `const row = "flex flex-wrap items-end gap-[var(--base-size-16)]";`;

const formatsSetup = `${daysFromTodaySetup}

${rowSetup}`;

const formatsCode = `<div className={row}>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="format-iso">YYYY-MM-DD</Text>
        <DatePicker id="format-iso" defaultValue={daysFromToday(0)} />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="format-day-first">DD/MM/YYYY</Text>
        <DatePicker id="format-day-first" format="DD/MM/YYYY" defaultValue={daysFromToday(0)} />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="format-long">LL</Text>
        <DatePicker id="format-long" format="LL" defaultValue={daysFromToday(0)} />
    </Stack>
</div>`;

// A stretch of days taken in the one field. The calendar stands open until both ends have been
// picked, and the field holds the two either side of the separator. Pressing the day a stretch was
// started on lets go of it again
const RangePreview = () => {
    const [range, setRange] = React.useState<CalendarRange>({ from: null, to: null });

    return (
        <Stack gap="normal" align="start">
            <Field id="runs-from" label="Runs from">
                <DatePickerComponent
                    id="runs-from"
                    mode="range"
                    value={range}
                    onChange={setRange}
                />
            </Field>
            <Text>{describeRange(range)}</Text>
        </Stack>
    );
};

const rangeSetup = `${describeRangeSetup}

const [range, setRange] = React.useState({ from: null, to: null });`;

const rangeCode = `<Stack gap="normal" align="start">
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="runs-from">Runs from</Text>
        <DatePicker id="runs-from" mode="range" value={range} onChange={setRange} />
    </Stack>
    <Text>{describeRange(range)}</Text>
</Stack>`;

// The earliest and the latest day that can be picked. Typing is held to it as readily as picking,
// so a date outside the stretch cannot be got in by the back door. This is the stretch the days are
// picked out of rather than a stretch of days being picked
const withinPreview = (
    <Field id="within" label="Within the next fortnight">
        <DatePickerComponent id="within" min={daysFromToday(0)} max={daysFromToday(14)} />
    </Field>
);

const withinCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="within">
        Within the next fortnight
    </Text>
    <DatePicker id="within" min={daysFromToday(0)} max={daysFromToday(14)} />
</Stack>`;

// Days ruled out one by one, for a reason the picker has no way of knowing. It is handed each day
// and says whether that one can be picked, which is what a weekend, a holiday or a day already
// taken comes to
const ruledOutPreview = (
    <Field id="weekday" label="A weekday">
        <DatePickerComponent
            id="weekday"
            isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
        />
    </Field>
);

const ruledOutCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="weekday">
        A weekday
    </Text>
    <DatePicker
        id="weekday"
        isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
    />
</Stack>`;

// How much room the field takes. The three steps are the control scale's own, so a picker and any
// other field given the same size stand the same height beside one another; below them, the field
// that fills whatever it was put in rather than standing at a width of its own
const roomPreview = (
    <Stack gap="normal" align="start">
        <div className={classes.row}>
            {sizes.map((size) => (
                <Field key={size} id={`size-${size}`} label={size}>
                    <DatePickerComponent id={`size-${size}`} size={size} />
                </Field>
            ))}
        </div>
        <div className={classes.form}>
            <Field id="block" label="Filling whatever holds it">
                <DatePickerComponent id="block" block />
            </Field>
        </div>
    </Stack>
);

const roomSetup = `${rowSetup}
const form = "w-[var(--overlay-width-small)]";

const sizes = ["small", "medium", "large"];`;

const roomCode = `<Stack gap="normal" align="start">
    <div className={row}>
        {sizes.map((size) => (
            <Stack key={size} gap="condensed" align="start">
                <Text as="label" htmlFor={\`size-\${size}\`}>{size}</Text>
                <DatePicker id={\`size-\${size}\`} size={size} />
            </Stack>
        ))}
    </div>
    <div className={form}>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="block">Filling whatever holds it</Text>
            <DatePicker id="block" block />
        </Stack>
    </div>
</Stack>`;

// How the field stands, said the same way any other field says it. An error colours the border and
// marks the control invalid to a screen reader; a field that cannot be used stops both the typing
// and the button
const statesPreview = (
    <div className={classes.row}>
        <Field id="invalid" label="Invalid">
            <DatePickerComponent
                id="invalid"
                validationStatus="error"
                defaultValue={daysFromToday(0)}
            />
        </Field>
        <Field id="valid" label="Valid">
            <DatePickerComponent
                id="valid"
                validationStatus="success"
                defaultValue={daysFromToday(0)}
            />
        </Field>
        <Field id="unavailable" label="Unavailable">
            <DatePickerComponent id="unavailable" disabled defaultValue={daysFromToday(0)} />
        </Field>
    </div>
);

const statesCode = `<div className={row}>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="invalid">Invalid</Text>
        <DatePicker id="invalid" validationStatus="error" defaultValue={daysFromToday(0)} />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="valid">Valid</Text>
        <DatePicker id="valid" validationStatus="success" defaultValue={daysFromToday(0)} />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="unavailable">Unavailable</Text>
        <DatePicker id="unavailable" disabled defaultValue={daysFromToday(0)} />
    </Stack>
</div>`;

// The day held by whoever is drawing the picker rather than by the picker. What the caller does
// with it is the reason for holding it at all, so it is put to use beside the field: the buttons
// move the day from outside, and the field follows
const ControlledPreview = () => {
    const [value, setValue] = React.useState<Date | null>(null);

    return (
        <Stack gap="normal" align="start">
            <Field id="controlled" label="Starts on">
                <DatePickerComponent id="controlled" value={value} onChange={setValue} />
            </Field>
            <Stack direction="horizontal" gap="condensed" wrap="wrap">
                <Button onClick={() => setValue(daysFromToday(0))}>Today</Button>
                <Button onClick={() => setValue(daysFromToday(7))}>Next week</Button>
                <Button onClick={() => setValue(null)}>Clear</Button>
            </Stack>
            <Text>{value ? value.toDateString() : "No day picked"}</Text>
        </Stack>
    );
};

const controlledSetup = `${daysFromTodaySetup}

const [value, setValue] = React.useState(null);`;

const controlledCode = `<Stack gap="normal" align="start">
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="controlled">Starts on</Text>
        <DatePicker id="controlled" value={value} onChange={setValue} />
    </Stack>
    <Stack direction="horizontal" gap="condensed" wrap="wrap">
        <Button onClick={() => setValue(daysFromToday(0))}>Today</Button>
        <Button onClick={() => setValue(daysFromToday(7))}>Next week</Button>
        <Button onClick={() => setValue(null)}>Clear</Button>
    </Stack>
    <Text>{value ? value.toDateString() : "No day picked"}</Text>
</Stack>`;

// Two fields that answer to each other, which is the other way a stretch of time is asked for. Each
// holds one end and bounds the other, so the one that runs to a day can never be set before the one
// it runs from
const TwoFieldsPreview = () => {
    const [from, setFrom] = React.useState<Date | null>(daysFromToday(0));
    const [to, setTo] = React.useState<Date | null>(daysFromToday(7));

    return (
        <div className={classes.row}>
            <Field id="from" label="From">
                <DatePickerComponent
                    id="from"
                    value={from}
                    onChange={setFrom}
                    max={to ?? undefined}
                />
            </Field>
            <Field id="to" label="To">
                <DatePickerComponent id="to" value={to} onChange={setTo} min={from ?? undefined} />
            </Field>
        </div>
    );
};

const twoFieldsSetup = `${daysFromTodaySetup}

${rowSetup}

const [from, setFrom] = React.useState(daysFromToday(0));
const [to, setTo] = React.useState(daysFromToday(7));`;

const twoFieldsCode = `<div className={row}>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="from">From</Text>
        <DatePicker id="from" value={from} onChange={setFrom} max={to ?? undefined} />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="to">To</Text>
        <DatePicker id="to" value={to} onChange={setTo} min={from ?? undefined} />
    </Stack>
</div>`;

// The week of the year written before each row of the calendar, for the places a week is named by
// its number rather than by the days in it. The week is started on a Monday to go with it, since a
// week number counted from a Sunday would not line up with what those places mean by it
const weekNumbersPreview = (
    <Field id="week-numbers" label="Starts on">
        <DatePickerComponent id="week-numbers" showWeekNumbers weekStartsOn={1} />
    </Field>
);

const weekNumbersCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="week-numbers">
        Starts on
    </Text>
    <DatePicker id="week-numbers" showWeekNumbers weekStartsOn={1} />
</Stack>`;

// The picker as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "How the date is written",
        description:
            "The form a date is written into the field in, which is also the form it is read back out in, given in Day.js tokens. Typing is only taken where the whole of what was typed reads as a date in that form, so a field expecting one form does not quietly accept another.",
        setup: formatsSetup,
        preview: formatsPreview,
        code: formatsCode,
    },
    {
        name: "A stretch of days",
        description:
            "Both ends taken in the one field. The calendar stands open until both have been picked and the field holds them either side of the separator, which has to be something the format itself never holds so the two can be told apart again. Pressing the day a stretch was started on lets go of it, and the first press hands back a stretch with only one end to it.",
        setup: rangeSetup,
        preview: <RangePreview />,
        code: rangeCode,
    },
    {
        name: "The earliest and the latest day",
        description:
            "The stretch the days are picked out of, rather than a stretch of days being picked. Typing is held to it as readily as picking, so a date outside it cannot be got in by the back door.",
        setup: daysFromTodaySetup,
        preview: withinPreview,
        code: withinCode,
    },
    {
        name: "Days ruled out one by one",
        description:
            "For a reason the picker has no way of knowing. It is handed each day and says whether that one can be picked, which is what a weekend, a holiday or a day already taken comes to.",
        preview: ruledOutPreview,
        code: ruledOutCode,
    },
    {
        name: "How much room the field takes",
        description:
            "The three steps are the control scale's own, so a picker and any other field given the same size stand the same height beside one another. A field told to fill whatever holds it takes the width of its container rather than standing at one of its own, which is what a field in a column of them wants.",
        setup: roomSetup,
        preview: roomPreview,
        code: roomCode,
    },
    {
        name: "How the field stands",
        description:
            "Said the same way any other field says it. An error colours the border and marks the control invalid to a screen reader; a field that cannot be used stops both the typing and the button that brings the calendar out.",
        setup: `${daysFromTodaySetup}\n\n${rowSetup}`,
        preview: statesPreview,
        code: statesCode,
    },
    {
        name: "A day the caller is holding",
        description:
            "The day held by whoever is drawing the picker rather than by the picker, so that anything else on the page can move it too. A picker keeping its own day still reports through onChange, so a caller who only wants to hear about it need not take it over.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
    {
        name: "Two fields that answer to each other",
        description:
            "The other way a stretch of time is asked for. Each field holds one end and bounds the other, so the day a thing runs to can never be set before the day it runs from. It is worth reaching for over one field in range mode where the two ends are asked for far apart on a form.",
        setup: twoFieldsSetup,
        preview: <TwoFieldsPreview />,
        code: twoFieldsCode,
    },
    {
        name: "The week of the year",
        description:
            "Written before each row of the calendar, for the places a week is named by its number rather than by the days in it. The week is started on a Monday to go with it, since a number counted from a Sunday would not line up with what those places mean by it.",
        preview: weekNumbersPreview,
        code: weekNumbersCode,
    },
];

// Every prop the picker takes. It is drawn as the one field rather than as a component with parts
// hanging off it, so there is the one table.
//
// What is picked comes first, since the mode settles what everything else means; how it is written
// follows, then what can be picked at all, then the calendar itself, and last the field it is
// typed into
const groups: ComponentPropGroup[] = [
    {
        name: "DatePicker",
        props: [
            {
                name: "mode",
                type: '"single" | "range"',
                default: '"single"',
                options: ["single", "range"],
                description:
                    "Whether one day is taken at a time or a stretch of them. It settles what value carries and what onChange hands back, so the two follow from it rather than being given separately",
            },
            {
                name: "value",
                type: "CalendarDateInput | CalendarRangeInput | null",
                description:
                    "What has been picked, where the state is held by whoever is drawing the picker. A day is taken however the caller already holds one: a Date, a string, milliseconds since the epoch, or a Day.js date. Null is a field with nothing in it",
            },
            {
                name: "defaultValue",
                type: "CalendarDateInput | CalendarRangeInput | null",
                description: "What is picked to start with, for a picker keeping its own state",
            },
            {
                name: "onChange",
                type: "(date: Date | null) => void | ((range: CalendarRange) => void)",
                description:
                    "Called with what was picked, or with nothing where the field was emptied. In range mode it is called on both presses, so the first hands back a stretch with only one end to it",
            },
            {
                name: "format",
                type: "string",
                default: '"YYYY-MM-DD"',
                description:
                    "How a date is both written into the field and read back out of it, in Day.js tokens. Typing is only taken where the whole of what was typed reads as a date in this form",
            },
            {
                name: "rangeSeparator",
                type: "string",
                default: '" - "',
                description:
                    "What stands between the two ends of a stretch of days in the field. It has to be something the format itself never holds, so that the two can be told apart again",
            },
            {
                name: "min",
                type: "CalendarDateInput",
                description:
                    "The earliest day that can be picked. Typing is held to it as readily as picking",
            },
            {
                name: "max",
                type: "CalendarDateInput",
                description: "The latest day that can be picked",
            },
            {
                name: "isDateDisabled",
                type: "(date: Date) => boolean",
                description:
                    "Rules out days one by one, for a reason the picker has no way of knowing. It is handed each day and says whether that one can be picked",
            },
            {
                name: "open",
                type: "boolean",
                description:
                    "Whether the calendar is showing, where the caller holds the state. A picker that is not given this keeps its own",
            },
            {
                name: "defaultOpen",
                type: "boolean",
                default: "false",
                description: "Whether the calendar is showing to start with",
            },
            {
                name: "onOpenChange",
                type: "(open: boolean, gesture?: DatePickerCloseGesture) => void",
                description:
                    "Called whenever the calendar opens or closes, with what closed it: a day being picked, the button, a press landing outside, or Escape",
            },
            {
                name: "weekStartsOn",
                type: "0 | 1 | 2 | 3 | 4 | 5 | 6",
                description: "Which day the week starts on, counted from Sunday",
            },
            {
                name: "fixedWeeks",
                type: "boolean",
                default: "true",
                description:
                    "Holds every month to six weeks, so the calendar keeps its height as the reader goes from one month to the next rather than shifting what stands below it",
            },
            {
                name: "showWeekNumbers",
                type: "boolean",
                default: "false",
                description: "Shows the week of the year each row of the calendar falls in",
            },
            {
                name: "monthFormat",
                type: "string",
                description: "How the month is written above the calendar, in Day.js tokens",
            },
            {
                name: "calendarButtonLabel",
                type: "string",
                default: '"Choose a date"',
                description:
                    "Names the button that brings the calendar out, which carries an icon rather than words",
            },
            {
                name: "calendarLabel",
                type: "string",
                default: '"Choose a date"',
                description: "Names the calendar itself, which stands as a dialog off the field",
            },
            {
                name: "size",
                type: '"small" | "medium" | "large"',
                default: '"medium"',
                options: ["small", "medium", "large"],
                description: "Which step of the control scale the field stands at",
            },
            {
                name: "block",
                type: "boolean",
                default: "false",
                description:
                    "Fills the width of whatever holds it, rather than standing at a width of its own",
            },
            {
                name: "validationStatus",
                type: '"error" | "success"',
                options: ["error", "success"],
                description:
                    "Colours the border, and marks the control invalid to a screen reader for an error",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description: "Stops both the field and the button being used",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description: "Requires the field before the form can be submitted",
            },
            {
                name: "inputClassName",
                type: "string",
                description:
                    "Class name for the field itself, where className goes on the picker around it",
            },
            {
                name: "className",
                type: "string",
                description: "Class name for custom styling",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the picker is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const DatePicker = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                DatePicker
            </Heading>
            <Text as="p" size="large">
                A field to type a date into, and a calendar to pick one from instead. Either way of
                giving the date answers the other: what is typed is what the calendar opens on, and
                what is picked is what the field is left holding. The form the date is written in is
                the form it is read back in, and typing is only taken where the whole of what was
                typed reads as a date in that form. A calendar standing on the page rather than
                brought out from a field is the Calendar component instead.
            </Text>
        </Stack>
        <ComponentExamples component="DatePicker" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default DatePicker;
