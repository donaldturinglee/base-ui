import * as React from "react";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { classNames } from "../../lib/classnames";
import { navigate } from "./navigate";
import { NavigationMenuContext, NavigationMenuItemContext } from "./NavigationMenuContext";
import type {
    NavigationMenuItemContextValue,
    NavigationMenuItemProps,
} from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-item",
};

// The keys that move between the links standing in a panel, whichever way the panel lays them
// out, and the two that jump to either end of them
const isNavigationKey = (key: string) =>
    key === "ArrowUp" ||
    key === "ArrowDown" ||
    key === "ArrowLeft" ||
    key === "ArrowRight" ||
    key === "Home" ||
    key === "End";

// One place in the row, being either a link of its own or a trigger and the panel it opens. It
// tells the menu how to find the two, so that the menu can hand focus between them without
// looking around the page
function NavigationMenuItem(
    props: NavigationMenuItemProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { children, className, value: valueProp, disabled = false, onKeyDown, ...rest } = props;

    const generatedValue = useId();
    const value = valueProp ?? generatedValue;

    const triggerId = useId();
    const contentId = useId();
    const triggerProxyId = useId();

    const menu = React.useContext(NavigationMenuContext);
    const registerItem = menu?.registerItem;

    useIsomorphicLayoutEffect(
        () => registerItem?.(value, { triggerId, contentId, triggerProxyId }),
        [contentId, registerItem, triggerId, triggerProxyId, value],
    );

    const isOpen = menu?.value === value;

    const context = React.useMemo<NavigationMenuItemContextValue>(
        () => ({ value, disabled, isOpen, triggerId, contentId, triggerProxyId }),
        [contentId, disabled, isOpen, triggerId, triggerProxyId, value],
    );

    if (!menu) {
        return null;
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented || !isNavigationKey(event.key)) {
            return;
        }

        // Only while focus is on one of the links the panel holds. Anywhere else these keys are
        // whatever the panel holds makes of them, a text field say, or the trigger's own
        const links = menu.getContentLinks(value);
        const active = document.activeElement as HTMLElement | null;

        if (!active || !links.includes(active)) {
            return;
        }

        // The keys belong to the panel rather than to the page around it, even at either end
        // of the links, where there is nowhere further to go
        event.preventDefault();
        event.stopPropagation();

        navigate(links, active, {
            key: event.key,
            loop: false,
            direction: menu.direction,
        })?.focus();
    };

    return (
        <NavigationMenuItemContext.Provider value={context}>
            <li
                ref={ref}
                className={classNames(classes.root, className)}
                data-component="NavigationMenu.Item"
                data-value={value}
                data-orientation={menu.orientation}
                data-open={isOpen ? "" : undefined}
                data-disabled={disabled ? "" : undefined}
                {...rest}
                onKeyDown={handleKeyDown}
            >
                {children}
            </li>
        </NavigationMenuItemContext.Provider>
    );
}

NavigationMenuItem.displayName = "NavigationMenu.Item";

export default React.forwardRef(NavigationMenuItem);
