import { createContext } from "react";
import type { Map as OlMap } from "ol";

// A map cannot be built until the element it draws into is there, which is one render later than
// the children that attach themselves to it. The context therefore starts out empty rather than
// keeping those children from rendering, and everything reading it waits for the map to arrive
export const MapContext = createContext<OlMap | undefined>(undefined);
