import { createContext } from "react";
import type { TourContextValue, TourPositionerContextValue } from "./Tour.types";

// Null outside a tour, so a part written on its own can stand down rather than drawing a step
// that is not there
export const TourContext = createContext<TourContextValue | null>(null);

// Where the surface ended up, which the caret is drawn from. It is answered by the positioner
// rather than by the tour, since only the positioner knows which way round the viewport left
// room for the surface to stand
export const TourPositionerContext = createContext<TourPositionerContextValue | null>(null);
