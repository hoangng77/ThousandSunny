import Content from '../../models/content.js';

export const uploadMedia = async (req, res) => {
    try {
        const { title, description, genre, mediaType, url } = req.body;
        if (!title || !mediaType || !url) {
            return res.status(400).json({ message: "Title, mediaType, and URL are required"});
        }
        if (req.user_role !== 'artist') {
            return res.status(403).json({message: "Only artists can upload media"});
        }

        const media = new Content({
            artist: req.user.id,
            title,
            description,
            genre: mediaType,
            fileUrl: url,
            status: 'published'
        })
        
        await media.save();
        res.status(201).json({message: "Media uploaded successfully", media});
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
}

export const updateMedia = async (req, res) => {
    try {
        const media = await Content.findById(req.params.id);
        if (!media) {
            return res.status(404).json({message: "Media not found"});
        }
        if (media.artist.toString() !== req.user.id) {
            return res.status(403).json({message: "Unauthorized"});
        }
        const updates = req.body;
        Object.assign(media, updates);
        await media.save();
        res.status(200).json({message: "Media updated successfully", media});
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
}

export const deleteMedia = async (req, res) => {
    try {
        const media = await Content.findById(req.params.id);
        if (!media) {
            return res.status(404).json({message: "Media not found"});
        }
        if (media.artist.toString() !== req.user.id) {
            return res.status(403).json({message: "Unauthorized"});
        }
        await media.deleteOne();
        res.status(200).json({message: "Media deleted successfully"});
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
}