import NavigationMenuBase from "./NavigationMenu";
import NavigationMenuArrow from "./NavigationMenuArrow";
import NavigationMenuContent from "./NavigationMenuContent";
import NavigationMenuIndicator from "./NavigationMenuIndicator";
import NavigationMenuItem from "./NavigationMenuItem";
import NavigationMenuItemIndicator from "./NavigationMenuItemIndicator";
import NavigationMenuLink from "./NavigationMenuLink";
import NavigationMenuList from "./NavigationMenuList";
import NavigationMenuPositioner from "./NavigationMenuPositioner";
import NavigationMenuTrigger from "./NavigationMenuTrigger";
import NavigationMenuViewport from "./NavigationMenuViewport";

// The parts a menu is built from are the menu's own, so that a caller writing a navigation
// menu never has to reach past it for the row, the panels or the links standing in them
export const NavigationMenu = Object.assign(NavigationMenuBase, {
    List: NavigationMenuList,
    Item: NavigationMenuItem,
    Trigger: NavigationMenuTrigger,
    Content: NavigationMenuContent,
    Link: NavigationMenuLink,
    Indicator: NavigationMenuIndicator,
    ItemIndicator: NavigationMenuItemIndicator,
    Arrow: NavigationMenuArrow,
    Positioner: NavigationMenuPositioner,
    Viewport: NavigationMenuViewport,
});

export {
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    NavigationMenuIndicator,
    NavigationMenuItemIndicator,
    NavigationMenuArrow,
    NavigationMenuPositioner,
    NavigationMenuViewport,
};
export {
    NavigationMenuContext,
    NavigationMenuItemContext,
    NavigationMenuPositionerContext,
} from "./NavigationMenuContext";
export { useNavigationMenu } from "./useNavigationMenu";
export * from "./NavigationMenu.types";
