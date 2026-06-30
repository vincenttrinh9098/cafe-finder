# Vitest Notes

## Why Use Vitest?

Vitest allows us to test individual React components and JavaScript functions without opening a real browser.

Benefits:

* Faster than Playwright tests
* Good for testing component behavior
* Helps catch bugs early
* Easy to mock API calls and authentication
* Useful for increasing frontend test coverage

Tradeoffs:

* Does not test the full browser experience
* Some browser functions may need to be mocked, like `scrollIntoView`

## Why Use Both Playwright and Vitest?

Playwright and Vitest complement each other by testing different layers of the application.

### Vitest (Unit / Component Testing)

Vitest focuses on testing a single component or function in isolation.

Examples:

* Form validation
* Utility functions
* React component rendering
* Button click behavior
* Conditional UI rendering

Advantages:

* Very fast
* Easy to mock APIs and authentication
* Pinpoints exactly where a bug occurs

Example:

Test the `SubmitReview` component and verify that submitting an empty form displays the required field errors without making real API calls.

---

### Playwright (End-to-End Testing)

Playwright tests the application the same way a real user would.

Examples:

* User logs in
* User searches for a cafe
* User navigates to a place page
* User is redirected when not authenticated
* Complete user workflows across multiple pages

Advantages:

* Tests the entire application
* Verifies routing, authentication, and backend integration
* Catches issues that unit tests cannot

Example:

Open the Discovery page, click a cafe, navigate to the Place Details page, open the Reviews tab, and verify that a logged-out user sees **"Sign in to leave a review."**

---

### Why We Needed Both

Neither tool can completely replace the other.

* **Vitest** ensures that individual components work correctly in isolation.
* **Playwright** ensures that all of those components work together as a complete application.

Using both gives us confidence that:

* Individual pieces of the application behave correctly.
* Complete user workflows function correctly from start to finish.

A common testing strategy is:

```text
Many Unit Tests (Vitest)
        ↓
Fewer End-to-End Tests (Playwright)
```

Unit tests are fast and cover most of the application's logic, while end-to-end tests verify the most important user journeys. Together they provide broader test coverage and make the application more reliable.


---

## Installation

Installed Vitest and React Testing Library in frontend project:

```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

For coverage:

```bash
npm install -D @vitest/coverage-v8
```

---

## Package.json Scripts

Script acts as a shortcut command.

```bash
"test": "vitest",
"test:unit": "vitest run",
"test:coverage": "vitest run --coverage"
```

Now we can do:

```bash
npm run test:coverage
```

---

## How to Run Tests

Run all unit tests:

```bash
npm run test:unit
```

Run tests in watch mode:

```bash
npm run test
```

Run coverage:

```bash
npm run test:coverage
```

Run a specific file:

```bash
npx vitest run tests/unit/submit-empty-review.test.jsx
```

---

## Test File Naming

Example:

```bash
submit-empty-review.test.jsx
```

`.test.jsx` means this file contains a test for a React component.

Vitest automatically looks for files ending in:

```bash
.test.js
.test.jsx
.test.ts
.test.tsx
.spec.js
.spec.jsx
.spec.ts
.spec.tsx
```

---

## Vitest Functions

`test()`: creates a test case

* first argument is the test name

Example:

```js
test("submit empty review shows required field errors", async () => {
  // test code
});
```

`expect()`: assertion library

* checks that something is true

Example:

```js
expect(screen.getAllByText(/\* required/i).length).toBeGreaterThan(0);
```

`vi.fn()`: creates a fake function

* useful for mock callbacks or API functions
* tracks if the function was called

Example:

```js
onReviewSubmitted={vi.fn()}
```

`vi.mock()`: replaces a real imported module with a fake version

* useful for mocking Supabase, API calls, or external services

Example:

```js
vi.mock("../../src/lib/supabase.js", () => ({
  default: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));
```

---

## React Testing Library Functions

`render()`: renders the component in the test environment

Example:

```jsx
render(<SubmitReview />);
```

`screen`: searches the rendered page

Example:

```js
screen.getByRole("button", { name: /post review/i });
```

`findByText()`: waits for text to appear

Example:

```js
await screen.findByText(/tap to leave a review/i);
```

`getByRole()`: finds an element by its user-facing role

Example:

```js
screen.getByRole("button", { name: /post review/i });
```

`getAllByText()`: finds all matching text elements

Example:

```js
screen.getAllByText(/\* required/i);
```

`userEvent.setup()`: creates a fake user for interactions

Example:

```js
const user = userEvent.setup();
await user.click(button);
```

---

## Example Test Flow

Test: submit empty review shows required field errors

1. Mock Supabase so the user is logged in
2. Mock API functions so no real backend request is made
3. Render the `SubmitReview` component
4. Click `tap to leave a review`
5. Click `Post Review` without filling anything in
6. Expect required field errors to appear

---

## What We Want to Test

* Submit empty review validation
* Submit valid review
* Review rating selection
* Review photo upload behavior
* API submit function gets called
* Logged-in review form behavior
* Logged-out review restriction
* Error handling when review submission fails
