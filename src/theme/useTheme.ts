import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import type { ColorScheme } from "./Theme.types";

export const useTheme = () => useContext(ThemeContext);

// Picks the value belonging to the active scheme, for the handful of cases a design token
// cannot cover. Anything a token already answers should read the token instead
export const useColorSchemeVar = (
    values: Partial<Record<ColorScheme, string>>,
    fallback: string,
) => {
    const { colorScheme } = useTheme();
    return (colorScheme ? values[colorScheme] : undefined) ?? fallback;
};
