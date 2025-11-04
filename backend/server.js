import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoute.js";
import profileRoutes from "./routes/profileRoute.js";
import artistRoutes from "./routes/artistRoute.js";
import consumerRoutes from "./routes/consumerRoute.js";
import discoverRoutes from "./routes/discoverRoute.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/artist", artistRoutes);
app.use("/consumer", consumerRoutes);
app.use("/discover", discoverRoutes);

// Error handling
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
