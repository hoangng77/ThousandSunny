import User from "../../models/user.js";
import Content from "../../models/content.js";
import mongoose from "mongoose";

export const getForYou = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("preferredGenres following");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Sort preferred genres by count descending
    const sortedGenres = [...user.preferredGenres].sort((a, b) => b.count - a.count);

    const genres = sortedGenres.map(g => g.genre);
    const followingIds = user.following.map(id => new mongoose.Types.ObjectId(id));

    // Build match conditions
    const match = {
      status: "published",
      genre: { $in: genres }, // top preference
    };

    const artworks = await Content.aggregate([
      { $match: match },

      // lookup artist info
      {
        $lookup: {
          from: "users",
          localField: "artist",
          foreignField: "_id",
          as: "artistInfo"
        }
      },
      { $unwind: "$artistInfo" },

      // compute priority score
      {
        $addFields: {
          matchGenreIndex: {
            $indexOfArray: [genres, "$genre"]
          },
          isFollowedArtist: {
            $in: ["$artistInfo._id", followingIds]
          },
        }
      },

      // priority sorting
      {
        $sort: {
          isFollowedArtist: -1,
          matchGenreIndex: 1,
          addedToLibraryCount: -1,
          createdAt: -1,
        }
      },

      { $limit: 50 },

      {
        $project: {
          title: 1,
          fileUrl: 1,
          genre: 1,
          contentType: 1,
          episodeNumber: 1,
          createdAt: 1,
          addedToLibraryCount: 1,
          artistInfo: {
            _id: 1,
            username: 1,
            "profile.avatarUrl": 1
          }
        }
      }
    ]);

    res.json({
      recommended: artworks,
      genres,
      following: followingIds
    });

  } catch (err) {
    console.error("FORYOU ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
