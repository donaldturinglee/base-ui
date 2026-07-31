import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// The direction the field's parts flow. A checkbox or a radio always reads across, whatever
// this is set to, since the box has to stand beside the name it belongs to
export type FormControlLayout = "horizontal" | "vertical";

export type FormControlValidationStatus = "error" | "success";

// A `legend` names a fieldset, and a `span` names something that is not a form input at all,
// a SegmentedControl say. Neither points at a control, so neither takes a `htmlFor`
export type FormControlLabelElement = "label" | "legend" | "span";

export type FormControlProps = React.ComponentPropsWithoutRef<"div"> & {
    // Whether the field allows user input
    disabled?: boolean;
    // Ties the label, the caption and the validation message to the input. One is made where
    // the caller does not give one
    id?: string;
    // Whether a value has to be given before the owning form can be submitted
    required?: boolean;
    layout?: FormControlLayout;
    className?: string;
};

export type FormControlLabelProps<As extends FormControlLabelElement = "label"> = PolymorphicProps<
    As,
    "label",
    {
        // Keeps the label in the accessibility tree while taking it off the screen
        visuallyHidden?: boolean;
        // What stands beside the name of a required field
        requiredText?: string;
        // Whether the required text is read out as well as shown
        requiredIndicator?: boolean;
        className?: string;
    }
>;

export type FormControlCaptionProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type FormControlValidationProps = React.ComponentPropsWithoutRef<"span"> & {
    variant: FormControlValidationStatus;
    className?: string;
};

export type FormControlLeadingVisualProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type FormControlContextValue = {
    id?: string;
    disabled?: boolean;
    required?: boolean;
    captionId?: string;
    validationMessageId?: string;
    labelId?: string;
};

// What a field hands to the input it wraps, so the two are wired together without the caller
// having to repeat any of it
export type FormControlForwardedProps = {
    id?: string;
    disabled?: boolean;
    required?: boolean;
    "aria-describedby"?: string;
};

export type FormControlInputProps = FormControlForwardedProps & {
    validationStatus?: FormControlValidationStatus;
};
