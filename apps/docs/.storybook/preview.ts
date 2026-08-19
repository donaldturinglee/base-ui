import type { Preview, Renderer } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import "../../../packages/react/src/styles/main.css";

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
        // The sidebar reads in the order the library is learnt in: what it is and how to install
        // it, then what it is drawn from, then the components themselves. Overview is ordered
        // the same way inside, from getting it running to what it is. Anything not named here
        // follows in the order Storybook would have put it in on its own
        options: {
            storySort: {
                order: [
                    "Overview",
                    ["Installation", "Community", "Contributing", "About"],
                    "Primitives",
                    "Components",
                ],
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
