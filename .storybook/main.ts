import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-webpack5-compiler-swc",
        "@storybook/addon-docs",
        "@storybook/addon-a11y",
        {
            name: "@storybook/addon-styling-webpack",
            options: {
                rules: [
                    {
                        test: /\.module\.s[ac]ss$/i,
                        use: [
                            "style-loader",
                            {
                                loader: "css-loader",
                                options: {
                                    modules: {
                                        namedExport: false,
                                        localIdentName: "[name]__[local]--[hash:base64:5]",
                                    },
                                },
                            },
                            "sass-loader",
                        ],
                    },
                    {
                        test: /\.s[ac]ss$/i,
                        exclude: /\.module\.s[ac]ss$/i,
                        use: ["style-loader", "css-loader", "sass-loader"],
                    },
                ],
            },
        },
    ],
    framework: {
        name: "@storybook/react-webpack5",
        options: {},
    },
};

export default config;
