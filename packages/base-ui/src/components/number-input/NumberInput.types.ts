import type * as React from "react";
import type { TextInputProps } from "../text-input/TextInput.types";

// The field is a text input told to hold numbers, so everything that shapes a text input shapes
// this one too. What it takes over are the parts that only mean something for a number: what the
// field holds, how far a step moves it, and the ends it is held between. The trailing action is
// taken over because the stepper stands there
export type NumberInputProps = Omit<
    TextInputProps,
    | "type"
    | "value"
    | "defaultValue"
    | "min"
    | "max"
    | "step"
    | "onChange"
    | "characterLimit"
    | "trailingAction"
> & {
    // What the field holds, where the caller keeps hold of it. `null` is a field left empty
    value?: number | null;
    // What the field starts out holding, where it keeps hold of that itself
    defaultValue?: number;
    min?: number;
    max?: number;
    // How far one press of the stepper, or one press of an arrow key, moves the value
    step?: number;
    // Called with the number the field now holds, or `null` where it has been emptied. There is
    // no event to report where the stepper moved the value rather than the reader typing it
    onChange?: (value: number | null, event?: React.ChangeEvent<HTMLInputElement>) => void;
    // Leaves the field to typing and to the arrow keys, with no stepper drawn beside it
    hideStepper?: boolean;
    // The stepper carries arrows rather than words, so each half has to be named for a screen
    // reader
    incrementLabel?: string;
    decrementLabel?: string;
    className?: string;
};
