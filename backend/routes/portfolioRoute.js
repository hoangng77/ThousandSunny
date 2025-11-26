import express from "express";
import { protect } from "../middleware/authentication.js";
import { getPortfolio } from "../controllers/artistControllers/portfolio.js";

const router = express.Router();

// Protected routes
router.get("/:username", protect, getPortfolio);

export default router;
