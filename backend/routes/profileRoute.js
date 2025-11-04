import express from "express";
import { protect } from "../middleware/authentication.js";
import { getProfile, updateProfile } from "../controllers/profileControllers/getProfile.js";

const router = express.Router();

// Protected routes
router.get("/:username", protect, getProfile);
router.put("/", protect, updateProfile);

export default router;
