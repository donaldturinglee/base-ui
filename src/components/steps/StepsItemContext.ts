import { createContext } from "react";
import type { StepsItemContextValue } from "./Steps.types";

// Carries where a step stands, and how far along it is, from the list down to the step and the
// parts it is drawn from. The list works the status out once and hands it down, so the circle,
// the connector and the words beside them all read from the same answer
export const StepsItemContext = createContext<StepsItemContextValue | null>(null);
