import { createContext } from "react";
import type { TooltipContextValue } from "./Tooltip.types";

// Lets anything inside the trigger find the id of the tooltip naming or describing it
export const TooltipContext = createContext<TooltipContextValue>({});
