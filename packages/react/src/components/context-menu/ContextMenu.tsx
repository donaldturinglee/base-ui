import * as React from "react";
import { useId } from "../../hooks/useId";
import { ContextMenuContext } from "./ContextMenuContext";
import type { ContextMenuPoint, ContextMenuProps } from "./ContextMenu.types";

// Where a menu that has not been pressed open yet would stand, which is the corner the page
// starts at rather than nowhere at all
const ORIGIN: ContextMenuPoint = { x: 0, y: 0, size: 0 };

// A list of actions brought out from the thing they are about rather than from a button, by
// a right click or by a finger resting on it. It draws nothing of its own: the area the menu
// is opened from and the menu itself are both given to it, and all it does is hold what they
// have to agree on between them
function ContextMenu(props: ContextMenuProps) {
    const {
        children,
        open: openProp,
        defaultOpen = false,
        onOpenChange,
        onSelect,
        closeOnSelect = true,
        loopFocus = false,
        typeahead = true,
        disabled = false,
        portalContainerName,
    } = props;

    const id = useId();
    const triggerId = `${id}--trigger`;
    const contentId = `${id}--content`;

    const triggerRef = React.useRef<HTMLDivElement>(null);

    // Kept once the menu has closed, so that a caller opening it again from their own state
    // stands it where it was last asked for
    const [point, setPoint] = React.useState<ContextMenuPoint>(ORIGIN);

    const [highlightedValue, setHighlightedValue] = React.useState<string | null>(null);

    // A menu the caller is holding the state of takes whether it is open from the prop; one
    // that is not keeps its own. Either way a menu that has been turned off stays shut
    const isControlled = openProp !== undefined;
    const [selfOpen, setSelfOpen] = React.useState(defaultOpen);
    const open = (isControlled ? openProp : selfOpen) && !disabled;

    const setOpen = React.useCallback(
        (next: boolean) => {
            setSelfOpen(next);
            onOpenChange?.(next);
        },
        [onOpenChange],
    );

    const onOpen = React.useCallback(
        (at: ContextMenuPoint) => {
            setPoint(at);
            // A menu pressed open again somewhere else moves rather than reopens, so the
            // reader is no longer on whichever item they were on
            setHighlightedValue(null);
            setOpen(true);
        },
        [setOpen],
    );

    const onClose = React.useCallback(() => setOpen(false), [setOpen]);

    const handleSelect = React.useCallback(
        (value: string, close: boolean) => {
            onSelect?.(value);

            if (close) {
                onClose();
            }
        },
        [onSelect, onClose],
    );

    const menuContextValue = React.useMemo(
        () => ({
            triggerRef,
            triggerId,
            contentId,
            point,
            open,
            disabled,
            closeOnSelect,
            loopFocus,
            typeahead,
            highlightedValue,
            portalContainerName,
            onOpen,
            onClose,
            onSelect: handleSelect,
            setHighlightedValue,
        }),
        [
            triggerId,
            contentId,
            point,
            open,
            disabled,
            closeOnSelect,
            loopFocus,
            typeahead,
            highlightedValue,
            portalContainerName,
            onOpen,
            onClose,
            handleSelect,
        ],
    );

    return (
        <ContextMenuContext.Provider value={menuContextValue}>
            {children}
        </ContextMenuContext.Provider>
    );
}

ContextMenu.displayName = "ContextMenu";

export default ContextMenu;
