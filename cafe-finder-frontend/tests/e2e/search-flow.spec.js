/*
Go to discovery page -> Search for coffee -> Click on first cafe -> Expect URL to have /place -> Expect cafe page to have a heading
*/

import { test, expect } from "@playwright/test";

test("user can search for a cafe and open one result", async ({ page }) => {
  await page.goto("/discovery");

  // Find search input by user-facing placeholder/text
  const searchInput = page.getByRole("textbox").first();

  await searchInput.fill("coffee");
  await searchInput.press("Enter");

  // Wait for results to show/update
  const firstResult = page
    .getByRole("link")
    .filter({ hasText: /coffee|cafe|tea|bakery/i })
    .first();

  await expect(firstResult).toBeVisible();

  await firstResult.click();

  // Confirms user opened a cafe/place details page
  await expect(page).toHaveURL(/\/place\/[^/]+/);
  await expect(page.getByRole("heading").first()).toBeVisible();
});