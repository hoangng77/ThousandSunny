import User from "../../models/user.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne( req.params )
  .populate({
    path: "library.content",
    model: "Content",
    select: "title fileUrl genre"
  });
  const libraryArtworks = user.library.map(l => l.content);
    console.log(user);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user, libraryArtworks });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    console.log(req.body.bio);

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
