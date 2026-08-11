import { createContext } from "react";
import type { ObserveFn } from "./OverflowObserver.types";

// Null stands in for a provider that is not there, which is what tells whatever asked to watch
// the element itself rather than through an observer shared with anything else
export const OverflowObserverContext = createContext<ObserveFn | null>(null);
