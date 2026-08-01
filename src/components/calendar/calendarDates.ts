import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";
import weekOfYear from "dayjs/plugin/weekOfYear";
import type { Dayjs } from "dayjs";
import type {
    CalendarDateInput,
    CalendarDateMatcher,
    CalendarRangeInput,
    CalendarRangePosition,
    CalendarSelection,
    CalendarWeekday,
    CalendarWeekStart,
} from "./Calendar.types";

// Day.js keeps everything past the plainest reading and writing of dates behind plugins, so
// the ones the calendar works with are turned on here rather than left to the app
dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(weekOfYear);

export const DAYS_IN_WEEK = 7;

// The rows every month is laid out in where they are all given the same number, so that
// nothing below the calendar moves as the reader goes from one month to the next
export const WEEKS_IN_FIXED_MONTH = 6;

// The one way a day is written down, so that one day can be told from another and the same
// day found again in the grid
export const DAY_KEY_FORMAT = "YYYY-MM-DD";

// Reads whatever the caller already holds a date as
export const toDate = (value: CalendarDateInput) => dayjs(value);

// The same, for a date that may not be there at all or may not read as one
export const toOptionalDate = (value: CalendarDateInput | null | undefined) => {
    if (value === null || value === undefined) {
        return null;
    }

    const date = toDate(value);

    return date.isValid() ? date : null;
};

export const toDayKey = (date: Dayjs) => date.format(DAY_KEY_FORMAT);

export const NOTHING_PICKED: CalendarSelection = { from: null, to: null };

// Whichever shape the caller holds what has been picked in, it is read as a stretch of days
// here, so that both modes have only the one shape to work with
export const toSelection = (
    input: CalendarDateInput | CalendarRangeInput | null | undefined,
    isRange: boolean,
): CalendarSelection => {
    if (input === null || input === undefined) {
        return NOTHING_PICKED;
    }

    if (isRange) {
        const range = input as CalendarRangeInput;

        return { from: toOptionalDate(range.from), to: toOptionalDate(range.to) };
    }

    const date = toOptionalDate(input as CalendarDateInput);

    return { from: date, to: date };
};

// Which day the week starts on where the caller has not said, which is settled by whatever
// locale Day.js itself is set to
export const getFirstDayOfWeek = () =>
    (dayjs().localeData().firstDayOfWeek() ?? 0) as CalendarWeekStart;

// What every column of the grid is called, starting on whichever day the week starts on
export const getWeekdays = (weekStartsOn: CalendarWeekStart): CalendarWeekday[] => {
    const names = dayjs().localeData();
    const narrow = names.weekdaysMin();
    const full = names.weekdays();

    return Array.from({ length: DAYS_IN_WEEK }, (_, index) => {
        const day = (weekStartsOn + index) % DAYS_IN_WEEK;

        return { day, narrow: narrow[day], full: full[day] };
    });
};

// The day the week a date falls in starts on
export const startOfWeek = (date: Dayjs, weekStartsOn: CalendarWeekStart) =>
    date.subtract((date.day() - weekStartsOn + DAYS_IN_WEEK) % DAYS_IN_WEEK, "day");

// Every day the month's grid holds, a row to a week: the days of the month itself, and enough
// of the months either side of it to fill out the weeks at both ends
export const getMonthWeeks = (
    month: Dayjs,
    weekStartsOn: CalendarWeekStart,
    fixedWeeks = false,
) => {
    const first = month.startOf("month");
    const start = startOfWeek(first, weekStartsOn);

    const lead = (first.day() - weekStartsOn + DAYS_IN_WEEK) % DAYS_IN_WEEK;
    const trail = (weekStartsOn + DAYS_IN_WEEK - 1 - month.endOf("month").day()) % DAYS_IN_WEEK;

    // Counted in days rather than measured between two dates, since the clocks going forward
    // or back leaves a month with a day in it that is not a whole day long
    const spanned = lead + month.daysInMonth() + trail;
    const weeks = fixedWeeks ? WEEKS_IN_FIXED_MONTH : spanned / DAYS_IN_WEEK;

    return Array.from({ length: weeks }, (_, week) =>
        Array.from({ length: DAYS_IN_WEEK }, (_, day) =>
            start.add(week * DAYS_IN_WEEK + day, "day"),
        ),
    );
};

// Whether a day is one the reader can pick: within the range the calendar was given, and not
// one the caller has ruled out for a reason the calendar has no way of knowing
export const isDateSelectable = (
    date: Dayjs,
    min: Dayjs | null,
    max: Dayjs | null,
    isDateDisabled?: CalendarDateMatcher,
) =>
    (min === null || !date.isBefore(min, "day")) &&
    (max === null || !date.isAfter(max, "day")) &&
    !isDateDisabled?.(date.toDate());

// The two ends of a range the right way round, whichever way round they were picked
const orderRange = (from: Dayjs, to: Dayjs) =>
    from.isAfter(to, "day") ? ([to, from] as const) : ([from, to] as const);

// Whether a day is one of those that have been picked: the day itself where only one end of
// the range is there, and everything from one end to the other where both are
export const isDateWithinRange = (date: Dayjs, from: Dayjs | null, to: Dayjs | null) => {
    if (from === null) {
        return to !== null && date.isSame(to, "day");
    }

    if (to === null) {
        return date.isSame(from, "day");
    }

    const [start, end] = orderRange(from, to);

    return !date.isBefore(start, "day") && !date.isAfter(end, "day");
};

// Where a day falls in a range. A range with only one end to it, or with both ends on the same
// day, is a single day rather than a stretch, so nothing is drawn between them
export const getRangePosition = (
    date: Dayjs,
    from: Dayjs | null,
    to: Dayjs | null,
): CalendarRangePosition | undefined => {
    if (from === null || to === null || from.isSame(to, "day")) {
        return undefined;
    }

    const [start, end] = orderRange(from, to);

    if (date.isSame(start, "day")) {
        return "start";
    }

    if (date.isSame(end, "day")) {
        return "end";
    }

    return date.isAfter(start, "day") && date.isBefore(end, "day") ? "middle" : undefined;
};

// Adds a day to the range being picked. The first day starts the stretch and the second closes
// it, whichever way round the two were pressed; a day added to a stretch that is already closed
// starts a new one. Pressing the day a stretch was started on lets go of it again, so that one
// begun by mistake can be taken back
export const extendRange = (
    from: Dayjs | null,
    to: Dayjs | null,
    date: Dayjs,
): CalendarSelection => {
    if (from === null || to !== null) {
        return { from: date, to: null };
    }

    if (date.isSame(from, "day")) {
        return NOTHING_PICKED;
    }

    const [start, end] = orderRange(from, date);

    return { from: start, to: end };
};

// Reads what was typed against the format it was asked for, and only takes it where the whole
// of it reads as a date
export const parseDate = (text: string, format: string) => {
    const parsed = dayjs(text, format, true);

    return parsed.isValid() ? parsed : null;
};

// The day the calendar is being read on. It comes from here rather than from Day.js itself so
// that everything reading a date goes through the one place the plugins were turned on
export const getToday = () => dayjs();
