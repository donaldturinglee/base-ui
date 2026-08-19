import * as React from "react";
import { useSlots } from "../../hooks/useSlots";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ActionList } from "../action-list";
import NavigationListItemWithSubNavigation from "./NavigationListItemWithSubNavigation";
import NavigationListSubNavigation from "./NavigationListSubNavigation";
import type { NavigationListItemProps } from "./NavigationList.types";

const slotsConfig = {
    subNavigation: NavigationListSubNavigation,
};

// Which element the item is drawn as is checked at this component's own boundary, so the
// link item is widened here to keep the same generic from being checked twice over, once
// through each of the two polymorphic layers
const LinkItem: React.ElementType = ActionList.LinkItem;

// Somewhere to go in the list, or something to open. An item written with a
// `NavigationList.SubNavigation` inside it opens that list instead of going anywhere, since a row cannot
// both follow a link and open what stands under it
function NavigationListItem<As extends React.ElementType = "a">(
    props: NavigationListItemProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as,
        children,
        className,
        defaultOpen,
        "aria-current": ariaCurrent,
        ...rest
    } = props as NavigationListItemProps<React.ElementType>;

    const [slots, childrenWithoutSlots] = useSlots(children, slotsConfig);

    if (slots.subNavigation) {
        return (
            <NavigationListItemWithSubNavigation
                subNavigation={slots.subNavigation}
                defaultOpen={defaultOpen}
                className={className}
            >
                {childrenWithoutSlots}
            </NavigationListItemWithSubNavigation>
        );
    }

    return (
        <LinkItem
            ref={ref}
            as={as}
            aria-current={ariaCurrent}
            // The item standing for the page being read is the one the list shows
            active={Boolean(ariaCurrent) && ariaCurrent !== "false"}
            className={className}
            data-component="NavigationList.Item"
            {...rest}
        >
            {children}
        </LinkItem>
    );
}

NavigationListItem.displayName = "NavigationList.Item";

export default fixedForwardRef(NavigationListItem);
