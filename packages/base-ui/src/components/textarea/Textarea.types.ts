import type * as React from "react";

export type TextareaResize = "none" | "both" | "horizontal" | "vertical";

export type TextareaValidationStatus = "error" | "success";

export type TextareaProps = React.ComponentPropsWithoutRef<"textarea"> & {
    validationStatus?: TextareaValidationStatus;
    resize?: TextareaResize;
    block?: boolean;
    // Recesses the field against the page, for use on a raised surface
    contrast?: boolean;
    minHeight?: number;
    maxHeight?: number;
    // Shows a counter below the field, and reports an error once it is passed
    characterLimit?: number;
    className?: string;
};
