import * as React from "react";
import { EyeOffRegular, EyeRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TextInput } from "../text-input";
import type { PasswordInputProps } from "./PasswordInput.types";

const classes = {
    root: "password-input",
    toggle: "password-input-toggle",
};

// A field for a password, with a toggle beside it for showing what has been typed.
//
// It is a text input underneath, so it is sized and coloured and validated the way every other
// field on the page is. What holds a password back is the type of the field rather than anything
// drawn over it, so showing one is the same field asked for plain text instead.
//
// The toggle is named for what pressing it would do next rather than for the state it is in, so
// a reader hears "Show password" and then "Hide password" as they press it. That is why it is
// not also marked as pressed: a button that says what it will do and reports what it has done
// says the same thing twice, and the two read as contradicting each other
function PasswordInput(
    props: PasswordInputProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        visible: visibleProp,
        defaultVisible = false,
        onVisibilityChange,
        hideToggle = false,
        showLabel = "Show password",
        hideLabel = "Hide password",
        disabled,
        ...rest
    } = props;

    // A field the caller is holding follows them; one left to itself keeps its own state
    const isControlled = visibleProp !== undefined;
    const [uncontrolledVisible, setUncontrolledVisible] = React.useState(defaultVisible);
    const isVisible = isControlled ? visibleProp : uncontrolledVisible;

    const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
        // The field focuses its typing area on a press anywhere in it, so that the padding round
        // the edge is not dead ground. A press on the toggle was aimed at the toggle, though, so
        // it is kept from reaching that: a reader who has just asked to see their password would
        // otherwise be moved off the control that says whether they can
        event.stopPropagation();

        const next = !isVisible;

        if (!isControlled) {
            setUncontrolledVisible(next);
        }

        onVisibilityChange?.(next);
    };

    return (
        <TextInput
            ref={ref}
            type={isVisible ? "text" : "password"}
            disabled={disabled}
            className={classNames(classes.root, className)}
            trailingAction={
                hideToggle ? undefined : (
                    <TextInput.Action
                        icon={isVisible ? EyeOffRegular : EyeRegular}
                        aria-label={isVisible ? hideLabel : showLabel}
                        disabled={disabled}
                        onClick={handleToggle}
                        className={classes.toggle}
                        data-component="PasswordInput.Toggle"
                    />
                )
            }
            // The field around it stays a TextInput, which is what it is; this names the part the
            // password field itself contributes
            data-component="PasswordInput"
            {...rest}
        />
    );
}

PasswordInput.displayName = "PasswordInput";

export default fixedForwardRef(PasswordInput);
