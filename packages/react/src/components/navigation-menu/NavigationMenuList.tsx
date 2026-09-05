import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { NavigationMenuContext } from "./NavigationMenuContext";
import type { NavigationMenuListProps } from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-list",
};

// The row the items stand in. It is what an indicator sliding between them is laid out against,
// and what the menu reads to know the order they stand in
function NavigationMenuList(
    props: NavigationMenuListProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { children, className, ...rest } = props;

    const menu = React.useContext(NavigationMenuContext);
    const mergedRef = useMergedRefs(ref, menu?.listRef ?? null);

    if (!menu) {
        return null;
    }

    return (
        <ul
            ref={mergedRef}
            className={classNames(classes.root, className)}
            data-component="NavigationMenu.List"
            data-orientation={menu.orientation}
            {...rest}
        >
            {children}
        </ul>
    );
}

NavigationMenuList.displayName = "NavigationMenu.List";

export default React.forwardRef(NavigationMenuList);
