import * as React from "react";
import { CheckmarkCircleRegular, ErrorCircleRegular } from "@gamecrafters/base-ui-icons";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CheckboxGroupContext } from "./CheckboxGroupContext";
import type {
    CheckboxGroupValidationProps,
    CheckboxGroupValidationStatus,
} from "./CheckboxGroup.types";

const icons = {
    success: CheckmarkCircleRegular,
    error: ErrorCircleRegular,
} satisfies Record<CheckboxGroupValidationStatus, React.ElementType>;

const classes = {
    icon: "checkbox-group-validation-icon",
};

const checkboxGroupValidationVariants = cva("checkbox-group-validation", {
    variants: {
        variant: {
            success: "checkbox-group-validation-success",
            error: "checkbox-group-validation-error",
        } satisfies Record<CheckboxGroupValidationStatus, string>,
    },
});

function CheckboxGroupValidation(
    props: CheckboxGroupValidationProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, variant, ...rest } = props;
    const { validationMessageId } = React.useContext(CheckboxGroupContext);
    const Icon = icons[variant];

    return (
        <span
            ref={ref}
            className={classNames(checkboxGroupValidationVariants({ variant }), className)}
            data-component="CheckboxGroup.Validation"
            data-validation-status={variant}
            {...rest}
        >
            <Icon className={classes.icon} aria-hidden="true" />
            <span id={validationMessageId}>{children}</span>
        </span>
    );
}

CheckboxGroupValidation.displayName = "CheckboxGroup.Validation";

export default fixedForwardRef(CheckboxGroupValidation);
