import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ContextMenuItemContext } from "./ContextMenuItemContext";
import type { ContextMenuItemTextProps } from "./ContextMenu.types";

const classes = {
    root: "context-menu-item-text",
};

// The words of an item, which take whatever room the mark beside them leaves and give way to
// an ellipsis rather than wrap
function ContextMenuItemText(
    props: ContextMenuItemTextProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    const item = React.useContext(ContextMenuItemContext);

    return (
        <span
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="ContextMenu.ItemText"
            data-highlighted={item?.highlighted ? "" : undefined}
            data-disabled={item?.disabled ? "" : undefined}
            data-state={
                item?.checked === undefined ? undefined : item.checked ? "checked" : "unchecked"
            }
            {...rest}
        />
    );
}

ContextMenuItemText.displayName = "ContextMenu.ItemText";

export default fixedForwardRef(ContextMenuItemText);
