import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { navigate } from "./navigate";
import { NavigationMenuContext, NavigationMenuItemContext } from "./NavigationMenuContext";
import type { NavigationMenuLinkProps } from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-link",
};

// The nearest thing a link can belong to: a menu, or a panel standing in one
const SCOPE_SELECTOR =
    "[data-component='NavigationMenu'], [data-component='NavigationMenu.Content']";

// Somewhere to go, written either in the row itself or in a panel. Following one puts the menu
// away: whatever the reader came to the menu for, they have found it.
//
// Written as the router's own link, it is followed by the router while the menu still puts
// itself away behind it
function NavigationMenuLink<As extends React.ElementType = "a">(
    props: NavigationMenuLinkProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "a",
        className,
        current = false,
        closeOnClick = true,
        onClick,
        onKeyDown,
        ...rest
    } = props as NavigationMenuLinkProps<"a">;

    const menu = React.useContext(NavigationMenuContext);
    const item = React.useContext(NavigationMenuItemContext);

    if (!menu) {
        return null;
    }

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);

        // A link opened somewhere else, with the page kept where it is, leaves the menu standing
        // for the next one
        if (closeOnClick && !event.metaKey && !event.ctrlKey) {
            menu.close();
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) {
            return;
        }

        // A link standing in a panel is stepped between by the item around the panel. Only one
        // standing in the row itself moves along the row
        if (
            event.currentTarget
                .closest(SCOPE_SELECTOR)
                ?.matches("[data-component='NavigationMenu.Content']")
        ) {
            return;
        }

        const next = navigate(menu.getTopLevelElements(), event.currentTarget, {
            key: event.key,
            orientation: menu.orientation,
            direction: menu.direction,
            loop: false,
        });

        if (next) {
            next.focus();
            event.preventDefault();
            event.stopPropagation();
        }
    };

    return (
        <Component
            ref={ref}
            aria-current={current ? "page" : undefined}
            className={classNames(classes.root, className)}
            data-component="NavigationMenu.Link"
            data-value={item?.value}
            data-current={current ? "" : undefined}
            {...rest}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        />
    );
}

NavigationMenuLink.displayName = "NavigationMenu.Link";

export default fixedForwardRef(NavigationMenuLink);
