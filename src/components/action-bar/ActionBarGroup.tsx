import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { ActionBarItemContext } from "./ActionBarItemContext";
import { useActionBarItem } from "./useActionBarItem";
import type { ActionBarGroupProps } from "./ActionBar.types";

const classes = {
    // The items of a group stay together, so they are carried into the overflow menu all at
    // once rather than one at a time
    root: "flex shrink-0 items-center gap-[var(--base-size-2)]",
    overflowing: "invisible",
};

const inGroup = { inGroup: true };

// Holds a run of items together, so that they are moved into the overflow menu as one
function ActionBarGroup(props: React.PropsWithChildren<ActionBarGroupProps>) {
    const { className, children, ...rest } = props;

    const groupRef = React.useRef<HTMLDivElement>(null);
    const { isOverflowing } = useActionBarItem(groupRef);

    return (
        <div
            ref={groupRef}
            className={classNames(classes.root, isOverflowing && classes.overflowing, className)}
            data-component="ActionBar.Group"
            data-overflowing={isOverflowing ? "" : undefined}
            {...rest}
        >
            <ActionBarItemContext.Provider value={inGroup}>
                {children}
            </ActionBarItemContext.Provider>
        </div>
    );
}

ActionBarGroup.displayName = "ActionBar.Group";

export default ActionBarGroup;
