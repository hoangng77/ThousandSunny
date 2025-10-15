import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true},
    description: String,
    genre: String,
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    fileUrl: String,
}, { timeStamps: true});

export default mongoose.model('Content', contentSchema);