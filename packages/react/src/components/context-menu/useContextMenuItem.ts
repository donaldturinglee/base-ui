import * as React from "react";
import { useContextMenu } from "./useContextMenu";

export type UseContextMenuItemOptions = {
    value: string;
    disabled?: boolean;
    // Whether picking the item closes the menu, in place of what the menu says
    closeOnSelect?: boolean;
    // What picking the item does of its own, before the menu is told
    onSelect?: () => void;
    // The item's own handlers, which are kept and called first
    onClick?: React.MouseEventHandler<HTMLElement>;
    onPointerMove?: React.PointerEventHandler<HTMLElement>;
    onPointerLeave?: React.PointerEventHandler<HTMLElement>;
    onPointerDown?: React.PointerEventHandler<HTMLElement>;
};

// Everything an item is drawn from and answers with, whichever kind of item it is: where it
// stands against the reader, what happens as the pointer crosses it, and what happens once it
// is picked. The kinds of item differ only in what they are read as and what picking them
// means, so the rest is settled here once
export const useContextMenuItem = ({
    value,
    disabled = false,
    closeOnSelect,
    onSelect,
    onClick,
    onPointerMove,
    onPointerLeave,
    onPointerDown,
}: UseContextMenuItemOptions) => {
    const menu = useContextMenu();

    const highlighted = menu.highlightedValue === value;
    const close = closeOnSelect ?? menu.closeOnSelect;

    const { onSelect: menuSelect, setHighlightedValue } = menu;

    const select = React.useCallback(() => {
        if (disabled) {
            return;
        }

        onSelect?.();
        menuSelect(value, close);
    }, [disabled, onSelect, menuSelect, value, close]);

    const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
        onPointerMove?.(event);

        // Only a pointer crossing the item puts the reader on it. A finger sliding across the
        // menu is scrolling it rather than choosing from it
        if (disabled || event.pointerType !== "mouse" || highlighted) {
            return;
        }

        setHighlightedValue(value);
    };

    const handlePointerLeave = (event: React.PointerEvent<HTMLElement>) => {
        onPointerLeave?.(event);

        if (disabled || event.pointerType !== "mouse") {
            return;
        }

        setHighlightedValue(null);
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
        onPointerDown?.(event);

        if (!disabled) {
            setHighlightedValue(value);
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        onClick?.(event);

        // A caller that answered the click themselves is left to it
        if (!event.defaultPrevented) {
            select();
        }
    };

    const itemProps = {
        // The items are reached with the arrow keys rather than tabbed through, so none of
        // them is a stop of its own on the way past the menu
        tabIndex: -1,
        "aria-disabled": disabled ? true : undefined,
        "data-disabled": disabled ? "" : undefined,
        "data-highlighted": highlighted ? "" : undefined,
        "data-value": value,
        onPointerMove: handlePointerMove,
        onPointerLeave: handlePointerLeave,
        onPointerDown: handlePointerDown,
        onClick: handleClick,
    };

    return { highlighted, disabled, select, itemProps };
};
