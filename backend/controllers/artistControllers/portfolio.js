import Content from "../../models/content.js";

export const getPortfolio = async (req, res) => {
    try {
      const media = await Content.find({ artist: req.user._id });
      res.json({ media });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };