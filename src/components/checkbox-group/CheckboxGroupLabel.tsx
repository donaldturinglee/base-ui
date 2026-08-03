import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CheckboxGroupContext } from "./CheckboxGroupContext";
import type { CheckboxGroupLabelProps } from "./CheckboxGroup.types";

const classes = {
    root: "checkbox-group-label",
    disabled: "checkbox-group-label-disabled",
    hidden: "sr-only",
    required: "checkbox-group-label-required",
};

function CheckboxGroupLabel(
    props: CheckboxGroupLabelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, visuallyHidden, ...rest } = props;
    const { disabled, required } = React.useContext(CheckboxGroupContext);

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
            data-component="CheckboxGroup.Label"
            data-label-disabled={disabled}
            {...rest}
        >
            {children}
            {required ? <span className={classes.required}>*</span> : null}
        </span>
    );
}

CheckboxGroupLabel.displayName = "CheckboxGroup.Label";

export default fixedForwardRef(CheckboxGroupLabel);
