import { createContext } from "react";
import type { BubbleContextValue } from "./Bubble.types";

export const BubbleContext = createContext<BubbleContextValue>({});
