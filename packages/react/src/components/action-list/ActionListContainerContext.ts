import { createContext } from "react";
import type { ActionListContainerContextValue } from "./ActionList.types";

// Read by a list that has been put inside something else, and written by whatever put it
// there. A menu uses it to hand the list its role, its name, and what to do once an item
// has been picked
export const ActionListContainerContext = createContext<ActionListContainerContextValue>({});
