import { expect, test } from "@playwright/test";
import { openStory } from "./storybook";

// The tooltip is drawn on the top layer through the popover API, which is a browser's to give.
// Under a DOM that only stands in for one it is the polyfill that answers instead, so what is
// held here is the real thing
test.describe("Tooltip", () => {
    test.beforeEach(async ({ page }) => {
        await openStory(page, "components-tooltip--default");
    });

    // The tooltip is announced through the trigger rather than in its own right, so it is
    // reached by what it says rather than by the role it carries
    const tooltipIn = (page: Parameters<typeof openStory>[0]) =>
        page.getByText("This cannot be undone");

    test("shows itself once the pointer rests on the trigger", async ({ page }) => {
        const tooltip = tooltipIn(page);

        await expect(tooltip).toBeHidden();

        await page.getByRole("button", { name: "Delete" }).hover();

        await expect(tooltip).toBeVisible();
    });

    test("is opened as a popover rather than laid out beside the trigger", async ({ page }) => {
        await page.getByRole("button", { name: "Delete" }).hover();

        const tooltip = tooltipIn(page);

        await expect(tooltip).toBeVisible();
        await expect(tooltip).toHaveAttribute("popover", "manual");

        // Standing open as a popover is what puts it on the top layer, above whatever the
        // trigger happens to sit within
        const isOnTheTopLayer = await tooltip.evaluate((element) =>
            element.matches(":popover-open"),
        );

        expect(isOnTheTopLayer).toBe(true);
    });

    test("goes away again once the pointer leaves", async ({ page }) => {
        const tooltip = tooltipIn(page);

        await page.getByRole("button", { name: "Delete" }).hover();
        await expect(tooltip).toBeVisible();

        await page.mouse.move(0, 0);
        await expect(tooltip).toBeHidden();
    });

    test("shows itself as soon as the trigger is reached by keyboard", async ({ page }) => {
        const tooltip = tooltipIn(page);

        await page.keyboard.press("Tab");
        await expect(page.getByRole("button", { name: "Delete" })).toBeFocused();
        await expect(tooltip).toBeVisible();

        await page.keyboard.press("Escape");
        await expect(tooltip).toBeHidden();
    });

    test("says what it holds to a reader on the trigger", async ({ page }) => {
        const trigger = page.getByRole("button", { name: "Delete" });
        const tooltip = tooltipIn(page);

        await trigger.hover();
        await expect(tooltip).toBeVisible();

        const tooltipId = await tooltip.getAttribute("id");

        await expect(trigger).toHaveAttribute("aria-describedby", String(tooltipId));
        await expect(tooltip).toHaveAttribute("role", "tooltip");
    });
});
