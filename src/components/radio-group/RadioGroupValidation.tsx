import * as React from "react";
import { CheckmarkCircleRegular, ErrorCircleRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { RadioGroupContext } from "./RadioGroupContext";
import type { RadioGroupValidationProps, RadioGroupValidationStatus } from "./RadioGroup.types";

const icons = {
    success: CheckmarkCircleRegular,
    error: ErrorCircleRegular,
} satisfies Record<RadioGroupValidationStatus, React.ElementType>;

const classes = {
    root: "flex [font-size:var(--text-body-size-small)] [font-weight:var(--base-text-weight-semibold)] [&_a]:underline [&_a]:[color:currentColor]",
    icon: "shrink-0 mt-[var(--base-size-2)] me-[var(--base-size-4)] size-[var(--base-size-12)]",
    variant: {
        success: "text-foreground-success",
        error: "text-foreground-danger",
    } satisfies Record<RadioGroupValidationStatus, string>,
};

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
            className={classNames(classes.root, classes.variant[variant], className)}
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
