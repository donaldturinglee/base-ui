import * as React from "react";
import { classNames } from "../../lib/classnames";
import type { ActionListDividerProps } from "./ActionList.types";

const classes = {
    root: "action-list-divider",
};

// Sets items or groups apart from one another. It says nothing, so it is left out of the
// accessibility tree
function ActionListDivider(props: ActionListDividerProps) {
    const { className, ...rest } = props;

    return (
        <li
            aria-hidden="true"
            className={classNames(classes.root, className)}
            data-component="ActionList.Divider"
            {...rest}
        />
    );
}

ActionListDivider.displayName = "ActionList.Divider";

export default ActionListDivider;
