import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type RadioGroupValidationStatus = "error" | "success";

// The native `onChange` is dropped so it cannot intersect with the group's own, which
// reports the selection rather than a single event
export type RadioGroupProps<As extends React.ElementType = "fieldset"> = Omit<
    PolymorphicProps<
        As,
        "fieldset",
        {
            disabled?: boolean;
            required?: boolean;
            className?: string;
        }
    >,
    "onChange"
> & {
    // Ties the radios together, so the browser only lets one of them be checked. Named here
    // rather than beside the rest, so it stays required whatever the group is rendered as
    name: string;
    // Called with the value of the radio that has just been checked. A radio group cannot be
    // cleared by clicking, so there is always a selection to report
    onChange?: (selected: string, event?: React.ChangeEvent<HTMLInputElement>) => void;
};

export type RadioGroupLabelProps = React.ComponentPropsWithoutRef<"span"> & {
    // Keeps the label in the accessibility tree while taking it off the screen
    visuallyHidden?: boolean;
    className?: string;
};

export type RadioGroupCaptionProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type RadioGroupValidationProps = React.ComponentPropsWithoutRef<"span"> & {
    variant: RadioGroupValidationStatus;
    className?: string;
};

export type RadioGroupContextValue = {
    name?: string;
    disabled?: boolean;
    required?: boolean;
    captionId?: string;
    validationMessageId?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
};
