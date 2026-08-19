import * as React from "react";
import { ChevronRightRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { ActionListContainerContext } from "../action-list";
import { ActionMenuContext } from "./ActionMenuContext";
import type { ActionMenuAnchorProps } from "./ActionMenu.types";

type AnchorChildProps = {
    className?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
};

// Whatever the menu opens from. The element it is wrapped around is what is rendered, with
// everything the menu needs of it spread onto it
function ActionMenuAnchor(props: ActionMenuAnchorProps) {
    const { children, className, onClick, onKeyDown, ...rest } = props;
    const menu = React.useContext(ActionMenuContext);
    const parentContainerContext = React.useContext(ActionListContainerContext);

    const isSubmenu = Boolean(menu?.isSubmenu);
    const onOpen = menu?.onOpen;

    // A submenu opens from an item of the menu around it, so an item that opens one is
    // marked with a chevron and opens rather than closing the menu it stands in
    const containerContextValue = React.useMemo(
        () =>
            isSubmenu
                ? {
                      ...parentContainerContext,
                      defaultTrailingVisual: <ChevronRightRegular />,
                      afterSelect: () => onOpen?.(),
                  }
                : parentContainerContext,
        [isSubmenu, onOpen, parentContainerContext],
    );

    if (!React.isValidElement<AnchorChildProps>(children)) {
        return null;
    }

    const childProps = children.props;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        childProps.onClick?.(event);
        onClick?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        childProps.onKeyDown?.(event);

        // A submenu is opened from the side it stands on, the way it is closed again
        if (isSubmenu && event.key === "ArrowRight" && !event.defaultPrevented) {
            onOpen?.();
            event.preventDefault();
        }

        onKeyDown?.(event);
    };

    return (
        <ActionListContainerContext.Provider value={containerContextValue}>
            {React.cloneElement(children, {
                ...rest,
                ref: menu?.anchorRef,
                className: classNames(className, childProps.className),
                onClick: handleClick,
                onKeyDown: handleKeyDown,
            } as Partial<AnchorChildProps>)}
        </ActionListContainerContext.Provider>
    );
}

ActionMenuAnchor.displayName = "ActionMenu.Anchor";

export default ActionMenuAnchor;
