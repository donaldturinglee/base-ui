import {
    ActionListDescription,
    ActionListDivider,
    ActionListLeadingVisual,
    ActionListTrailingAction,
    ActionListTrailingVisual,
} from "../action-list";
import NavListBase from "./NavList";
import NavListGroup from "./NavListGroup";
import NavListGroupExpand from "./NavListGroupExpand";
import NavListGroupHeading from "./NavListGroupHeading";
import NavListHeading from "./NavListHeading";
import NavListItem from "./NavListItem";
import NavListSubNav from "./NavListSubNav";

// The parts an item is built from are the list's own, so that a caller writing a nav list
// never has to reach for the action list underneath it
export const NavList = Object.assign(NavListBase, {
    Heading: NavListHeading,
    Item: NavListItem,
    SubNav: NavListSubNav,
    Group: NavListGroup,
    GroupHeading: NavListGroupHeading,
    GroupExpand: NavListGroupExpand,
    Description: ActionListDescription,
    LeadingVisual: ActionListLeadingVisual,
    TrailingVisual: ActionListTrailingVisual,
    TrailingAction: ActionListTrailingAction,
    Divider: ActionListDivider,
});

export {
    NavListHeading,
    NavListItem,
    NavListSubNav,
    NavListGroup,
    NavListGroupHeading,
    NavListGroupExpand,
};
export * from "./NavList.types";
