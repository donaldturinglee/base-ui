import { createContext, useContext } from "react";
import type { UseResizableReturn } from "./useResizable";

// What the group around a part is holding. A part drawn outside a group finds nothing here and
// draws itself as best it can rather than throwing: a trigger with no panels to move is still a
// line, and a panel with no group to lay it out is still a box
export type ResizableContextValue = Partial<UseResizableReturn>;

export const ResizableContext = createContext<ResizableContextValue>({});

export const useResizableContext = () => useContext(ResizableContext);
