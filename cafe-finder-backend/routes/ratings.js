import express from "express";
import supabase from "../supabase.js";
import multer from "multer";

const router = express.Router();

// GET /api/ratings/:google_place_id  ← fetch ratings
router.get("/reviews/:google_place_id", async (req, res) => {
  const { google_place_id } = req.params;

  try {
    const { data: place } = await supabase
      .from("places")
      .select("id")
      .eq("google_place_id", google_place_id)
      .single();

    if (!place) return res.json({ reviews: [] });

    const { data: reviews, error } = await supabase
      .from("ratings")
      .select("*")
      .eq("place_id", place.id)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/attributes/:google_place_id", async (req, res) => {
  const { google_place_id } = req.params;

  try {
    const { data: place } = await supabase
      .from("places")
      .select("*")
      .eq("google_place_id", google_place_id)
      .single();

    if (!place) return res.status(404).json({ error: "Not found" });

    const { data: ratings } = await supabase
      .from("ratings")
      .select("noise, foot_traffic, seating, outlet, parking, study_score")
      .eq("place_id", place.id);

    if (!ratings || ratings.length === 0) {
      return res.json({
        ...place,
        attributes: [],
        study_score: null
      });
    }

    const mostCommon = (key) => {
      const counts = {};
      ratings.forEach(r => {
        if (r[key]) counts[r[key]] = (counts[r[key]] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    };

    const getMean = (key) => {
      const values = ratings
        .map(r => r[key])
        .filter(v => typeof v === "number");

      if (!values.length) return null;

      const sum = values.reduce((a, b) => a + b, 0);
      return Math.round((sum / values.length) * 10) / 10;
    };

    const study_score = getMean("study_score");

    const attributes = [
      mostCommon("noise"),
      mostCommon("foot_traffic"),
      mostCommon("seating"),
      mostCommon("outlet"),
      mostCommon("parking"),
    ].filter(Boolean);

    res.json({
      ...place,
      study_score,
      attributes
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//Submit a photos review
const upload = multer({ storage: multer.memoryStorage() });
router.post("/upload-photo", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file received" });
    
    const file = req.file;
    // sanitize filename - remove special characters
    const ext = file.originalname.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;  // ← just use timestamp + extension
    console.log("uploading to supabase:", fileName);

    const { data, error } = await supabase.storage
      .from("review-photos")
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    console.log("supabase upload result:", data, error);

    if (error) return res.status(500).json({ error: error.message });

    const { data: urlData } = supabase.storage
      .from("review-photos")
      .getPublicUrl(fileName);

    res.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ratings                  ← submit a rating
router.post("/", async (req, res) => {
  const { google_place_id, name, address, foot_traffic, parking, outlet, noise, seating, comments,photos, study_score} = req.body;

  try {
    const { data: place, error: placeError } = await supabase
      .from("places")
      .upsert({ google_place_id, name, address }, { onConflict: "google_place_id" })
      .select()
      .single();

    if (placeError) return res.status(500).json({ error: placeError.message });

    const { error: ratingError } = await supabase
      .from("ratings")
      .insert({ place_id: place.id, address, name, foot_traffic, parking, outlet, noise,seating,comments,photos,study_score});
      
    if (ratingError) return res.status(500).json({ error: ratingError.message });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;