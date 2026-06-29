/*
Logged in -> Open review form -> Fill out review form -> Submit the review -> User's comment appears
*/


import { test, expect } from "@playwright/test";

test.use({ storageState: "tests/playwright/.auth/user.json" });

test("logged in user can create a review", async ({ page }) => {
  const reviewText = `Playwright test review ${Date.now()}`;

  await page.goto("/discovery");

  // Click on first cafe on discovery
  await page
    .getByRole("link")
    .filter({ hasText: /cafe|coffee|tea|bakery/i })
    .first()
    .click();

  // Validate cafe url
  await expect(page).toHaveURL(/\/place\/[^/]+/);

  // Click on review button
  await page.getByRole("button", { name: /reviews/i }).click();

  // Click "tap to leave a review"
  await page.getByText(/tap to leave a review/i).click();

  // We should see "Write a review" as the heading
  await expect(page.getByText(/write a review/i)).toBeVisible();

  // Fill out the scores and cafe evaluation form
  await page.getByRole("button", { name: /score option 5/i }).click();

  await page.getByRole("button", { name: "Quiet", exact: true }).click();
  await page.getByRole("button", { name: "Lightly busy", exact: true }).click();
  await page.getByRole("button", { name: "Some seats", exact: true }).click();
  await page.getByRole("button", { name: "Some outlets available", exact: true }).click();
  await page.getByRole("button", { name: "Moderate parking", exact: true }).click();

  // Fill out user's comments
  await page
    .getByPlaceholder(/tell us about your experience/i)
    .fill(reviewText);

  // Submit the review
  await page.getByRole("button", { name: /post review/i }).click();
  
  // Should see posted review
  await expect(page.getByText(reviewText)).toBeVisible();
});