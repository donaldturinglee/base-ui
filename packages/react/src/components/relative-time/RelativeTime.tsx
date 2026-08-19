import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import {
    DEFAULT_RELATIVE_TIME_PREFIX,
    DEFAULT_RELATIVE_TIME_THRESHOLD,
    formatRelativeTime,
    formatTitle,
} from "./relativeTimeFormat";
import type { RelativeTimeProps } from "./RelativeTime.types";

// The time either prop stands for, or nothing at all when neither was given or what was
// given cannot be read as a date
const getDate = (date?: Date, datetime?: string) => {
    const resolved = date ?? (datetime === undefined ? undefined : new Date(datetime));

    return resolved && !Number.isNaN(resolved.getTime()) ? resolved : undefined;
};

function RelativeTime<As extends React.ElementType = "time">(
    props: RelativeTimeProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "time",
        children,
        date,
        datetime,
        format = "auto",
        tense = "auto",
        precision = "second",
        threshold = DEFAULT_RELATIVE_TIME_THRESHOLD,
        prefix = DEFAULT_RELATIVE_TIME_PREFIX,
        noTitle,
        weekday,
        year,
        month,
        day,
        hour,
        minute,
        second,
        timeZoneName,
        ...rest
    } = props as RelativeTimeProps<"time">;

    const time = getDate(date, datetime);
    const [now, setNow] = React.useState(() => Date.now());

    const { text, updateDelay } = time
        ? formatRelativeTime(time, now, {
              format,
              tense,
              precision,
              threshold,
              prefix,
              dateOptions: { weekday, year, month, day, hour, minute, second, timeZoneName },
          })
        : { text: "", updateDelay: null };

    // The reading is only worked out again when it would really change, so a time far from
    // now costs nothing to leave on the page
    React.useEffect(() => {
        if (updateDelay === null) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setNow(Date.now());
        }, updateDelay);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [now, updateDelay]);

    return (
        <Component
            ref={ref}
            dateTime={time?.toISOString()}
            title={noTitle || !time ? undefined : formatTitle(time)}
            data-component="RelativeTime"
            data-format={format}
            data-tense={tense}
            {...rest}
        >
            {/* Children stand in for the reading, so a time rendered on the server can be
                handed over already written out */}
            {children ?? text}
        </Component>
    );
}

RelativeTime.displayName = "RelativeTime";

export default fixedForwardRef(RelativeTime);
