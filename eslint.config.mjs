// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import tsplugin from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import * as parser from "@typescript-eslint/parser";
import globals from "globals";

export default tseslint.config(eslint.configs.recommended, {
    files: [
        "**/*.js",
        "**/*.cjs",
        "**/*.mjs",
        "**/*.ts"
    ],
    languageOptions: {
        parser: parser,
        globals: {
            ...globals.node,
            process: "readonly",
            console: "readonly",
        },
    },
    plugins: {
        '@typescript-eslint': tsplugin,
        "prettier": prettier,
    },
    rules: {
        // Enforce consistent indentation (4 spaces in this case)
        "indent": ["error", 4],
        // Enforce the use of double quotes for strings
        "quotes": ["error", "double"],
        // Enforce semicolons at the end of statements
        "semi": ["error", "always"],
        // Enforce consistent line breaks (LF for Unix)
        "linebreak-style": ["error", "unix"],
        // Require the use of === and !== (no implicit type conversions)
        "eqeqeq": ["error", "always"],
        // Enforce a maximum line length (usually 80 or 100 characters)
        "max-len": ["error", { code: 100 }],
        // Enable Prettier as a lint rule
        "prettier/prettier": [
            "error",
            {
                singleQuote: false,
                semi: true,
            },
        ],
    },
}, ...tseslint.configs.recommended, storybook.configs["flat/recommended"]);
