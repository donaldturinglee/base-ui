import * as React from "react";
import { classNames } from "../../lib/classnames";
import { NavigationMenuContext, NavigationMenuItemContext } from "./NavigationMenuContext";
import type { NavigationMenuItemIndicatorProps } from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-item-indicator",
};

// A mark drawn under one item while its panel stands open, for a menu that marks each item in
// place rather than sliding one mark along the row. It is kept from a screen reader, since the
// trigger already says whether its panel is open
function NavigationMenuItemIndicator(
    props: NavigationMenuItemIndicatorProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    const menu = React.useContext(NavigationMenuContext);
    const item = React.useContext(NavigationMenuItemContext);

    // A mark written outside an item has nothing to mark
    if (!menu || !item) {
        return null;
    }

    return (
        <div
            ref={ref}
            aria-hidden="true"
            hidden={!item.isOpen}
            className={classNames(classes.root, className)}
            data-component="NavigationMenu.ItemIndicator"
            data-value={item.value}
            data-orientation={menu.orientation}
            data-open={item.isOpen ? "" : undefined}
            {...rest}
        />
    );
}

NavigationMenuItemIndicator.displayName = "NavigationMenu.ItemIndicator";

export default React.forwardRef(NavigationMenuItemIndicator);
