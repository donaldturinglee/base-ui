import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type RelativeTimeFormat = "auto" | "micro" | "elapsed";

export type RelativeTimeTense = "auto" | "past" | "future";

export type RelativeTimePrecision = "year" | "month" | "day" | "hour" | "minute" | "second";

export type RelativeTimeUnit = "year" | "month" | "week" | "day" | "hour" | "minute" | "second";

// How a localised date is spelled out, taken straight from `Intl.DateTimeFormat`
export type RelativeTimeDateOptions = {
    weekday?: "short" | "long" | "narrow";
    year?: "numeric" | "2-digit";
    month?: "numeric" | "2-digit" | "short" | "long" | "narrow";
    day?: "numeric" | "2-digit";
    hour?: "numeric" | "2-digit";
    minute?: "numeric" | "2-digit";
    second?: "numeric" | "2-digit";
    timeZoneName?: "short" | "long" | "shortOffset" | "longOffset" | "shortGeneric" | "longGeneric";
};

// Everything the reading is worked out from, apart from the time itself and the moment it is
// being measured against
export type RelativeTimeSettings = {
    format: RelativeTimeFormat;
    tense: RelativeTimeTense;
    precision: RelativeTimePrecision;
    threshold: string;
    prefix: string;
    dateOptions: RelativeTimeDateOptions;
    locale?: string;
};

export type FormattedRelativeTime = {
    text: string;
    // How long the wording holds for, or `null` once it can no longer change
    updateDelay: number | null;
};

export type RelativeTimeProps<As extends React.ElementType = "time"> = PolymorphicProps<
    As,
    "time",
    RelativeTimeDateOptions & {
        // The time to show, given as a `Date`
        date?: Date;
        // The same time given as an ISO8601 string, which `date` is taken from when set
        datetime?: string;
        // Whether the time reads in full, in the terse form, or as a duration
        format?: RelativeTimeFormat;
        // Which way a relative time is allowed to read. A time that cannot be read that way
        // is written out as a date instead
        tense?: RelativeTimeTense;
        // The smallest unit an elapsed time is broken down into
        precision?: RelativeTimePrecision;
        // The ISO8601 duration within which a time reads relative to now
        threshold?: string;
        // What comes before a localised date
        prefix?: string;
        // Drops the `title` the time carries by default
        noTitle?: boolean;
        className?: string;
    }
>;
