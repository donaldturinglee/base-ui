import { createContext } from "react";
import type {
    NavigationMenuContextValue,
    NavigationMenuItemContextValue,
    NavigationMenuLinkContextValue,
} from "./NavigationMenu.types";

// What the menu holds for every item in it. Standing outside a menu, nothing is open and
// nothing can be opened, so the parts below draw themselves and answer to no one
export const NavigationMenuContext = createContext<NavigationMenuContextValue>({
    openValue: null,
    setOpenValue: () => {},
    orientation: "horizontal",
    openOn: "click",
    openAfterDelay: () => {},
    closeAfterDelay: () => {},
});

// What one item holds for the trigger that opens it and the panel that opens. The empty ids
// are what a trigger or a panel written outside an item reads, and what tells it there is
// nothing there for it to open or be opened by
export const NavigationMenuItemContext = createContext<NavigationMenuItemContextValue>({
    value: "",
    triggerId: "",
    contentId: "",
    isOpen: false,
});

// What one link holds for the sub-list standing under it and for whatever says more about it.
// The empty ids are what a part written outside a link reads, and what tells it there is
// nothing there for it to belong to
export const NavigationMenuLinkContext = createContext<NavigationMenuLinkContextValue>({
    linkId: "",
    descriptionId: "",
});

// The level of the menu's own heading, as a number, so that a group heading can be set one
// level below it. `null` where the menu has no heading, and a group falls back to an h3
export const NavigationMenuHeadingLevelContext = createContext<number | null>(null);

// How deeply a sub-list stands within a panel, which is what steps its links in from the edge.
// The panel itself is the zeroth level
export const NavigationMenuDepthContext = createContext<{ depth: number }>({ depth: 0 });
