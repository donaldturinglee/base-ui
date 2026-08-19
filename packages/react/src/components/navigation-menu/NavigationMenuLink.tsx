import * as React from "react";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import NavigationMenuDescription from "./NavigationMenuDescription";
import NavigationMenuLeadingVisual from "./NavigationMenuLeadingVisual";
import NavigationMenuSubNavigation from "./NavigationMenuSubNavigation";
import NavigationMenuTrailingVisual from "./NavigationMenuTrailingVisual";
import {
    NavigationMenuContext,
    NavigationMenuDepthContext,
    NavigationMenuLinkContext,
} from "./NavigationMenuContext";
import type {
    NavigationMenuLinkContextValue,
    NavigationMenuLinkProps,
} from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-link",
    active: "navigation-menu-link-active",
    // The label and whatever the link says about itself are held together, so that the
    // description stands under the label rather than under the visual beside it
    label: "navigation-menu-link-label",
    // A link standing in a sub-list is an item of that list, so the row it makes is an item
    // rather than a link written loose in a panel
    item: "navigation-menu-sub-navigation-item",
};

const slotsConfig = {
    leadingVisual: NavigationMenuLeadingVisual,
    trailingVisual: NavigationMenuTrailingVisual,
    description: NavigationMenuDescription,
    subNavigation: NavigationMenuSubNavigation,
};

// Somewhere to go, written either in the row itself or in a panel. Following one puts the menu
// away: whatever the reader came to the menu for, they have found it.
//
// A link written with a `NavigationMenu.SubNavigation` inside it keeps the place it goes and
// gains the list standing under it, which is what a panel deep enough to need a second level
// is built from
function NavigationMenuLink<As extends React.ElementType = "a">(
    props: NavigationMenuLinkProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "a",
        id,
        className,
        active,
        children,
        onClick,
        ...rest
    } = props as NavigationMenuLinkProps<"a">;

    const { setOpenValue } = React.useContext(NavigationMenuContext);
    const { depth } = React.useContext(NavigationMenuDepthContext);

    const linkId = useId(id);
    const descriptionId = useId();

    const [slots, childrenWithoutSlots] = useSlots(children, slotsConfig);

    const context = React.useMemo<NavigationMenuLinkContextValue>(
        () => ({ linkId, descriptionId }),
        [linkId, descriptionId],
    );

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);

        if (event.defaultPrevented) {
            return;
        }

        setOpenValue(null);
    };

    const link = (
        <Component
            ref={ref}
            id={linkId}
            aria-current={active ? "page" : undefined}
            aria-describedby={slots.description ? descriptionId : undefined}
            className={classNames(classes.root, active && classes.active, className)}
            data-component="NavigationMenu.Link"
            data-active={active ? "" : undefined}
            data-has-description={slots.description ? "" : undefined}
            {...rest}
            onClick={handleClick}
        >
            {slots.leadingVisual}
            <span className={classes.label}>
                {childrenWithoutSlots}
                {slots.description}
            </span>
            {slots.trailingVisual}
        </Component>
    );

    // The sub-list stands after the link rather than inside it, since a link holding a list of
    // links would be one place to go holding several others
    const content = (
        <NavigationMenuLinkContext.Provider value={context}>
            {link}
            {slots.subNavigation}
        </NavigationMenuLinkContext.Provider>
    );

    // A link standing in a sub-list is an item of that list; one standing in a panel is simply
    // a link written there, since a panel is not a list
    return depth === 0 ? content : <li className={classes.item}>{content}</li>;
}

NavigationMenuLink.displayName = "NavigationMenu.Link";

export default fixedForwardRef(NavigationMenuLink);
