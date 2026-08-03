import * as React from "react";
import { ActionListContainerContext } from "../action-list";
import { AnchoredOverlay } from "../anchored-overlay";
import { ActionMenuContext } from "./ActionMenuContext";
import type { AnchoredOverlayCloseGesture } from "../anchored-overlay";
import type { ActionMenuOverlayProps } from "./ActionMenu.types";

const classes = {
    container: "action-menu-overlay",
};

// The floating part of the menu, which is where the list of items goes. It stands against
// whatever the menu was opened from
function ActionMenuOverlay(props: ActionMenuOverlayProps) {
    const {
        children,
        align = "start",
        side,
        className,
        returnFocusRef,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    const menu = React.useContext(ActionMenuContext);
    const isSubmenu = Boolean(menu?.isSubmenu);
    const onClose = menu?.onClose;

    const handleClose = React.useCallback(
        (gesture: AnchoredOverlayCloseGesture) => onClose?.(gesture),
        [onClose],
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.defaultPrevented) {
            return;
        }

        // Tabbing away from a menu closes it, and the ones it was opened from with it
        if (event.key === "Tab") {
            onClose?.("tab");
            return;
        }

        // A submenu is closed from the side it stands on, the way it was opened
        if (isSubmenu && event.key === "ArrowLeft") {
            onClose?.("arrow-left");
            event.preventDefault();
        }
    };

    const containerContextValue = React.useMemo(
        () => ({
            container: "ActionMenu",
            listRole: "menu" as const,
            // A menu is named by the button that opens it, since there is nowhere inside it
            // for a heading to go
            listLabelledBy: ariaLabelledBy ?? menu?.anchorId,
            selectionAttribute: "aria-checked" as const,
            afterSelect: () => onClose?.("item-select"),
        }),
        [ariaLabelledBy, menu?.anchorId, onClose],
    );

    if (!menu) {
        return null;
    }

    return (
        <AnchoredOverlay
            anchorRef={menu.anchorRef}
            renderAnchor={menu.renderAnchor}
            anchorId={menu.anchorId}
            open={menu.open}
            onOpen={menu.onOpen}
            onClose={handleClose}
            align={align}
            side={side ?? (isSubmenu ? "outside-right" : "outside-bottom")}
            className={className}
            focusTrapSettings={returnFocusRef ? { returnFocusRef } : undefined}
            {...rest}
        >
            <div
                className={classes.container}
                onKeyDown={handleKeyDown}
                data-component="ActionMenu.Overlay"
            >
                <ActionListContainerContext.Provider value={containerContextValue}>
                    {children}
                </ActionListContainerContext.Provider>
            </div>
        </AnchoredOverlay>
    );
}

ActionMenuOverlay.displayName = "ActionMenu.Overlay";

export default ActionMenuOverlay;
