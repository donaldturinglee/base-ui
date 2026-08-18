import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ComboboxContext } from "./ComboboxContext";
import type { ComboboxLabelProps } from "./Combobox.types";

const classes = {
    root: "combobox-label",
    disabled: "combobox-label-disabled",
};

// What the combobox is called. It names the field rather than the list, since the field is what
// a reader lands on and what carries the caret the whole time the list is being read
function ComboboxLabel(
    props: ComboboxLabelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;
    const combobox = React.useContext(ComboboxContext);

    if (!combobox) {
        return null;
    }

    return (
        <label
            ref={ref}
            id={combobox.labelId}
            htmlFor={combobox.inputId}
            className={classNames(classes.root, combobox.disabled && classes.disabled, className)}
            data-component="Combobox.Label"
            data-disabled={combobox.disabled || undefined}
            {...rest}
        >
            {children}
        </label>
    );
}

ComboboxLabel.displayName = "Combobox.Label";

export default fixedForwardRef(ComboboxLabel);
