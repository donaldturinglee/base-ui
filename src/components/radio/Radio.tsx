import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { RadioGroupContext } from "../radio-group/RadioGroupContext";
import type { RadioProps } from "./Radio.types";

const classes = {
    // The top margin centres the circle against a 20px line of label text beside it
    root: "relative grid place-content-center size-[var(--base-size-16)] m-0 mt-[var(--base-size-2)] cursor-pointer appearance-none rounded-[var(--border-radius-full)] bg-[var(--background-color-default)] border-solid border-[length:var(--border-width-thin)] border-[color:var(--control-border-color-emphasis)] transition-[background-color,border-color] duration-micro ease-hover",
    // The dot is the fill left showing inside a thickened border rather than a mark of its
    // own, because an input cannot have children. The border doubles as the filled circle so
    // the shape does not shift in dark high contrast
    checked:
        "checked:bg-[var(--control-checked-foreground-color-rest)] checked:border-[color:var(--control-checked-background-color-rest)] checked:border-[length:var(--border-width-thicker)] forced-colors:checked:bg-[canvastext] forced-colors:checked:border-[color:canvastext]",
    disabled:
        "disabled:cursor-not-allowed disabled:bg-[var(--control-background-color-disabled)] disabled:border-[color:var(--control-border-color-disabled)] checked:disabled:bg-[var(--control-checked-foreground-color-disabled)] checked:disabled:border-[color:var(--control-checked-background-color-disabled)]",
    focus: "focus-visible:outline-solid focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[color:var(--focus-outline-color)] focus-visible:outline-offset-[var(--focus-outline-offset)]",
};

function Radio(
    props: RadioProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, name, required, validationStatus, value, onChange, ...rest } = props;

    const group = React.useContext(RadioGroupContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        group.onChange?.(event);
        onChange?.(event);
    };

    return (
        <input
            ref={ref}
            type="radio"
            value={value}
            // The name is what the browser groups on, so a radio standing on its own has to
            // be given one where there is no group around it to name it
            name={name ?? group.name}
            required={required}
            // A native radio reports checked and unchecked on its own, so nothing is stated
            // here: it would go stale as soon as an uncontrolled radio was clicked, since
            // that does not re-render it
            aria-required={required ? true : undefined}
            aria-invalid={validationStatus === "error" ? true : undefined}
            onChange={handleChange}
            className={classNames(
                classes.root,
                classes.checked,
                classes.disabled,
                classes.focus,
                className,
            )}
            data-component="Radio"
            {...rest}
        />
    );
}

Radio.displayName = "Radio";

export default fixedForwardRef(Radio);
