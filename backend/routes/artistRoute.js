import express from "express";
import { uploadMedia, updateMedia, deleteMedia } from "../controllers/artistControllers/media.js";
import { getPortfolio, getDashboard } from "../controllers/artistControllers/portfolioAndDashboard.js";
import { getProfilePage } from "..controllers/artistControllers/profilePage.js";

const router = express.Router();

router.post("/content", uploadMedia);
router.put("/content/:id", updateMedia);
router.delete("/content/:id", deleteMedia);
router.get("/portfolio/:artist_id", getPortfolio);
router.get("/dashboard", getDashboard);
router.get("/profilePage/:username", getProfilePage);

export default router;