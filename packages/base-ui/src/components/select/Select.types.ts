import type * as React from "react";

export type SelectSize = "small" | "medium" | "large";

export type SelectValidationStatus = "error" | "success";

// `size` is dropped because the native attribute takes a row count, and `multiple` because
// a list box cannot carry this styling
export type SelectProps = Omit<React.ComponentPropsWithoutRef<"select">, "size" | "multiple"> & {
    size?: SelectSize;
    block?: boolean;
    validationStatus?: SelectValidationStatus;
    placeholder?: string;
    className?: string;
};

export type SelectOptionProps = React.ComponentPropsWithoutRef<"option"> & {
    value: string;
    className?: string;
};

export type SelectOptGroupProps = React.ComponentPropsWithoutRef<"optgroup"> & {
    className?: string;
};
