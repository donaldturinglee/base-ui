import { createContext } from "react";
import type { CollapsibleContextValue } from "./Collapsible.types";

export const CollapsibleContext = createContext<CollapsibleContextValue>({});
