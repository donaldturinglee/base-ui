import { createContext } from "react";
import type { SelectPanelContextValue } from "./SelectPanel.types";

export const SelectPanelContext = createContext<SelectPanelContextValue>({});
