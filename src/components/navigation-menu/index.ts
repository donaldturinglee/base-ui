import NavigationMenuBase from "./NavigationMenu";
import NavigationMenuContent from "./NavigationMenuContent";
import NavigationMenuDescription from "./NavigationMenuDescription";
import NavigationMenuDivider from "./NavigationMenuDivider";
import NavigationMenuGroup from "./NavigationMenuGroup";
import NavigationMenuGroupHeading from "./NavigationMenuGroupHeading";
import NavigationMenuHeading from "./NavigationMenuHeading";
import NavigationMenuItem from "./NavigationMenuItem";
import NavigationMenuLeadingVisual from "./NavigationMenuLeadingVisual";
import NavigationMenuLink from "./NavigationMenuLink";
import NavigationMenuList from "./NavigationMenuList";
import NavigationMenuSubNavigation from "./NavigationMenuSubNavigation";
import NavigationMenuTrailingVisual from "./NavigationMenuTrailingVisual";
import NavigationMenuTrigger from "./NavigationMenuTrigger";

// The parts a menu is built from are the menu's own, so that a caller writing a navigation
// menu never has to reach past it for the row, the panels or the links standing in them
export const NavigationMenu = Object.assign(NavigationMenuBase, {
    Heading: NavigationMenuHeading,
    List: NavigationMenuList,
    Item: NavigationMenuItem,
    Trigger: NavigationMenuTrigger,
    Content: NavigationMenuContent,
    Link: NavigationMenuLink,
    SubNavigation: NavigationMenuSubNavigation,
    Group: NavigationMenuGroup,
    GroupHeading: NavigationMenuGroupHeading,
    Description: NavigationMenuDescription,
    LeadingVisual: NavigationMenuLeadingVisual,
    TrailingVisual: NavigationMenuTrailingVisual,
    Divider: NavigationMenuDivider,
});

export {
    NavigationMenuHeading,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    NavigationMenuSubNavigation,
    NavigationMenuGroup,
    NavigationMenuGroupHeading,
    NavigationMenuDescription,
    NavigationMenuLeadingVisual,
    NavigationMenuTrailingVisual,
    NavigationMenuDivider,
};
export {
    NavigationMenuContext,
    NavigationMenuItemContext,
    NavigationMenuLinkContext,
    NavigationMenuHeadingLevelContext,
    NavigationMenuDepthContext,
} from "./NavigationMenuContext";
export * from "./NavigationMenu.types";
