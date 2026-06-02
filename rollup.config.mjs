import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
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
            exclude: [
                "./**/*.test.tsx",
                "./**/*.stories.tsx"
            ],
        }),
        postcss({
            extract: "main.css",
            minimize: true,
        }),
        visualizer(),
        terser()
    ],
    external: [
        "react",
        "react-dom"
    ],
};

