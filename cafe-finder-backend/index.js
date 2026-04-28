import express from "express";
import "dotenv/config";
import cors from "cors";
import placesRoutes from "./routes/places.js";
import ratingsRoutes from "./routes/ratings.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/places", placesRoutes);
app.use("/api/ratings", ratingsRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

//TEST USING BELOWw
//curl "http://localhost:3000/api/places?query=coffee+shops+in+sacramento" <-get
//curl "http://localhost:3000/api/ratings/ChIJLVU0csPQmoAR2BoDuV6oWXA"      <-get