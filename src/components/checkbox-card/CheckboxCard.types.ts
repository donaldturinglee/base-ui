import type * as React from "react";

export type CheckboxCardValidationStatus = "error" | "success";

// The native `onChange` is dropped so it cannot intersect with the card's own, which reports a
// change on the checkbox inside the card rather than on the label around it
export type CheckboxCardProps = Omit<React.ComponentPropsWithoutRef<"label">, "onChange"> & {
    // Identifies this card on submission and in its group's selection. A checkbox stands on its
    // own rather than against its siblings, so it is submitted under this name as well
    value: string;
    // Whether this is a card that has been ticked, where the caller keeps hold of the answer
    checked?: boolean;
    // Whether the card starts out ticked, where the checkbox keeps hold of the answer itself
    defaultChecked?: boolean;
    // Draws the card as neither ticked nor cleared, for a card that stands for a set of answers
    // only some of which have been given
    indeterminate?: boolean;
    // Stops the card being ticked. A card inside a disabled CheckboxGroup is stopped along with it
    disabled?: boolean;
    required?: boolean;
    // Draws the card's border in the colour of the answer, and informs the ARIA attributes
    validationStatus?: CheckboxCardValidationStatus;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    className?: string;
};

export type CheckboxCardLabelProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type CheckboxCardDescriptionProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type CheckboxCardLeadingVisualProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

// The ids the checkbox is already pointing at, so that the name and the line below it take them
// rather than naming ids of their own
export type CheckboxCardContextValue = {
    labelId?: string;
    descriptionId?: string;
};
