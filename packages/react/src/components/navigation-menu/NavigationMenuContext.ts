import { createContext } from "react";
import type {
    NavigationMenuContextValue,
    NavigationMenuItemContextValue,
    NavigationMenuPositionerContextValue,
} from "./NavigationMenu.types";

// Null outside a menu, so a part written on its own can stand down rather than drawing a panel
// that has nothing to open it
export const NavigationMenuContext = createContext<NavigationMenuContextValue | null>(null);

// What one item holds for the trigger that opens it and the panel that opens. Null outside an
// item, which is nowhere either of them can work
export const NavigationMenuItemContext = createContext<NavigationMenuItemContextValue | null>(null);

// Where along the open item the viewport lines up. Null outside a positioner, where the
// viewport is left to line up with the middle of the item
export const NavigationMenuPositionerContext =
    createContext<NavigationMenuPositionerContextValue | null>(null);
