import type * as React from "react";

export type RadioCardValidationStatus = "error" | "success";

// The native `onChange` is dropped so it cannot intersect with the card's own, which reports a
// change on the radio inside the card rather than on the label around it
export type RadioCardProps = Omit<React.ComponentPropsWithoutRef<"label">, "onChange"> & {
    // Identifies this card on submission and as its group's selection
    value: string;
    // Ties the card to its siblings, so the browser only lets one of them be checked. A card
    // inside a RadioGroup takes the group's name when this is left out
    name?: string;
    // Whether this is the card that has been picked, where the caller keeps hold of the choice
    checked?: boolean;
    // Whether the card starts out picked, where the radio keeps hold of the choice itself
    defaultChecked?: boolean;
    // Stops the card being picked. A card inside a disabled RadioGroup is stopped along with it
    disabled?: boolean;
    required?: boolean;
    // Draws the card's border in the colour of the answer, and informs the ARIA attributes
    validationStatus?: RadioCardValidationStatus;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    className?: string;
};

export type RadioCardLabelProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type RadioCardDescriptionProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type RadioCardLeadingVisualProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

// The ids the radio is already pointing at, so that the name and the line below it take them
// rather than naming ids of their own
export type RadioCardContextValue = {
    labelId?: string;
    descriptionId?: string;
};
