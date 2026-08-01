import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { DatePicker } from ".";
import type { DatePickerProps } from "./DatePicker.types";

export default {
    title: "Components/DatePicker",
    component: DatePicker,
} as Meta<typeof DatePicker>;

export const Default: StoryFn<typeof DatePicker> = () => (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="default-starts-on">
            Starts on
        </Text>
        <DatePicker id="default-starts-on" />
    </Stack>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<DatePickerProps> = (args) => (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="playground-starts-on">
            Starts on
        </Text>
        <DatePicker {...args} id="playground-starts-on" />
    </Stack>
);

Playground.args = {
    mode: "single",
    format: "YYYY-MM-DD",
    rangeSeparator: " - ",
    size: "medium",
    block: false,
    contrast: false,
    disabled: false,
    required: false,
    fixedWeeks: true,
    showWeekNumbers: false,
};

Playground.argTypes = {
    mode: {
        control: {
            type: "radio",
        },
        options: ["single", "range"],
        description: "Whether one day is taken at a time, or a stretch of them",
    },
    format: {
        control: {
            type: "text",
        },
        description:
            "How a date is both written into the field and read back out, in Day.js tokens",
    },
    rangeSeparator: {
        control: {
            type: "text",
        },
        description: "What stands between the two ends of a stretch of days in the field",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "Which step of the control scale the field stands at",
    },
    validationStatus: {
        control: {
            type: "radio",
        },
        options: [undefined, "error", "success"],
        description: "Colours the border, and marks the control invalid for an error",
    },
    weekStartsOn: {
        control: {
            type: "select",
        },
        options: [undefined, 0, 1, 2, 3, 4, 5, 6],
        description: "Which day the week starts on, counted from Sunday",
    },
    showWeekNumbers: {
        control: {
            type: "boolean",
        },
        description: "Shows the week of the year each row of the calendar falls in",
    },
    fixedWeeks: {
        control: {
            type: "boolean",
        },
        description: "Holds every month to six weeks, so that the calendar keeps its height",
    },
    block: {
        control: {
            type: "boolean",
        },
        description: "Fills the width of its container",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops both the field and the button being used",
    },
    required: {
        control: {
            type: "boolean",
        },
        description: "Requires the field before the form can be submitted",
    },
    value: {
        table: {
            disable: true,
        },
    },
    open: {
        table: {
            disable: true,
        },
    },
    isDateDisabled: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
