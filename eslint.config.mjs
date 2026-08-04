import storybook from "eslint-plugin-storybook";

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import tsplugin from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import * as parser from "@typescript-eslint/parser";
import globals from "globals";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.js", "**/*.cjs", "**/*.mjs", "**/*.ts"],
        languageOptions: {
            parser: parser,
            globals: {
                ...globals.node,
                process: "readonly",
                console: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": tsplugin,
            prettier: prettier,
        },
        rules: {
            // Enforce consistent indentation (4 spaces in this case)
            // SwitchCase: 1 keeps `case` clauses aligned with Prettier's output
            indent: ["error", 4, { SwitchCase: 1 }],
            // Enforce the use of double quotes for strings
            // avoidEscape allows single quotes when the string contains double quotes
            quotes: ["error", "double", { avoidEscape: true }],
            // Enforce semicolons at the end of statements
            semi: ["error", "always"],
            // Enforce consistent line breaks (LF for Unix)
            "linebreak-style": ["error", "unix"],
            // Require the use of === and !== (no implicit type conversions)
            eqeqeq: ["error", "always"],
            // Enforce a maximum line length (usually 80 or 100 characters)
            "max-len": ["error", { code: 100 }],
            // Allow intentionally unused bindings when prefixed with an underscore
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            // Enable Prettier as a lint rule
            "prettier/prettier": [
                "error",
                {
                    singleQuote: false,
                    semi: true,
                },
            ],
        },
    },
    storybook.configs["flat/recommended"],
);
