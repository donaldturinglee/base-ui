import type { Preview, Renderer } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import "../src/styles/main.css";

const preview: Preview = {
    // The design tokens in styles/themes are scoped to [data-theme], so stories only
    // resolve them once the attribute is set on the preview
    decorators: [
        withThemeByDataAttribute<Renderer>({
            themes: {
                light: "light",
                dark: "dark",
            },
            defaultTheme: "light",
            attributeName: "data-theme",
        }),
    ],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        options: {
            storySort: {
                order: [],
            },
        },
        a11y: {
            context: "body",
            config: {},
            options: {},
        },
        docs: {
            codePanel: true,
        },
    },
    initialGlobals: {
        a11y: {
            manual: false,
        },
    },
};

export default preview;
