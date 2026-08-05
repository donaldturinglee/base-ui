import { createContext } from "react";
import type { HoverCardContextValue } from "./HoverCard.types";

export const HoverCardContext = createContext<HoverCardContextValue>({});
