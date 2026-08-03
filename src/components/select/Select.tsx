import * as React from "react";
import { ChevronUpDownRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { SelectProps, SelectSize, SelectValidationStatus } from "./Select.types";

const classes = {
    // The wrapper carries the field styling so the native control underneath can stay
    // transparent and keep its own dropdown behaviour. The indicator's size and inset live
    // here so the control below can reserve exactly the room it takes up
    field: "relative inline-flex items-stretch overflow-hidden align-middle rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-[color:var(--control-border-color-rest)] bg-background-default text-foreground-default [box-shadow:var(--shadow-inset)] [--select-indicator-size:var(--base-size-16)] [--select-indicator-inset:var(--base-size-4)] [&_select]:cursor-pointer forced-colors:[&_svg]:[fill:FieldText]",
    focus: "focus-within:border-border-accent-emphasis focus-within:outline-solid focus-within:outline-[length:var(--focus-outline-width)] focus-within:outline-[color:var(--focus-outline-color)] focus-within:-outline-offset-1",
    block: "flex w-full self-stretch",
    disabled:
        "text-foreground-disabled bg-[var(--control-background-color-disabled)] border-[color:var(--control-border-color-disabled)] [box-shadow:none] [&_select]:cursor-not-allowed forced-colors:[&_svg]:[fill:GrayText]",
    size: {
        small: "min-h-[var(--control-small-size)] py-[var(--control-small-padding-block)] leading-[var(--base-size-20)] [font-size:var(--text-body-size-small)]",
        medium: "min-h-[var(--control-medium-size)] leading-[var(--base-size-20)] [font-size:var(--text-body-size-medium)]",
        large: "min-h-[var(--control-large-size)] py-[var(--control-large-padding-block)] leading-[var(--base-size-20)] [font-size:var(--text-body-size-medium)]",
    } satisfies Record<SelectSize, string>,
    validation: {
        error: "border-border-danger-emphasis focus-within:border-[color:var(--control-border-color-danger)] focus-within:outline-[color:var(--control-border-color-danger)]",
        success: "border-background-success-emphasis",
    } satisfies Record<SelectValidationStatus, string>,
    // The 1px margins keep the field's inset focus outline from being covered, and the
    // inherited background is what Firefox reads to colour its own dropdown menu. The right
    // padding clears the indicator, so a long option never runs underneath it
    select: "w-full my-px ml-px pl-[var(--base-size-12)] pr-[calc(var(--select-indicator-inset)_+_var(--select-indicator-size)_+_var(--base-size-4))] border-0 outline-none appearance-none [font-size:inherit] [color:currentColor] [background-color:inherit] [border-radius:inherit] disabled:bg-transparent forced-colors:disabled:[background-color:-moz-combobox]",
    indicator:
        "absolute top-1/2 right-[var(--select-indicator-inset)] size-[var(--select-indicator-size)] -translate-y-1/2 pointer-events-none",
};

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
                classes.field,
                classes.size[size],
                classes.focus,
                block && classes.block,
                disabled && classes.disabled,
                // Last, so a field that is both disabled and invalid still reads as invalid
                validationStatus && classes.validation[validationStatus],
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
