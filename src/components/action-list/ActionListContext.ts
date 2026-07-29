import { createContext } from "react";
import type { ActionListContextValue } from "./ActionList.types";

export const ActionListContext = createContext<ActionListContextValue>({});
