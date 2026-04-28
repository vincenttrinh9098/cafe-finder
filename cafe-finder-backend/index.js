import express from "express";
import "dotenv/config";
import supabase from "./supabase.js";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));


// Test: fetch all places
app.get("/test", async (req, res) => {
  const { data, error } = await supabase.from("places").select("*");
  if (error) return res.status(500).json({ error });
  res.json({ places: data });
});


app.get("/places", async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    // Fetch from Google
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${process.env.GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const places = data.results.map(p => ({
      google_place_id: p.place_id,
      name: p.name,
      address: p.formatted_address,
      rating: p.rating,
      open_now: p.opening_hours?.open_now,
      lat: p.geometry.location.lat,
      lng: p.geometry.location.lng,
    }));

    res.json({ places });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.use(express.json());

app.post("/rate", async (req, res) => {
  const { google_place_id, name, address, foot_traffic, parking, outlets, noise, vibe } = req.body;

  try {
    // Upsert place
    const { data: place, error: placeError } = await supabase
      .from("places")
      .upsert({ google_place_id, name, address }, { onConflict: "google_place_id" })
      .select()
      .single();

    if (placeError) return res.status(500).json({ error: placeError.message });

    // Insert rating
    const { error: ratingError } = await supabase
      .from("ratings")
      .insert({ place_id: place.id, foot_traffic, parking, outlets, noise, vibe });

    if (ratingError) return res.status(500).json({ error: ratingError.message });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/ratings/:google_place_id", async (req, res) => {
  const { google_place_id } = req.params;

  try {
    const { data: place } = await supabase
      .from("places")
      .select("id")
      .eq("google_place_id", google_place_id)
      .single();

      


    if (!place) return res.json({ ratings: null });

    const { data: ratings } = await supabase
      .from("ratings")
      .select("*")
      .eq("place_id", place.id);

    //console.log("Raw ratings:", JSON.stringify(ratings));
    // Average the numeric metrics
    const avg = (key) => Math.round(ratings.reduce((sum, r) => sum + r[key], 0) / ratings.length);

    res.json({
      count: ratings.length,
      outlets: avg("outlets"),
      noise: avg("noise"),
      foot_traffic: avg("foot_traffic"),
      parking: avg("parking"),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

