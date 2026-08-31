import { existsSync } from "node:fs";
import { cp } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Where under the site the Storybook is put, which is the address the page showing it reads it
// from once there is no dev server of its own left to read it from
const storybookPath = "storybook";

// What `storybook build` leaves behind in the docs workspace
const storybookBuild = fileURLToPath(new URL("../docs/storybook-static", import.meta.url));

// The Storybook is the docs workspace's to build, so the site copies in what that build left
// rather than building it a second time.
//
// A site built without it is still a site, so a Storybook that has yet to be built is said rather
// than thrown: everything else the build was asked for has been done by the time this is reached
const storybook = (): Plugin => {
    let outDir = "";

    return {
        name: "storybook",
        apply: "build",
        configResolved(config) {
            outDir = config.build.outDir;
        },
        async closeBundle() {
            if (!existsSync(storybookBuild)) {
                this.warn(
                    "The Storybook has not been built, so the site is built without it. " +
                        "Build it with `npm run build:docs` and build the site again",
                );

                return;
            }

            await cp(storybookBuild, join(outDir, storybookPath), { recursive: true });
        },
    };
};

export default defineConfig({
    // Tailwind is handed to Vite as a plugin rather than through a PostCSS config, so the
    // stylesheet the app is drawn under is compiled by Tailwind itself and nothing else is
    // asked to walk the CSS on the way
    plugins: [react(), tailwindcss(), storybook()],
    server: {
        // The dev server is asked to open the browser once it is listening, so the page the work
        // is looked at through is reached without the URL being carried over by hand
        open: true,
    },
    build: {
        // The rest of the workspace writes what it builds to `build`, and it is that name the
        // task runner is told to cache and the repository is told to ignore
        outDir: "build",
    },
});
