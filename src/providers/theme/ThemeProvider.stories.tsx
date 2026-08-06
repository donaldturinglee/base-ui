import type { StoryFn, Meta } from "@storybook/react-vite";
import { ThemeProvider, useTheme } from ".";
import type { ThemeProviderProps } from "./Theme.types";

const classes = {
    panel: "p-[var(--base-size-16)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default",
};

export default {
    title: "Components/ThemeProvider",
    component: ThemeProvider,
} as Meta<typeof ThemeProvider>;

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

export const Default: StoryFn<typeof ThemeProvider> = () => (
    <ThemeProvider className={classes.panel}>
        <ActiveScheme />
    </ThemeProvider>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<ThemeProviderProps> = (args) => (
    <ThemeProvider {...args} className={classes.panel}>
        <ActiveScheme />
    </ThemeProvider>
);

Playground.args = {
    colorMode: "day",
    dayScheme: "light",
    nightScheme: "dark",
    contextOnly: false,
};

Playground.argTypes = {
    colorMode: {
        control: {
            type: "radio",
        },
        options: ["day", "night", "light", "dark", "auto"],
        description: "Which mode the subtree is in, where auto follows the operating system",
    },
    dayScheme: {
        control: {
            type: "inline-radio",
        },
        options: ["light", "dark"],
        description: "The scheme day mode resolves to",
    },
    nightScheme: {
        control: {
            type: "inline-radio",
        },
        options: ["light", "dark"],
        description: "The scheme night mode resolves to",
    },
    contextOnly: {
        control: {
            type: "boolean",
        },
        description: "Hands the theme to descendants without wrapping them in an element",
    },
    children: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
