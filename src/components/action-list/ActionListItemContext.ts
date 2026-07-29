import { createContext } from "react";
import type { ActionListItemContextValue } from "./ActionList.types";

export const ActionListItemContext = createContext<ActionListItemContextValue>({});
