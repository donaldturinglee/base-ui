import { createContext } from "react";
import type { ActionListGroupContextValue } from "./ActionList.types";

export const ActionListGroupContext = createContext<ActionListGroupContextValue>({});
