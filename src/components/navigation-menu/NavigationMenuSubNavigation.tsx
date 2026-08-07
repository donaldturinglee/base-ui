import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { NavigationMenuDepthContext, NavigationMenuLinkContext } from "./NavigationMenuContext";
import type { NavigationMenuSubNavigationProps } from "./NavigationMenu.types";

const classes = {
    // Stepped in from the link it stands under, so that a glance down the panel says which
    // links belong to which. The step compounds as the lists nest
    root: "navigation-menu-sub-navigation",
};

// How deep the lists are allowed to nest. Past this an information architecture is better
// rethought than drawn
const MAX_DEPTH = 4;

// A list of links standing under the link it belongs to, which is what names it. It has to be
// written inside a `NavigationMenu.Link`.
//
// Nothing here opens or shuts. The panel it stands in is the thing that opens, and a reader
// who has already opened one should not have to open another to read what it holds — which is
// where this parts company with a navigation list, whose items are on the page all along and
// so have to fold their sub-lists away to stay readable
function NavigationMenuSubNavigation(
    props: NavigationMenuSubNavigationProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;

    const { linkId } = React.useContext(NavigationMenuLinkContext);
    const { depth } = React.useContext(NavigationMenuDepthContext);

    const depthContextValue = React.useMemo(() => ({ depth: depth + 1 }), [depth]);

    // A sub-list with no link over it has nothing to name it, so there is nothing worth
    // drawing
    if (!linkId || depth >= MAX_DEPTH) {
        return null;
    }

    return (
        <NavigationMenuDepthContext.Provider value={depthContextValue}>
            <ul
                ref={ref}
                aria-labelledby={linkId}
                className={classNames(classes.root, className)}
                data-component="NavigationMenu.SubNavigation"
                data-depth={depth + 1}
                {...rest}
            >
                {children}
            </ul>
        </NavigationMenuDepthContext.Provider>
    );
}

NavigationMenuSubNavigation.displayName = "NavigationMenu.SubNavigation";

export default fixedForwardRef(NavigationMenuSubNavigation);
