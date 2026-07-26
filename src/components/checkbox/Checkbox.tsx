import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CheckboxGroupContext } from "../checkbox-group/CheckboxGroupContext";
import type { CheckboxProps } from "./Checkbox.types";

// The tick and the dash are masked over the filled box rather than drawn as elements,
// because an input cannot have children. They are set through a custom property so the
// data URIs stay out of the class strings
const marks = {
    checkmark:
        'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTEuNzgwMyAwLjIxOTYyNUMxMS45MjEgMC4zNjA0MjcgMTIgMC41NTEzMDUgMTIgMC43NTAzMTNDMTIgMC45NDkzMjEgMTEuOTIxIDEuMTQwMTkgMTEuNzgwMyAxLjI4MUw0LjUxODYgOC41NDA0MkM0LjM3Nzc1IDguNjgxIDQuMTg2ODIgOC43NiAzLjk4Nzc0IDguNzZDMy43ODg2NyA4Ljc2IDMuNTk3NzMgOC42ODEgMy40NTY4OSA4LjU0MDQyTDAuMjAxNjIyIDUuMjg2MkMwLjA2ODkyNzcgNS4xNDM4MyAtMC4wMDMzMDkwNSA0Ljk1NTU1IDAuMDAwMTE2NDkzIDQuNzYwOThDMC4wMDM1NTIwNSA0LjU2NjQzIDAuMDgyMzg5NCA0LjM4MDgxIDAuMjIwMDMyIDQuMjQzMjFDMC4zNTc2NjUgNC4xMDU2MiAwLjU0MzM1NSA0LjAyNjgxIDAuNzM3OTcgNC4wMjMzOEMwLjkzMjU4NCA0LjAxOTk0IDEuMTIwOTMgNC4wOTIxNyAxLjI2MzM0IDQuMjI0ODJMMy45ODc3NCA2Ljk0ODM1TDEwLjcxODYgMC4yMTk2MjVDMTAuODU5NSAwLjA3ODk5MjMgMTEuMDUwNCAwIDExLjI0OTUgMEMxMS40NDg1IDAgMTEuNjM5NSAwLjA3ODk5MjMgMTEuNzgwMyAwLjIxOTYyNVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=")',
    dash: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMiIgdmlld0JveD0iMCAwIDEwIDIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMCAxQzAgMC40NDc3MTUgMC40NDc3MTUgMCAxIDBIOUM5LjU1MjI5IDAgMTAgMC40NDc3MTUgMTAgMUMxMCAxLjU1MjI4IDkuNTUyMjkgMiA5IDJIMUMwLjQ0NzcxNSAyIDAgMS41NTIyOCAwIDFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K")',
};

const classes = {
    // The top margin centres the box against a 20px line of label text beside it
    root: "relative grid place-content-center size-[var(--base-size-16)] m-0 mt-[var(--base-size-2)] cursor-pointer appearance-none rounded-[var(--border-radius-small)] bg-[var(--background-color-default)] border-solid border-[length:var(--border-width-thin)] border-[color:var(--control-border-color-emphasis)] transition-[background-color,border-color] duration-[var(--motion-duration-micro)] ease-[var(--motion-easing-hover)]",
    mark: "before:content-[''] before:invisible before:size-[var(--base-size-16)] before:bg-[var(--foreground-color-on-emphasis)] before:[mask-image:var(--checkbox-mark)] before:[mask-size:75%] before:[mask-repeat:no-repeat] before:[mask-position:center]",
    // The fill doubles as the border colour so the box does not shift in dark high contrast
    checked:
        "checked:bg-[var(--control-checked-background-color-rest)] checked:border-[color:var(--control-checked-background-color-rest)] checked:before:visible indeterminate:bg-[var(--control-checked-background-color-rest)] indeterminate:border-[color:var(--control-checked-background-color-rest)] indeterminate:before:visible forced-colors:checked:bg-[canvastext] forced-colors:checked:border-[color:canvastext] forced-colors:indeterminate:bg-[canvastext] forced-colors:indeterminate:border-[color:canvastext]",
    disabled:
        "disabled:cursor-not-allowed disabled:bg-[var(--control-background-color-disabled)] disabled:border-[color:var(--control-border-color-disabled)] checked:disabled:bg-[var(--control-checked-background-color-disabled)] checked:disabled:border-[color:var(--control-checked-border-color-disabled)] checked:disabled:before:bg-[var(--control-checked-foreground-color-disabled)] indeterminate:disabled:bg-[var(--control-checked-background-color-disabled)] indeterminate:disabled:border-[color:var(--control-checked-border-color-disabled)] indeterminate:disabled:before:bg-[var(--control-checked-foreground-color-disabled)]",
    focus: "focus-visible:outline-solid focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[color:var(--focus-outline-color)] focus-visible:outline-offset-[var(--focus-outline-offset)]",
};

function Checkbox(
    props: CheckboxProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        style,
        checked,
        indeterminate,
        required,
        validationStatus,
        value,
        onChange,
        ...rest
    } = props;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRefs(ref, inputRef);
    const group = React.useContext(CheckboxGroupContext);

    // `indeterminate` is a property rather than an attribute, so it has to be set on the
    // element itself
    useIsomorphicLayoutEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate ?? false;
        }
    }, [indeterminate, checked]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        group.onChange?.(event);
        onChange?.(event);
    };

    return (
        <input
            ref={mergedRef}
            type="checkbox"
            // A part checked box is never also checked, but only where the caller is
            // controlling it: coercing an uncontrolled box would make it controlled, and
            // React warns as soon as `indeterminate` is cleared again
            checked={indeterminate && checked !== undefined ? false : checked}
            required={required}
            value={value}
            name={value}
            // A native checkbox reports checked and unchecked on its own; only the part
            // checked state has to be stated, and it would go stale if it were synced from
            // an effect, since an uncontrolled box does not re-render when it is clicked
            aria-checked={indeterminate ? "mixed" : undefined}
            aria-required={required ? true : undefined}
            aria-invalid={validationStatus === "error" ? true : undefined}
            onChange={handleChange}
            className={classNames(
                classes.root,
                classes.mark,
                classes.checked,
                classes.disabled,
                classes.focus,
                className,
            )}
            style={
                {
                    ...style,
                    "--checkbox-mark": indeterminate ? marks.dash : marks.checkmark,
                } as React.CSSProperties
            }
            data-component="Checkbox"
            {...rest}
        />
    );
}

Checkbox.displayName = "Checkbox";

export default fixedForwardRef(Checkbox);
