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
    }));
    console.log("Ratings result:", {places});

    res.json({ places });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;