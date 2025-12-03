import Content from "../../models/content.js";
import User from "../../models/user.js";
import mongoose from "mongoose";

export const getDiscover = async (req, res) => {
  try {
    // 1. Load user safely
    const user = await User.findById(req.user.id).populate("library.content");

    const role = user.role;

    // 2. Build library exclusion list (consumer only)
    let libraryIds = [];

    if (role === "consumer") {
      libraryIds = (user.library || [])
        .map(item => item.content?._id)
        .filter(id => id) // remove null, empty, undefined
        .map(id => new mongoose.Types.ObjectId(id));
    }

    // 3. Build $match stage safely
    const matchStage = { status: "published" };

    if (role === "consumer" && libraryIds.length > 0) {
      matchStage._id = { $nin: libraryIds };
    }

    // 4. Build pipeline (NO invalid items allowed)
    const pipeline = [
      { $match: matchStage },

      // join artist info
      {
        $lookup: {
          from: "users",
          localField: "artist",
          foreignField: "_id",
          as: "artistInfo"
        }
      },
      { $unwind: { path: "$artistInfo", preserveNullAndEmptyArrays: true } },

      // count how many users added this artwork
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "library.content",
          as: "addedByUsers"
        }
      },
      {
        $addFields: {
          addedCount: { $size: "$addedByUsers" }
        }
      },

      // fields for frontend
      {
        $project: {
          title: 1,
          fileUrl: 1,
          genre: 1,
          contentType: 1,
          episodeNumber: 1,
          seriesTitle: 1,
          seriesId: 1, 
          createdAt: 1,
          "artistInfo._id": 1,
          "artistInfo.username": 1,
          "artistInfo.profile.avatarUrl": 1,
          addedCount: 1
        }
      },

      // sort + limit
      { $sort: { addedCount: -1, createdAt: -1 } },
      { $limit: 50 }
    ];

    // 5. Run aggregation safely
    const artworks = await Content.aggregate(pipeline);

    let userFollowing = [];
    if (req.user) {
      const user = await User.findById(req.user.id).select("following");
      userFollowing = user.following.map((id) => id.toString());
    }

    res.json({
      artworks,
      role,
      userFollowing,
    });

  } catch (err) {
    console.error("DISCOVER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
