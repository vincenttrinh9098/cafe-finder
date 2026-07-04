import express from "express";
import rateLimit from "express-rate-limit";
import { query, param } from "express-validator";
import { validationResult } from "express-validator";

const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many search requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

// reusable validation error handler
function validate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  return null;
}

// GET /api/places
router.get("/",
  searchLimiter,
  [
    query("query")
      .exists().withMessage("Missing query")
      .isString().withMessage("Missing query")
      .trim()
      .trim()
      .notEmpty().withMessage("Missing query")
      .isLength({ max: 100 }).withMessage("Query too long"),
    /* query("pagetoken")
       .optional()
       .isString()
       .trim()
       .isLength({ max: 500 }).withMessage("Invalid page token"), */
  ],
  async (req, res) => {
    if (validate(req, res)) return;
    const { query: searchQuery, pagetoken, lat, lng } = req.query;

    const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
    url.searchParams.set("query", searchQuery + " cafe OR tea house OR boba OR bakery");
    url.searchParams.set("key", process.env.GOOGLE_API_KEY);
    if (pagetoken) url.searchParams.set("pagetoken", pagetoken);
    if (lat && lng) {
      url.searchParams.set("location", `${lat},${lng}`); //  bias results to user location
      url.searchParams.set("radius", "15000"); // 15km
    }

    try {
      const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
      url.searchParams.set("query", searchQuery + " cafe OR tea house OR boba OR bakery");
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
      res.status(500).json({ error: "Something went wrong" }); // generic message
      console.error(err); // log internally 
    }
  }
);

// GET /api/places/photo
router.get("/photo",
  [
    query("ref")
      .exists().withMessage("Missing ref")
      .isString().withMessage("Missing ref")
      .trim()

      .notEmpty().withMessage("Missing ref")
      .isLength({ max: 500 }).withMessage("Invalid photo reference"),
  ],
  async (req, res) => {
    if (validate(req, res)) return;
    const { ref } = req.query;

    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ref}&key=${process.env.GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    res.set("Content-Type", response.headers.get("content-type"));
    res.send(Buffer.from(buffer));
  }
);

// GET /api/places/details
router.get("/details",
  [
    query("place_id")
      .exists().withMessage("Missing place_id")
      .isString().withMessage("Missing place_id")
      .trim()
      .notEmpty().withMessage("Missing place_id")
      .isLength({ max: 200 }).withMessage("Invalid place ID"),
  ],
  async (req, res) => {
    if (validate(req, res)) return;
    const { place_id } = req.query;

    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,formatted_address,rating,opening_hours,formatted_phone_number,website,geometry,photos&key=${process.env.GOOGLE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      const result = data.result;

      res.json({
        opening_hours: result.opening_hours,
        formatted_phone_number: result.formatted_phone_number,
        website: result.website,
        name: result.name,
        formatted_address: result.formatted_address,
        rating: result.rating,
        lat: result.geometry?.location?.lat,
        lng: result.geometry?.location?.lng,
        photo_reference: result.photos?.[0]?.photo_reference ?? null,
      });
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" }); // generic message
      console.error(err); // log internally 
    }
  }
);

// GET /api/places/nearby
router.get("/nearby",
  [
    query("lat")
      .isFloat({ min: -90, max: 90 }).withMessage("Invalid latitude"),
    query("lng")
      .isFloat({ min: -180, max: 180 }).withMessage("Invalid longitude"),
  ],
  async (req, res) => {
    if (validate(req, res)) return;
    const { lat, lng } = req.query;

    try {
      const queries = ["cafe", "bakery", "boba", "tea house", "matcha"];
      const fetchQuery = (q) =>
        fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q)}&location=${lat},${lng}&radius=5000&key=${process.env.GOOGLE_API_KEY}`)
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
      res.status(500).json({ error: "Something went wrong" }); // generic message
      console.error(err); // log internally 
    }
  }
);

// GET /api/places/top-rated
router.get("/top-rated", async (req, res) => {
  const { lat, lng } = req.query;

  // retry helper
  const fetchWithRetry = async (url, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results ?? [];
      } catch (err) {
        console.error(`Fetch attempt ${i + 1} failed:`, err.message);
        if (i === retries - 1) return []; // return empty on final failure instead of throwing
        await new Promise(r => setTimeout(r, 1000 * (i + 1))); // wait 1s, 2s, 3s
      }
    }
    return [];
  };

  try {
    const types = ["cafe", "bakery"];
    const keywords = ["boba", "tea house", "matcha cafe"];

    const typeResults = await Promise.all(
      types.map(type =>
        fetchWithRetry(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${type}${lat && lng ? `&location=${lat},${lng}&radius=10000` : ''}&key=${process.env.GOOGLE_API_KEY}`)
      )
    );

    const keywordResults = await Promise.all(
      keywords.map(keyword =>
        fetchWithRetry(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&type=cafe&key=${process.env.GOOGLE_API_KEY}`)
      )
    );

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
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /api/places/eta
router.get("/eta",
  [
    query("origin_lat").isFloat({ min: -90, max: 90 }).withMessage("Invalid origin latitude"),
    query("origin_lng").isFloat({ min: -180, max: 180 }).withMessage("Invalid origin longitude"),
    query("dest_lat").isFloat({ min: -90, max: 90 }).withMessage("Invalid destination latitude"),
    query("dest_lng").isFloat({ min: -180, max: 180 }).withMessage("Invalid destination longitude"),
  ],
  async (req, res) => {
    if (validate(req, res)) return;
    const { origin_lat, origin_lng, dest_lat, dest_lng } = req.query;

    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin_lat},${origin_lng}&destinations=${dest_lat},${dest_lng}&mode=driving&key=${process.env.GOOGLE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      const element = data.rows?.[0]?.elements?.[0];
      if (!element || element.status !== "OK") {
        return res.json({ duration: null, distance: null });
      }

      res.json({
        duration: element.duration.text,
        distance: element.distance.text,
      });
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" }); // generic message
      console.error(err); // log internally 
    }
  }
);

export default router;