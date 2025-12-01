import express from "express";
import { protect } from "../middleware/authentication.js";
import { getPortfolio, updatePortfolio } from "../controllers/portfolioControllers/portfolio.js";
import upload from "../middleware/upload.js";
const router = express.Router();
// Portfolio Routes
router.get("/:username", protect, getPortfolio);
router.put("/edit-portfolio", protect, upload.single("avatar"), updatePortfolio);

export default router;
