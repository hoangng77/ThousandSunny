import express from "express";
import { protect } from "../middleware/authentication.js";
import { getProfile, updateProfile } from "../controllers/profileControllers/profile.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Protected routes
router.get("/:username", protect, getProfile);
router.put("/edit-profile", protect, upload.single("avatar"), updateProfile);

export default router;
