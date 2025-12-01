import User from "../../models/user.js";
// Get the list of artists the consumer is following
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("following", "username profile avatarUrl");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ following: user.following });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// Follow an artist
export const followArtist = async (req, res) => {
  try {
    const { artistId } = req.params;

    const artist = await User.findById(artistId);
    if (!artist || artist.role !== "artist") {
      return res.status(404).json({ message: "Artist not found" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { following: artistId } },
      { new: true }
    );

    res.json({ following: user.following });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// Unfollow an artist
export const unfollowArtist = async (req, res) => {
  try {
    const { artistId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { following: artistId } },
      { new: true }
    );

    res.json({ following: user.following });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
