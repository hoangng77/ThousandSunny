import express from "express";
import { protect } from "../middleware/authentication.js";
import { getLibrary, addToLibrary, removeFromLibrary } from "../controllers/consumerControllers/library.js";
import { getFollowing, followArtist, unfollowArtist } from "../controllers/consumerControllers/following.js";
const router = express.Router();
// Consumer Routes
router.get("/library", protect, getLibrary);
router.post("/library/:contentId", protect, addToLibrary);
router.delete("/library/:contentId", protect, removeFromLibrary);
router.get("/following", protect, getFollowing);
router.post("/following/:artistId", protect, followArtist);
router.delete("/following/:artistId", protect, unfollowArtist);

export default router;