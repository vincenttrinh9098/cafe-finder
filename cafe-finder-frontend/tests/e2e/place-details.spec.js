/*
Open home page -> Click on first cafe -> Expect URL to have /place -> Expect cafe page to have heading & review 
*/

import { test, expect } from "@playwright/test";

test("user can open a cafe details page from discovery", async ({ page }) => {
  await page.goto("/discovery");

  const firstCafeLink = page
    .getByRole("link")
    .filter({ hasText: /cafe|coffee|tea|bakery/i })
    .first();

  await expect(firstCafeLink).toBeVisible();
  await firstCafeLink.click();

  await expect(page).toHaveURL(/\/place\/[^/]+/);

  await expect(page.getByRole("heading").first()).toBeVisible();
  await expect(page.getByText(/rating|reviews/i).first()).toBeVisible();
});