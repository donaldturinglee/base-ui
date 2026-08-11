import * as React from "react";
import dayjs from "dayjs";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Stack } from "../stack";
import { Text } from "../text";
import { DatePicker } from ".";
import type { CalendarRange } from "../calendar";
import type { TextInputSize } from "../text-input";

const classes = {
    row: "flex flex-wrap items-end gap-[var(--base-size-16)]",
    form: "flex flex-col gap-[var(--base-size-16)] w-[var(--overlay-width-small)]",
};

const today = dayjs();

const sizes: TextInputSize[] = ["small", "medium", "large"];

// How far a stretch of days has been picked, written out so that both ends can be read as they
// are taken
const describeRange = ({ from, to }: CalendarRange) => {
    if (!from) {
        return "No days picked";
    }

    if (!to) {
        return `${from.toDateString()} — pick the day it runs to`;
    }

    return `${from.toDateString()} to ${to.toDateString()}`;
};

export default {
    title: "Components/DatePicker/Features",
    parameters: {
        layout: "centered",
    },
};

// A Field With A Label, which is how a date is asked for on a form
const Field = ({ id, label, children }: React.PropsWithChildren<{ id: string; label: string }>) => (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor={id}>
            {label}
        </Text>
        {children}
    </Stack>
);

// How The Date Is Written, which is also the form it is read back in
export const Formats: StoryFn = () => (
    <div className={classes.row}>
        <Field id="format-iso" label="YYYY-MM-DD">
            <DatePicker id="format-iso" defaultValue={today} />
        </Field>
        <Field id="format-day-first" label="DD/MM/YYYY">
            <DatePicker id="format-day-first" format="DD/MM/YYYY" defaultValue={today} />
        </Field>
        <Field id="format-long" label="LL">
            <DatePicker id="format-long" format="LL" defaultValue={today} />
        </Field>
    </div>
);

// A Stretch Of Days In The One Field, where the calendar stands open until both ends have been
// picked. Either end can be typed as readily as picked, the two written either side of the
// separator
export const PickingARange: StoryFn = () => {
    const [range, setRange] = React.useState<CalendarRange>({ from: null, to: null });

    return (
        <Stack gap="normal" align="start">
            <Field id="stretch" label="Runs from">
                <DatePicker id="stretch" mode="range" value={range} onChange={setRange} />
            </Field>
            <Text>{describeRange(range)}</Text>
        </Stack>
    );
};

// A Stretch The Picker Keeps For Itself, opened on one that was already picked
export const ARangeToStartFrom: StoryFn = () => (
    <Field id="stretch-given" label="Runs from">
        <DatePicker
            id="stretch-given"
            mode="range"
            defaultValue={{ from: today, to: today.add(6, "day") }}
        />
    </Field>
);

// The Earliest And The Latest Day That Can Be Picked, which typing is held to as readily as
// picking. This is the range the days are picked out of rather than a range of days being
// picked
export const WithinARange: StoryFn = () => (
    <Field id="range" label="Within the next fortnight">
        <DatePicker id="range" min={today} max={today.add(14, "day")} />
    </Field>
);

// Days Ruled Out One By One, for a reason the picker has no way of knowing
export const RuledOutDays: StoryFn = () => (
    <Field id="weekdays" label="A weekday">
        <DatePicker
            id="weekdays"
            isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
        />
    </Field>
);

// Sizes, which the field takes from the control scale
export const Sizes: StoryFn = () => (
    <div className={classes.row}>
        {sizes.map((size) => (
            <Field key={size} id={`size-${size}`} label={size}>
                <DatePicker id={`size-${size}`} size={size} />
            </Field>
        ))}
    </div>
);

// Filling Whatever Holds It, rather than standing at a width of its own
export const Block: StoryFn = () => (
    <div className={classes.form}>
        <Field id="block" label="Starts on">
            <DatePicker id="block" block />
        </Field>
    </div>
);

// Saying How The Field Stands, in the same way as any other field
export const Validation: StoryFn = () => (
    <div className={classes.row}>
        <Field id="invalid" label="Invalid">
            <DatePicker id="invalid" validationStatus="error" defaultValue={today} />
        </Field>
        <Field id="valid" label="Valid">
            <DatePicker id="valid" validationStatus="success" defaultValue={today} />
        </Field>
        <Field id="unavailable" label="Unavailable">
            <DatePicker id="unavailable" disabled defaultValue={today} />
        </Field>
    </div>
);

// A Day The Caller Is Holding, so that anything else on the page can move it too
export const Controlled: StoryFn = () => {
    const [value, setValue] = React.useState<Date | null>(null);

    return (
        <Stack gap="normal" align="start">
            <Field id="controlled" label="Starts on">
                <DatePicker id="controlled" value={value} onChange={setValue} />
            </Field>
            <div className={classes.row}>
                <Button onClick={() => setValue(dayjs().toDate())}>Today</Button>
                <Button onClick={() => setValue(dayjs().add(7, "day").toDate())}>Next week</Button>
                <Button onClick={() => setValue(null)}>Clear</Button>
            </div>
            <Text>{value ? value.toDateString() : "No day picked"}</Text>
        </Stack>
    );
};

// Two Fields That Answer To Each Other, which is how a stretch of time is asked for
export const ARangeOfTwoFields: StoryFn = () => {
    const [from, setFrom] = React.useState<Date | null>(today.toDate());
    const [to, setTo] = React.useState<Date | null>(today.add(7, "day").toDate());

    return (
        <div className={classes.row}>
            <Field id="from" label="From">
                <DatePicker id="from" value={from} onChange={setFrom} max={to ?? undefined} />
            </Field>
            <Field id="to" label="To">
                <DatePicker id="to" value={to} onChange={setTo} min={from ?? undefined} />
            </Field>
        </div>
    );
};

// The Week Of The Year, written before each row of the calendar
export const WithWeekNumbers: StoryFn = () => (
    <Field id="week-numbers" label="Starts on">
        <DatePicker id="week-numbers" showWeekNumbers weekStartsOn={1} />
    </Field>
);
