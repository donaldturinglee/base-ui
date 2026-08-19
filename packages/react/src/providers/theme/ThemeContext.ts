import { createContext } from "react";
import type { ThemeContextValue } from "./Theme.types";

// The setters stand in for a provider that is not there, so `useTheme` can be called from
// anywhere without a null check of its own
export const ThemeContext = createContext<ThemeContextValue>({
    setColorMode: () => null,
    setDayScheme: () => null,
    setNightScheme: () => null,
});
