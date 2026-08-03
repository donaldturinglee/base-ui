import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CalendarDayProps } from "./Calendar.types";

const classes = {
    root: "calendar-day",
    interactive: "calendar-day-interactive",
    selected: "calendar-day-selected",
    between: "calendar-day-between",
    outside: "calendar-day-outside",
    unavailable: "calendar-day-unavailable",
    // The day of the month is what is read on the page; the whole date is what is read out
    hidden: "sr-only",
};

// One day of the month. Nothing about it is worked out here: the calendar around it says how
// the day stands, and this only draws it
function CalendarDay(
    props: CalendarDayProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        label,
        name,
        dayKey,
        selected,
        range,
        today,
        outside,
        unavailable,
        tabbable,
        className,
        ...rest
    } = props;

    // Only the two ends of a stretch of days are filled in. Everything between them stands on
    // the bar the cells draw, so a second background on top of it would only break the run
    const isBetween = range === "middle";
    const isFilled = selected && !isBetween;

    return (
        <button
            ref={ref}
            type="button"
            // Only one day in the grid is tabbed to; the rest are reached with the arrow keys
            tabIndex={tabbable ? 0 : -1}
            aria-pressed={selected}
            aria-current={today ? "date" : undefined}
            aria-disabled={unavailable || undefined}
            className={classNames(
                classes.root,
                !unavailable && !selected && classes.interactive,
                outside && classes.outside,
                isBetween && classes.between,
                // Last, so that a day that is both picked and unavailable still reads as
                // picked
                unavailable && classes.unavailable,
                isFilled && classes.selected,
                className,
            )}
            data-component="Calendar.Day"
            data-date={dayKey}
            data-selected={selected}
            data-range={range}
            data-today={today || undefined}
            data-outside={outside || undefined}
            data-unavailable={unavailable || undefined}
            data-tabbable={tabbable}
            {...rest}
        >
            <span aria-hidden="true">{label}</span>
            <span className={classes.hidden}>{name}</span>
        </button>
    );
}

CalendarDay.displayName = "Calendar.Day";

export default fixedForwardRef(CalendarDay);
