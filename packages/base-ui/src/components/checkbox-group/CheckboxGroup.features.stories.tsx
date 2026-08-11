import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Text } from "../text";
import { Checkbox } from "../checkbox";
import { CheckboxGroup } from ".";

const classes = {
    field: "flex items-start gap-[var(--base-size-8)]",
};

const choices = ["one", "two", "three"];

const boxesWithPrefix = (prefix: string, checked?: string[]) =>
    choices.map((value) => (
        <div key={value} className={classes.field}>
            <Checkbox
                id={`${prefix}-${value}`}
                value={value}
                defaultChecked={checked?.includes(value)}
            />
            <Text as="label" htmlFor={`${prefix}-${value}`}>
                Choice {value}
            </Text>
        </div>
    ));

export default {
    title: "Components/CheckboxGroup/Features",
    parameters: {
        layout: "centered",
    },
};

// With Caption
export const WithCaption: StoryFn<typeof CheckboxGroup> = () => (
    <CheckboxGroup>
        <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
        <CheckboxGroup.Caption>Pick as many as you like</CheckboxGroup.Caption>
        {boxesWithPrefix("caption")}
    </CheckboxGroup>
);

// With Validation
export const WithValidation: StoryFn<typeof CheckboxGroup> = () => (
    <CheckboxGroup required>
        <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
        {boxesWithPrefix("validation")}
        <CheckboxGroup.Validation variant="error">Pick at least one</CheckboxGroup.Validation>
    </CheckboxGroup>
);

// With A Successful Validation
export const WithSuccessfulValidation: StoryFn<typeof CheckboxGroup> = () => (
    <CheckboxGroup>
        <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
        {boxesWithPrefix("success", ["one"])}
        <CheckboxGroup.Validation variant="success">That works</CheckboxGroup.Validation>
    </CheckboxGroup>
);

// Visually Hidden Label, which still names the group
export const VisuallyHiddenLabel: StoryFn<typeof CheckboxGroup> = () => (
    <CheckboxGroup>
        <CheckboxGroup.Label visuallyHidden>Choices</CheckboxGroup.Label>
        {boxesWithPrefix("hidden-label")}
    </CheckboxGroup>
);

// Disabled
export const Disabled: StoryFn<typeof CheckboxGroup> = () => (
    <CheckboxGroup disabled>
        <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
        {boxesWithPrefix("disabled", ["one"])}
    </CheckboxGroup>
);

// Starting Selection, reported back as it changes
export const StartingSelection: StoryFn<typeof CheckboxGroup> = () => {
    const [selected, setSelected] = React.useState<string[]>(["one", "two"]);

    return (
        <CheckboxGroup onChange={setSelected}>
            <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
            <CheckboxGroup.Caption>Selected: {selected.join(", ") || "none"}</CheckboxGroup.Caption>
            {boxesWithPrefix("selection", ["one", "two"])}
        </CheckboxGroup>
    );
};
