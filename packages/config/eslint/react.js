import storybook from "eslint-plugin-storybook";
import tseslint from "typescript-eslint";
import base from "./base.js";

// What a package that draws components is linted under: everything every package shares, and
// the Storybook rules the stories are held to on top of it
export default tseslint.config(...base, storybook.configs["flat/recommended"]);
