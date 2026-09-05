import * as React from "react";
import { classNames } from "../../lib/classnames";
import { useIsRtl } from "../../providers/direction/useDirection";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Caret } from "../caret";
import { NavigationMenuContext } from "./NavigationMenuContext";
import type { NavigationMenuArrowProps } from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-arrow",
};

// The point the viewport is drawn with to say which item it was opened from. It stands in the
// indicator, which carries it along the row to the open item, and points back the way the row
// does not run: up at an item across a row, and sideways at one down a column
function NavigationMenuArrow(
    props: NavigationMenuArrowProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    const menu = React.useContext(NavigationMenuContext);
    const isRtl = useIsRtl();

    if (!menu) {
        return null;
    }

    // Down a column the panel stands at the end of the item the page is read towards, so the
    // point faces back the other way
    const location = menu.orientation === "horizontal" ? "top" : isRtl ? "right" : "left";

    return (
        <Caret
            ref={ref}
            location={location}
            className={classNames(classes.root, className)}
            data-component="NavigationMenu.Arrow"
            data-orientation={menu.orientation}
            {...rest}
        />
    );
}

NavigationMenuArrow.displayName = "NavigationMenu.Arrow";

export default fixedForwardRef(NavigationMenuArrow);
