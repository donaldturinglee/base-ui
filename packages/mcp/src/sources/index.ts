import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Registry } from "../registry/registry.types";
import { readSection } from "./entries";
import { readTokens } from "./tokens";

// The design system is read from its own sources rather than from anything written about it, so
// that the registry says what the library says and cannot fall behind it. This is the whole of
// that reading, and it is done once at the end of a build

// Where each of the things the library says about itself is written down, against the root of
// the package they are read from
const COMPONENTS = "src/components";
const PROVIDERS = "src/providers";
const PRIMITIVES = "src/styles/utilities/variables.css";
const LIGHT = "src/styles/themes/light.css";
const DARK = "src/styles/themes/dark.css";

type Manifest = {
    name: string;
    version: string;
};

export const readLibrary = (root: string): Registry => {
    const manifest = JSON.parse(read(root, "package.json")) as Manifest;

    return {
        package: manifest.name,
        version: manifest.version,
        entries: [
            ...readSection(join(root, COMPONENTS), "components", manifest.name),
            ...readSection(join(root, PROVIDERS), "providers", manifest.name),
        ],
        // The primitives are read first, since they are the only ones the library heads with a
        // group and a group said out loud beats one read off the front of a name
        tokens: readTokens([
            { scheme: "static", text: read(root, PRIMITIVES) },
            { scheme: "light", text: read(root, LIGHT) },
            { scheme: "dark", text: read(root, DARK) },
        ]),
    };
};

const read = (root: string, file: string): string => {
    return readFileSync(join(root, file), "utf8");
};

export { readEntry, readSection } from "./entries";
export { readProps, readTypeNames } from "./props";
export { readStories } from "./stories";
export { readTokens } from "./tokens";
