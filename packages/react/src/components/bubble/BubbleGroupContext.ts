import { createContext } from "react";
import type { BubbleGroupContextValue } from "./Bubble.types";

export const BubbleGroupContext = createContext<BubbleGroupContextValue>({});
