import * as React from "react";
import { classNames } from "../../lib/classnames";
import { NavigationMenuContext, NavigationMenuPositionerContext } from "./NavigationMenuContext";
import type {
    NavigationMenuPositionerContextValue,
    NavigationMenuPositionerProps,
} from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-positioner",
};

// Where the viewport stands: under the row, or beside the column, running the whole length of
// it so that the viewport can be slid along it to whichever item stands open. It says where
// along that item the viewport lines up, and the menu measures the viewport against the item
// from that
function NavigationMenuPositioner(
    props: NavigationMenuPositionerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { children, className, align = "center", ...rest } = props;

    const menu = React.useContext(NavigationMenuContext);

    const context = React.useMemo<NavigationMenuPositionerContextValue>(() => ({ align }), [align]);

    if (!menu) {
        return null;
    }

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="NavigationMenu.Positioner"
            data-orientation={menu.orientation}
            data-align={align}
            {...rest}
        >
            <NavigationMenuPositionerContext.Provider value={context}>
                {children}
            </NavigationMenuPositionerContext.Provider>
        </div>
    );
}

NavigationMenuPositioner.displayName = "NavigationMenu.Positioner";

export default React.forwardRef(NavigationMenuPositioner);
