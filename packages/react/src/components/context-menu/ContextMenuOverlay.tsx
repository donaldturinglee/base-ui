import * as React from "react";
import { ActionListContainerContext } from "../action-list";
import { ActionMenuContext } from "../action-menu";
import { AnchoredOverlay } from "../anchored-overlay";
import { Portal } from "../portal";
import { ContextMenuContext } from "./ContextMenuContext";
import type { ContextMenuOverlayProps } from "./ContextMenu.types";

const classes = {
    point: "context-menu-point",
    container: "context-menu-overlay",
};

// The floating part of the menu, which is where the list of items goes. It stands at the
// press that opened it rather than off the edge of anything, so that press is held open as
// an element of its own for the overlay to be measured against
function ContextMenuOverlay(props: ContextMenuOverlayProps) {
    const {
        children,
        align = "start",
        side = "outside-bottom",
        className,
        returnFocusRef,
        "aria-label": ariaLabel = "Context menu",
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    const menu = React.useContext(ContextMenuContext);
    const onClose = menu?.onClose;

    const pointRef = React.useRef<HTMLDivElement>(null);

    const handleClose = React.useCallback(() => onClose?.(), [onClose]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        // Tabbing away from a menu closes it
        if (!event.defaultPrevented && event.key === "Tab") {
            onClose?.();
        }
    };

    const containerContextValue = React.useMemo(
        () => ({
            container: "ContextMenu",
            listRole: "menu" as const,
            // There is no button standing on the page for the menu to be named by, so it
            // says what it is itself unless the caller points at something that says it better
            listLabel: ariaLabelledBy ? undefined : ariaLabel,
            listLabelledBy: ariaLabelledBy,
            selectionAttribute: "aria-checked" as const,
            afterSelect: handleClose,
        }),
        [ariaLabel, ariaLabelledBy, handleClose],
    );

    // A menu opened from an item of this one is a menu within a menu, and reads this to find
    // the one it was opened from so that picking an item closes the whole stack. The point
    // the menu was pressed open at stands in for the anchor a menu would usually have, since
    // it is what this one is measured against
    const submenuContextValue = React.useMemo(
        () => ({
            anchorRef: pointRef,
            renderAnchor: null,
            open: Boolean(menu?.open),
            onClose: handleClose,
        }),
        [menu?.open, handleClose],
    );

    if (!menu || !menu.open) {
        return null;
    }

    const { point } = menu;

    return (
        <>
            <Portal containerName={menu.portalContainerName}>
                <div
                    ref={pointRef}
                    aria-hidden
                    className={classes.point}
                    style={
                        {
                            "--context-menu-point-top": `${point.y}px`,
                            "--context-menu-point-left": `${point.x}px`,
                            "--context-menu-point-size": `${point.size}px`,
                        } as React.CSSProperties
                    }
                    data-component="ContextMenu.Point"
                />
            </Portal>
            <AnchoredOverlay
                renderAnchor={null}
                anchorRef={pointRef}
                open={menu.open}
                onClose={handleClose}
                align={align}
                side={side}
                // The menu stands at the press itself, rather than clear of it the way it
                // would stand clear of an anchor it would otherwise cover
                anchorOffset={0}
                className={className}
                overlayProps={{ portalContainerName: menu.portalContainerName }}
                // The press left nothing behind to hand focus back to, so it goes to the area
                // the menu was opened from
                focusTrapSettings={{ returnFocusRef: returnFocusRef ?? menu.triggerRef }}
                {...rest}
            >
                <div
                    className={classes.container}
                    onKeyDown={handleKeyDown}
                    data-component="ContextMenu.Overlay"
                >
                    <ActionMenuContext.Provider value={submenuContextValue}>
                        <ActionListContainerContext.Provider value={containerContextValue}>
                            {children}
                        </ActionListContainerContext.Provider>
                    </ActionMenuContext.Provider>
                </div>
            </AnchoredOverlay>
        </>
    );
}

ContextMenuOverlay.displayName = "ContextMenu.Overlay";

export default ContextMenuOverlay;
