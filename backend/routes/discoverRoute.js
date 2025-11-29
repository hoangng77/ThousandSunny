import express from "express";
import { getDiscover } from "../controllers/discoverControllers/discover.js";
import { protect } from "../middleware/authentication.js";

const router = express.Router();

router.get("/", protect, getDiscover);

export default router;
