import { defineConfig } from "rolldown";
import { visualizer } from "rollup-plugin-visualizer";

// Resolution, the mixed ESM and CommonJS graph, JSON, and the TypeScript and JSX transforms are
// all Rolldown's own, and the stylesheet is compiled beside the bundle by the Tailwind CLI, so
// the only plugin left is the one that reads what ended up in the bundle
export default defineConfig({
    input: "./src/main.ts",
    // The transforms are read from the same tsconfig the package is written against, so the JSX
    // runtime the components are drawn through is the one they are typed under
    tsconfig: "./tsconfig.json",
    // The stylesheet is published as its own entry point and was never carried by the bundle, so
    // the import that pulls it into the graph is dropped rather than turned into JavaScript
    moduleTypes: {
        ".css": "empty",
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
    plugins: [visualizer()],
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
