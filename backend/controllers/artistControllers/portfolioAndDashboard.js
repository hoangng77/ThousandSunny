import Content from '../../models/content.js';

export const getPortfolio = async (req, res) => {
    try {
        const portfolio = await Content.find({ artist: req.params.artist_id});
        res.status(200).json({ portfolio });
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
}

export const getDashboard = async (req, res) => {
    try {
        const content = await Content.find({ artist: req.user.id });
        res.status(200).json({ content });
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
}   