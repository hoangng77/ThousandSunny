import User from "../../models/user.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { bio, avatarUrl, socialLinks } = req.body;
    if (bio) user.profile.bio = bio;
    if (avatarUrl) user.profile.avatarUrl = avatarUrl;
    if (socialLinks) user.profile.socialLinks = socialLinks;
    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
