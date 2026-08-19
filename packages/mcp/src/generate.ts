import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { readLibrary } from "./sources";

// The last step of a build: the design system is read out of its own sources and written down
// beside the bundle that answers from it. Both paths are read against the package this is run
// from, which is where npm starts a script

const LIBRARY = "../react";
const REGISTRY = "build/registry.json";

const registry = readLibrary(resolve(LIBRARY));

writeFileSync(resolve(REGISTRY), JSON.stringify(registry), "utf8");

const read = `${registry.entries.length} entries and ${registry.tokens.length} tokens`;
console.log(`Read ${read} from ${registry.package} ${registry.version}`);
