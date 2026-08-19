import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Select } from ".";

const classes = {
    // Gives the block story a container to fill
    container: "w-[20rem]",
};

const choices = (
    <>
        <Select.Option value="one">Choice one</Select.Option>
        <Select.Option value="two">Choice two</Select.Option>
        <Select.Option value="three">Choice three</Select.Option>
    </>
);

const Field = ({
    id,
    label,
    children,
}: {
    id: string;
    label: string;
    children: React.ReactNode;
}) => (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor={id}>
            {label}
        </Text>
        {children}
    </Stack>
);

export default {
    title: "Components/Select/Features",
    parameters: {
        layout: "centered",
    },
};

// With Placeholder
export const WithPlaceholder: StoryFn<typeof Select> = () => (
    <Field id="placeholder-choice" label="Choice">
        <Select id="placeholder-choice" placeholder="Pick a choice">
            {choices}
        </Select>
    </Field>
);

// With A Default Value
export const WithDefaultValue: StoryFn<typeof Select> = () => (
    <Field id="default-value-choice" label="Choice">
        <Select id="default-value-choice" defaultValue="two">
            {choices}
        </Select>
    </Field>
);

// Controlled, where the caller holds what has been picked
export const Controlled: StoryFn<typeof Select> = () => {
    const [value, setValue] = React.useState("one");

    return (
        <Stack gap="normal">
            <Field id="controlled-choice" label="Choice">
                <Select id="controlled-choice" value={value} onChange={setValue}>
                    {choices}
                </Select>
            </Field>
            <Text>Picked: {value}</Text>
        </Stack>
    );
};

// Grouped Options
export const GroupedOptions: StoryFn<typeof Select> = () => (
    <Field id="grouped-choice" label="Choice">
        <Select id="grouped-choice" placeholder="Pick a choice">
            <Select.OptGroup label="Group one">
                <Select.Option value="one">Choice one</Select.Option>
                <Select.Option value="two">Choice two</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="Group two">
                <Select.Option value="three">Choice three</Select.Option>
                <Select.Option value="four">Choice four</Select.Option>
            </Select.OptGroup>
        </Select>
    </Field>
);

// Disabled Options, which are passed over rather than picked
export const DisabledOptions: StoryFn<typeof Select> = () => (
    <Field id="disabled-options-choice" label="Choice">
        <Select id="disabled-options-choice" placeholder="Pick a choice">
            <Select.Option value="one">Choice one</Select.Option>
            <Select.Option value="two" disabled>
                Choice two
            </Select.Option>
            <Select.Option value="three">Choice three</Select.Option>
        </Select>
    </Field>
);

// Size Scale
export const SizeScale: StoryFn<typeof Select> = () => (
    <Stack gap="normal">
        {(["small", "medium", "large"] as const).map((size) => (
            <Field key={size} id={`${size}-choice`} label={`size="${size}"`}>
                <Select id={`${size}-choice`} size={size} placeholder="Pick a choice">
                    {choices}
                </Select>
            </Field>
        ))}
    </Stack>
);

// Block
export const Block: StoryFn<typeof Select> = () => (
    <div className={classes.container}>
        <Field id="block-choice" label="Choice">
            <Select id="block-choice" block placeholder="Pick a choice">
                {choices}
            </Select>
        </Field>
    </div>
);

// Validation Error
export const ValidationError: StoryFn<typeof Select> = () => (
    <Field id="error-choice" label="Choice">
        <Select id="error-choice" validationStatus="error" placeholder="Pick a choice">
            {choices}
        </Select>
    </Field>
);

// Validation Success
export const ValidationSuccess: StoryFn<typeof Select> = () => (
    <Field id="success-choice" label="Choice">
        <Select id="success-choice" validationStatus="success" defaultValue="one">
            {choices}
        </Select>
    </Field>
);

// Disabled
export const Disabled: StoryFn<typeof Select> = () => (
    <Field id="disabled-choice" label="Choice">
        <Select id="disabled-choice" disabled placeholder="Pick a choice">
            {choices}
        </Select>
    </Field>
);
