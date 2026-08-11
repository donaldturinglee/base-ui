import { defineConfig } from "rolldown";
import postcss from "rollup-plugin-postcss";
import tailwindcss from "@tailwindcss/postcss";
import { visualizer } from "rollup-plugin-visualizer";

// Resolution, the mixed ESM and CommonJS graph, JSON, and the TypeScript and JSX transforms are
// all Rolldown's own, so the only plugins left are the two it has nothing to say about: the
// stylesheet, and the reading of what ended up in the bundle
export default defineConfig({
    input: "./src/main.ts",
    // The transforms are read from the same tsconfig the package is written against, so the JSX
    // runtime the components are drawn through is the one they are typed under
    tsconfig: "./tsconfig.json",
    // Rolldown bundles no CSS of its own. The stylesheet is handed to PostCSS instead, which
    // gives back the JavaScript that carries it, so that is what Rolldown is told to expect
    moduleTypes: {
        ".css": "js",
    },
    output: [
        {
            file: "./build/main.cjs.js",
            format: "cjs",
            sourcemap: false,
            minify: true,
        },
        {
            file: "build/main.esm.js",
            format: "esm",
            sourcemap: false,
            minify: true,
        },
    ],
    plugins: [
        postcss({
            extract: "styles/main.css",
            minimize: true,
            autoModules: true,
            plugins: [tailwindcss()],
        }),
        visualizer(),
    ],
    external: [
        "react",
        "react-dom",
        "react-dom/client",
        "react-is",
        "@oddbird/popover-polyfill/fn",
        "shiki",
        "lexical",
        /^@lexical\//,
        "recharts",
        /^recharts\//,
        "react-resizable-panels",
    ],
});
