import { expect, test } from "@playwright/test";

// The critical sign-in to close flow replaces this smoke check in Phase 3.
test("home page renders the brand", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Deskolas")).toBeVisible();
  await expect(page.getByText("The cohort help desk.")).toBeVisible();
});
