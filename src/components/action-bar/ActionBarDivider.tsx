import * as React from "react";
import { classNames } from "../../lib/classnames";
import { useActionBarItem } from "./useActionBarItem";
import type { ActionBarDividerProps } from "./ActionBar.types";

const classes = {
    root: "action-bar-divider",
    overflowing: "invisible",
};

// Sets one run of items in the bar apart from the next
function ActionBarDivider(props: ActionBarDividerProps) {
    const { className, ...rest } = props;

    const dividerRef = React.useRef<HTMLDivElement>(null);
    const { isOverflowing } = useActionBarItem(dividerRef);

    return (
        <div
            ref={dividerRef}
            aria-hidden="true"
            className={classNames(classes.root, isOverflowing && classes.overflowing, className)}
            data-component="ActionBar.Divider"
            data-overflowing={isOverflowing ? "" : undefined}
            {...rest}
        />
    );
}

ActionBarDivider.displayName = "ActionBar.Divider";

export default ActionBarDivider;
