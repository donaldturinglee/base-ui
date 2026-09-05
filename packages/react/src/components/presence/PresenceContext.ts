import { createContext } from "react";
import type { PresenceContextValue } from "./Presence.types";

// Carries where content stands from the component that manages its presence down to the parts
// that draw it, so a component built from parts can hold one presence for all of them
export const PresenceContext = createContext<PresenceContextValue | undefined>(undefined);
