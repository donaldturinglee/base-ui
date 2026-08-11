import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import Radio from "./Radio";

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
    title: "Components/Radio/Features",
    parameters: {
        layout: "centered",
    },
};

// Checked
export const Checked: StoryFn<typeof Radio> = () => (
    <Field id="checked-choice" label="Checked">
        <Radio id="checked-choice" name="checked-choices" value="one" defaultChecked />
    </Field>
);

// Disabled
export const Disabled: StoryFn<typeof Radio> = () => (
    <Stack gap="condensed">
        <Field id="disabled-choice" label="Disabled">
            <Radio id="disabled-choice" name="disabled-choices" value="one" disabled />
        </Field>
        <Field id="disabled-checked-choice" label="Disabled and checked">
            <Radio
                id="disabled-checked-choice"
                name="disabled-checked-choices"
                value="two"
                disabled
                defaultChecked
            />
        </Field>
    </Stack>
);

// Required
export const Required: StoryFn<typeof Radio> = () => (
    <Field id="required-choice" label="Required">
        <Radio id="required-choice" name="required-choices" value="one" required />
    </Field>
);

// A Named Set, where the browser lets only one of them be checked
export const NamedSet: StoryFn<typeof Radio> = () => {
    const [selected, setSelected] = React.useState("one");
    const values = ["one", "two", "three"];

    return (
        <Stack gap="condensed">
            {values.map((value) => (
                <Field key={value} id={`named-${value}`} label={`Choice ${value}`}>
                    <Radio
                        id={`named-${value}`}
                        name="named-choices"
                        value={value}
                        checked={selected === value}
                        onChange={(event) => setSelected(event.currentTarget.value)}
                    />
                </Field>
            ))}
        </Stack>
    );
};
