import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useFormControlForwardedProps } from "../form-control/useFormControlForwardedProps";
import { TextInput } from "../text-input";
import { ClipboardTextContext } from "./ClipboardTextContext";
import type { ClipboardTextInputProps } from "./ClipboardText.types";

const classes = {
    root: "clipboard-text-input",
};

// What is about to be copied, shown so that a reader can see what they are taking before they
// take it. It is a text input underneath, so it is sized and coloured the way every other field
// on the page is, and it is read-only rather than disabled: the value is not the reader's to
// change, but it is theirs to select, to read out and to copy by hand.
//
// A field standing in a FormControl is wired into it, so the name above it and the hint below it
// belong to this input rather than to nothing at all
function ClipboardTextInput(
    props: ClipboardTextInputProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    // A field the reader cannot type in is never one they have to fill, so what the field
    // around it says about that is left off
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { required: _required, ...inputProps } = useFormControlForwardedProps(props);
    const { className, id, disabled, onFocus, ...rest } = inputProps;
    const { value, inputId, disabled: isDisabled } = React.useContext(ClipboardTextContext);

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        onFocus?.(event);

        if (event.defaultPrevented) {
            return;
        }

        // Nothing in the field is worth reaching part of, so arriving at it selects the whole
        // value. That leaves a reader who would rather take it themselves one keystroke away
        event.target.select();
    };

    return (
        <TextInput
            ref={ref}
            id={id ?? inputId}
            value={value ?? ""}
            readOnly
            disabled={disabled ?? isDisabled}
            onFocus={handleFocus}
            className={classNames(classes.root, className)}
            // The field around it stays a TextInput, which is what it is; this names the part
            // the clipboard field itself contributes
            data-component="ClipboardText.Input"
            {...rest}
        />
    );
}

ClipboardTextInput.displayName = "ClipboardText.Input";

export default fixedForwardRef(ClipboardTextInput);
