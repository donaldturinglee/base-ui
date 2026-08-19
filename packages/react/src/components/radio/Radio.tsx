import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { RadioGroupContext } from "../radio-group/RadioGroupContext";
import type { RadioProps } from "./Radio.types";

const classes = {
    root: "radio",
    checked: "radio-checked",
    disabled: "radio-disabled",
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
            className={classNames(classes.root, classes.checked, classes.disabled, className)}
            data-component="Radio"
            {...rest}
        />
    );
}

Radio.displayName = "Radio";

export default fixedForwardRef(Radio);
