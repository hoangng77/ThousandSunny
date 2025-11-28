import mongoose from "mongoose";

const GENRES = [
  "Fantasy",
  "Romance",
  "Horror",
  "Action",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Mystery",
  "Slice of Life",
  "Adventure",
];

const contentSchema = new mongoose.Schema({
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  description: String,
  fileUrl: String,
  genre: { type: String, enum: GENRES, required: true },
  status: { type: String, default: "published" },
  contentType: { type: String, enum: ["single", "series"], default: "single" },
  seriesId: { type: String },
  episodeNumber: Number,
  seriesTitle: String,
  addedToLibraryCount: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

export default mongoose.model("Content", contentSchema);
