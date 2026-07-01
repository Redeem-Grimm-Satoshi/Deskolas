import { expect, test } from "@playwright/test";

// An unauthenticated visitor to the root is routed to sign in, which shows the
// brand and the sign-in form. Runs with placeholder Supabase keys in CI.
test("root redirects an unauthenticated visitor to sign in", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByText("The cohort help desk.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});
