import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import type { TextInputActionProps } from "./TextInput.types";

const classes = {
    // Zero line height keeps the button from standing taller than the icon inside it
    root: "self-center shrink-0 mx-[var(--base-size-4)] leading-[0]",
    // The field sets the size, so an action in a small or large field is sized to match
    button: "relative size-[var(--text-input-action-size)] p-[var(--base-size-4)] bg-transparent text-foreground-muted hover:text-foreground-default focus:text-foreground-default",
    // A coarse pointer is given a target as tall as the field to aim at
    target: "pointer-coarse:after:content-[''] pointer-coarse:after:absolute pointer-coarse:after:inset-x-0 pointer-coarse:after:top-1/2 pointer-coarse:after:-translate-y-1/2 pointer-coarse:after:min-h-[var(--control-min-target-coarse)]",
};

function TextInputAction(
    props: TextInputActionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, icon, ...rest } = props;

    return (
        <span className={classes.root} data-component="TextInput.Action">
            <IconButton
                ref={ref}
                type="button"
                variant="invisible"
                size="small"
                icon={icon}
                className={classNames(classes.button, classes.target, className)}
                {...rest}
            />
        </span>
    );
}

TextInputAction.displayName = "TextInput.Action";

export default fixedForwardRef(TextInputAction);
