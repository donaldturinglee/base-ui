import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { NavListDepthContext, NavListItemWithSubNavContext } from "./NavListContext";
import type { NavListSubNavProps } from "./NavList.types";

const classes = {
    // Stepped in from the item that opens it, so that a glance down the list says which
    // items belong to which. The step compounds as the lists nest
    root: "list-none m-0 p-0 mt-[var(--base-size-2)] ps-[var(--base-size-16)]",
    // An item standing under another is drawn a little quieter than the one that opens it
    items: "[&_[data-component='ActionList.Item.Label']]:[font-size:var(--text-body-size-small)]",
};

// How deep the lists are allowed to nest. Past this an information architecture is better
// rethought than drawn
const MAX_DEPTH = 4;

// A list of items standing under the item that opens it. It has to be written inside a
// `NavList.Item`, which is what opens it and what names it
function NavListSubNav(
    props: NavListSubNavProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;

    const { buttonId, subNavId, isOpen } = React.useContext(NavListItemWithSubNavContext);
    const { depth } = React.useContext(NavListDepthContext);

    const depthContextValue = React.useMemo(() => ({ depth: depth + 1 }), [depth]);

    // A sub-list with nothing to open it has nothing to name it either, so there is
    // nothing worth drawing
    if (!buttonId || !subNavId || depth >= MAX_DEPTH) {
        return null;
    }

    return (
        <NavListDepthContext.Provider value={depthContextValue}>
            {/* Drawn whether or not it is open, so that the item can tell from what it
                holds whether the page being read is somewhere within it */}
            <ul
                ref={ref}
                id={subNavId}
                hidden={!isOpen}
                aria-labelledby={buttonId}
                className={classNames(classes.root, classes.items, className)}
                data-component="NavList.SubNav"
                data-depth={depth + 1}
                {...rest}
            >
                {children}
            </ul>
        </NavListDepthContext.Provider>
    );
}

NavListSubNav.displayName = "NavList.SubNav";

export default fixedForwardRef(NavListSubNav);
