import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ContextMenuItemContext } from "./ContextMenuItemContext";
import { useContextMenuItem } from "./useContextMenuItem";
import type { ContextMenuItemProps } from "./ContextMenu.types";

const classes = {
    root: "context-menu-item",
};

// Something the menu can do. Picking it tells the menu what was picked and, unless it or the
// menu says otherwise, closes the menu
function ContextMenuItem(
    props: ContextMenuItemProps,
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
        onSelect,
        variant = "default",
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
        onSelect,
        onClick,
        onPointerMove,
        onPointerLeave,
        onPointerDown,
    });

    const itemContextValue = React.useMemo(
        () => ({ highlighted, disabled }),
        [highlighted, disabled],
    );

    return (
        <ContextMenuItemContext.Provider value={itemContextValue}>
            <div
                ref={ref}
                role="menuitem"
                className={classNames(classes.root, className)}
                data-component="ContextMenu.Item"
                data-variant={variant === "danger" ? variant : undefined}
                data-valuetext={valueText}
                {...itemProps}
                {...rest}
            >
                {children}
            </div>
        </ContextMenuItemContext.Provider>
    );
}

ContextMenuItem.displayName = "ContextMenu.Item";

export default fixedForwardRef(ContextMenuItem);
