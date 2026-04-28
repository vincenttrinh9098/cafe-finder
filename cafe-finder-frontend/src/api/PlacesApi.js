const BASE_URL = "http://localhost:3000/api";

export async function searchPlaces(query) {
  const res = await fetch(`${BASE_URL}/places?query=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.places;
}

export async function getRatings(google_place_id) {
  const res = await fetch(`${BASE_URL}/ratings/${google_place_id}`);
  return res.json();
}

export async function submitRating(ratingData) {
  const res = await fetch(`${BASE_URL}/ratings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ratingData),
  });
  return res.json();
}