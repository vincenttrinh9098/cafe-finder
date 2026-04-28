import express from "express";
import supabase from "../supabase.js";
const router = express.Router();

// GET /api/ratings/:google_place_id  ← fetch ratings
router.get("/:google_place_id", async (req, res) => {
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

    const avg = (key) => Math.round(ratings.reduce((sum, r) => sum + r[key], 0) / ratings.length);

    const result = {
      count: ratings.length,
      outlets: avg("outlets"),
      noise: avg("noise"),
      foot_traffic: avg("foot_traffic"),
      parking: avg("parking"),
    };

    console.log("Ratings result:", result);
    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST /api/ratings                  ← submit a rating
router.post("/", async (req, res) => {
  const { google_place_id, name, address, foot_traffic, parking, outlets, noise, vibe } = req.body;

  try {
    const { data: place, error: placeError } = await supabase
      .from("places")
      .upsert({ google_place_id, name, address }, { onConflict: "google_place_id" })
      .select()
      .single();

    if (placeError) return res.status(500).json({ error: placeError.message });

    const { error: ratingError } = await supabase
      .from("ratings")
      .insert({ place_id: place.id, foot_traffic, parking, outlets, noise});

    if (ratingError) return res.status(500).json({ error: ratingError.message });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;