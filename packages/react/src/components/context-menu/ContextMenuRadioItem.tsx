import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ContextMenuItemContext } from "./ContextMenuItemContext";
import { ContextMenuItemGroupContext } from "./ContextMenuItemGroupContext";
import { useContextMenuItem } from "./useContextMenuItem";
import type { ContextMenuRadioItemProps } from "./ContextMenu.types";

const classes = {
    root: "context-menu-item",
};

// One of a run of items of which one at a time is picked. Whether it is the one is read from
// the group around it, and picking it tells the group so
function ContextMenuRadioItem(
    props: ContextMenuRadioItemProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        value,
        valueText,
        disabled = false,
        closeOnSelect,
        onClick,
        onPointerMove,
        onPointerLeave,
        onPointerDown,
        ...rest
    } = props;

    const group = React.useContext(ContextMenuItemGroupContext);
    const checked = group?.value === value;
    const onValueChange = group?.onValueChange;

    const { highlighted, itemProps } = useContextMenuItem({
        value,
        disabled,
        closeOnSelect,
        onSelect: () => onValueChange?.(value),
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
                role="menuitemradio"
                aria-checked={checked}
                className={classNames(classes.root, className)}
                data-component="ContextMenu.RadioItem"
                data-type="radio"
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

ContextMenuRadioItem.displayName = "ContextMenu.RadioItem";

export default fixedForwardRef(ContextMenuRadioItem);
