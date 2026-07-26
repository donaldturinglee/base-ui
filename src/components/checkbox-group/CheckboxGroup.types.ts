import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type CheckboxGroupValidationStatus = "error" | "success";

// The native `onChange` is dropped so it cannot intersect with the group's own, which
// reports the selection rather than a single event
export type CheckboxGroupProps<As extends React.ElementType = "fieldset"> = Omit<
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
    // Called with the values of every checked box whenever any of them changes
    onChange?: (selected: string[], event?: React.ChangeEvent<HTMLInputElement>) => void;
};

export type CheckboxGroupLabelProps = React.ComponentPropsWithoutRef<"span"> & {
    // Keeps the label in the accessibility tree while taking it off the screen
    visuallyHidden?: boolean;
    className?: string;
};

export type CheckboxGroupCaptionProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type CheckboxGroupValidationProps = React.ComponentPropsWithoutRef<"span"> & {
    variant: CheckboxGroupValidationStatus;
    className?: string;
};

export type CheckboxGroupContextValue = {
    disabled?: boolean;
    required?: boolean;
    captionId?: string;
    validationMessageId?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
};
