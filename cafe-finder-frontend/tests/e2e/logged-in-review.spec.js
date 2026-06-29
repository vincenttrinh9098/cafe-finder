/*
Logged in -> Click on cafe page -> Expect to see 'tap to leave a review'
*/

import { test, expect } from "@playwright/test";

test.use({ storageState: "tests/playwright/.auth/user.json" });

test("logged in user sees tap to leave a review", async ({ page }) => {
  await page.goto("/discovery");

  await page
    .getByRole("link")
    .filter({ hasText: /cafe|coffee|tea|bakery/i })
    .first()
    .click();

  await expect(page).toHaveURL(/\/place\/[^/]+/);

  await page.getByRole("button", { name: /reviews/i }).click();

  await expect(page.getByText(/tap to leave a review/i)).toBeVisible();
  await expect(page.getByText(/sign in to leave a review/i)).not.toBeVisible();
});