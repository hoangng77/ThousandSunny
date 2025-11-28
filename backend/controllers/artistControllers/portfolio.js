import User from "../../models/user.js";
import Content from "../../models/content.js";

export const getPortfolio = async (req, res) => {
  try {
    const { username } = req.params;

    const artist = await User.findOne({ username, role: "artist" }).lean();
    if (!artist) return res.status(404).json({ message: "Artist not found" });

    const media = await Content.find({ artist: artist._id })
      .sort({ createdAt: -1 })
      .lean();

    const followers = await User.find({ following: artist._id })
      .select("username profile.avatarUrl")
      .lean();
    
    const followerCount = followers.length;

    res.json({ 
      artist, 
      media, 
      followers, 
      followerCount 
    });
  } catch (err) {
    console.error("getPortfolio error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePortfolio = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (bio !== undefined) user.profile.bio = bio;

    if (req.file) {
      const avatarPath = `/uploads/${req.file.filename}`;

      user.profile.avatarUrl = avatarPath;
    }

    await user.save();

    res.status(200).json({
      message: "Portfolio updated successfully",
      profile: user.profile,
    });
  } catch (err) {
    console.error("editPortfolio error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
