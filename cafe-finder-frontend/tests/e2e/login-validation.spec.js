/*
Not logged in -> Go to /login -> Click Google sign-in -> Expect google url
*/

import { test, expect } from "@playwright/test";

test("clicking Google sign-in redirects to Supabase OAuth", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("button", { name: /google|continue with google|sign in with google/i }).click();

  await expect(page).toHaveURL(/supabase|google|accounts\.google/i);
});