import type { StoryFn } from "@storybook/react-vite";
import { ThemeProvider, useColorSchemeVar, useTheme } from ".";

const classes = {
    panel: "p-[var(--base-size-16)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default",
    nested: "mt-[var(--base-size-16)]",
};

export default {
    title: "Components/ThemeProvider/Features",
};

const ActiveScheme = () => {
    const { colorScheme, colorMode, resolvedColorMode } = useTheme();

    return (
        <div>
            Colour scheme: {colorScheme}
            <br />
            Colour mode: {colorMode}, resolved to {resolvedColorMode}
        </div>
    );
};

// Nested
export const Nested: StoryFn<typeof ThemeProvider> = () => {
    // A provider that takes the opposite of whatever the one above it settled on
    const Inverse = () => {
        const { resolvedColorMode } = useTheme();

        return (
            <ThemeProvider
                colorMode={resolvedColorMode === "day" ? "night" : "day"}
                className={`${classes.panel} ${classes.nested}`}
            >
                Always the inverse of the mode above
                <ActiveScheme />
            </ThemeProvider>
        );
    };

    return (
        <ThemeProvider colorMode="day" className={classes.panel}>
            <ActiveScheme />
            <ThemeProvider colorMode="night" className={`${classes.panel} ${classes.nested}`}>
                Always night mode
                <ActiveScheme />
            </ThemeProvider>
            <Inverse />
        </ThemeProvider>
    );
};

// Auto
export const Auto: StoryFn<typeof ThemeProvider> = () => (
    <ThemeProvider colorMode="auto" className={classes.panel}>
        Follows the operating system
        <ActiveScheme />
    </ThemeProvider>
);

// Context Only
export const ContextOnly: StoryFn<typeof ThemeProvider> = () => (
    <ThemeProvider colorMode="night" className={classes.panel}>
        The wrapper here carries the design tokens
        {/* Nothing is wrapped, so the tokens above still stand */}
        <ThemeProvider contextOnly colorMode="day">
            <ActiveScheme />
        </ThemeProvider>
    </ThemeProvider>
);

// With Color Scheme Var
export const WithColorSchemeVar: StoryFn<typeof ThemeProvider> = () => {
    // For the handful of cases a design token cannot cover
    const Swatch = () => {
        const border = useColorSchemeVar(
            { light: "var(--base-color-blue-5)", dark: "var(--base-color-yellow-3)" },
            "currentColor",
        );

        return (
            <div className={classes.panel} style={{ borderColor: border }}>
                A border the design tokens have no name for
                <ActiveScheme />
            </div>
        );
    };

    return (
        <ThemeProvider colorMode="auto">
            <Swatch />
        </ThemeProvider>
    );
};
