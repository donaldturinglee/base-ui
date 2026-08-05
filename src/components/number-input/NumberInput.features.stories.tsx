import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { FormControl } from "../form-control";
import { Text } from "../text";
import { NumberInput } from ".";
import type { TextInputSize } from "../text-input/TextInput.types";

const classes = {
    // Gives the fields a container to lay themselves out against
    container: "w-[16rem]",
    // Sets one field apart from the next where several are shown together
    stack: "flex flex-col gap-[var(--base-size-16)]",
    muted: "text-[var(--foreground-color-muted)]",
};

const sizes: TextInputSize[] = ["small", "medium", "large"];

export default {
    title: "Components/NumberInput/Features",
};

// Held Between Two Ends, where the stepper stops rather than running past them
export const WithARange: StoryFn<typeof NumberInput> = () => (
    <div className={`${classes.container} ${classes.stack}`}>
        <NumberInput aria-label="At the floor" defaultValue={0} min={0} max={10} />
        <NumberInput aria-label="Between the two" defaultValue={5} min={0} max={10} />
        <NumberInput aria-label="At the ceiling" defaultValue={10} min={0} max={10} />
    </div>
);

// Stepping By Something Other Than One, which the arrow keys follow as well as the stepper
export const WithAStep: StoryFn<typeof NumberInput> = () => (
    <div className={`${classes.container} ${classes.stack}`}>
        <NumberInput aria-label="In fives" defaultValue={0} step={5} />
        <NumberInput aria-label="In tenths" defaultValue={0.5} step={0.1} min={0} max={1} />
    </div>
);

// The Sizes A Field Comes In, which the stepper is sized to match
export const Sizes: StoryFn<typeof NumberInput> = () => (
    <div className={`${classes.container} ${classes.stack}`}>
        {sizes.map((size) => (
            <NumberInput key={size} aria-label={size} size={size} defaultValue={1} min={0} />
        ))}
    </div>
);

// Without The Stepper, for a field with a range too wide to be worth stepping through
export const WithoutTheStepper: StoryFn<typeof NumberInput> = () => (
    <div className={classes.container}>
        <NumberInput aria-label="Year" defaultValue={2026} min={1900} max={2100} hideStepper />
    </div>
);

// With A Unit Beside It, which the field carries the way any other field carries a visual
export const WithVisuals: StoryFn<typeof NumberInput> = () => (
    <div className={`${classes.container} ${classes.stack}`}>
        <NumberInput aria-label="Price" leadingVisual="$" defaultValue={20} min={0} />
        <NumberInput aria-label="Weight" trailingVisual="kg" defaultValue={5} min={0} />
    </div>
);

// Validation Statuses, drawn on the field the way they are on any other
export const ValidationStatuses: StoryFn<typeof NumberInput> = () => (
    <div className={`${classes.container} ${classes.stack}`}>
        <NumberInput aria-label="Too many" defaultValue={11} max={10} validationStatus="error" />
        <NumberInput aria-label="Just right" defaultValue={5} max={10} validationStatus="success" />
    </div>
);

// Turned Off, which closes the stepper along with the field
export const Disabled: StoryFn<typeof NumberInput> = () => (
    <div className={`${classes.container} ${classes.stack}`}>
        <NumberInput aria-label="Turned off" defaultValue={3} disabled />
        <NumberInput aria-label="Read only" defaultValue={3} readOnly />
    </div>
);

// Named By A Form Control, which is how one of these is labelled on a form
export const WithAFormControl: StoryFn<typeof NumberInput> = () => (
    <div className={classes.container}>
        <FormControl>
            <FormControl.Label>Quantity</FormControl.Label>
            <NumberInput defaultValue={1} min={1} max={99} />
            <FormControl.Caption>Up to ninety-nine at a time</FormControl.Caption>
        </FormControl>
    </div>
);

// Controlled, where the caller keeps hold of the number
export const Controlled: StoryFn<typeof NumberInput> = () => {
    const [quantity, setQuantity] = React.useState<number | null>(1);

    return (
        <div className={`${classes.container} ${classes.stack}`}>
            <NumberInput
                aria-label="Quantity"
                value={quantity}
                onChange={setQuantity}
                min={0}
                max={10}
            />
            <Text size="small" className={classes.muted}>
                Holding: {quantity === null ? "nothing" : quantity}
            </Text>
        </div>
    );
};
