import { createContext } from "react";
import type { TabsContextValue } from "./Tabs.types";

// Carries what is selected, and the way to select something else, from the tabs down to the
// tablist, the tabs and the panels standing inside them
export const TabsContext = createContext<TabsContextValue | null>(null);
