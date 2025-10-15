import express from "express";
import { } from "../controllers/consumerControllers/.js";

const router = express.Router();

router.get("/search", searchMedia);
router.post("/library/:contentId", addToLibrary);
router.delete("/library/:contentId", removeFromLibrary);
router.patch("/libary/:visibility", changeVisibility);
router.post("/progress/:contentId", updateProgress);
router.post("/comments/:contentId", postComment);
router.put("/comments/:contentId", editComment);
router.delete("/comments/:contentId", deleteComment);
router.post("/follow/:artistId", followArtist);
router.put("/follow/:artistId", unfollowArtist);
router.delete("/follow/:artistId", deleteFollow);

export default router;