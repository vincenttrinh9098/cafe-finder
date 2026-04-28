import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: "Missing query" });
  try {
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
      photo_reference: p.photos?.[0]?.photo_reference || null, // ← add this
    }));
    console.log("Ratings result:", {places});

    res.json({ places });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/photo", async (req, res) => {
  const { ref } = req.query;
  if (!ref) return res.status(400).json({ error: "Missing ref" });

  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ref}&key=${process.env.GOOGLE_API_KEY}`;
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  
  res.set("Content-Type", response.headers.get("content-type"));
  res.send(Buffer.from(buffer));
});

export default router;