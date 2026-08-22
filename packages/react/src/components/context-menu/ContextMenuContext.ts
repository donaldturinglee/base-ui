import { createContext } from "react";
import type { ContextMenuContextValue } from "./ContextMenu.types";

// The menu holds the state and the parts of it read this to find it. The trigger writes the
// press that opened the menu here, and the overlay reads it back to know where to stand
export const ContextMenuContext = createContext<ContextMenuContextValue | undefined>(undefined);
