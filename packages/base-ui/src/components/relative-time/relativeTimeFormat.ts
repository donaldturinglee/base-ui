import type {
    FormattedRelativeTime,
    RelativeTimeDateOptions,
    RelativeTimePrecision,
    RelativeTimeSettings,
    RelativeTimeUnit,
} from "./RelativeTime.types";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
// A month is taken as thirty days and a year as twelve of those, so that a duration can be
// worked out from a span of time alone rather than from where in the calendar it falls
const MONTH = 30 * DAY;
const YEAR = 12 * MONTH;

// A month either side of now, matching the reference
export const DEFAULT_RELATIVE_TIME_THRESHOLD = "P30D";
export const DEFAULT_RELATIVE_TIME_PREFIX = "on";

// The same month, as the milliseconds a threshold that cannot be read falls back to
const DEFAULT_THRESHOLD = 30 * DAY;

// Largest first, so the first unit a span reaches is the one it is rounded to
const units: { unit: RelativeTimeUnit; length: number }[] = [
    { unit: "year", length: YEAR },
    { unit: "month", length: MONTH },
    { unit: "week", length: WEEK },
    { unit: "day", length: DAY },
    { unit: "hour", length: HOUR },
    { unit: "minute", length: MINUTE },
    { unit: "second", length: SECOND },
];

// Smallest first, so that a precision cuts the tail off the list
const elapsedUnits: RelativeTimePrecision[] = ["year", "month", "day", "hour", "minute", "second"];

const suffixes: Record<RelativeTimeUnit, string> = {
    year: "y",
    month: "mo",
    week: "w",
    day: "d",
    hour: "h",
    minute: "m",
    second: "s",
};

// The date and the time halves of an ISO8601 duration, kept apart only so that neither runs
// past the end of a line
const DURATION_DATE_PATTERN = "(?:(\\d+)Y)?(?:(\\d+)M)?(?:(\\d+)W)?(?:(\\d+)D)?";
const DURATION_TIME_PATTERN = "(?:T(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+(?:\\.\\d+)?)S)?)?";
const DURATION_PATTERN = new RegExp(`^P${DURATION_DATE_PATTERN}${DURATION_TIME_PATTERN}$`);

// Turns an ISO8601 duration, such as the default `P30D`, into milliseconds. Anything that is
// not a duration comes back as `null`, so the caller can fall back to the default
export const parseDuration = (duration: string): number | null => {
    const match = DURATION_PATTERN.exec(duration);

    if (!match || match.slice(1).every((part) => part === undefined)) {
        return null;
    }

    const [, years, months, weeks, days, hours, minutes, seconds] = match;

    return (
        Number(years ?? 0) * YEAR +
        Number(months ?? 0) * MONTH +
        Number(weeks ?? 0) * WEEK +
        Number(days ?? 0) * DAY +
        Number(hours ?? 0) * HOUR +
        Number(minutes ?? 0) * MINUTE +
        Number(seconds ?? 0) * SECOND
    );
};

// Picks the largest unit a span of time reaches and rounds to it, so that a little over two
// hours reads as two hours rather than as a run of ever smaller units. `length` comes back
// alongside, since it is also how long the wording holds for
export const roundToSingleUnit = (elapsed: number) => {
    const magnitude = Math.abs(elapsed);
    const reached = units.find(({ length }) => magnitude >= length);
    const { unit, length } = reached ?? units[units.length - 1];

    // Rounding the span and putting the sign back afterwards keeps a time to come and a time
    // gone by the same distance reading alike, which rounding a negative number would not
    return { value: Math.sign(elapsed) * Math.round(magnitude / length), unit, length };
};

// Breaks a span of time into whole units, down to the precision asked for
export const getElapsedUnits = (elapsed: number, precision: RelativeTimePrecision) => {
    const magnitude = Math.abs(elapsed);
    const seconds = Math.floor(magnitude / SECOND);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    const counts: Record<RelativeTimePrecision, number> = {
        year: years,
        month: months - years * 12,
        day: days - months * 30,
        hour: hours - days * 24,
        minute: minutes - hours * 60,
        second: seconds - minutes * 60,
    };

    return elapsedUnits
        .slice(0, elapsedUnits.indexOf(precision) + 1)
        .map((unit) => ({ unit, count: counts[unit] }));
};

// The terse reading, where a span under a minute is rounded up rather than counted in seconds
export const formatMicro = (elapsed: number) => {
    const { value, unit } = roundToSingleUnit(elapsed);

    return unit === "second" ? "1m" : `${Math.abs(value)}${suffixes[unit]}`;
};

// The duration reading, where the units that are there are laid out side by side
export const formatElapsed = (elapsed: number, precision: RelativeTimePrecision) => {
    const parts = getElapsedUnits(elapsed, precision).filter(({ count }) => count > 0);

    if (parts.length === 0) {
        return `0${suffixes[precision]}`;
    }

    return parts.map(({ unit, count }) => `${count}${suffixes[unit]}`).join(" ");
};

export const formatRelative = (elapsed: number, locale?: string) => {
    const { value, unit } = roundToSingleUnit(elapsed);

    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(value, unit);
};

// The day and the month are always spelled out; the year only when it is not the one the
// reader is in, so that a date from this year cannot be read as any other
const getDateFormatOptions = (
    date: Date,
    now: number,
    options: RelativeTimeDateOptions,
): Intl.DateTimeFormatOptions => {
    const isThisYear = date.getFullYear() === new Date(now).getFullYear();

    return {
        weekday: options.weekday,
        year: options.year ?? (isThisYear ? undefined : "numeric"),
        month: options.month ?? "short",
        day: options.day ?? "numeric",
        hour: options.hour,
        minute: options.minute,
        second: options.second,
        timeZoneName: options.timeZoneName,
    };
};

export const formatDate = (
    date: Date,
    now: number,
    options: RelativeTimeDateOptions,
    locale?: string,
) => new Intl.DateTimeFormat(locale, getDateFormatOptions(date, now, options)).format(date);

// The whole date the time stands for, kept on the element so that the reading can be checked
export const formatTitle = (date: Date, locale?: string) =>
    new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
    }).format(date);

// Pure, so the reading can be worked out while rendering rather than kept in state
export const formatRelativeTime = (
    date: Date,
    now: number,
    settings: RelativeTimeSettings,
): FormattedRelativeTime => {
    const { format, tense, precision, threshold, prefix, dateOptions, locale } = settings;
    const elapsed = date.getTime() - now;

    if (format === "elapsed") {
        return {
            text: formatElapsed(elapsed, precision),
            // The smallest unit on show is the one that runs out first
            updateDelay: units.find(({ unit }) => unit === precision)?.length ?? SECOND,
        };
    }

    // A time reads relative to now only while it is close enough to it, and only while it
    // falls on the side of now that was asked for
    const reach = parseDuration(threshold) ?? DEFAULT_THRESHOLD;
    const matchesTense =
        tense === "auto" ||
        (tense === "past" && elapsed <= 0) ||
        (tense === "future" && elapsed >= 0);

    if (Math.abs(elapsed) <= reach && matchesTense) {
        const { length } = roundToSingleUnit(elapsed);

        return {
            text: format === "micro" ? formatMicro(elapsed) : formatRelative(elapsed, locale),
            updateDelay: length,
        };
    }

    const localised = formatDate(date, now, dateOptions, locale);
    const untilThreshold = elapsed - reach;

    return {
        text: prefix ? `${prefix} ${localised}` : localised,
        // A time still to come reads differently once it comes within the threshold, and
        // again once it slips into the past; one already gone only moves further away
        updateDelay: elapsed <= 0 ? null : untilThreshold > 0 ? untilThreshold : elapsed,
    };
};
