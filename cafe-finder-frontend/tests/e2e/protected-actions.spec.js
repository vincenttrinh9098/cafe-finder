import { test, expect } from "@playwright/test";

test("logged out user is prompted to sign in before leaving a review", async ({ page }) => {
  await page.goto("/discovery");

  await page
    .getByRole("link")
    .filter({ hasText: /cafe|coffee|tea|bakery/i })
    .first()
    .click();

  await expect(page).toHaveURL(/\/place\/[^/]+/);

  await page.getByRole("button", { name: /reviews/i }).click();

  await expect(page.getByText(/sign in to leave a review/i)).toBeVisible();

  await expect(page.getByText(/tap to leave a review/i)).not.toBeVisible();
});