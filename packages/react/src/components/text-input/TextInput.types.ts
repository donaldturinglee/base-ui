import type * as React from "react";
import type { ButtonVisual } from "../button";

export type TextInputSize = "small" | "medium" | "large";

export type TextInputValidationStatus = "error" | "success";

// Where the spinner stands. "auto" puts it after the typing area, unless there is a leading
// visual for it to take the place of
export type TextInputLoaderPosition = "auto" | "leading" | "trailing";

// A visual is given either as the component to render, or as something already built: an
// element, or plain text such as a unit or a currency sign
export type TextInputVisual = React.ElementType | React.ReactNode;

// `size` is dropped because the native attribute takes a character count rather than a step
// of the control scale
export type TextInputProps = Omit<React.ComponentPropsWithoutRef<"input">, "size"> & {
    size?: TextInputSize;
    block?: boolean;
    // Recesses the field against the page, for use on a raised surface
    contrast?: boolean;
    monospace?: boolean;
    validationStatus?: TextInputValidationStatus;
    // Stands inside the field, before the typing area
    leadingVisual?: TextInputVisual;
    // Stands inside the field, after the typing area
    trailingVisual?: TextInputVisual;
    // Stands inside the field at the very end, and is the only part of it that can be
    // pressed. Built with TextInput.Action
    trailingAction?: React.ReactNode;
    loading?: boolean;
    loaderPosition?: TextInputLoaderPosition;
    // What a screen reader is told while the field is waiting
    loaderText?: string;
    // Shows a counter below the field, and reports an error once it is passed
    characterLimit?: number;
    className?: string;
};

// An icon carries no text of its own, so an action has to be named for a screen reader
type TextInputActionAccessibleName =
    | { "aria-label": string; "aria-labelledby"?: undefined }
    | { "aria-label"?: undefined; "aria-labelledby": string };

// An action is only ever an icon button, so there is nothing for a caller to put inside it
export type TextInputActionProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "aria-label" | "aria-labelledby" | "children"
> & {
    icon: NonNullable<ButtonVisual>;
    className?: string;
} & TextInputActionAccessibleName;
