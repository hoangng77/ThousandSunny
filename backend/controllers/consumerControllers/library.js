import Library from "../../models/library.js";

export const addToLibrary = async (req, res) => {
  try {
    const { contentId } = req.body;
    if (!contentId) {
      return res.status(400).json({ message: "Content ID is required" });
    }

    let library = await Library.findOne({ user: req.user.id });
    if (!library) {
      library = new Library({ user: req.user.id, items: [] });
    }

    const exists = library.items.some(
      item => item.content.toString() === contentId
    );
    if (exists) {
      return res.status(400).json({ message: "Already in library" });
    }

    library.items.push({ content: contentId });
    await library.save();

    res.status(200).json({
      message: "Added to library",
      library,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const removeFromLibrary = async (req, res) => {
  try {
    const { contentId } = req.body;
    if (!contentId) {
      return res.status(400).json({ message: "Content ID is required" });
    }

    const library = await Library.findOne({ user: req.user.id });
    if (!library) {
      return res.status(404).json({ message: "Library not found" });
    }

    library.items = library.items.filter(
      item => item.content.toString() !== contentId
    );
    await library.save();

    res.status(200).json({
      message: "Removed from library",
      library,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const changeVisibility = async (req, res) => {
  try {
    const library = await Library.findOne({ user: req.user.id });
    if (!library) {
      return res.status(404).json({ message: "Library not found" });
    }

    library.visibility =
      library.visibility === "private" ? "public" : "private";
    await library.save();

    res.status(200).json({
      message: "Visibility updated",
      visibility: library.visibility,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
