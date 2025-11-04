import User from "../../models/user.js";

export const getLibrary = async (req, res) => {
  const user = await User.findById(req.user._id).populate("library.content");
  res.json({ library: user.library });
};

export const addToLibrary = async (req, res) => {
  const { contentId } = req.body;
  const user = await User.findById(req.user._id);
  if (user.library.some(item => item.content.toString() === contentId))
    return res.status(400).json({ message: "Already in library" });
  user.library.push({ content: contentId });
  await user.save();
  res.json({ library: user.library });
};

export const removeFromLibrary = async (req, res) => {
  const { contentId } = req.body;
  const user = await User.findById(req.user._id);
  user.library = user.library.filter(item => item.content.toString() !== contentId);
  await user.save();
  res.json({ library: user.library });
};
