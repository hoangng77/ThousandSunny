import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";

// Routes
import authRoutes from "./routes/authRoute.js";
import profileRoutes from "./routes/profileRoute.js";
import artistRoutes from "./routes/artistRoute.js";
import consumerRoutes from "./routes/consumerRoute.js";
import discoverRoutes from "./routes/discoverRoute.js";
import portfolioRoutes from "./routes/portfolioRoute.js";
import forYouRoutes from "./routes/forYouRoute.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
try {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected");
} catch (err) {
  console.error("MongoDB connection error, ",err);
}

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/artist", artistRoutes);
app.use("/consumer", consumerRoutes);
app.use("/discover", discoverRoutes);
app.use("/for-you", forYouRoutes);

// Error handling
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

