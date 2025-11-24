import User from "../../models/user.js";

export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("following", "username profile avatarUrl");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ following: user.following });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
  
export const followArtist = async (req, res) => {
  try {
    const { artistId } = req.params;

    if (req.user._id.toString() === artistId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const artist = await User.findById(artistId);
    if (!artist || artist.role !== "artist") {
      return res.status(404).json({ message: "Artist not found" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { following: artistId } },
      { new: true }
    );

    res.json({ following: user.following });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
  
  export const unfollowArtist = async (req, res) => {
  try {
    const { artistId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: artistId } },
      { new: true }
    );

    res.json({ following: user.following });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
