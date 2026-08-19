import type * as React from "react";

export type NativeSelectSize = "small" | "medium" | "large";

export type NativeSelectValidationStatus = "error" | "success";

// `size` is dropped because the native attribute takes a row count, and `multiple` because
// a list box cannot carry this styling
export type NativeSelectProps = Omit<
    React.ComponentPropsWithoutRef<"select">,
    "size" | "multiple"
> & {
    size?: NativeSelectSize;
    block?: boolean;
    validationStatus?: NativeSelectValidationStatus;
    placeholder?: string;
    className?: string;
};

export type NativeSelectOptionProps = React.ComponentPropsWithoutRef<"option"> & {
    value: string;
    className?: string;
};

export type NativeSelectOptGroupProps = React.ComponentPropsWithoutRef<"optgroup"> & {
    className?: string;
};
