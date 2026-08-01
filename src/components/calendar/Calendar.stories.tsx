import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Calendar } from ".";
import type { CalendarProps } from "./Calendar.types";

export default {
    title: "Components/Calendar",
    component: Calendar,
} as Meta<typeof Calendar>;

export const Default: StoryFn<typeof Calendar> = () => {
    const [value, setValue] = React.useState<Date | null>(null);

    return (
        <Stack gap="condensed" align="start">
            <Calendar value={value} onChange={setValue} />
            <Text>{value ? value.toDateString() : "No day picked"}</Text>
        </Stack>
    );
};

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<CalendarProps> = (args) => <Calendar {...args} />;

Playground.args = {
    mode: "single",
    fixedWeeks: false,
    showOutsideDays: true,
    showWeekNumbers: false,
    monthFormat: "MMMM YYYY",
    dayFormat: "LL",
};

Playground.argTypes = {
    mode: {
        control: {
            type: "radio",
        },
        options: ["single", "range"],
        description: "Whether one day is picked at a time, or a stretch of them",
    },
    weekStartsOn: {
        control: {
            type: "select",
        },
        options: [undefined, 0, 1, 2, 3, 4, 5, 6],
        description: "Which day the week starts on, counted from Sunday",
    },
    fixedWeeks: {
        control: {
            type: "boolean",
        },
        description: "Holds every month to six weeks, so that nothing below the calendar moves",
    },
    showOutsideDays: {
        control: {
            type: "boolean",
        },
        description: "Shows the days of the months either side that fill out the weeks",
    },
    showWeekNumbers: {
        control: {
            type: "boolean",
        },
        description: "Shows the week of the year each row falls in",
    },
    monthFormat: {
        control: {
            type: "text",
        },
        description: "How the month above the grid is written, in Day.js tokens",
    },
    dayFormat: {
        control: {
            type: "text",
        },
        description: "How a day is named to a screen reader, in Day.js tokens",
    },
    value: {
        table: {
            disable: true,
        },
    },
    month: {
        table: {
            disable: true,
        },
    },
    isDateDisabled: {
        table: {
            disable: true,
        },
    },
    focusableDayRef: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
