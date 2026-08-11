import { createContext } from "react";
import type { ActionBarContextValue } from "./ActionBar.types";

export const ActionBarContext = createContext<ActionBarContextValue>({ size: "medium" });
