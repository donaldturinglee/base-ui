import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Textarea } from ".";

const classes = {
    // Gives the block story a container to fill
    container: "w-[25rem]",
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
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor={id}>
            {label}
        </Text>
        {children}
    </Stack>
);

export default {
    title: "Components/Textarea/Features",
    parameters: {
        layout: "centered",
    },
};

// Resize Scale
export const ResizeScale: StoryFn<typeof Textarea> = () => (
    <Stack gap="normal">
        {(["none", "both", "horizontal", "vertical"] as const).map((resize) => (
            <Field key={resize} id={`${resize}-notes`} label={`resize="${resize}"`}>
                <Textarea id={`${resize}-notes`} resize={resize} rows={3} />
            </Field>
        ))}
    </Stack>
);

// Block
export const Block: StoryFn<typeof Textarea> = () => (
    <div className={classes.container}>
        <Field id="block-notes" label="Notes">
            <Textarea id="block-notes" block rows={3} />
        </Field>
    </div>
);

// Contrast
export const Contrast: StoryFn<typeof Textarea> = () => (
    <Field id="contrast-notes" label="Notes">
        <Textarea id="contrast-notes" contrast rows={3} />
    </Field>
);

// Validation Error
export const ValidationError: StoryFn<typeof Textarea> = () => (
    <Field id="error-notes" label="Notes">
        <Textarea id="error-notes" validationStatus="error" rows={3} />
    </Field>
);

// Validation Success
export const ValidationSuccess: StoryFn<typeof Textarea> = () => (
    <Field id="success-notes" label="Notes">
        <Textarea id="success-notes" validationStatus="success" rows={3} />
    </Field>
);

// Disabled
export const Disabled: StoryFn<typeof Textarea> = () => (
    <Field id="disabled-notes" label="Notes">
        <Textarea id="disabled-notes" disabled rows={3} defaultValue="You cannot change this" />
    </Field>
);

// Minimum And Maximum Height
export const MinimumAndMaximumHeight: StoryFn<typeof Textarea> = () => (
    <Field id="height-notes" label="Notes">
        <Textarea id="height-notes" minHeight={80} maxHeight={160} resize="vertical" />
    </Field>
);

// Character Limit, which counts down and reports an error once it is passed
export const CharacterLimit: StoryFn<typeof Textarea> = () => (
    <Field id="limit-notes" label="Notes">
        <Textarea id="limit-notes" characterLimit={50} rows={3} />
    </Field>
);

// Character Limit Passed
export const CharacterLimitPassed: StoryFn<typeof Textarea> = () => (
    <Field id="over-notes" label="Notes">
        <Textarea
            id="over-notes"
            characterLimit={10}
            rows={3}
            defaultValue="This is rather longer than the limit allows"
        />
    </Field>
);
