import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ComboboxContext } from "./ComboboxContext";
import type { ComboboxControlProps } from "./Combobox.types";

const classes = {
    root: "combobox-control",
    disabled: "combobox-control-disabled",
    invalid: "combobox-control-invalid",
};

// What the reader sees standing on the page: the field, and whatever buttons are put beside it.
// It is the control that carries the border and the ring rather than the field inside it, so
// that the field and the buttons read as the one thing rather than as a field with things
// standing after it. It is also what the list is placed against, since a list lining up with
// the typing area alone would stand short of the buttons at its end
function ComboboxControl(
    props: ComboboxControlProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;
    const combobox = React.useContext(ComboboxContext);
    const mergedRef = useMergedRefs(ref, combobox?.controlRef ?? null);

    if (!combobox) {
        return null;
    }

    return (
        <div
            ref={mergedRef}
            className={classNames(
                classes.root,
                combobox.disabled && classes.disabled,
                combobox.invalid && classes.invalid,
                className,
            )}
            data-component="Combobox.Control"
            data-open={combobox.open || undefined}
            data-disabled={combobox.disabled || undefined}
            data-readonly={combobox.readOnly || undefined}
            data-invalid={combobox.invalid || undefined}
            {...rest}
        >
            {children}
        </div>
    );
}

ComboboxControl.displayName = "Combobox.Control";

export default fixedForwardRef(ComboboxControl);
