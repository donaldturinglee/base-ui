import type { Preview } from "@storybook/react-vite";
import "../src/styles/main.css";

const preview: Preview = {
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
