import * as React from "react";
import { CalendarLtrRegular } from "@gamecrafters/base-ui-icons";
import { useId } from "../../hooks/useId";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { AnchoredOverlay } from "../anchored-overlay";
import { Calendar } from "../calendar";
import {
    isDateSelectable,
    NOTHING_PICKED,
    parseDate,
    toOptionalDate,
    toSelection,
} from "../calendar/calendarDates";
import { TextInput } from "../text-input";
import type { AnchoredOverlayCloseGesture } from "../anchored-overlay";
import type { CalendarRange, CalendarSelection } from "../calendar";
import type {
    DatePickerCloseGesture,
    DatePickerElementProps,
    DatePickerProps,
} from "./DatePicker.types";

const classes = {
    root: "inline-block",
    // A field that fills whatever holds it needs every wrapper between the two to fill it too
    block: "block w-full",
    // The calendar is given room of its own inside the overlay, which brings nothing but the
    // surface it stands on
    overlay: "p-[var(--overlay-padding-normal)]",
};

// A field for a date, or for a stretch of days from one to another, with a calendar behind a
// button at the end of it. The date can be typed as readily as it can be picked, and what was
// typed is only taken where the whole of it reads as a date in the form the field was given
function DatePicker(
    props: DatePickerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        mode = "single",
        value,
        defaultValue,
        onChange,
        format = "YYYY-MM-DD",
        rangeSeparator = " - ",
        open: openProp,
        defaultOpen = false,
        onOpenChange,
        min,
        max,
        isDateDisabled,
        weekStartsOn,
        fixedWeeks = true,
        showWeekNumbers,
        monthFormat,
        calendarButtonLabel = "Choose a date",
        calendarLabel = "Choose a date",
        placeholder,
        disabled,
        block,
        onBlur,
        inputClassName,
        className,
        ...rest
    } = props as DatePickerElementProps;

    const calendarId = useId();

    const fieldRef = React.useRef<HTMLSpanElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedInputRef = useMergedRefs(ref, inputRef);
    // Handed to the overlay's focus trap, so that the calendar opens on the day the reader
    // would land on rather than on the button that steps back a month
    const dayRef = React.useRef<HTMLButtonElement>(null);

    const minDate = toOptionalDate(min);
    const maxDate = toOptionalDate(max);

    const isRange = mode === "range";

    // A picker the caller is holding what has been picked for takes it from the prop; one that
    // is not keeps its own
    const isValueControlled = value !== undefined;
    const [selfSelection, setSelfSelection] = React.useState(() =>
        toSelection(defaultValue, isRange),
    );
    const selection = isValueControlled ? toSelection(value, isRange) : selfSelection;

    // The same for whether the calendar is open
    const isOpenControlled = openProp !== undefined;
    const [selfOpen, setSelfOpen] = React.useState(defaultOpen);
    const isOpen = isOpenControlled ? openProp : selfOpen;

    // What has been picked, written out for the field. A stretch with only one end to it is
    // written as that end alone, since that is all there is to say about it yet
    const writeSelection = ({ from, to }: CalendarSelection) => {
        if (from === null) {
            return "";
        }

        if (!isRange || to === null) {
            return from.format(format);
        }

        return `${from.format(format)}${rangeSeparator}${to.format(format)}`;
    };

    // What was typed, read back the same way round. Nothing is taken from it unless the whole
    // of it reads as a date, or as both ends of a stretch
    const readSelection = (input: string): CalendarSelection | undefined => {
        if (input.trim() === "") {
            return NOTHING_PICKED;
        }

        const parts = isRange ? input.split(rangeSeparator) : [input];
        const dates = parts.map((part) => parseDate(part.trim(), format));

        if (dates.length > 2 || dates.some((date) => date === null)) {
            return undefined;
        }

        const [from, to = null] = dates as NonNullable<(typeof dates)[number]>[];

        if (!isRange) {
            return { from, to: from };
        }

        // Typed backwards, the two ends are put the right way round, so that a stretch reads
        // the same however it was arrived at
        return to && from.isAfter(to, "day") ? { from: to, to: from } : { from, to };
    };

    // What the reader has typed, which the field shows in place of what was picked until they
    // leave it. Anything that could not be read as a date is dropped at that point
    const [typed, setTyped] = React.useState<string | null>(null);
    const text = typed ?? writeSelection(selection);

    const setOpen = (next: boolean, gesture?: DatePickerCloseGesture) => {
        if (!isOpenControlled) {
            setSelfOpen(next);
        }

        onOpenChange?.(next, gesture);
    };

    const commit = (next: CalendarSelection) => {
        const isTakeable = [next.from, next.to].every(
            (date) => date === null || isDateSelectable(date, minDate, maxDate, isDateDisabled),
        );

        if (!isTakeable) {
            return;
        }

        if (!isValueControlled) {
            setSelfSelection(next);
        }

        // Only the mode the picker is in says which of the two shapes the caller is waiting
        // for, so the one handler is called as whichever it was given as
        if (isRange) {
            const handler = onChange as ((range: CalendarRange) => void) | undefined;

            handler?.({ from: next.from?.toDate() ?? null, to: next.to?.toDate() ?? null });

            return;
        }

        (onChange as ((date: Date | null) => void) | undefined)?.(next.from?.toDate() ?? null);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value;
        setTyped(next);

        const read = readSelection(next);

        if (read) {
            commit(read);
        }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        // Whatever is left in the field is written out again from the day that was picked, so
        // that half a date is never left standing as though it had been taken
        setTyped(null);
        onBlur?.(event);
    };

    const handleDayChange = (date: Date) => {
        setTyped(null);
        commit(toSelection(date, false));
        setOpen(false, "date-select");
    };

    const handleRangeChange = (range: CalendarRange) => {
        setTyped(null);
        commit(toSelection(range, true));

        // The calendar stands open until the far end of the stretch has been picked, since
        // there is still a day to take
        if (range.from && range.to) {
            setOpen(false, "date-select");
        }
    };

    const handleOverlayClose = (gesture: AnchoredOverlayCloseGesture) => {
        setOpen(false, gesture === "escape" ? "escape" : "click-outside");
    };

    // Everything the calendar is given whichever mode it is standing in
    const calendarProps = {
        min,
        max,
        isDateDisabled,
        weekStartsOn,
        fixedWeeks,
        showWeekNumbers,
        monthFormat,
        focusableDayRef: dayRef,
        "data-component": "DatePicker.Calendar",
    };

    return (
        <span
            className={classNames(classes.root, block && classes.block, className)}
            data-component="DatePicker"
            data-open={isOpen}
        >
            <span
                ref={fieldRef}
                className={classNames(classes.root, block && classes.block)}
                data-component="DatePicker.Field"
            >
                <TextInput
                    ref={mergedInputRef}
                    type="text"
                    value={text}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    // The form the date is written in stands in the field until one is given,
                    // so that a reader typing rather than picking knows what is expected
                    placeholder={
                        placeholder ?? (isRange ? `${format}${rangeSeparator}${format}` : format)
                    }
                    disabled={disabled}
                    block={block}
                    className={inputClassName}
                    trailingAction={
                        <TextInput.Action
                            icon={CalendarLtrRegular}
                            aria-label={calendarButtonLabel}
                            aria-haspopup="dialog"
                            aria-expanded={isOpen}
                            aria-controls={isOpen ? calendarId : undefined}
                            disabled={disabled}
                            onClick={() => setOpen(!isOpen, "button")}
                            data-component="DatePicker.CalendarButton"
                        />
                    }
                    {...rest}
                />
            </span>

            <AnchoredOverlay
                renderAnchor={null}
                anchorRef={fieldRef}
                open={isOpen}
                onClose={handleOverlayClose}
                side="outside-bottom"
                align="start"
                className={classes.overlay}
                overlayProps={{ id: calendarId, role: "dialog", "aria-label": calendarLabel }}
                focusTrapSettings={{ initialFocusRef: dayRef, returnFocusRef: inputRef }}
            >
                {/* The mode settles what the calendar hands back, so it is rendered as
                    whichever of the two the picker is standing for */}
                {isRange ? (
                    <Calendar
                        mode="range"
                        value={{ from: selection.from, to: selection.to }}
                        onChange={handleRangeChange}
                        {...calendarProps}
                    />
                ) : (
                    <Calendar
                        value={selection.from}
                        onChange={handleDayChange}
                        {...calendarProps}
                    />
                )}
            </AnchoredOverlay>
        </span>
    );
}

DatePicker.displayName = "DatePicker";

export default fixedForwardRef(DatePicker);
