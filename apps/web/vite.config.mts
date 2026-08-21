import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    // Tailwind is handed to Vite as a plugin rather than through a PostCSS config, so the
    // stylesheet the app is drawn under is compiled by Tailwind itself and nothing else is
    // asked to walk the CSS on the way
    plugins: [react(), tailwindcss()],
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
