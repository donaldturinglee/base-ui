import * as React from "react";
import { CheckmarkCircleRegular, ErrorCircleRegular } from "@gamecrafters/base-ui-icons";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { FormControlContext } from "./FormControlContext";
import type { FormControlValidationProps, FormControlValidationStatus } from "./FormControl.types";

const icons = {
    success: CheckmarkCircleRegular,
    error: ErrorCircleRegular,
} satisfies Record<FormControlValidationStatus, React.ElementType>;

const classes = {
    icon: "form-control-validation-icon",
};

const formControlValidationVariants = cva("form-control-validation", {
    variants: {
        variant: {
            success: "form-control-validation-success",
            error: "form-control-validation-error",
        } satisfies Record<FormControlValidationStatus, string>,
    },
});

function FormControlValidation(
    props: FormControlValidationProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, variant, id, ...rest } = props;
    const { validationMessageId } = React.useContext(FormControlContext);
    const Icon = icons[variant];

    return (
        <span
            ref={ref}
            className={classNames(formControlValidationVariants({ variant }), className)}
            data-component="FormControl.Validation"
            data-validation-status={variant}
            {...rest}
        >
            {/* The icon stands in a box of its own, so it is held to a line of the message
                beside it rather than to the size the icon happens to come at */}
            <span
                className={classes.icon}
                data-component="FormControl.Validation.Icon"
                aria-hidden="true"
            >
                <Icon />
            </span>
            {/* The id sits on the message rather than the row, so what describes the input is
                the wording alone and not the icon beside it */}
            <span id={id ?? validationMessageId}>{children}</span>
        </span>
    );
}

FormControlValidation.displayName = "FormControl.Validation";

export default fixedForwardRef(FormControlValidation);
