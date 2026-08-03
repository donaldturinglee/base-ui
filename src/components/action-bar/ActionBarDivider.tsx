import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { useActionBarItem } from "./useActionBarItem";
import type { ActionBarDividerProps } from "./ActionBar.types";

const classes = {
    // A standing line between one run of items and the next, drawn as a background so it
    // keeps its height whatever stands either side of it
    root: "shrink-0 self-center w-[var(--border-width-thin)] h-[var(--base-size-16)] mx-[var(--base-size-4)] bg-border-muted",
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
