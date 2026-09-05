import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ContextMenuItemContext } from "./ContextMenuItemContext";
import { useContextMenuItem } from "./useContextMenuItem";
import type { ContextMenuCheckboxItemProps } from "./ContextMenu.types";

const classes = {
    root: "context-menu-item",
};

// An item that is picked and put back on its own, so a menu can hold as many of them picked
// at once as it likes. What it says is drawn beside a mark that is only there while it is
// picked
function ContextMenuCheckboxItem(
    props: ContextMenuCheckboxItemProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        value,
        valueText,
        checked,
        onCheckedChange,
        disabled = false,
        closeOnSelect,
        onClick,
        onPointerMove,
        onPointerLeave,
        onPointerDown,
        ...rest
    } = props;

    const { highlighted, itemProps } = useContextMenuItem({
        value,
        disabled,
        closeOnSelect,
        // Picking the item turns it over
        onSelect: () => onCheckedChange?.(!checked),
        onClick,
        onPointerMove,
        onPointerLeave,
        onPointerDown,
    });

    const itemContextValue = React.useMemo(
        () => ({ highlighted, disabled, checked }),
        [highlighted, disabled, checked],
    );

    return (
        <ContextMenuItemContext.Provider value={itemContextValue}>
            <div
                ref={ref}
                role="menuitemcheckbox"
                aria-checked={checked}
                className={classNames(classes.root, className)}
                data-component="ContextMenu.CheckboxItem"
                data-type="checkbox"
                data-state={checked ? "checked" : "unchecked"}
                data-valuetext={valueText}
                {...itemProps}
                {...rest}
            >
                {children}
            </div>
        </ContextMenuItemContext.Provider>
    );
}

ContextMenuCheckboxItem.displayName = "ContextMenu.CheckboxItem";

export default fixedForwardRef(ContextMenuCheckboxItem);
