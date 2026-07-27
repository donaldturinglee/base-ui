import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Link } from "../link";
import { Stack } from "../stack";
import { RelativeTime } from ".";

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

const distant = new Date("2020-01-01T00:00:00Z");

export default {
    title: "Components/RelativeTime/Features",
    parameters: {
        layout: "centered",
    },
};

// Recent Time, which reads relative to now and keeps itself up to date
export const RecentTime: StoryFn<typeof RelativeTime> = () => (
    <Stack gap="condensed">
        <RelativeTime date={new Date(Date.now() - 30 * 1000)} noTitle />
        <RelativeTime date={new Date(Date.now() - 5 * MINUTE)} noTitle />
        <RelativeTime date={new Date(Date.now() - 3 * DAY)} noTitle />
        <RelativeTime date={new Date(Date.now() + 2 * DAY)} noTitle />
    </Stack>
);

// Micro Format, where the same times are cut down to fit beside other content
export const MicroFormat: StoryFn<typeof RelativeTime> = () => (
    <Stack gap="condensed">
        <RelativeTime format="micro" date={new Date(Date.now() - 30 * 1000)} noTitle />
        <RelativeTime format="micro" date={new Date(Date.now() - 5 * MINUTE)} noTitle />
        <RelativeTime format="micro" date={new Date(Date.now() - 3 * DAY)} noTitle />
    </Stack>
);

// Count Down Timer, where an elapsed time counts the units down one by one
export const CountDownTimer: StoryFn<typeof RelativeTime> = () => (
    <RelativeTime format="elapsed" date={new Date("2038-01-19T03:14:08Z")} noTitle />
);

// Precision, which is how far an elapsed time is broken down
export const Precision: StoryFn<typeof RelativeTime> = () => (
    <Stack gap="condensed">
        <RelativeTime format="elapsed" precision="day" date={distant} noTitle />
        <RelativeTime format="elapsed" precision="hour" date={distant} noTitle />
        <RelativeTime format="elapsed" precision="minute" date={distant} noTitle />
    </Stack>
);

// Threshold, which is how far from now a time still reads relative to it
export const Threshold: StoryFn<typeof RelativeTime> = () => (
    <Stack gap="condensed">
        <RelativeTime date={new Date(Date.now() - 3 * DAY)} threshold="P30D" noTitle />
        <RelativeTime date={new Date(Date.now() - 3 * DAY)} threshold="P1D" noTitle />
    </Stack>
);

// Long Date, where a time too far from now to read relative to it is written out in full
export const LongDate: StoryFn<typeof RelativeTime> = () => (
    <RelativeTime
        date={distant}
        weekday="long"
        day="2-digit"
        month="short"
        year="numeric"
        hour="numeric"
        minute="2-digit"
        timeZoneName="short"
        prefix=""
        noTitle
    />
);

// A Datetime String, which is taken in place of a date
export const DatetimeString: StoryFn<typeof RelativeTime> = () => (
    <RelativeTime datetime="2020-01-01T00:00:00Z" noTitle />
);

// Children, which stand in for the reading the component would work out
export const Children: StoryFn<typeof RelativeTime> = () => (
    <RelativeTime date={distant} noTitle>
        the first day of 2020
    </RelativeTime>
);

// In A Link, where the time carries the title that says which date it stands for
export const InALink: StoryFn<typeof RelativeTime> = () => (
    <Link href="#commit">
        Committed <RelativeTime date={new Date(Date.now() - 2 * DAY)} />
    </Link>
);

// Switching Between Readings, where the same time is asked for in more and less detail
export const SwitchingBetweenReadings: StoryFn<typeof RelativeTime> = () => {
    const [exact, setExact] = React.useState(false);

    return (
        <Stack gap="condensed" align="start">
            <Button onClick={() => setExact(!exact)} aria-describedby="relative-time">
                Show {exact ? "short" : "exact"} date
            </Button>
            <RelativeTime
                id="relative-time"
                date={distant}
                hour={exact ? "numeric" : undefined}
                minute={exact ? "2-digit" : undefined}
                day={exact ? "2-digit" : undefined}
                year={exact ? "numeric" : undefined}
                timeZoneName={exact ? "short" : undefined}
                prefix=""
                noTitle
            />
        </Stack>
    );
};
