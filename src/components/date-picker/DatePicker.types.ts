import type {
    CalendarDateInput,
    CalendarDateMatcher,
    CalendarMode,
    CalendarRange,
    CalendarRangeInput,
    CalendarWeekStart,
} from "../calendar/Calendar.types";
import type { TextInputProps } from "../text-input";

// What dismissed the calendar, so a caller can tell one way of closing it from another
export type DatePickerCloseGesture = "date-select" | "button" | "click-outside" | "escape";

// A picker that takes one day at a time, which is what it does where it is told nothing
export type DatePickerPropsForOneDay = {
    mode?: "single";
    // The day that has been picked. `null` is a field with nothing in it
    value?: CalendarDateInput | null;
    defaultValue?: CalendarDateInput | null;
    // Called with the day that was picked, or with nothing where the field was emptied
    onChange?: (date: Date | null) => void;
};

// A picker that takes a stretch of days. The calendar stands open until both ends have been
// picked, and the field holds them either side of the separator. Pressing the day a stretch was
// started on lets go of it again
export type DatePickerPropsForARange = {
    mode: "range";
    value?: CalendarRangeInput | null;
    defaultValue?: CalendarRangeInput | null;
    // Called on both presses, so the first hands back a range with only one end to it
    onChange?: (range: CalendarRange) => void;
};

// What is picked, and what is handed back, both follow from the mode
export type DatePickerSelectionConfig = DatePickerPropsForOneDay | DatePickerPropsForARange;

// The field settles its own type, value and trailing button, so those are not the caller's to
// give. A counter has no place on a date either, and the earliest and the latest day are the
// calendar's own rather than the plain numbers the native attributes take
export type DatePickerBaseProps = Omit<
    TextInputProps,
    | "type"
    | "value"
    | "defaultValue"
    | "onChange"
    | "trailingAction"
    | "characterLimit"
    | "min"
    | "max"
> & {
    // How a date is both written into the field and read back out of it, in Day.js tokens.
    // Typing is only taken where the whole of what was typed reads as a date in this form
    format?: string;
    // What stands between the two ends of a stretch of days in the field. It has to be
    // something the format itself never holds, so that the two can be told apart again
    rangeSeparator?: string;
    // Whether the calendar is open. A picker the caller is not holding this for keeps its own
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, gesture?: DatePickerCloseGesture) => void;
    min?: CalendarDateInput;
    max?: CalendarDateInput;
    isDateDisabled?: CalendarDateMatcher;
    weekStartsOn?: CalendarWeekStart;
    // Holds every month to six weeks, so that the calendar keeps its height as the reader goes
    // from one month to the next
    fixedWeeks?: boolean;
    showWeekNumbers?: boolean;
    monthFormat?: string;
    // Names the button that brings the calendar out
    calendarButtonLabel?: string;
    // Names the calendar itself, which stands as a dialog off the field
    calendarLabel?: string;
    // Goes on the field rather than on the picker around it, which takes `className`
    inputClassName?: string;
    className?: string;
};

export type DatePickerProps = DatePickerBaseProps & DatePickerSelectionConfig;

// The same props with the mode left open, for reading inside the component. What `value` and
// `onChange` carry is settled by the mode, which the caller sees as one shape or the other and
// the picker tells apart itself
export type DatePickerElementProps = DatePickerBaseProps & {
    mode?: CalendarMode;
    value?: CalendarDateInput | CalendarRangeInput | null;
    defaultValue?: CalendarDateInput | CalendarRangeInput | null;
    onChange?: ((date: Date | null) => void) | ((range: CalendarRange) => void);
};
