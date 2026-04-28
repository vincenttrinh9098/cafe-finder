import express from "express";
import "dotenv/config";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));