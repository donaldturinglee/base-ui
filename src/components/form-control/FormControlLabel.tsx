import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { FormControlContext } from "./FormControlContext";
import type { FormControlLabelElement, FormControlLabelProps } from "./FormControl.types";

const classes = {
    root: "form-control-label",
    disabled: "form-control-label-disabled",
    hidden: "sr-only",
    required: "form-control-label-required",
};

function FormControlLabel<As extends FormControlLabelElement = "label">(
    props: FormControlLabelProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "label",
        className,
        children,
        htmlFor,
        id,
        visuallyHidden,
        requiredIndicator = true,
        requiredText,
        ...rest
    } = props as FormControlLabelProps<"label">;

    const { id: controlId, disabled, required, labelId } = React.useContext(FormControlContext);

    return (
        <Component
            ref={ref}
            id={id ?? labelId}
            // A legend or a span names whatever stands around it rather than pointing at a
            // control, so neither is given anything to point at
            htmlFor={Component === "label" ? (htmlFor ?? controlId) : undefined}
            className={classNames(
                classes.root,
                disabled && classes.disabled,
                visuallyHidden && classes.hidden,
                className,
            )}
            data-component="FormControl.Label"
            data-control-disabled={disabled}
            {...rest}
        >
            {required || requiredText ? (
                <span className={classes.required}>
                    <span>{children}</span>
                    {/* The mark is taken out of the accessibility tree where the field is
                        already spoken for elsewhere, a note above the form say */}
                    <span aria-hidden={requiredIndicator ? undefined : true}>
                        {requiredText ?? "*"}
                    </span>
                </span>
            ) : (
                children
            )}
        </Component>
    );
}

FormControlLabel.displayName = "FormControl.Label";

export default fixedForwardRef(FormControlLabel);
