import type * as React from "react";
import type { AnchorAlignment, AnchorSide } from "../tooltip/anchoredPosition";

export type SelectSize = "small" | "medium" | "large";

export type SelectValidationStatus = "error" | "success";

// What the field needs of an option to stand in for it while the list is closed, and to move
// between the options with the keyboard. The options are read off what the caller wrote rather
// than reported by themselves, since the field has to know what it is showing before the list
// has ever been opened for an option to report anything
export type SelectOptionEntry = {
    value: string;
    label: React.ReactNode;
    // What the option reads as, which is what typing at the field is matched against
    text: string;
    disabled: boolean;
};

// `value`, `defaultValue` and `onChange` are the field's own rather than the button's, since
// what is picked is one of the options rather than anything the button carries. `size` is
// dropped because it is a length on a button, and `type` because the button only ever opens
// the list
export type SelectProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "size" | "value" | "defaultValue" | "onChange" | "type"
> & {
    size?: SelectSize;
    block?: boolean;
    validationStatus?: SelectValidationStatus;
    // Stands in for the choice until one is made
    placeholder?: string;
    // What is picked, for a field the caller is holding the value of
    value?: string;
    // What is picked to begin with, for one that is not
    defaultValue?: string;
    // Called with the value picked
    onChange?: (value: string) => void;
    // The name the choice is submitted under with the form the field stands in
    name?: string;
    // Says a choice has to be made, which a caller checks for itself
    required?: boolean;
    // Whether the list is showing. Left out, the field keeps its own state
    open?: boolean;
    // Whether the list starts showing, for a field the caller is not holding the state of
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    // Which edge of the field the list stands off
    side?: AnchorSide;
    // Where along that edge it lines up
    align?: AnchorAlignment;
    className?: string;
};

export type SelectOptionProps = React.ComponentPropsWithoutRef<"div"> & {
    // What the field is left holding once the option is picked
    value: string;
    disabled?: boolean;
    className?: string;
};

export type SelectOptGroupProps = React.ComponentPropsWithoutRef<"div"> & {
    // Names the run of options standing under it
    label: string;
    // Marks every option in the group as one that cannot be picked
    disabled?: boolean;
    className?: string;
};

export type SelectOptGroupContextValue = {
    // Said once by the group rather than written onto each option, so that it reaches every
    // option under it however deeply the caller nested them
    disabled?: boolean;
};

export type SelectContextValue = {
    size?: SelectSize;
    // What is picked, and what picking an option does
    value?: string;
    onSelect?: (value: string) => void;
    // The option the arrow keys are resting on, which is the one Enter takes
    activeValue?: string;
    setActiveValue?: (value: string) => void;
    // An option is pointed at by an id of the list's own rather than one of its own, so that
    // two fields offering the same options do not both lay claim to the same element
    getOptionId?: (value: string) => string | undefined;
};
