import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { test, expect, vi } from "vitest";
import { SubmitReview } from "../../src/pages/place-details/TabPlacesContent/reviews/submitReview.jsx"

vi.mock("../../src/lib/supabase.js", () => ({
  default: {
    auth: {
      getSession: vi.fn(() =>
        Promise.resolve({
          data: {
            session: {
              user: {
                id: "test-user",
                user_metadata: { name: "Test User" },
              },
            },
          },
        })
      ),
    },
  },
}));

vi.mock("../../../../api/placesApi.js", () => ({
  submitRating: vi.fn(),
  uploadReviewPhoto: vi.fn(),
}));

test("submit empty review shows required field errors", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <SubmitReview
        place={{
          google_place_id: "test-place-id",
          name: "Test Cafe",
          address: "123 Test St",
        }}
        onReviewSubmitted={vi.fn()}
      />
    </MemoryRouter>
  );

  await user.click(await screen.findByText(/tap to leave a review/i));

  await user.click(screen.getByRole("button", { name: /post review/i }));

  expect(screen.getAllByText(/\* required/i).length).toBeGreaterThan(0);
});