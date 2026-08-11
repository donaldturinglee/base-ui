import type { Page } from "@playwright/test";

// The globals Storybook reads a story under. Only the theme is named here, since that is the
// one the design tokens are scoped to
type StoryGlobals = {
    theme?: "light" | "dark";
};

// A story is reached through the preview frame rather than through the manager around it, so
// what a suite drives is the component on its own
const storyUrl = (id: string, globals: StoryGlobals) => {
    const search = new URLSearchParams({ id, viewMode: "story" });
    const named = Object.entries(globals).map(([name, value]) => `${name}:${value}`);

    if (named.length > 0) {
        search.set("globals", named.join(","));
    }

    return `/iframe.html?${search}`;
};

// Storybook leaves its root empty until the story has been put on the page, so waiting on
// something inside it is waiting on the component itself
export const openStory = async (page: Page, id: string, globals: StoryGlobals = {}) => {
    await page.goto(storyUrl(id, globals));
    await page.locator("#storybook-root > *").first().waitFor();

    // The scheme is written onto the page by a decorator rather than carried by the URL, so a
    // story asked for under one is only ready to be read once that has happened
    if (globals.theme) {
        await page.locator(`html[data-theme="${globals.theme}"]`).waitFor();
    }
};
