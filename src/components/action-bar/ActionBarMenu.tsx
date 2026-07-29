import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ActionList } from "../action-list";
import { ActionMenu } from "../action-menu";
import { IconButton } from "../icon-button";
import { ActionBarMenuItems } from "./ActionBarMenuItems";
import { useActionBarItem } from "./useActionBarItem";
import type { ActionBarMenuProps } from "./ActionBar.types";

const classes = {
    overflowing: "invisible",
};

// A menu of its own in the bar. Where the row runs out of room the whole menu is offered
// from the overflow menu, as a menu within it
function ActionBarMenu(
    props: ActionBarMenuProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        icon,
        items,
        returnFocusRef,
        // Read by the bar when it draws this menu inside its own, and of no use here
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        overflowIcon,
        ...rest
    } = props;

    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const mergedRef = useMergedRefs(ref, buttonRef);
    const { size, isOverflowing } = useActionBarItem(buttonRef);

    return (
        <ActionMenu anchorRef={buttonRef}>
            <ActionMenu.Anchor>
                <IconButton
                    ref={mergedRef}
                    icon={icon}
                    size={size}
                    variant="invisible"
                    className={classNames(isOverflowing && classes.overflowing, className)}
                    data-component="ActionBar.Menu"
                    data-overflowing={isOverflowing ? "" : undefined}
                    {...rest}
                />
            </ActionMenu.Anchor>
            <ActionMenu.Overlay returnFocusRef={returnFocusRef}>
                <ActionList>
                    <ActionBarMenuItems items={items} />
                </ActionList>
            </ActionMenu.Overlay>
        </ActionMenu>
    );
}

ActionBarMenu.displayName = "ActionBar.Menu";

export default fixedForwardRef(ActionBarMenu);
