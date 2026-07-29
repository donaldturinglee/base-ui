import * as React from "react";
import { useId } from "../../hooks/useId";
import ActionMenuAnchor from "./ActionMenuAnchor";
import ActionMenuButton from "./ActionMenuButton";
import { ActionMenuContext } from "./ActionMenuContext";
import type { AnchoredOverlayAnchorProps } from "../anchored-overlay";
import type { ActionMenuCloseGesture, ActionMenuProps } from "./ActionMenu.types";

type AnchorElementProps = {
    id?: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
};

const isAnchor = (child: React.ReactNode): child is React.ReactElement<AnchorElementProps> =>
    React.isValidElement(child) &&
    (child.type === ActionMenuAnchor || child.type === ActionMenuButton);

// The overlay opens the menu through handlers of its own, so whatever the anchor was
// already doing is kept and done first. The ref the overlay offers is left out, since the
// anchor takes the one the menu is already holding it with from context
const mergeAnchorProps = (
    anchorProps: AnchoredOverlayAnchorProps,
    childProps: AnchorElementProps,
) => ({
    id: anchorProps.id,
    "aria-haspopup": anchorProps["aria-haspopup"],
    "aria-expanded": anchorProps["aria-expanded"],
    tabIndex: anchorProps.tabIndex,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
        childProps.onClick?.(event);
        anchorProps.onClick(event);
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
        childProps.onKeyDown?.(event);
        anchorProps.onKeyDown(event);
    },
});

// A list of actions brought out from a button. The anchor is taken out of the children and
// handed to the overlay to render, so that everything the overlay needs of the anchor can
// be spread onto it wherever the caller wrote it
function ActionMenu(props: ActionMenuProps) {
    const { children, open: openProp, onOpenChange, anchorRef: externalAnchorRef } = props;

    const parentMenu = React.useContext(ActionMenuContext);

    const internalAnchorRef = React.useRef<HTMLElement>(null);
    const anchorRef = externalAnchorRef ?? internalAnchorRef;

    // A menu the caller is holding the state of takes whether it is open from the prop; one
    // that is not keeps its own
    const isControlled = openProp !== undefined;
    const [selfOpen, setSelfOpen] = React.useState(false);
    const open = isControlled ? openProp : selfOpen;

    const setOpen = React.useCallback(
        (next: boolean) => {
            setSelfOpen(next);
            onOpenChange?.(next);
        },
        [onOpenChange],
    );

    const onOpen = React.useCallback(() => setOpen(true), [setOpen]);

    const parentClose = parentMenu?.onClose;
    const onClose = React.useCallback(
        (gesture: ActionMenuCloseGesture) => {
            setOpen(false);

            // Picking an item, or tabbing away, is done with the whole stack of menus rather
            // than with this one alone
            if (gesture === "item-select" || gesture === "tab") {
                parentClose?.(gesture);
            }
        },
        [setOpen, parentClose],
    );

    const childArray = React.Children.toArray(children);
    const anchorChild = childArray.find(isAnchor);
    const anchorId = useId(anchorChild?.props.id);

    const renderAnchor = anchorChild
        ? (anchorProps: AnchoredOverlayAnchorProps) =>
              React.cloneElement(anchorChild, mergeAnchorProps(anchorProps, anchorChild.props))
        : null;

    const isSubmenu = parentMenu !== undefined;

    const menuContextValue = React.useMemo(
        () => ({ anchorRef, renderAnchor, anchorId, open, onOpen, onClose, isSubmenu }),
        [anchorRef, renderAnchor, anchorId, open, onOpen, onClose, isSubmenu],
    );

    return (
        <ActionMenuContext.Provider value={menuContextValue}>
            {childArray.filter((child) => child !== anchorChild)}
        </ActionMenuContext.Provider>
    );
}

ActionMenu.displayName = "ActionMenu";

export default ActionMenu;
