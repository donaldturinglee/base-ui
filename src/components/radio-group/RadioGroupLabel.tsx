import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { RadioGroupContext } from "./RadioGroupContext";
import type { RadioGroupLabelProps } from "./RadioGroup.types";

const classes = {
    root: "block [font-size:var(--text-body-size-medium)] [font-weight:var(--base-text-weight-semibold)]",
    disabled: "[color:var(--foreground-color-muted)]",
    hidden: "sr-only",
    required: "ms-[var(--base-size-4)]",
};

function RadioGroupLabel(
    props: RadioGroupLabelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, visuallyHidden, ...rest } = props;
    const { disabled, required } = React.useContext(RadioGroupContext);

    return (
        <span
            ref={ref}
            title={required ? "required field" : undefined}
            className={classNames(
                classes.root,
                disabled && classes.disabled,
                visuallyHidden && classes.hidden,
                className,
            )}
            data-component="RadioGroup.Label"
            data-label-disabled={disabled}
            {...rest}
        >
            {children}
            {required ? <span className={classes.required}>*</span> : null}
        </span>
    );
}

RadioGroupLabel.displayName = "RadioGroup.Label";

export default fixedForwardRef(RadioGroupLabel);
