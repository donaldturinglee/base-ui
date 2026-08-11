import { createContext } from "react";
import type { ActionBarItemContextValue } from "./ActionBar.types";

// Given to each item by the bar, so that an item knows which of them it is without being
// handed a prop it would then have to pass on
export const ActionBarItemContext = createContext<ActionBarItemContextValue>({});
