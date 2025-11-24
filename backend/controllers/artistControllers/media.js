import Content from '../../models/content.js';

export const uploadMedia = async (req, res) => {
    try {
        const { title, description, genre } = req.body;

        if (!title || !req.file) {
            return res.status(400).json({ message: "Title and file are required" });
        }
        if (req.user.role !== 'artist') {
            return res.status(403).json({ message: "Only artists can upload media" });
        }

        const media = new Content({
            artist: req.user._id,
            title,
            description,
            genre,
            fileUrl: req.file.path, // Save the file path from multer
            status: 'published',
        });
        
        await media.save();
        res.status(201).json({message: "Media uploaded successfully", media});
    } catch (err) {
        console.error("Error in uploadMedia:", err);
        res.status(500).json({message: "Server error", error: err.message});
    }
}

export const uploadSerializedContent = async (req, res) => {
    try {
        const { title, description, genre, seriesTitle, episodeNumber, seriesId } = req.body;

        if (!title || !req.file) {
            return res.status(400).json({ message: "Title and file are required" });
        }
        if (req.user.role !== 'artist') {
            return res.status(403).json({ message: "Only artists can upload media" });
        }
        if (!episodeNumber || !seriesTitle) {
            return res.status(400).json({ message: "Episode number and series title are required" });
        }

        const media = new Content({
            artist: req.user._id,
            title,
            description,
            genre,
            fileUrl: req.file.path,
            status: 'published',
            contentType: 'series',
            seriesId: seriesId || null,
            episodeNumber,
            seriesTitle,
        });
        
        await media.save();
        res.status(201).json({message: "Serialized content uploaded successfully", media});
    } catch (err) {
        console.error("Error in uploadSerializedContent:", err);
        res.status(500).json({message: "Server error", error: err.message});
    }
}

export const getProgress = async (req, res) => {
  try {
    const artistId = req.user._id;

    const allContent = await Content.find({ artist: artistId }).lean();

    const singles = allContent.filter(item => item.contentType === "single");

    const seriesMap = {};

    allContent.forEach(item => {
      if (item.contentType === "series") {
        const seriesId = item.seriesId?.toString();

        if (!seriesMap[seriesId]) {
          seriesMap[seriesId] = {
            _id: seriesId,
            seriesTitle: item.seriesTitle,
            description: item.description || "",
            genre: item.genre || "",
            episodes: []
          };
        }

        seriesMap[seriesId].episodes.push({
          _id: item._id,
          title: item.title,
          episodeNumber: item.episodeNumber,
          fileUrl: item.fileUrl,
          createdAt: item.createdAt
        });
      }
    });

    const series = Object.values(seriesMap);

    return res.json({
      series,
      singles
    });

  } catch (err) {
    console.error("Error fetching artist progress:", err);
    return res.status(500).json({ message: "Server error fetching progress" });
  }
};

export const updateMedia = async (req, res) => {
    try {
        const media = await Content.findById(req.params._id);
        if (!media) {
            return res.status(404).json({message: "Media not found"});
        }
        if (media.artist.toString() !== req.user._id) {
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
        const media = await Content.findById(req.params._id);
        if (!media) {
            return res.status(404).json({message: "Media not found"});
        }
        if (media.artist.toString() !== req.user._id) {
            return res.status(403).json({message: "Unauthorized"});
        }
        await media.deleteOne();
        res.status(200).json({message: "Media deleted successfully"});
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
}