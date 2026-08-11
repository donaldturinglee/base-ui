import * as React from "react";
import { classNames } from "../../lib/classnames";
import { ActionListItemContext } from "./ActionListItemContext";
import type { ActionListVisualProps } from "./ActionList.types";

const classes = {
    root: "action-list-visual",
    muted: "action-list-visual-muted",
    inherit: "action-list-visual-inherit",
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
