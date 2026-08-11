import { expect, test } from "@playwright/test";
import { openStory } from "./storybook";

// Every token is scoped to [data-theme], so what a component is painted in is only settled once
// a browser has run the cascade over it. Nothing short of one can say what colour came out
test.describe("Themes", () => {
    test("paints the page in the light tokens", async ({ page }) => {
        await openStory(page, "components-button--default", { theme: "light" });

        await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
        await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    });

    test("paints the page in the dark tokens", async ({ page }) => {
        await openStory(page, "components-button--default", { theme: "dark" });

        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
        await expect(page.locator("body")).not.toHaveCSS("background-color", "rgb(255, 255, 255)");
    });

    test("answers every token of the one scheme with a token of the other", async ({ page }) => {
        const painted = async (theme: "light" | "dark") => {
            await openStory(page, "components-button--default", { theme });

            return page
                .getByRole("button", { name: "Save changes" })
                .evaluate((element) => window.getComputedStyle(element).backgroundColor);
        };

        const light = await painted("light");
        const dark = await painted("dark");

        // A token that went unanswered leaves the button painted the same under both, which
        // is the one thing a scheme is not allowed to do
        expect(light).not.toBe(dark);
    });
});
