import express from "express";
import { getDiscover } from "../controllers/discoverControllers/getDiscover.js";

const router = express.Router();

router.get("/", getDiscover);

export default router;
