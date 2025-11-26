import express from "express";
import { getForYou } from "../controllers/foryouControllers/foryou.js";
import { protect } from "../middleware/authentication.js";

const router = express.Router();

router.get("/", protect, getForYou);

export default router;
