import type * as React from "react";

export type RadioValidationStatus = "error" | "success";

export type RadioProps = Omit<React.ComponentPropsWithoutRef<"input">, "type" | "value"> & {
    // Identifies this radio on submission and as its group's selection
    value: string;
    // Ties the radio to its siblings, so the browser only lets one of them be checked. A
    // radio inside a RadioGroup takes the group's name when this is left out
    name?: string;
    // Only informs the ARIA attributes: a single radio carries no validation styling of its
    // own, the group around it does
    validationStatus?: RadioValidationStatus;
    className?: string;
};
