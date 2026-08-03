import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CalendarDayProps } from "./Calendar.types";

const classes = {
    // Every day takes the same square whatever it holds, so the grid keeps its shape from one
    // month to the next
    root: "grid size-[var(--control-medium-size)] cursor-pointer appearance-none place-items-center rounded-[var(--border-radius-medium)] border-0 bg-transparent p-0 text-foreground-default [font-family:inherit] [font-size:var(--text-body-size-small)] [font-variant-numeric:tabular-nums]",
    focus: "focus-visible:outline-solid focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[color:var(--focus-outline-color)] focus-visible:outline-offset-[calc(-1_*_var(--border-width-thin))]",
    interactive:
        "hover:bg-[var(--control-transparent-background-color-hover)] active:bg-[var(--control-transparent-background-color-active)]",
    // The day that has been picked takes the colours a chosen control takes anywhere else.
    // Only the two ends of a range are filled in; the days between them are carried by the bar
    // the cells around them draw
    selected:
        "bg-[var(--control-checked-background-color-rest)] [color:var(--control-checked-foreground-color-rest)] [font-weight:var(--base-text-weight-semibold)] hover:bg-[var(--control-checked-background-color-hover)] active:bg-[var(--control-checked-background-color-active)]",
    between: "[font-weight:var(--base-text-weight-semibold)]",
    outside: "text-foreground-muted",
    unavailable: "cursor-not-allowed text-foreground-disabled",
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
                classes.focus,
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
