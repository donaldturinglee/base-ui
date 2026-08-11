import { useContext } from "react";
import { OverflowObserverContext } from "./OverflowObserverContext";

// The shared observer of the nearest provider, or null where there is none above, in which case
// whatever asked is left to watch the element on its own
export const useOverflowObserver = () => useContext(OverflowObserverContext);
