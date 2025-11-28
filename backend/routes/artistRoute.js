import express from "express";
import { protect } from "../middleware/authentication.js";
import upload  from "../middleware/upload.js";
import { uploadMedia, updateMedia, deleteMedia, uploadSerializedContent, getProgress, getMedia, getSeries, getArtist} from "../controllers/artistControllers/media.js";
import { getPortfolio } from "../controllers/artistControllers/portfolio.js";
const router = express.Router();



router.post("/upload", protect, upload.single("file"), uploadMedia);
router.put("/content/:id", protect, upload.single("file"), updateMedia);
router.delete("/content/:id", protect, deleteMedia);
router.get("/content/:id", getMedia);
router.get("/portfolio", protect, getPortfolio);
router.get("/progress", protect, getProgress);
router.post("/upload-series", protect, upload.single("file"), uploadSerializedContent);
router.get("/series/:id", protect, getSeries)
router.get("/:id", protect, getArtist);

export default router;