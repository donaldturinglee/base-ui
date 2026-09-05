import * as React from "react";
import { classNames } from "../../lib/classnames";
import { NavigationMenuContext } from "./NavigationMenuContext";
import type { NavigationMenuIndicatorProps } from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-indicator",
};

// A mark that slides along the row to whichever item stands open, laid out against the row
// from where the menu measured the open item's trigger to be. Written with a
// `NavigationMenu.Arrow` inside it, it carries the arrow along to point up at the trigger from
// the viewport under it.
//
// It is kept from a screen reader: which item is open is already said by the trigger itself
function NavigationMenuIndicator(
    props: NavigationMenuIndicatorProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    const menu = React.useContext(NavigationMenuContext);

    if (!menu) {
        return null;
    }

    return (
        <div
            ref={ref}
            aria-hidden="true"
            hidden={!menu.open}
            className={classNames(classes.root, className)}
            data-component="NavigationMenu.Indicator"
            data-orientation={menu.orientation}
            data-open={menu.open ? "" : undefined}
            // A menu that has just opened has nowhere for the mark to slide from, so it is put
            // straight under the item rather than slid in from wherever it last stood
            data-still={menu.still ? "" : undefined}
            {...rest}
        />
    );
}

NavigationMenuIndicator.displayName = "NavigationMenu.Indicator";

export default React.forwardRef(NavigationMenuIndicator);
