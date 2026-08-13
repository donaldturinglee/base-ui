import { defineConfig } from "rolldown";

// Two programs are built rather than one: the server a client speaks the protocol to, and the
// script that reads the design system's sources into the registry the server answers from. The
// second is run once at the end of a build and never ships, but it is written in the same
// TypeScript as the first and so is bundled the same way
export default defineConfig({
    input: {
        main: "./src/main.ts",
        generate: "./src/generate.ts",
    },
    // The transform is read from the same tsconfig the package is written against, so what is
    // bundled is what was checked
    tsconfig: "./tsconfig.json",
    // Nothing here reaches a browser, so the runtime's own modules resolve as themselves and
    // are left where they are rather than being followed into the bundle
    platform: "node",
    output: {
        dir: "./build",
        format: "esm",
        entryFileNames: "[name].js",
        // Both entries are started as programs rather than imported, so both say what they
        // are to be run under
        banner: "#!/usr/bin/env node",
        sourcemap: false,
    },
    // The protocol and the schemas the tools are described by are installed alongside the
    // server rather than carried by it, and the compiler the sources are read with is only
    // ever reached for at build time
    external: ["zod", /^@modelcontextprotocol\/sdk/, "typescript"],
});
