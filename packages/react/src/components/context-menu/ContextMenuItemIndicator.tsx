import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ContextMenuItemContext } from "./ContextMenuItemContext";
import type { ContextMenuItemIndicatorProps } from "./ContextMenu.types";

const classes = {
    root: "context-menu-item-indicator",
};

// The mark beside an item that can be picked, which holds whatever the caller draws it with
// and is only shown while the item is picked. It keeps its room while it is not, so the words
// beside it stand in line down the menu whichever items are picked. In an item that cannot be
// picked it is shown whatever the item is doing, and stands for whatever the caller put in it.
//
// Whatever it holds is a picture of the state the item already says, so it is kept from a
// screen reader rather than read out twice
function ContextMenuItemIndicator(
    props: ContextMenuItemIndicatorProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    const item = React.useContext(ContextMenuItemContext);
    const checkable = item?.checked !== undefined;

    return (
        <span
            ref={ref}
            aria-hidden="true"
            className={classNames(classes.root, className)}
            data-component="ContextMenu.ItemIndicator"
            data-highlighted={item?.highlighted ? "" : undefined}
            data-disabled={item?.disabled ? "" : undefined}
            data-state={checkable ? (item.checked ? "checked" : "unchecked") : undefined}
            {...rest}
        />
    );
}

ContextMenuItemIndicator.displayName = "ContextMenu.ItemIndicator";

export default fixedForwardRef(ContextMenuItemIndicator);
