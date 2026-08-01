import * as React from "react";
import { ChevronLeftRegular, ChevronRightRegular } from "@gamecrafters/base-ui-icons";
import { useId } from "../../hooks/useId";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import CalendarDay from "./CalendarDay";
import {
    DAYS_IN_WEEK,
    extendRange,
    getFirstDayOfWeek,
    getMonthWeeks,
    getRangePosition,
    getToday,
    getWeekdays,
    isDateSelectable,
    isDateWithinRange,
    startOfWeek,
    toDate,
    toDayKey,
    toOptionalDate,
    toSelection,
} from "./calendarDates";
import type { Dayjs } from "dayjs";
import type { CalendarElementProps, CalendarProps, CalendarRange } from "./Calendar.types";

const classes = {
    // The calendar is only as wide as the grid it holds, so it can stand on a page or in an
    // overlay without either having to say how much room to give it
    root: "inline-block",
    header: "flex items-center justify-between gap-[var(--base-size-4)] pb-[var(--base-size-8)]",
    caption:
        "[font-size:var(--text-body-size-medium)] [font-weight:var(--base-text-weight-semibold)]",
    grid: "border-collapse",
    weekday:
        "p-0 pb-[var(--base-size-4)] [color:var(--foreground-color-muted)] [font-size:var(--text-body-size-small)] [font-weight:var(--base-text-weight-normal)]",
    weekNumberHeader: "p-0",
    weekNumber:
        "pe-[var(--base-size-8)] [color:var(--foreground-color-muted)] [font-size:var(--text-body-size-small)] [font-variant-numeric:tabular-nums] [font-weight:var(--base-text-weight-normal)]",
    // The room between one day and the next is given by the cell around it, so that the days
    // themselves stay square
    cell: "p-[var(--base-size-2)]",
    // The bar running from one end of a stretch of days to the other is drawn by the cells
    // rather than by the days, so that it runs unbroken across the room between them
    rangeCell: "bg-[var(--background-color-accent-muted)]",
    rangeCellStart: "rounded-s-[var(--border-radius-medium)]",
    rangeCellEnd: "rounded-e-[var(--border-radius-medium)]",
    hidden: "sr-only",
};

// A month laid out a week to a row, for picking a day out of, or a stretch of them from one
// end to the other. The arrow keys move around the grid a day and a week at a time, and PageUp
// and PageDown a month at a time, so that only one day in it is ever tabbed to
function Calendar(
    props: CalendarProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        mode = "single",
        value,
        defaultValue,
        onChange,
        month: monthProp,
        defaultMonth,
        onMonthChange,
        min,
        max,
        isDateDisabled,
        weekStartsOn: weekStartsOnProp,
        fixedWeeks = false,
        showOutsideDays = true,
        showWeekNumbers = false,
        monthFormat = "MMMM YYYY",
        dayFormat = "LL",
        focusableDayRef,
        previousMonthLabel = "Previous month",
        nextMonthLabel = "Next month",
        weekNumberLabel = "Week",
        className,
        ...rest
    } = props as CalendarElementProps;

    const captionId = useId();
    const gridRef = React.useRef<HTMLTableElement>(null);

    const today = getToday();
    const isRange = mode === "range";

    // A calendar the caller is holding what has been picked for takes it from the prop; one
    // that is not keeps its own
    const isValueControlled = value !== undefined;
    const [selfSelection, setSelfSelection] = React.useState(() =>
        toSelection(defaultValue, isRange),
    );
    const selection = isValueControlled ? toSelection(value, isRange) : selfSelection;

    // The same for the month on show, which opens on the day that was picked where there is
    // one and on this month where there is not
    const isMonthControlled = monthProp !== undefined;
    const [selfMonth, setSelfMonth] = React.useState(() =>
        (
            toOptionalDate(defaultMonth) ??
            toSelection(defaultValue, isRange).from ??
            toSelection(value, isRange).from ??
            getToday()
        ).startOf("month"),
    );
    const month = (isMonthControlled ? toDate(monthProp) : selfMonth).startOf("month");

    const minDate = toOptionalDate(min);
    const maxDate = toOptionalDate(max);

    const weekStartsOn = weekStartsOnProp ?? getFirstDayOfWeek();
    const weekdays = getWeekdays(weekStartsOn);
    const weeks = getMonthWeeks(month, weekStartsOn, fixedWeeks);

    // Where the reader last was in the grid, which is where the arrow keys carry on from
    const [focusedDate, setFocusedDate] = React.useState<Dayjs | null>(null);
    // The day focus is to be put on once the grid has been laid out again, since a day moved
    // to in another month is not on the page until then
    const pendingFocus = React.useRef<string | null>(null);

    // The day the reader is over while a stretch is half picked, which stands in for its far
    // end so that what they are about to take is shown before they take it
    const [previewDate, setPreviewDate] = React.useState<Dayjs | null>(null);

    const isHalfPicked = isRange && selection.from !== null && selection.to === null;
    const shownTo = isHalfPicked ? previewDate : selection.to;

    // The one day the tab key reaches: wherever the reader last was, else the day that has
    // been picked, else today, else the first of the month
    const findTabbable = () => {
        for (const candidate of [focusedDate, selection.from, today]) {
            if (candidate && candidate.isSame(month, "month")) {
                return candidate;
            }
        }

        return month;
    };

    const tabbableKey = toDayKey(findTabbable());

    React.useEffect(() => {
        const key = pendingFocus.current;

        if (key === null) {
            return;
        }

        pendingFocus.current = null;
        gridRef.current?.querySelector<HTMLButtonElement>(`[data-date='${key}']`)?.focus();
    });

    const changeMonth = (next: Dayjs) => {
        const landing = next.startOf("month");

        if (!isMonthControlled) {
            setSelfMonth(landing);
        }

        onMonthChange?.(landing.toDate());
    };

    const moveFocus = (next: Dayjs) => {
        setFocusedDate(next);
        pendingFocus.current = toDayKey(next);

        // Moving off the end of the month brings the next one into view rather than stopping
        if (!next.isSame(month, "month")) {
            changeMonth(next);
        }
    };

    const selectDate = (date: Dayjs) => {
        if (!isDateSelectable(date, minDate, maxDate, isDateDisabled)) {
            return;
        }

        setFocusedDate(date);

        // A day picked out of one of the months either side brings its own month into view
        if (!date.isSame(month, "month")) {
            changeMonth(date);
        }

        const next = isRange
            ? extendRange(selection.from, selection.to, date)
            : { from: date, to: date };

        if (!isValueControlled) {
            setSelfSelection(next);
        }

        // Only the mode the calendar is in says which of the two shapes the caller is waiting
        // for, so the one handler is called as whichever it was given as
        if (isRange) {
            const handler = onChange as ((range: CalendarRange) => void) | undefined;

            handler?.({
                from: next.from?.toDate() ?? null,
                to: next.to?.toDate() ?? null,
            });

            return;
        }

        (onChange as ((date: Date) => void) | undefined)?.(date.toDate());
    };

    const handleDayKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, date: Dayjs) => {
        // A key pressed with a modifier belongs to the browser or the page, not to the grid.
        // Shift is the one exception, since it is what turns a page into a year
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }

        const step = (next: Dayjs) => {
            // Taking the event keeps the page from scrolling away underneath the grid
            event.preventDefault();
            moveFocus(next);
        };

        switch (event.key) {
            case "ArrowLeft":
                return step(date.subtract(1, "day"));
            case "ArrowRight":
                return step(date.add(1, "day"));
            case "ArrowUp":
                return step(date.subtract(DAYS_IN_WEEK, "day"));
            case "ArrowDown":
                return step(date.add(DAYS_IN_WEEK, "day"));
            case "Home":
                return step(startOfWeek(date, weekStartsOn));
            case "End":
                return step(startOfWeek(date, weekStartsOn).add(DAYS_IN_WEEK - 1, "day"));
            case "PageUp":
                return step(date.subtract(1, event.shiftKey ? "year" : "month"));
            case "PageDown":
                return step(date.add(1, event.shiftKey ? "year" : "month"));
            default:
                return;
        }
    };

    const handleDayFocus = (date: Dayjs) => {
        setFocusedDate((current) => (current?.isSame(date, "day") ? current : date));

        // Moving through the grid with the keyboard shows the stretch as readily as running
        // the pointer over it does
        if (isHalfPicked) {
            setPreviewDate(date);
        }
    };

    const handleDayPointerEnter = (date: Dayjs) => {
        if (isHalfPicked) {
            setPreviewDate(date);
        }
    };

    // The stretch stops being shown once the reader takes the pointer off the grid, since
    // there is no longer a far end for it to run to
    const handleGridPointerLeave = () => {
        setPreviewDate(null);
    };

    const previousMonth = month.subtract(1, "month");
    const nextMonth = month.add(1, "month");

    // A month with nothing in it that could be picked is nowhere worth going
    const canGoBack = minDate === null || !previousMonth.endOf("month").isBefore(minDate, "day");
    const canGoForward = maxDate === null || !nextMonth.isAfter(maxDate, "day");

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Calendar"
            {...rest}
        >
            <div className={classes.header} data-component="Calendar.Header">
                <IconButton
                    icon={ChevronLeftRegular}
                    aria-label={previousMonthLabel}
                    variant="invisible"
                    size="small"
                    disabled={!canGoBack}
                    onClick={() => changeMonth(previousMonth)}
                    data-component="Calendar.PreviousMonth"
                />
                <div
                    id={captionId}
                    // Read out as it changes, since nothing else says the grid underneath has
                    // been laid out again
                    aria-live="polite"
                    className={classes.caption}
                    data-component="Calendar.Caption"
                >
                    {month.format(monthFormat)}
                </div>
                <IconButton
                    icon={ChevronRightRegular}
                    aria-label={nextMonthLabel}
                    variant="invisible"
                    size="small"
                    disabled={!canGoForward}
                    onClick={() => changeMonth(nextMonth)}
                    data-component="Calendar.NextMonth"
                />
            </div>

            {/* A plain table rather than a grid: the days are buttons, which a screen reader
                already reads one at a time, and a grid on top of them only gets in the way */}
            <table
                ref={gridRef}
                aria-labelledby={captionId}
                className={classes.grid}
                onPointerLeave={handleGridPointerLeave}
                data-component="Calendar.Grid"
                data-mode={mode}
            >
                <thead>
                    <tr>
                        {showWeekNumbers ? (
                            <th scope="col" className={classes.weekNumberHeader}>
                                <span className={classes.hidden}>{weekNumberLabel}</span>
                            </th>
                        ) : null}
                        {weekdays.map((weekday) => (
                            <th
                                key={weekday.day}
                                scope="col"
                                className={classes.weekday}
                                data-component="Calendar.Weekday"
                            >
                                <span aria-hidden="true">{weekday.narrow}</span>
                                <span className={classes.hidden}>{weekday.full}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {weeks.map((week) => (
                        <tr key={toDayKey(week[0])} data-component="Calendar.Week">
                            {showWeekNumbers ? (
                                <th
                                    scope="row"
                                    className={classes.weekNumber}
                                    data-component="Calendar.WeekNumber"
                                >
                                    {week[0].week()}
                                </th>
                            ) : null}
                            {week.map((day) => {
                                const dayKey = toDayKey(day);
                                const outside = !day.isSame(month, "month");

                                if (outside && !showOutsideDays) {
                                    return <td key={dayKey} className={classes.cell} />;
                                }

                                const tabbable = dayKey === tabbableKey;
                                // Where the day falls in the stretch being shown, which the
                                // day the reader is over stands in for the far end of while
                                // one is still being picked
                                const range = getRangePosition(day, selection.from, shownTo);

                                return (
                                    <td
                                        key={dayKey}
                                        className={classNames(
                                            classes.cell,
                                            range && classes.rangeCell,
                                            range === "start" && classes.rangeCellStart,
                                            range === "end" && classes.rangeCellEnd,
                                        )}
                                    >
                                        <CalendarDay
                                            ref={tabbable ? focusableDayRef : undefined}
                                            label={day.format("D")}
                                            name={day.format(dayFormat)}
                                            dayKey={dayKey}
                                            // Only what has been taken reads as picked; the
                                            // stretch shown ahead of the second press is
                                            // there for the eye alone
                                            selected={isDateWithinRange(
                                                day,
                                                selection.from,
                                                selection.to,
                                            )}
                                            range={range}
                                            today={day.isSame(today, "day")}
                                            outside={outside}
                                            unavailable={
                                                !isDateSelectable(
                                                    day,
                                                    minDate,
                                                    maxDate,
                                                    isDateDisabled,
                                                )
                                            }
                                            tabbable={tabbable}
                                            onClick={() => selectDate(day)}
                                            onKeyDown={(event) => handleDayKeyDown(event, day)}
                                            onFocus={() => handleDayFocus(day)}
                                            onPointerEnter={() => handleDayPointerEnter(day)}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

Calendar.displayName = "Calendar";

export default fixedForwardRef(Calendar);
