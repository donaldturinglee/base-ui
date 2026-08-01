import CalendarBase from "./Calendar";
import CalendarDay from "./CalendarDay";

export const Calendar = Object.assign(CalendarBase, {
    Day: CalendarDay,
});

export { CalendarDay };
export {
    DAYS_IN_WEEK,
    DAY_KEY_FORMAT,
    extendRange,
    getFirstDayOfWeek,
    getMonthWeeks,
    getRangePosition,
    getWeekdays,
    isDateSelectable,
    isDateWithinRange,
    parseDate,
    startOfWeek,
    toDayKey,
} from "./calendarDates";
export * from "./Calendar.types";
