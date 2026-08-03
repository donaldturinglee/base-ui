import * as React from "react";
import { ChevronUpDownRegular } from "@gamecrafters/base-ui-icons";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { SelectProps, SelectSize, SelectValidationStatus } from "./Select.types";

const classes = {
    select: "select-control",
    indicator: "select-indicator",
};

const selectFieldVariants = cva("select", {
    variants: {
        size: {
            small: "select-small",
            medium: "select-medium",
            large: "select-large",
        } satisfies Record<SelectSize, string>,
        block: {
            true: "select-block",
            false: "",
        },
        disabled: {
            true: "select-disabled",
            false: "",
        },
        validation: {
            error: "select-error",
            success: "select-success",
        } satisfies Record<SelectValidationStatus, string>,
    },
});

function Select(
    props: SelectProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        placeholder,
        size = "medium",
        block,
        disabled,
        required,
        validationStatus,
        defaultValue,
        ...rest
    } = props;

    // A controlled select brings its own value, so handing it a default would only warn
    const isControlled = "value" in rest;

    return (
        <span
            className={classNames(
                selectFieldVariants({
                    size,
                    block,
                    disabled,
                    validation: validationStatus,
                }),
                className,
            )}
            data-component="Select"
            data-size={size}
            data-block={block}
            data-disabled={disabled}
            data-validation={validationStatus}
        >
            <select
                ref={ref}
                disabled={disabled}
                required={required}
                aria-invalid={validationStatus === "error" ? true : undefined}
                className={classes.select}
                // A required placeholder cannot be chosen, so it only stands in until the
                // reader picks something real
                defaultValue={
                    isControlled ? undefined : (defaultValue ?? (placeholder ? "" : undefined))
                }
                data-has-placeholder={Boolean(placeholder) || undefined}
                {...rest}
            >
                {placeholder ? (
                    <option
                        value=""
                        disabled={required}
                        hidden={required}
                        data-component="Select.Option"
                    >
                        {placeholder}
                    </option>
                ) : null}
                {children}
            </select>
            <ChevronUpDownRegular className={classes.indicator} aria-hidden="true" />
        </span>
    );
}

Select.displayName = "Select";

export default fixedForwardRef(Select);
