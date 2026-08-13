import { defineConfig } from "vitest/config";

// The config names no root of its own, so the root is where the run was started from, which is
// the package this file sits at the top of and what the include below is read against. Nothing
// here draws anything, so the suites are run under node rather than under a document
export default defineConfig({
    test: {
        environment: "node",
        include: ["src/**/*.test.ts"],
    },
});
