import { createContext } from "react";
import type { ContextMenuItemContextValue } from "./ContextMenu.types";

// Carries the state of an item down to the parts it is drawn from, so the words and the mark
// inside it can be drawn as picked or passed over along with the item itself
export const ContextMenuItemContext = createContext<ContextMenuItemContextValue | undefined>(
    undefined,
);
