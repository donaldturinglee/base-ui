import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// The setup is read from beside this file rather than from the package being tested, since it
// is carried here with the config rather than left in each package
const setupFile = fileURLToPath(new URL("./vitest.setup.ts", import.meta.url));

// The config is shared, so it names no root of its own: the root is the package the suites are
// run from, which is where the paths below are read against
export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: [setupFile],
        include: ["src/**/*.test.{ts,tsx}"],
    },
});
