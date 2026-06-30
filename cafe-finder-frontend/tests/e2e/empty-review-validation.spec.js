/*
Logged in -> Open review form -> Submit without filling anything -> Required Validation appears
*/

import { test, expect } from "@playwright/test";

test.use({ storageState: "tests/playwright/.auth/user.json" });

test("review form shows required errors when submitted empty", async ({ page }) => {
  await page.goto("/discovery");

  await page
    .getByRole("link")
    .filter({ hasText: /cafe|coffee|tea|bakery/i })
    .first()
    .click();

  await page.getByRole("button", { name: /reviews/i }).click();

  await page.getByText(/tap to leave a review/i).click();

  await page.getByRole("button", { name: /post review/i }).click();

  // Required field messages should appear on the form
  await expect(page.getByText(/\* required/i).first()).toBeVisible();
});