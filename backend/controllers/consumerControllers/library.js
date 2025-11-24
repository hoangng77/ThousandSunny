import User from "../../models/user.js";
import Content from "../../models/content.js";

export const getLibrary = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("library.content");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ library: user.library });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addToLibrary = async (req, res) => {
  try {
    const { contentId } = req.body;

    const user = await User.findById(req.user.id);
    const content = await Content.findById(contentId);

    if (!content) return res.status(404).json({ message: "Content not found" });
    if (!user.library) {
      user.library = [];
    }

    if (user.library.some(item => item.content.toString() === contentId)) {
      return res.status(400).json({ message: "Already in library" });
    }

    user.library.push({ content: contentId });

    content.addedToLibraryCount += 1;

    const genreIndex = user.preferredGenres
      .findIndex(g => g.genre === content.genre);

    if (genreIndex >= 0) {
      user.preferredGenres[genreIndex].count += 1;
    } else {
      user.preferredGenres.push({
        genre: content.genre,
        count: 1
      });
    }

    await user.save();
    await content.save();

    res.json({ library: user.library });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const removeFromLibrary = async (req, res) => {
  try {
    const { contentId } = req.body;

    const user = await User.findById(req.user._id);
    const content = await Content.findById(contentId);

    if (!content) return res.status(404).json({ message: "Content not found" });

    const beforeLength = user.library.length;
    user.library = user.library.filter(
      item => item.content.toString() !== contentId
    );

    if (user.library.length === beforeLength) {
      return res.status(400).json({ message: "Not found in library" });
    }

    if (content.addedToLibraryCount > 0) {
      content.addedToLibraryCount -= 1;
    }

    await user.save();
    await content.save();

    res.json({ library: user.library });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

