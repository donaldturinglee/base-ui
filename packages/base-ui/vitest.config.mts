import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// The setup is kept beside the suites it is carried for rather than beside this file, and is
// read against this file rather than against wherever the run was started from
const setupFile = fileURLToPath(new URL("./src/tests/setup.ts", import.meta.url));

// The config names no root of its own, so the root is where the run was started from, which is
// the package this file sits at the top of and what the include below is read against
export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: [setupFile],
        include: ["src/**/*.test.{ts,tsx}"],
    },
});
