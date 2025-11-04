import Content from "../../models/content.js";

export const getDiscover = async (req, res) => {
  try {
    const media = await Content.aggregate([{ $sample: { size: 10 } }]);
    res.json({ media });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};