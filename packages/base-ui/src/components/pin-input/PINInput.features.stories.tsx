import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { FormControl } from "../form-control";
import { Text } from "../text";
import { PINInput } from ".";
import type { TextInputSize } from "../text-input/TextInput.types";

const classes = {
    // Sets one group apart from the next where several are shown together
    stack: "flex flex-col gap-[var(--base-size-16)]",
    field: "flex flex-col gap-[var(--base-size-8)]",
    muted: "text-[var(--foreground-color-muted)]",
};

const sizes: TextInputSize[] = ["small", "medium", "large"];

export default {
    title: "Components/PINInput/Features",
};

// As Many Boxes As The Code Is Long
export const Lengths: StoryFn<typeof PINInput> = () => (
    <div className={classes.stack}>
        {[4, 6, 8].map((length) => (
            <PINInput key={length} aria-label={`${length} digits`} length={length} />
        ))}
    </div>
);

// The Sizes The Boxes Come In, which follow the sizes every other field comes in
export const Sizes: StoryFn<typeof PINInput> = () => (
    <div className={classes.stack}>
        {sizes.map((size) => (
            <PINInput key={size} aria-label={size} length={4} size={size} defaultValue="1234" />
        ))}
    </div>
);

// Taking Letters As Well, for a code that is not only digits
export const Alphanumeric: StoryFn<typeof PINInput> = () => (
    <PINInput aria-label="Recovery code" length={6} type="alphanumeric" defaultValue="A1B2C3" />
);

// Held Back, for a code that should not be read over a shoulder
export const Masked: StoryFn<typeof PINInput> = () => (
    <PINInput aria-label="PIN" length={4} mask defaultValue="1234" />
);

// Validation Statuses, drawn on the boxes the way they are on any other field
export const ValidationStatuses: StoryFn<typeof PINInput> = () => (
    <div className={classes.stack}>
        <PINInput aria-label="Wrong code" length={4} defaultValue="1234" validationStatus="error" />
        <PINInput
            aria-label="Right code"
            length={4}
            defaultValue="1234"
            validationStatus="success"
        />
    </div>
);

// Turned Off, which closes every box together
export const Disabled: StoryFn<typeof PINInput> = () => (
    <PINInput aria-label="Verification code" length={4} defaultValue="12" disabled />
);

// Named By A Form Control, which is how one of these is labelled on a form
export const WithAFormControl: StoryFn<typeof PINInput> = () => (
    <FormControl>
        <FormControl.Label>Verification code</FormControl.Label>
        <PINInput length={6} autoComplete="one-time-code" />
        <FormControl.Caption>The six digits we have just sent you</FormControl.Caption>
    </FormControl>
);

// Controlled, where the caller keeps hold of the code and is told once it is finished
export const Controlled: StoryFn<typeof PINInput> = () => {
    const [code, setCode] = React.useState("");
    const [finished, setFinished] = React.useState<string | null>(null);

    return (
        <div className={classes.field}>
            <PINInput
                aria-label="Verification code"
                length={4}
                value={code}
                onChange={(next) => {
                    setCode(next);
                    setFinished(null);
                }}
                onComplete={setFinished}
            />
            <Text size="small" className={classes.muted}>
                {finished ? `Finished: ${finished}` : `So far: ${code || "nothing"}`}
            </Text>
        </div>
    );
};
