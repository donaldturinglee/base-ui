import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import type { TimerFormattedTime, TimerTime } from "./Timer.types";

// Day.js keeps everything past the plainest reading and writing of dates behind plugins, so the
// one the timer works with is turned on here rather than left to the app
dayjs.extend(duration);

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;
const MILLISECONDS_IN_SECOND = 1000;

// A length of time split into the units it is read in. Each unit carries only what is left over
// from the one above it, so an hour and a half is an hour and thirty minutes rather than an hour
// and ninety of them, and a clock that shows no hours is not left showing the wrong minutes.
//
// The units are taken off the length as a whole rather than read off the duration a unit at a
// time, since Day.js settles a duration into months and years before it reaches the days: a run
// of a hundred days read that way is three months and change, and a timer counts the days it has
// been going rather than the calendar it has been going across.
//
// A run is never read as a length below nought: a countdown held at the end it was headed for
// stands at nought rather than going past it
export const splitTime = (value: number): TimerTime => {
    const length = dayjs.duration(Math.max(value, 0));

    return {
        days: Math.floor(length.asDays()),
        hours: Math.floor(length.asHours()) % HOURS_IN_DAY,
        minutes: Math.floor(length.asMinutes()) % MINUTES_IN_HOUR,
        seconds: Math.floor(length.asSeconds()) % SECONDS_IN_MINUTE,
        milliseconds: Math.floor(length.asMilliseconds()) % MILLISECONDS_IN_SECOND,
    };
};

// The same time written out. Every unit is padded to the width it is read at, so that the digits
// hold still as the clock moves rather than the row shifting each time a unit drops a figure.
//
// The duration is built back up out of the units rather than out of the length they came from, so
// that what is written is what was read: handed a length, Day.js would settle it into months and
// years again on the way out.
//
// The padding is a floor rather than a width: a run long enough for three figures of days keeps
// all three, since a day is the one unit with nothing above it to carry the overflow
export const formatTime = (time: TimerTime): TimerFormattedTime => {
    const written = dayjs.duration(time);

    return {
        days: written.format("DD"),
        hours: written.format("HH"),
        minutes: written.format("mm"),
        seconds: written.format("ss"),
        milliseconds: written.format("SSS"),
    };
};

// The moment a run is timed against. It comes from here rather than from Day.js itself so that
// everything the timer reads a time by goes through the one place the plugin was turned on
export const now = () => dayjs();
