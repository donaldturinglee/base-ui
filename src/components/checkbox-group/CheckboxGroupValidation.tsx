import * as React from "react";
import { CheckmarkCircleRegular, ErrorCircleRegular } from "@gamecrafters/base-ui-icons";
import { classNames, cva } from "../../utilities/classnames";
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
    icon: "shrink-0 mt-[var(--base-size-2)] me-[var(--base-size-4)] size-[var(--base-size-12)]",
};

const checkboxGroupValidationVariants = cva(
    "flex [font-size:var(--text-body-size-small)] [font-weight:var(--base-text-weight-semibold)] [&_a]:underline [&_a]:[color:currentColor]",
    {
        variants: {
            variant: {
                success: "text-foreground-success",
                error: "text-foreground-danger",
            } satisfies Record<CheckboxGroupValidationStatus, string>,
        },
    },
);

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
