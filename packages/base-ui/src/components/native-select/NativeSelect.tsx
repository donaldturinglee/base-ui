import * as React from "react";
import { ChevronUpDownRegular } from "@gamecrafters/base-ui-icons";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type {
    NativeSelectProps,
    NativeSelectSize,
    NativeSelectValidationStatus,
} from "./NativeSelect.types";

const classes = {
    select: "native-select-control",
    indicator: "native-select-indicator",
};

const nativeSelectFieldVariants = cva("native-select", {
    variants: {
        size: {
            small: "native-select-small",
            medium: "native-select-medium",
            large: "native-select-large",
        } satisfies Record<NativeSelectSize, string>,
        block: {
            true: "native-select-block",
            false: "",
        },
        disabled: {
            true: "native-select-disabled",
            false: "",
        },
        validation: {
            error: "native-select-error",
            success: "native-select-success",
        } satisfies Record<NativeSelectValidationStatus, string>,
    },
});

function NativeSelect(
    props: NativeSelectProps,
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
                nativeSelectFieldVariants({
                    size,
                    block,
                    disabled,
                    validation: validationStatus,
                }),
                className,
            )}
            data-component="NativeSelect"
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
                        data-component="NativeSelect.Option"
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

NativeSelect.displayName = "NativeSelect";

export default fixedForwardRef(NativeSelect);
