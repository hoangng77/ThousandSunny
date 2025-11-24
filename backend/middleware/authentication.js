import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("username role _id");
        req.user = {
            id: user._id.toString(),
            role: user.role,
            username: user.username,
        };
        next();
    } catch (err) {
        console.log("Authentication error: ", err);
        return res.status(500).json({ message: "Invalid token" });
    }
};