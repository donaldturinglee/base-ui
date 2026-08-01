import { createContext } from "react";
import type { DrawerContextValue } from "./Drawer.types";

export const DrawerContext = createContext<DrawerContextValue>({});
