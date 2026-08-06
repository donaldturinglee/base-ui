import { createContext } from "react";
import type { DirectionContextValue, TextDirection } from "./Direction.types";

// A page is read left to right until something says otherwise, which is where `dir` itself
// lands when nothing has set it
export const DEFAULT_DIRECTION: TextDirection = "ltr";

// The default stands in for a provider that is not there, so `useDirection` answers with a
// direction wherever it is called
export const DirectionContext = createContext<DirectionContextValue>({
    direction: DEFAULT_DIRECTION,
});
