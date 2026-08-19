import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import Checkbox from "./Checkbox";

const classes = {
    field: "flex items-start gap-[var(--base-size-8)]",
};

const Field = ({
    id,
    label,
    children,
}: {
    id: string;
    label: string;
    children: React.ReactNode;
}) => (
    <div className={classes.field}>
        {children}
        <Text as="label" htmlFor={id}>
            {label}
        </Text>
    </div>
);

export default {
    title: "Components/Checkbox/Features",
    parameters: {
        layout: "centered",
    },
};

// Checked
export const Checked: StoryFn<typeof Checkbox> = () => (
    <Field id="checked-choice" label="Checked">
        <Checkbox id="checked-choice" defaultChecked />
    </Field>
);

// Indeterminate
export const Indeterminate: StoryFn<typeof Checkbox> = () => (
    <Field id="indeterminate-choice" label="Part checked">
        <Checkbox id="indeterminate-choice" indeterminate />
    </Field>
);

// Disabled
export const Disabled: StoryFn<typeof Checkbox> = () => (
    <Stack gap="condensed">
        <Field id="disabled-choice" label="Disabled">
            <Checkbox id="disabled-choice" disabled />
        </Field>
        <Field id="disabled-checked-choice" label="Disabled and checked">
            <Checkbox id="disabled-checked-choice" disabled defaultChecked />
        </Field>
        <Field id="disabled-indeterminate-choice" label="Disabled and part checked">
            <Checkbox id="disabled-indeterminate-choice" disabled indeterminate />
        </Field>
    </Stack>
);

// Required
export const Required: StoryFn<typeof Checkbox> = () => (
    <Field id="required-choice" label="Required">
        <Checkbox id="required-choice" required />
    </Field>
);

// Select All, where the parent box reports a part checked group
export const SelectAll: StoryFn<typeof Checkbox> = () => {
    const [selected, setSelected] = React.useState<string[]>(["one"]);
    const values = ["one", "two", "three"];
    const allChecked = selected.length === values.length;

    return (
        <Stack gap="condensed">
            <Field id="select-all" label="Select all">
                <Checkbox
                    id="select-all"
                    checked={allChecked}
                    indeterminate={selected.length > 0 && !allChecked}
                    onChange={(event) => setSelected(event.currentTarget.checked ? values : [])}
                />
            </Field>
            {values.map((value) => (
                <Field key={value} id={`select-${value}`} label={`Choice ${value}`}>
                    <Checkbox
                        id={`select-${value}`}
                        value={value}
                        checked={selected.includes(value)}
                        onChange={(event) =>
                            setSelected(
                                event.currentTarget.checked
                                    ? [...selected, value]
                                    : selected.filter((selectedValue) => selectedValue !== value),
                            )
                        }
                    />
                </Field>
            ))}
        </Stack>
    );
};
