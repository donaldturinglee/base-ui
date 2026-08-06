import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import {
    NavigationListDepthContext,
    NavigationListItemWithSubNavigationContext,
} from "./NavigationListContext";
import type { NavigationListSubNavigationProps } from "./NavigationList.types";

const classes = {
    // Stepped in from the item that opens it, so that a glance down the list says which
    // items belong to which. The step compounds as the lists nest
    root: "navigation-list-sub-navigation",
    items: "navigation-list-sub-navigation-items",
};

// How deep the lists are allowed to nest. Past this an information architecture is better
// rethought than drawn
const MAX_DEPTH = 4;

// A list of items standing under the item that opens it. It has to be written inside a
// `NavigationList.Item`, which is what opens it and what names it
function NavigationListSubNavigation(
    props: NavigationListSubNavigationProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;

    const { buttonId, subNavigationId, isOpen } = React.useContext(
        NavigationListItemWithSubNavigationContext,
    );
    const { depth } = React.useContext(NavigationListDepthContext);

    const depthContextValue = React.useMemo(() => ({ depth: depth + 1 }), [depth]);

    // A sub-list with nothing to open it has nothing to name it either, so there is
    // nothing worth drawing
    if (!buttonId || !subNavigationId || depth >= MAX_DEPTH) {
        return null;
    }

    return (
        <NavigationListDepthContext.Provider value={depthContextValue}>
            {/* Drawn whether or not it is open, so that the item can tell from what it
                holds whether the page being read is somewhere within it */}
            <ul
                ref={ref}
                id={subNavigationId}
                hidden={!isOpen}
                aria-labelledby={buttonId}
                className={classNames(classes.root, classes.items, className)}
                data-component="NavigationList.SubNavigation"
                data-depth={depth + 1}
                {...rest}
            >
                {children}
            </ul>
        </NavigationListDepthContext.Provider>
    );
}

NavigationListSubNavigation.displayName = "NavigationList.SubNavigation";

export default fixedForwardRef(NavigationListSubNavigation);
