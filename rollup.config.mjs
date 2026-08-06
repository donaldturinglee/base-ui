import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import tailwindcss from "@tailwindcss/postcss";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";

export default {
    input: "./src/main.ts",
    output: [
        {
            file: "./build/main.cjs.js",
            format: "cjs",
            sourcemap: false,
        },
        {
            file: "build/main.esm.js",
            format: "esm",
            sourcemap: false,
        },
    ],
    plugins: [
        json(),
        resolve(),
        commonjs(),
        typescript({
            tsconfig: "./tsconfig.json",
            exclude: ["./**/*.test.tsx", "./**/*.stories.tsx"],
        }),
        postcss({
            extract: "styles/main.css",
            minimize: true,
            autoModules: true,
            plugins: [tailwindcss()],
        }),
        visualizer(),
        terser(),
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
};
