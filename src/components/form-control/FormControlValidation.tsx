import * as React from "react";
import { CheckmarkCircleRegular, ErrorCircleRegular } from "@gamecrafters/base-ui-icons";
import { classNames, cva } from "../../utilities/classnames";
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
            <Icon className={classes.icon} aria-hidden="true" />
            {/* The id sits on the message rather than the row, so what describes the input is
                the wording alone and not the icon beside it */}
            <span id={id ?? validationMessageId}>{children}</span>
        </span>
    );
}

FormControlValidation.displayName = "FormControl.Validation";

export default fixedForwardRef(FormControlValidation);
