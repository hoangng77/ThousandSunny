import mongoose from "mongoose";
// Define User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["artist", "consumer"], required: true },
  profile: {
    bio: String,
    avatarUrl: String,
  },
  library: [{ content: { type: mongoose.Schema.Types.ObjectId, ref: "Content" } }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  passwordResetToken: String,
  passwordResetExpires: Date,
  preferredGenres: [{
    genre: String,
    count: { type: Number, default: 1 }
  }],  
}, { timestamps: true });
// Export User model
export default mongoose.model("User", userSchema);
