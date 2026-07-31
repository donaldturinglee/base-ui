import type * as React from "react";

// The two schemes `styles/themes.css` defines. Anything outside this set has no design
// tokens standing behind it, so `[data-theme]` would resolve to nothing
export type ColorScheme = "light" | "dark";

// What the subtree is showing. Day and night name the time of day a scheme is meant for,
// so which scheme they resolve to is the caller's to decide; light and dark are aliases
// kept for callers that think in schemes rather than in modes
export type ColorMode = "day" | "night" | "light" | "dark";

export type ColorModeWithAuto = ColorMode | "auto";

export type ThemeProviderProps = {
    // Which mode the subtree is in, where "auto" follows the operating system
    colorMode?: ColorModeWithAuto;
    // The scheme day mode resolves to
    dayScheme?: ColorScheme;
    // The scheme night mode resolves to
    nightScheme?: ColorScheme;
    // Hands the theme to descendants without wrapping them in a `[data-theme]` element.
    // The design tokens then come from whichever ancestor carries the attribute
    contextOnly?: boolean;
    className?: string;
    children?: React.ReactNode;
};

export type ThemeContextValue = {
    // The scheme the mode settled on, and the one written to `[data-theme]`
    colorScheme?: ColorScheme;
    colorMode?: ColorModeWithAuto;
    // What "auto" resolved to, so a nested provider can take the opposite of it
    resolvedColorMode?: ColorMode;
    dayScheme?: ColorScheme;
    nightScheme?: ColorScheme;
    setColorMode: React.Dispatch<React.SetStateAction<ColorModeWithAuto>>;
    setDayScheme: React.Dispatch<React.SetStateAction<ColorScheme>>;
    setNightScheme: React.Dispatch<React.SetStateAction<ColorScheme>>;
};
