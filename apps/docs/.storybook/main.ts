import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
    // The pages that are about the library rather than about any one component are the app's own
    // and are held here. A component's stories are kept beside the component they are written for,
    // so the rest of what is named here reaches across the workspace into the library the app is
    // the documentation for
    stories: [
        "../stories/**/*.mdx",
        "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
        "../../../packages/react/src/**/*.mdx",
        "../../../packages/react/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    ],
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
