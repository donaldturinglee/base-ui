import { createContext } from "react";
import type { ContextMenuItemGroupContextValue } from "./ContextMenu.types";

// Read by the label of a group to find what it names, and by the items of a group that are
// picked one at a time to find which of them it is
export const ContextMenuItemGroupContext = createContext<
    ContextMenuItemGroupContextValue | undefined
>(undefined);
