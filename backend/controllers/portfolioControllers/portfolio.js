import User from "../../models/user.js";
import Content from "../../models/content.js";
// Get an artist's portfolio
export const getPortfolio = async (req, res) => {
  try {
    const { username } = req.params;

    const artist = await User.findOne({ username: username.toString(), role: "artist" }).lean();
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
// Update an artist's portfolio
export const updatePortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (req.body.bio) {
      user.profile.bio = req.body.bio;
    }

    if (req.file) {
      user.profile.avatarUrl = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
