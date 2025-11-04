import User from "../../models/user.js";

export const getFollowing = async (req, res) => {
    const user = await User.findById(req.user._id).populate("following");
    res.json({ following: user.following });
  };
  
  export const followArtist = async (req, res) => {
    const { artistId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.following.includes(artistId)) {
      user.following.push(artistId);
      await user.save();
    }
    res.json({ following: user.following });
  };
  
  export const unfollowArtist = async (req, res) => {
    const { artistId } = req.params;
    const user = await User.findById(req.user._id);
    user.following = user.following.filter(id => id.toString() !== artistId);
    await user.save();
    res.json({ following: user.following });
  };