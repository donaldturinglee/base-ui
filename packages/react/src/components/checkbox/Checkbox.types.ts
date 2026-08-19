import type * as React from "react";

export type CheckboxValidationStatus = "error" | "success";

export type CheckboxProps = Omit<React.ComponentPropsWithoutRef<"input">, "type" | "value"> & {
    indeterminate?: boolean;
    // Only informs the ARIA attributes: a single checkbox carries no validation styling of
    // its own, the group around it does
    validationStatus?: CheckboxValidationStatus;
    // Identifies this checkbox on submission and in the group's selection
    value?: string;
    className?: string;
};
