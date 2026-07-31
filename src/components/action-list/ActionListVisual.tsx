import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { ActionListItemContext } from "./ActionListItemContext";
import type { ActionListVisualProps } from "./ActionList.types";

const classes = {
    // The box is as tall as a line of the label, so a visual sits on the label's first line
    // however many lines the item runs to. The line height is a bare number, so it is taken
    // against the label's own size to give a length
    root: "flex shrink-0 items-center justify-center min-w-[var(--base-size-16)] h-[calc(var(--text-body-line-height-medium)_*_1em)] [&_svg]:size-[var(--base-size-16)]",
    // A visual says the same thing the label does, so it is only ever coloured against it
    muted: "[color:var(--foreground-color-muted)]",
    // Danger, disabled and inactive items are coloured as a whole, and the visual follows
    inherit: "[color:inherit]",
};

// The box a leading or trailing visual is drawn in. Both stand it in the same place, so
// they only differ in where the item puts them
export const ActionListVisualContainer = ({
    className,
    ...rest
}: React.PropsWithChildren<ActionListVisualProps>) => {
    const { variant, disabled, inactive } = React.useContext(ActionListItemContext);
    const followsItem = variant === "danger" || disabled || inactive;

    return (
        <span
            className={classNames(
                classes.root,
                followsItem ? classes.inherit : classes.muted,
                className,
            )}
            {...rest}
        />
    );
};
