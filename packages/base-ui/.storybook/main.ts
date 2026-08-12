import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    // Tailwind is handed to Vite as a plugin rather than through a PostCSS config, so the
    // stylesheet the stories are previewed under is compiled by Tailwind itself and nothing
    // else is asked to walk the CSS on the way
    viteFinal: (viteConfig) => ({
        ...viteConfig,
        plugins: [...(viteConfig.plugins ?? []), tailwindcss()],
    }),
};

export default config;
