import supabase from '../lib/supabase.js';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export async function getPlaceAttributes(google_place_id) {
  const res = await fetch(`${BASE_URL}/ratings/attributes/${google_place_id}`);
  const data = await res.json();
  return data.attributes ?? [];
}

export async function getNearbyPlaces(lat, lng, pagetoken = null) {
  const params = new URLSearchParams({ lat, lng });
  if (pagetoken) params.set("pagetoken", pagetoken);
  const res = await fetch(`${BASE_URL}/places/nearby?${params.toString()}`);
  const data = await res.json();
  return { places: data.places ?? [], nextPageToken: data.next_page_token ?? null };
}

export async function getTopRatedPlaces() {
  const res = await fetch(`${BASE_URL}/places/top-rated`);
  const data = await res.json();
  return data.places ?? [];
}

export async function submitRating(ratingData) {
  const { data: { session } } = await supabase.auth.getSession();
  //console.log("session:", session); 
  if (!session) throw new Error("SESSION_EXPIRED"); // throw specific error

  const res = await fetch(`${BASE_URL}/ratings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(ratingData),
  });
  return res.json();
}

export async function uploadReviewPhoto(file) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("SESSION_EXPIRED");

  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from("review-photos")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from("review-photos")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}


export async function deleteReview(id) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("SESSION_EXPIRED"); // throw specific error
  const res = await fetch(`${BASE_URL}/ratings/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${session?.access_token}`,
    },
  });
  return res.json();
}

export async function updateReview(id, data) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("SESSION_EXPIRED"); //  throw specific error
  const res = await fetch(`${BASE_URL}/ratings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}