import { createContext } from "react";
import type { PortalContextValue } from "./Portal.types";

export const PortalContext = createContext<PortalContextValue>({});
