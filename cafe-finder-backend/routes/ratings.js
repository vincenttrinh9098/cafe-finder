import express from "express";
import supabase from "../supabase.js";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { body, param, validationResult } from "express-validator";

const router = express.Router();

/*HELPER FUNCTIONS*/
async function getUserFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// reusable validation error handler
function validate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  return null;
}

const reviewSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: "Too many reviews submitted, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const photoUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: "Too many photo uploads, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const VALID_NOISE = ["Very quiet", "Quiet", "Moderate noise", "Loud", "Very loud"];
const VALID_FOOT_TRAFFIC = ["Nearly empty", "Lightly busy", "Busy", "Very Busy"];
const VALID_SEATING = ["Plenty of seats", "Some seats", "Limited seats", "Usually full"];
const VALID_OUTLET = ["Plenty of outlets", "Some outlets available", "Limited outlets", "No visible outlets"];
const VALID_PARKING = ["Plenty of parking", "Moderate parking", "Limited parking", "Very hard to park"];

// GET /api/ratings/reviews/:google_place_id
router.get("/reviews/:google_place_id",
  param("google_place_id").isString().trim().notEmpty().withMessage("Invalid place ID"),
  async (req, res) => {
    if (validate(req, res)) return;
    const { google_place_id } = req.params;
    try {
      const { data: place } = await supabase
        .from("places").select("id").eq("google_place_id", google_place_id).single();
      if (!place) return res.json({ reviews: [] });
      const { data: reviews, error } = await supabase
        .from("ratings").select("*").eq("place_id", place.id).order("created_at", { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      res.json({ reviews });
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" }); // generic message
      console.error(err); // log internally 
    }
  }
);

// GET /api/ratings/attributes/:google_place_id
router.get("/attributes/:google_place_id",
  param("google_place_id").isString().trim().notEmpty().withMessage("Invalid place ID"),
  async (req, res) => {
    if (validate(req, res)) return;
    const { google_place_id } = req.params;
    try {
      const { data: place } = await supabase
        .from("places").select("id").eq("google_place_id", google_place_id).single();
      if (!place) return res.json({ attributes: [] });
      const { data: ratings } = await supabase
        .from("ratings").select("noise, foot_traffic, seating, outlet, parking, study_score").eq("place_id", place.id);
      if (!ratings || ratings.length === 0) return res.json({ attributes: [] });

      const mostCommon = (key) => {
        const counts = {};
        ratings.forEach(r => { if (r[key]) counts[r[key]] = (counts[r[key]] || 0) + 1; });
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
      };

      const getMean = (key) => {
        const values = ratings.map(r => r[key]).filter(v => typeof v === "number");
        if (values.length === 0) return null;
        return Math.round((values.reduce((acc, v) => acc + v, 0) / values.length) * 10) / 10;
      };

      const attributes = [
        mostCommon("noise"),
        mostCommon("foot_traffic"),
        mostCommon("seating"),
        mostCommon("outlet"),
        mostCommon("parking"),
        getMean("study_score"),
      ].filter(Boolean);

      res.json({ attributes });
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" }); // generic message
      console.error(err); // log internally 
    }
  }
);

// POST /api/ratings/upload-photo
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // ← 5MB max file size
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  }
});

router.post("/upload-photo", photoUploadLimiter, upload.single("photo"), async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  try {
    if (!req.file) return res.status(400).json({ error: "No file received" });

    const ext = req.file.originalname.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;

    // retry up to 3 times on SSL errors
    let data, error;
    for (let attempt = 1; attempt <= 3; attempt++) {
      ({ data, error } = await supabase.storage
        .from("review-photos")
        .upload(fileName, req.file.buffer, { contentType: req.file.mimetype }));

      if (!error) break; // success, stop retrying

      console.error(`Upload attempt ${attempt} failed:`, error.message);

      if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt)); // wait 1s, 2s between retries
    }

    if (error) return res.status(500).json({ error: "Upload failed, please try again." });

    const { data: urlData } = supabase.storage.from("review-photos").getPublicUrl(fileName);
    res.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
// POST /api/ratings
router.post("/",
  reviewSubmitLimiter,
  [
    body("google_place_id").isString().trim().notEmpty().withMessage("Missing place ID"),
    body("name").isString().trim().notEmpty().isLength({ max: 200 }).withMessage("Invalid place name"),
    body("address").isString().trim().notEmpty().isLength({ max: 500 }).withMessage("Invalid address"),
    body("noise").isIn(VALID_NOISE).withMessage("Invalid noise value"),
    body("foot_traffic").isIn(VALID_FOOT_TRAFFIC).withMessage("Invalid foot traffic value"),
    body("seating").isIn(VALID_SEATING).withMessage("Invalid seating value"),
    body("outlet").isIn(VALID_OUTLET).withMessage("Invalid outlet value"),
    body("parking").isIn(VALID_PARKING).withMessage("Invalid parking value"),
    body("study_score").isInt({ min: 1, max: 5 }).withMessage("Study score must be 1-5"),
    body("comments").optional().isString().isLength({ max: 1000 }).withMessage("Comment too long"),
    body("photos").optional().isArray({ max: 5 }).withMessage("Too many photos"),
  ],
  async (req, res) => {
    if (validate(req, res)) return;

    const { google_place_id, name, address, foot_traffic, parking, outlet, noise, seating, comments, photos, study_score } = req.body;
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    try {
      const { data: place, error: placeError } = await supabase
        .from("places")
        .upsert({ google_place_id, name, address }, { onConflict: "google_place_id" })
        .select().single();
      if (placeError) return res.status(500).json({ error: placeError.message });

      const { error: ratingError } = await supabase
        .from("ratings")
        .insert({
          place_id: place.id, address, name, foot_traffic, parking, outlet, noise,
          seating, comments, photos, study_score,
          user_id: user.id,
          user_name: user.user_metadata?.name ?? "Anonymous",
        });
      if (ratingError) return res.status(500).json({ error: ratingError.message });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" }); // generic message
      console.error(err); // log internally 
    }
  }
);

// DELETE /api/ratings/:id
router.delete("/:id",
  param("id").isInt({ min: 1 }).withMessage("Invalid review ID"),
  async (req, res) => {
    if (validate(req, res)) return;
    const { id } = req.params;
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { data: rating, error: fetchError } = await supabase
      .from("ratings").select("user_id").eq("id", id).single();
    if (fetchError || !rating) return res.status(404).json({ error: "Review not found" });
    if (rating.user_id !== user.id) return res.status(403).json({ error: "Forbidden" });

    const { error } = await supabase.from("ratings").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  }
);

// PUT /api/ratings/:id
router.put("/:id",
  [
    param("id").isInt({ min: 1 }).withMessage("Invalid review ID"),
    body("comments").optional().isString().isLength({ max: 1000 }).withMessage("Comment too long"),
    body("noise").optional().isIn(VALID_NOISE).withMessage("Invalid noise value"),
    body("foot_traffic").optional().isIn(VALID_FOOT_TRAFFIC).withMessage("Invalid foot traffic value"),
    body("seating").optional().isIn(VALID_SEATING).withMessage("Invalid seating value"),
    body("outlet").optional().isIn(VALID_OUTLET).withMessage("Invalid outlet value"),
    body("parking").optional().isIn(VALID_PARKING).withMessage("Invalid parking value"),
  ],
  async (req, res) => {
    if (validate(req, res)) return;
    const { id } = req.params;
    const { comments, noise, foot_traffic, seating, outlet, parking } = req.body;
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { data: rating, error: fetchError } = await supabase
      .from("ratings").select("user_id").eq("id", id).single();
    if (fetchError || !rating) return res.status(404).json({ error: "Review not found" });
    if (rating.user_id !== user.id) return res.status(403).json({ error: "Forbidden" });

    const { error } = await supabase
      .from("ratings").update({ comments, noise, foot_traffic, seating, outlet, parking }).eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  }
);

export default router;