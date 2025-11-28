import express from "express";
import { protect } from "../middleware/authentication.js";
import { getPortfolio, updatePortfolio } from "../controllers/artistControllers/portfolio.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Protected routes
router.get("/:username", protect, getPortfolio);
router.put("/edit-portfolio", protect, upload.single("avatar"), updatePortfolio);

export default router;
