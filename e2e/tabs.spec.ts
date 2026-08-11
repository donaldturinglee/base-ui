import { expect, test } from "@playwright/test";
import { openStory } from "./storybook";

// A tablist is walked with the arrow keys rather than with Tab, and where focus lands after
// each press is what a browser decides. That is what is held here
test.describe("Tabs", () => {
    test.beforeEach(async ({ page }) => {
        await openStory(page, "components-tabs--default");
    });

    test("shows the panel belonging to the tab that is selected", async ({ page }) => {
        const tablist = page.getByRole("tablist", { name: "Repository" });

        await expect(tablist).toBeVisible();
        await expect(page.getByRole("tab", { name: "Overview" })).toHaveAttribute(
            "aria-selected",
            "true",
        );
        await expect(page.getByRole("tabpanel")).toContainText("over the last week");
    });

    test("moves to the tab that is clicked", async ({ page }) => {
        await page.getByRole("tab", { name: "Issues" }).click();

        await expect(page.getByRole("tab", { name: "Issues" })).toHaveAttribute(
            "aria-selected",
            "true",
        );
        await expect(page.getByRole("tabpanel")).toContainText("Twelve issues are open");
    });

    test("holds one stop for the whole tablist", async ({ page }) => {
        await page.keyboard.press("Tab");

        await expect(page.getByRole("tab", { name: "Overview" })).toBeFocused();

        // The second press leaves the tablist for the panel rather than reaching the tab
        // standing beside the one focus is on
        await page.keyboard.press("Tab");

        await expect(page.getByRole("tab", { name: "Issues" })).not.toBeFocused();
    });

    test("walks the tabs with the arrow keys and comes round at the end", async ({ page }) => {
        await page.getByRole("tab", { name: "Overview" }).focus();

        await page.keyboard.press("ArrowRight");
        await expect(page.getByRole("tab", { name: "Issues" })).toBeFocused();

        await page.keyboard.press("ArrowRight");
        await expect(page.getByRole("tab", { name: "Pull requests" })).toBeFocused();

        await page.keyboard.press("ArrowRight");
        await expect(page.getByRole("tab", { name: "Overview" })).toBeFocused();

        await page.keyboard.press("ArrowLeft");
        await expect(page.getByRole("tab", { name: "Pull requests" })).toBeFocused();
    });

    test("goes to the first and the last tab on Home and End", async ({ page }) => {
        await page.getByRole("tab", { name: "Issues" }).focus();

        await page.keyboard.press("End");
        await expect(page.getByRole("tab", { name: "Pull requests" })).toBeFocused();

        await page.keyboard.press("Home");
        await expect(page.getByRole("tab", { name: "Overview" })).toBeFocused();
    });
});
