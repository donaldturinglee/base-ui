import type * as React from "react";
import type { Dayjs } from "dayjs";

// A date is taken however the caller already holds one: as a Date, as text, as the number of
// milliseconds since the epoch, or as a Day.js date
export type CalendarDateInput = Date | string | number | Dayjs;

// Which day the week starts on, counted from Sunday
export type CalendarWeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// One column of the grid: the day of the week it stands for, and what that day is called
export type CalendarWeekday = {
    day: number;
    narrow: string;
    full: string;
};

// Rules out days that cannot be picked for a reason the calendar has no way of knowing
export type CalendarDateMatcher = (date: Date) => boolean;

// Whether one day is picked at a time, or a stretch of them from one end to the other
export type CalendarMode = "single" | "range";

// A stretch of days, given however the caller already holds either end of one. An end that is
// not there yet is a range still being picked
export type CalendarRangeInput = {
    from?: CalendarDateInput | null;
    to?: CalendarDateInput | null;
};

// The same, as the calendar hands it back
export type CalendarRange = {
    from: Date | null;
    to: Date | null;
};

// What has been picked, held the one way whichever mode is in use, since a single day is only
// a stretch with the same day at either end
export type CalendarSelection = {
    from: Dayjs | null;
    to: Dayjs | null;
};

// Where a day falls in the stretch that has been picked, which is what the bar running from
// one end of it to the other is drawn from
export type CalendarRangePosition = "start" | "middle" | "end";

// A calendar that picks one day at a time, which is what it does where it is told nothing
export type CalendarPropsForOneDay = {
    mode?: "single";
    // The day that has been picked. `null` is a calendar with nothing picked on it
    value?: CalendarDateInput | null;
    defaultValue?: CalendarDateInput | null;
    onChange?: (date: Date) => void;
};

// A calendar that picks a stretch of days. The first day pressed starts the stretch and the
// second closes it; pressing a third starts a new one. Pressing the day a stretch was started
// on lets go of it again
export type CalendarPropsForARange = {
    mode: "range";
    // Called on both presses, so the first hands back a range with only one end to it
    value?: CalendarRangeInput | null;
    defaultValue?: CalendarRangeInput | null;
    onChange?: (range: CalendarRange) => void;
};

// What is picked, and what is handed back, both follow from the mode
export type CalendarSelectionConfig = CalendarPropsForOneDay | CalendarPropsForARange;

// `onChange` and `defaultValue` both mean something else on a plain div, so the div's own
// versions are dropped in favour of the calendar's
export type CalendarBaseProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    "onChange" | "defaultValue"
> & {
    // The month laid out in the grid. A calendar the caller is not holding this for opens on
    // the month the picked day falls in, and on this one afterwards
    month?: CalendarDateInput;
    defaultMonth?: CalendarDateInput;
    onMonthChange?: (month: Date) => void;
    // The earliest and the latest day that can be picked
    min?: CalendarDateInput;
    max?: CalendarDateInput;
    isDateDisabled?: CalendarDateMatcher;
    // Taken from whatever locale Day.js is set to where it is left out
    weekStartsOn?: CalendarWeekStart;
    // Holds every month to six weeks, so that nothing below the calendar moves as the reader
    // goes from one month to the next
    fixedWeeks?: boolean;
    // Shows the days of the months either side that fill out the first and the last week
    showOutsideDays?: boolean;
    // Shows the week of the year each row falls in, before the days themselves
    showWeekNumbers?: boolean;
    // How the month above the grid is written, in Day.js tokens
    monthFormat?: string;
    // How a day is named to a screen reader, in Day.js tokens
    dayFormat?: string;
    // Points at the day the reader would land on. Whatever holds the calendar can put focus
    // there as it opens, which is what an overlay's focus trap has to be handed
    focusableDayRef?: React.RefObject<HTMLButtonElement | null>;
    previousMonthLabel?: string;
    nextMonthLabel?: string;
    weekNumberLabel?: string;
    className?: string;
};

export type CalendarProps = CalendarBaseProps & CalendarSelectionConfig;

// The same props with the mode left open, for reading inside the component. What `value` and
// `onChange` carry is settled by the mode, which the caller sees as one shape or the other and
// the calendar tells apart itself
export type CalendarElementProps = CalendarBaseProps & {
    mode?: CalendarMode;
    value?: CalendarDateInput | CalendarRangeInput | null;
    defaultValue?: CalendarDateInput | CalendarRangeInput | null;
    onChange?: ((date: Date) => void) | ((range: CalendarRange) => void);
};

// What one day in the grid is told about itself. The calendar around it settles all of this,
// so there is nothing here for a caller to render themselves
export type CalendarDayProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "children" | "disabled" | "type"
> & {
    // The day of the month, which is all that is written in the cell
    label: string;
    // The whole date, which is what a screen reader reads in its place
    name: string;
    // The day written the one way, so that the calendar can find the cell again to focus it
    dayKey: string;
    // Whether the day is one of those that have been picked, which in a range is every day
    // from one end of it to the other
    selected: boolean;
    // Where the day falls in the stretch being shown, which is nowhere at all where only one
    // day stands picked
    range?: CalendarRangePosition;
    // Whether the day is today, which is carried to a screen reader and left on the element
    // for a caller to style, but is not set apart by the calendar itself
    today: boolean;
    // A day of the month either side, there to fill out the week rather than to be read
    outside: boolean;
    // A day that cannot be picked says so rather than being taken out of the grid, so that a
    // reader can still reach it and be told why
    unavailable: boolean;
    // The one day in the grid the tab key reaches, which the arrow keys move around from
    tabbable: boolean;
    className?: string;
};
