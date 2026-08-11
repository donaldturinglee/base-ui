import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Text } from "../text";
import { Radio } from "../radio";
import { RadioGroup } from ".";

const classes = {
    field: "flex items-start gap-[var(--base-size-8)]",
};

const choices = ["one", "two", "three"];

const radiosWithPrefix = (prefix: string, checked?: string) =>
    choices.map((value) => (
        <div key={value} className={classes.field}>
            <Radio id={`${prefix}-${value}`} value={value} defaultChecked={checked === value} />
            <Text as="label" htmlFor={`${prefix}-${value}`}>
                Choice {value}
            </Text>
        </div>
    ));

export default {
    title: "Components/RadioGroup/Features",
    parameters: {
        layout: "centered",
    },
};

// With Caption
export const WithCaption: StoryFn<typeof RadioGroup> = () => (
    <RadioGroup name="caption-choices">
        <RadioGroup.Label>Choices</RadioGroup.Label>
        <RadioGroup.Caption>Pick one</RadioGroup.Caption>
        {radiosWithPrefix("caption")}
    </RadioGroup>
);

// With Validation
export const WithValidation: StoryFn<typeof RadioGroup> = () => (
    <RadioGroup name="validation-choices" required>
        <RadioGroup.Label>Choices</RadioGroup.Label>
        {radiosWithPrefix("validation")}
        <RadioGroup.Validation variant="error">Pick one</RadioGroup.Validation>
    </RadioGroup>
);

// With A Successful Validation
export const WithSuccessfulValidation: StoryFn<typeof RadioGroup> = () => (
    <RadioGroup name="success-choices">
        <RadioGroup.Label>Choices</RadioGroup.Label>
        {radiosWithPrefix("success", "one")}
        <RadioGroup.Validation variant="success">That works</RadioGroup.Validation>
    </RadioGroup>
);

// Visually Hidden Label, which still names the group
export const VisuallyHiddenLabel: StoryFn<typeof RadioGroup> = () => (
    <RadioGroup name="hidden-label-choices">
        <RadioGroup.Label visuallyHidden>Choices</RadioGroup.Label>
        {radiosWithPrefix("hidden-label")}
    </RadioGroup>
);

// Disabled
export const Disabled: StoryFn<typeof RadioGroup> = () => (
    <RadioGroup name="disabled-choices" disabled>
        <RadioGroup.Label>Choices</RadioGroup.Label>
        {radiosWithPrefix("disabled", "one")}
    </RadioGroup>
);

// Starting Selection, reported back as it changes
export const StartingSelection: StoryFn<typeof RadioGroup> = () => {
    const [selected, setSelected] = React.useState("one");

    return (
        <RadioGroup name="selection-choices" onChange={setSelected}>
            <RadioGroup.Label>Choices</RadioGroup.Label>
            <RadioGroup.Caption>Selected: {selected}</RadioGroup.Caption>
            {radiosWithPrefix("selection", "one")}
        </RadioGroup>
    );
};
