import * as React from "react";
import { useSyncedState } from "../../hooks/useSyncedState";
import { ThemeContext } from "./ThemeContext";
import { useTheme } from "./useTheme";
import type { ColorMode, ColorModeWithAuto, ColorScheme, ThemeProviderProps } from "./Theme.types";

export const DEFAULT_COLOR_MODE: ColorModeWithAuto = "day";
const DEFAULT_DAY_SCHEME: ColorScheme = "light";
const DEFAULT_NIGHT_SCHEME: ColorScheme = "dark";

const PREFERS_DARK_QUERY = "(prefers-color-scheme: dark)";

// `matchMedia` is not there on the server, and not there in jsdom either, so every reach
// for it is guarded and the mode falls back to day
const subscribeToSystemColorMode = (onStoreChange: () => void) => {
    const mediaQueryList = window?.matchMedia?.(PREFERS_DARK_QUERY);
    mediaQueryList?.addEventListener("change", onStoreChange);
    return () => mediaQueryList?.removeEventListener("change", onStoreChange);
};

const getSystemColorMode = (): ColorMode =>
    window?.matchMedia?.(PREFERS_DARK_QUERY)?.matches ? "night" : "day";

const getServerColorMode = (): ColorMode => "day";

const useSystemColorMode = () =>
    React.useSyncExternalStore<ColorMode>(
        subscribeToSystemColorMode,
        getSystemColorMode,
        getServerColorMode,
    );

const resolveColorMode = (colorMode: ColorModeWithAuto, systemColorMode: ColorMode) =>
    colorMode === "auto" ? systemColorMode : colorMode;

const chooseColorScheme = (
    colorMode: ColorMode,
    dayScheme: ColorScheme,
    nightScheme: ColorScheme,
) => {
    switch (colorMode) {
        case "day":
        case "light":
            return dayScheme;
        case "night":
        case "dark":
            return nightScheme;
    }
};

// Settles on one of the two colour schemes and puts the design tokens behind it within
// reach of everything below
function ThemeProvider({ children, className, contextOnly, ...props }: ThemeProviderProps) {
    // Whatever the caller leaves out comes from a ThemeProvider further up, so a nested
    // provider only has to say what it changes
    const {
        colorMode: fallbackColorMode,
        dayScheme: fallbackDayScheme,
        nightScheme: fallbackNightScheme,
    } = useTheme();

    const [colorMode, setColorMode] = useSyncedState(
        props.colorMode ?? fallbackColorMode ?? DEFAULT_COLOR_MODE,
    );
    const [dayScheme, setDayScheme] = useSyncedState(
        props.dayScheme ?? fallbackDayScheme ?? DEFAULT_DAY_SCHEME,
    );
    const [nightScheme, setNightScheme] = useSyncedState(
        props.nightScheme ?? fallbackNightScheme ?? DEFAULT_NIGHT_SCHEME,
    );

    const systemColorMode = useSystemColorMode();
    const resolvedColorMode = resolveColorMode(colorMode, systemColorMode);
    const colorScheme = chooseColorScheme(resolvedColorMode, dayScheme, nightScheme);

    const context = React.useMemo(
        () => ({
            colorScheme,
            colorMode,
            resolvedColorMode,
            dayScheme,
            nightScheme,
            setColorMode,
            setDayScheme,
            setNightScheme,
        }),
        [
            colorScheme,
            colorMode,
            resolvedColorMode,
            dayScheme,
            nightScheme,
            setColorMode,
            setDayScheme,
            setNightScheme,
        ],
    );

    if (contextOnly) {
        return <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>;
    }

    return (
        <ThemeContext.Provider value={context}>
            <div
                className={className}
                data-component="ThemeProvider"
                // The design tokens are scoped to `[data-theme]`, so this attribute is what
                // brings them onto the page
                data-theme={colorScheme}
                // What `data-theme` cannot say on its own: that the subtree is following the
                // operating system rather than holding a scheme of its own
                data-color-mode={colorMode}
            >
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

ThemeProvider.displayName = "ThemeProvider";

export default ThemeProvider;
