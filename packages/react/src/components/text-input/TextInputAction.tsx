import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import type { TextInputActionProps } from "./TextInput.types";

const classes = {
    root: "input-action",
    button: "input-action-button",
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
                className={classNames(classes.button, className)}
                {...rest}
            />
        </span>
    );
}

TextInputAction.displayName = "TextInput.Action";

export default fixedForwardRef(TextInputAction);
