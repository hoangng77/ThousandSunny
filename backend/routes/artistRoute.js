import express from "express";
import { protect } from "../middleware/authentication.js";
import upload  from "../middleware/upload.js";
import { uploadMedia, updateMedia, deleteMedia, uploadSerializedContent, getProgress } from "../controllers/artistControllers/media.js";
const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadMedia);
router.put("/content/:id", protect, updateMedia);
router.delete("/content/:id", protect, deleteMedia);
router.get("/progress", protect, getProgress);
router.post("/upload-series", protect, upload.single("file"), uploadSerializedContent);

export default router;