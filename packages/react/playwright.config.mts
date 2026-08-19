import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

// Storybook is an app of its own rather than part of this package, so the directory it is
// started from is read against this file rather than against the directory the run was started
// from, which is what Playwright would otherwise have used
const storybook = fileURLToPath(new URL("../../apps/docs", import.meta.url));

// The same port `npm run storybook` serves on, so a Storybook already up is the one the suites
// are run against rather than a second one beside it
const baseURL = "http://localhost:9000";

export default defineConfig({
    // The suites sit in a directory of their own rather than beside this file, so they are named
    // here instead of being picked up from wherever the config was found, which would take the
    // unit suites under `src` along with them
    testDir: "e2e",
    // Every suite drives a component of its own, so nothing is waiting on anything else
    fullyParallel: true,
    // A test left focused is a test the rest of the suite is not run beside, which is a
    // mistake worth stopping a build over rather than one to find out about later
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? "github" : "list",
    // Storybook builds a story the first time one is asked for, so the suites that reach a
    // component first wait on that build as well as on the component itself. The allowance is
    // for the build rather than for a component taking its time, which is what the shorter one
    // on each assertion is there to catch
    timeout: 60_000,
    expect: {
        timeout: 15_000,
    },
    use: {
        baseURL,
        // Kept only where a test failed and was tried again, so a green run leaves nothing
        // behind to clear up
        trace: "on-first-retry",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    // Storybook is what the components are served from, so it is brought up for the run and
    // left alone where it is already up. It is started from the app the script it is named by
    // belongs to, which is where the stories these suites drive are read through
    webServer: {
        command: "npm run storybook -- --ci --quiet",
        cwd: storybook,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
    },
});
