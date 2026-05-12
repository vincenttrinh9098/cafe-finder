const BASE_URL = "http://localhost:3000/api";

export async function searchPlaces(query, pagetoken = null) {
  const params = new URLSearchParams({ query });
  if (pagetoken) params.set("pagetoken", pagetoken);
  
  const res = await fetch(`${BASE_URL}/places?${params.toString()}`);
  const data = await res.json();
  return { places: data.places, nextPageToken: data.next_page_token };
}

export async function getRatings(google_place_id) {
  const res = await fetch(`${BASE_URL}/ratings/${google_place_id}`);
  return res.json();
}

export async function getReviews(google_place_id) {
  const res = await fetch(`${BASE_URL}/ratings/reviews/${google_place_id}`);
  const data = await res.json();
  return data.reviews ?? [];
}


export async function submitRating(ratingData) {
  const res = await fetch(`${BASE_URL}/ratings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ratingData),
  });
  return res.json();
}

export async function uploadReviewPhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);

  const res = await fetch(`${BASE_URL}/ratings/upload-photo`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data.url;
}