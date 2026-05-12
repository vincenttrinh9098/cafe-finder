import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  const { query, pagetoken } = req.query;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
    url.searchParams.set("query", query + " cafe OR tea house OR boba OR bakery");
    url.searchParams.set("key", process.env.GOOGLE_API_KEY);
    if (pagetoken) url.searchParams.set("pagetoken", pagetoken);

    const response = await fetch(url.toString());
    const data = await response.json();

    const places = data.results.map(p => ({
      google_place_id: p.place_id,
      name: p.name,
      address: p.formatted_address,
      rating: p.rating,
      open_now: p.opening_hours?.open_now,
      lat: p.geometry.location.lat,
      lng: p.geometry.location.lng,
      photo_reference: p.photos?.[0]?.photo_reference || null,
    }));

    res.json({ places, next_page_token: data.next_page_token ?? null });
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

router.get("/details", async (req, res) => {
  const { place_id } = req.query;
  if (!place_id) return res.status(400).json({ error: "Missing place_id" });

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,formatted_phone_number,website,opening_hours&key=${process.env.GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("details result:", data.result); 
    res.json(data.result); // sends back { opening_hours: { open_now, weekday_text, periods } }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/nearby", async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: "Missing lat/lng" });

  try {
    const queries = ["cafe", "bakery", "boba", "tea house", "matcha"];

    const fetchQuery = (query) =>
      fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=5000&key=${process.env.GOOGLE_API_KEY}`)
        .then(r => r.json())
        .then(d => d.results ?? []);

    const results = await Promise.all(queries.map(fetchQuery));

    const seen = new Set();
    const merged = results.flat().filter(p => {
      if (seen.has(p.place_id)) return false;
      seen.add(p.place_id);
      return true;
    });

    const places = merged.map(p => ({
      google_place_id: p.place_id,
      name: p.name,
      address: p.formatted_address,
      rating: p.rating,
      open_now: p.opening_hours?.open_now,
      lat: p.geometry.location.lat,
      lng: p.geometry.location.lng,
      photo_reference: p.photos?.[0]?.photo_reference || null,
    }));

    res.json({ places });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 


router.get("/top-rated", async (req, res) => {
  try {
    const types = ["cafe", "bakery"];
    const keywords = ["boba", "tea house", "matcha cafe"];

    const fetchType = (type) =>
      fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${type}&key=${process.env.GOOGLE_API_KEY}`)
        .then(r => r.json())
        .then(d => d.results ?? []);

    const fetchKeyword = (keyword) =>
      fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&type=cafe&key=${process.env.GOOGLE_API_KEY}`)
        .then(r => r.json())
        .then(d => d.results ?? []);

    const [typeResults, keywordResults] = await Promise.all([
      Promise.all(types.map(fetchType)),
      Promise.all(keywords.map(fetchKeyword)),
    ]);

    const seen = new Set();
    const merged = [...typeResults.flat(), ...keywordResults.flat()].filter(p => {
      if (seen.has(p.place_id)) return false;
      seen.add(p.place_id);
      return true;
    });

    const places = merged
      .filter(p => p.rating)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 20)
      .map(p => ({
        google_place_id: p.place_id,
        name: p.name,
        address: p.formatted_address,
        rating: p.rating,
        open_now: p.opening_hours?.open_now,
        lat: p.geometry.location.lat,
        lng: p.geometry.location.lng,
        photo_reference: p.photos?.[0]?.photo_reference || null,
      }));

    res.json({ places });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;