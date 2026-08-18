import { createContext } from "react";
import type { SwapContextValue } from "./Swap.types";

export const SwapContext = createContext<SwapContextValue>({});
