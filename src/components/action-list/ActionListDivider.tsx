import * as React from "react";
import { classNames } from "../../utilities/classnames";
import type { ActionListDividerProps } from "./ActionList.types";

const classes = {
    // The line is drawn as a background rather than a border, so it keeps its own height
    // whatever the list is holding either side of it
    root: "block h-[var(--border-width-thin)] my-[var(--base-size-8)] mx-0 p-0 list-none bg-[var(--border-color-muted)]",
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
