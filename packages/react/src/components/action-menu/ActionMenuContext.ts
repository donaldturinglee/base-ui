import { createContext } from "react";
import type { ActionMenuContextValue } from "./ActionMenu.types";

// A menu nested inside another one reads this to find the menu it was opened from, so that
// picking an item closes the whole stack rather than one menu of it
export const ActionMenuContext = createContext<ActionMenuContextValue | undefined>(undefined);
