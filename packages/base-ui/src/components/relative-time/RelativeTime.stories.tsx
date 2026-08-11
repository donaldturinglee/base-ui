import type { StoryFn, Meta } from "@storybook/react-vite";
import { RelativeTime } from ".";
import type { RelativeTimeProps } from "./RelativeTime.types";

// The controls hand back a timestamp rather than a `Date`, so the story builds the date it
// is given rather than taking one straight from the args
type PlaygroundArgs = Omit<RelativeTimeProps, "date"> & { date: number };

export default {
    title: "Components/RelativeTime",
    component: RelativeTime,
} as Meta<typeof RelativeTime>;

export const Default: StoryFn<typeof RelativeTime> = () => (
    <RelativeTime date={new Date("2020-01-01T00:00:00Z")} noTitle />
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<PlaygroundArgs> = ({ date, ...args }) => (
    <RelativeTime {...args} date={new Date(date)} />
);

Playground.args = {
    date: new Date("2020-01-01T00:00:00Z").getTime(),
    format: "auto",
    tense: "auto",
    precision: "second",
    threshold: "P30D",
    prefix: "on",
    noTitle: true,
    month: "short",
    day: "numeric",
};

Playground.argTypes = {
    date: {
        control: {
            type: "date",
        },
        description: "The time to show",
    },
    format: {
        control: {
            type: "radio",
        },
        options: ["auto", "micro", "elapsed"],
        description: "Whether the time reads in full, in the terse form, or as a duration",
    },
    tense: {
        control: {
            type: "radio",
        },
        options: ["auto", "past", "future"],
        description: "Which way a relative time is allowed to read",
    },
    precision: {
        control: {
            type: "radio",
        },
        options: ["year", "month", "day", "hour", "minute", "second"],
        description: "The smallest unit an elapsed time is broken down into",
    },
    threshold: {
        control: {
            type: "text",
        },
        description: "The ISO8601 duration within which a time reads relative to now",
    },
    prefix: {
        control: {
            type: "text",
        },
        description: "What comes before a localised date",
    },
    noTitle: {
        control: {
            type: "boolean",
        },
        description: "Drops the title the time carries by default",
    },
    weekday: {
        control: {
            type: "select",
        },
        options: [undefined, "short", "long", "narrow"],
        description: "How the weekday is spelled out",
    },
    month: {
        control: {
            type: "select",
        },
        options: [undefined, "numeric", "2-digit", "short", "long", "narrow"],
        description: "How the month is spelled out",
    },
    day: {
        control: {
            type: "select",
        },
        options: [undefined, "numeric", "2-digit"],
        description: "How the day is spelled out",
    },
    hour: {
        control: {
            type: "select",
        },
        options: [undefined, "numeric", "2-digit"],
        description: "How the hour is spelled out",
    },
    minute: {
        control: {
            type: "select",
        },
        options: [undefined, "numeric", "2-digit"],
        description: "How the minute is spelled out",
    },
    second: {
        control: {
            type: "select",
        },
        options: [undefined, "numeric", "2-digit"],
        description: "How the second is spelled out",
    },
    year: {
        control: {
            type: "select",
        },
        options: [undefined, "numeric", "2-digit"],
        description: "How the year is spelled out, which is left out for the year in progress",
    },
    timeZoneName: {
        control: {
            type: "select",
        },
        options: [
            undefined,
            "short",
            "long",
            "shortOffset",
            "longOffset",
            "shortGeneric",
            "longGeneric",
        ],
        description: "How the time zone is spelled out",
    },
    datetime: {
        table: {
            disable: true,
        },
    },
    ref: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
