import {
    ActionListDescription,
    ActionListDivider,
    ActionListLeadingVisual,
    ActionListTrailingAction,
    ActionListTrailingVisual,
} from "../action-list";
import NavigationListBase from "./NavigationList";
import NavigationListGroup from "./NavigationListGroup";
import NavigationListGroupExpand from "./NavigationListGroupExpand";
import NavigationListGroupHeading from "./NavigationListGroupHeading";
import NavigationListHeading from "./NavigationListHeading";
import NavigationListItem from "./NavigationListItem";
import NavigationListSubNavigation from "./NavigationListSubNavigation";

// The parts an item is built from are the list's own, so that a caller writing a navigation
// list never has to reach for the action list underneath it
export const NavigationList = Object.assign(NavigationListBase, {
    Heading: NavigationListHeading,
    Item: NavigationListItem,
    SubNavigation: NavigationListSubNavigation,
    Group: NavigationListGroup,
    GroupHeading: NavigationListGroupHeading,
    GroupExpand: NavigationListGroupExpand,
    Description: ActionListDescription,
    LeadingVisual: ActionListLeadingVisual,
    TrailingVisual: ActionListTrailingVisual,
    TrailingAction: ActionListTrailingAction,
    Divider: ActionListDivider,
});

export {
    NavigationListHeading,
    NavigationListItem,
    NavigationListSubNavigation,
    NavigationListGroup,
    NavigationListGroupHeading,
    NavigationListGroupExpand,
};
export * from "./NavigationList.types";
