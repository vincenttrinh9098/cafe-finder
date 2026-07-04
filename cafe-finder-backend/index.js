import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import "dotenv/config";
import cors from "cors";
import placesRoutes from "./routes/places.js";
import ratingsRoutes from "./routes/ratings.js";
import morgan from "morgan";


const app = express();

const allowedOrigins = [
  "http://localhost:5173",     // local dev
  "http://localhost:4173",     // vite preview
  "http://10.0.0.189:5173",   //network dev
  "https://Beta-Test-Spot-Finder.vercel.app", //vercel domain
  "https://betatestspotfinder-vincenttrinh9098s-projects.vercel.app",
  "https://betatestspotfinder-seven.vercel.app" //given vercel domain
];
//app.use(morgan("combined"));

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (curl, mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// apply helmet to all routes except photo
app.use((req, res, next) => {
  if (req.path.startsWith("/api/places/photo")) {
    // allow cross-origin image loading for photo proxy
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: false,
    })(req, res, next);
  } else {
    helmet({
      contentSecurityPolicy: false, // disable CSP for now, configure properly at deployment
    })(req, res, next);
  }
});

// no global limiter — apply only where needed
app.use("/api/places", placesRoutes);
app.use("/api/ratings", ratingsRoutes);

// export limiters so routes can use them directly

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));