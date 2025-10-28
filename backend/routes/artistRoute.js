import express from "express";
import { protect } from "../middleware/authentication.js";
import { uploadMedia, updateMedia, deleteMedia } from "../controllers/artistControllers/media.js";
import { getPortfolio } from "../controllers/artistControllers/portfolio.js";
const router = express.Router();

router.post("/upload", protect, uploadMedia);
router.put("/content/:id", protect, updateMedia);
router.delete("/content/:id", protect, deleteMedia);
router.get("/portfolio", protect, getPortfolio);

export default router;