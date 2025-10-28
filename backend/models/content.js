import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  description: String,
  fileUrl: String,
  genre: String,
  status: { type: String, default: "published" },
}, { timestamps: true });

export default mongoose.model("Content", contentSchema);
