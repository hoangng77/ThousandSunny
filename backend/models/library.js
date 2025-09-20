import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true },
    visibility: { type: String, enum: ["public", "private"], default: "private" }
  }, { timestamps: true });

export default mongoose.model('Library', librarySchema);