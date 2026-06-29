# Playwright Notes

## Why Use Playwright?

Playwright allows us to automate browser actions and test our application like a real user.

Benefits:
- Prevent regressions when new features are added
- Catch bugs before deployment
- Test entire user workflows
- Run tests automatically in CI/CD pipelines

Tradeoffs:
- Slower than unit tests
- More setup required

---

## Installation

Installed Playwright in frontend project:

```bash
npm install -D @playwright/test
npx playwright install
```

## Package.json Scripts

Script acts as a shortcut command.

```bash
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:debug": "playwright test --debug"
```
Now we can do: npm run test:e2e

## How to Run Tests

Run all tests:

```bash
npm run test:e2e
```

Run a specific file:

```bash
npx playwright test tests/e2e/place-details.spec.js
```

Run a specific file in debug mode:

```bash
npx playwright test tests/e2e/place-details.spec.js --debug
```

Run all tests in debug mode:

```bash
npm run test:e2e:debug
```

## Test File Naming

Example: discovery.spec.js
.spec.js means 'specification'

Playwright automatically looks for files ending in:
.spec.js
.spec.ts
.test.js
.test.ts

## Playwright functions

test(): creates a test case
- first argument is the test name

expect(): assertion library
- checks that something is true
- example: await expect(page).toHaveURL(/discovery/);
- verifies the browser is on the discovery page

locator(): finds an element on the page
- example: page.locator("body")
- targets the HTML body element

toBeVisible(): verifies the element is visible to the user
- example: await expect(page.locator("body")).toBeVisible();

## What we want to test:
- Discovery → place details
- Search/filter behavior
- Logged-out save/review restrictions
- Review/rating UI rendering
- Authenticated saved cafe flow
- Profile page rendering
- logged in → reviews tab → sees “tap to leave a review”