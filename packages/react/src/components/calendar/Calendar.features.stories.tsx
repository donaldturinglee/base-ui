import * as React from "react";
import dayjs from "dayjs";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Stack } from "../stack";
import { Text } from "../text";
import { Calendar } from ".";
import type { CalendarRange } from "./Calendar.types";

const classes = {
    row: "flex flex-wrap items-start gap-[var(--base-size-24)]",
};

const today = dayjs();

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
    title: "Components/Calendar/Features",
    parameters: {
        layout: "centered",
    },
};

// The Day That Was Picked, which the calendar keeps for itself where the caller does not
export const Uncontrolled: StoryFn = () => <Calendar defaultValue={today} />;

// A Day The Caller Is Holding, so that anything else on the page can move it too
export const Controlled: StoryFn = () => {
    const [value, setValue] = React.useState<Date | null>(today.toDate());

    return (
        <Stack gap="condensed" align="start">
            <Calendar value={value} onChange={setValue} />
            <div className={classes.row}>
                <Button onClick={() => setValue(dayjs().toDate())}>Today</Button>
                <Button onClick={() => setValue(null)}>Clear</Button>
            </div>
            <Text>{value ? value.toDateString() : "No day picked"}</Text>
        </Stack>
    );
};

// Which Day The Week Starts On, taken from the locale where it is left out
export const WeekStart: StoryFn = () => (
    <div className={classes.row}>
        <Stack gap="condensed" align="start">
            <Text>Sunday</Text>
            <Calendar weekStartsOn={0} />
        </Stack>
        <Stack gap="condensed" align="start">
            <Text>Monday</Text>
            <Calendar weekStartsOn={1} />
        </Stack>
    </div>
);

// A Stretch Of Days, where the first day pressed opens it and the second closes it. Pressing a
// third starts a new one, and pressing the day it was opened on lets go of it again
export const PickingARange: StoryFn = () => {
    const [range, setRange] = React.useState<CalendarRange>({ from: null, to: null });

    return (
        <Stack gap="condensed" align="start">
            <Calendar mode="range" value={range} onChange={setRange} />
            <Text>{describeRange(range)}</Text>
        </Stack>
    );
};

// A Stretch The Calendar Keeps For Itself, opened on one that was already picked
export const ARangeToStartFrom: StoryFn = () => (
    <Calendar mode="range" defaultValue={{ from: today, to: today.add(6, "day") }} fixedWeeks />
);

// The Earliest And The Latest Day That Can Be Picked, past which there is nowhere left to go.
// This is the range the days are picked out of rather than a range of days being picked
export const WithinARange: StoryFn = () => (
    <Calendar min={today.subtract(3, "day")} max={today.add(10, "day")} />
);

// Days Ruled Out One By One, for a reason the calendar has no way of knowing
export const RuledOutDays: StoryFn = () => (
    <Stack gap="condensed" align="start">
        <Text>Weekends cannot be picked</Text>
        <Calendar isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6} />
    </Stack>
);

// A Steady Height, so that nothing below the calendar moves as the reader goes from one month
// to the next
export const FixedWeeks: StoryFn = () => <Calendar fixedWeeks />;

// Only The Month Itself, with the weeks at both ends left part empty
export const WithoutOutsideDays: StoryFn = () => <Calendar showOutsideDays={false} />;

// The Week Of The Year, written before each row
export const WithWeekNumbers: StoryFn = () => <Calendar showWeekNumbers />;

// The Month On Show, held by the caller so that the calendar can be moved from elsewhere
export const AMonthTheCallerHolds: StoryFn = () => {
    const [month, setMonth] = React.useState(today.startOf("month").toDate());

    return (
        <Stack gap="condensed" align="start">
            <div className={classes.row}>
                <Button onClick={() => setMonth(dayjs(month).subtract(1, "year").toDate())}>
                    A year back
                </Button>
                <Button onClick={() => setMonth(dayjs(month).add(1, "year").toDate())}>
                    A year on
                </Button>
            </div>
            <Calendar month={month} onMonthChange={setMonth} />
        </Stack>
    );
};

// How The Month Is Written, in Day.js tokens
export const MonthFormat: StoryFn = () => <Calendar monthFormat="MMM YYYY" />;
