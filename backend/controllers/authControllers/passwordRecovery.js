import crypto from "crypto";
import User from "../../models/user.js";

export const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No user with this email"});
        }
        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 15*3600;
        await user.save();

        const resetUrl = 'http://localhost:3000/reset-password/${resetToken}';
        res.json({message: "Password reset link has been sent"});
    }
    catch (err){
        res.status(500).json({message: "Servor error", error: err.message});
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({message: "Invalid or expired token"});
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({message: "Password reset successful!"});
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
};