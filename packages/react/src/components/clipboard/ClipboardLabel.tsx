import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ClipboardContext } from "./ClipboardContext";
import type { ClipboardLabelProps } from "./Clipboard.types";

const classes = {
    root: "clipboard-label",
    disabled: "clipboard-label-disabled",
};

// What the value is called, set the way every other field's name is. It points at the field
// showing the value, so pressing the name puts the reader in it with the whole value selected
function ClipboardLabel<As extends React.ElementType = "label">(
    props: ClipboardLabelProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "label",
        className,
        htmlFor,
        ...rest
    } = props as ClipboardLabelProps<"label">;
    const { inputId, disabled } = React.useContext(ClipboardContext);

    return (
        <Component
            ref={ref}
            // A span or a legend names whatever stands around it rather than pointing at a
            // control, so neither is given anything to point at. Nor is a name standing over a
            // value that is only ever shown as text, since there is no field there to reach
            htmlFor={Component === "label" ? (htmlFor ?? inputId) : undefined}
            className={classNames(classes.root, disabled && classes.disabled, className)}
            data-component="Clipboard.Label"
            data-disabled={Boolean(disabled)}
            {...rest}
        />
    );
}

ClipboardLabel.displayName = "Clipboard.Label";

export default fixedForwardRef(ClipboardLabel);
