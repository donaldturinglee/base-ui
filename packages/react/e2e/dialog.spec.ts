import { expect, test } from "@playwright/test";
import { openStory } from "./storybook";

// What a dialog does with focus is what a browser does with focus, so it is held to that here
// rather than under a DOM that only stands in for one
test.describe("Dialog", () => {
    test.beforeEach(async ({ page }) => {
        await openStory(page, "components-dialog--default");
    });

    test("opens on the trigger and puts focus inside itself", async ({ page }) => {
        await page.getByRole("button", { name: "Show dialog" }).click();

        const dialog = page.getByRole("dialog", { name: "Delete repository" });

        await expect(dialog).toBeVisible();
        await expect(dialog).toHaveAttribute("aria-modal", "true");
        await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
    });

    test("holds focus within itself as the reader tabs round", async ({ page }) => {
        await page.getByRole("button", { name: "Show dialog" }).click();

        const dialog = page.getByRole("dialog", { name: "Delete repository" });

        await expect(dialog).toBeVisible();

        // Tabbing off the last thing inside comes round to the first rather than reaching
        // the trigger standing behind the dialog
        for (let step = 0; step < 6; step++) {
            await page.keyboard.press("Tab");
            await expect(dialog.locator(":focus")).toHaveCount(1);
        }
    });

    test("closes on Escape and hands focus back to the trigger", async ({ page }) => {
        const trigger = page.getByRole("button", { name: "Show dialog" });

        await trigger.click();

        const dialog = page.getByRole("dialog", { name: "Delete repository" });

        await expect(dialog).toBeVisible();

        await page.keyboard.press("Escape");

        await expect(dialog).toBeHidden();
        await expect(trigger).toBeFocused();
    });

    test("closes on the backdrop and stands its ground on the dialog itself", async ({ page }) => {
        await page.getByRole("button", { name: "Show dialog" }).click();

        const dialog = page.getByRole("dialog", { name: "Delete repository" });

        await expect(dialog).toBeVisible();

        await dialog.click();
        await expect(dialog).toBeVisible();

        // The corner of the viewport is backdrop wherever the dialog has settled
        await page.mouse.click(4, 4);
        await expect(dialog).toBeHidden();
    });

    test("holds the page still while it stands open", async ({ page }) => {
        const body = page.locator("body");

        await expect(body).not.toHaveAttribute("data-dialog-scroll-disabled");

        await page.getByRole("button", { name: "Show dialog" }).click();
        await expect(page.getByRole("dialog", { name: "Delete repository" })).toBeVisible();
        await expect(body).toHaveCSS("overflow", "hidden");

        await page.keyboard.press("Escape");
        await expect(body).not.toHaveAttribute("data-dialog-scroll-disabled");
    });
});
