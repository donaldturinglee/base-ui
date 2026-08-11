import { createContext } from "react";
import type { PopoverContextValue } from "./Popover.types";

export const PopoverContext = createContext<PopoverContextValue>({});
