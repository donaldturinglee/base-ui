import { createContext } from "react";
import type { Platform } from "./KeybindingHint.types";

// Stands in for the platform that was detected, so that a test or a story can show what a
// keybinding reads as somewhere other than the machine it is running on. `null` leaves the
// detected platform as it is
export const PlatformContext = createContext<Platform | null>(null);
