import { User } from '../models/User.js';

export const getProfilePage = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ profile });
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
}
