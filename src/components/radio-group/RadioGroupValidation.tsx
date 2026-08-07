import * as React from "react";
import { CheckmarkCircleRegular, ErrorCircleRegular } from "@gamecrafters/base-ui-icons";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { RadioGroupContext } from "./RadioGroupContext";
import type { RadioGroupValidationProps, RadioGroupValidationStatus } from "./RadioGroup.types";

const icons = {
    success: CheckmarkCircleRegular,
    error: ErrorCircleRegular,
} satisfies Record<RadioGroupValidationStatus, React.ElementType>;

const classes = {
    icon: "radio-group-validation-icon",
};

const radioGroupValidationVariants = cva("radio-group-validation", {
    variants: {
        variant: {
            success: "radio-group-validation-success",
            error: "radio-group-validation-error",
        } satisfies Record<RadioGroupValidationStatus, string>,
    },
});

function RadioGroupValidation(
    props: RadioGroupValidationProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, variant, ...rest } = props;
    const { validationMessageId } = React.useContext(RadioGroupContext);
    const Icon = icons[variant];

    return (
        <span
            ref={ref}
            className={classNames(radioGroupValidationVariants({ variant }), className)}
            data-component="RadioGroup.Validation"
            data-validation-status={variant}
            {...rest}
        >
            <Icon className={classes.icon} aria-hidden="true" />
            <span id={validationMessageId}>{children}</span>
        </span>
    );
}

RadioGroupValidation.displayName = "RadioGroup.Validation";

export default fixedForwardRef(RadioGroupValidation);
