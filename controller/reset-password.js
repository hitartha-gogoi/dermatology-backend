import Doctor from "../models/doctor.js";
import { resetmailsender } from "../utils/reset-mail-sender.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { config } from "dotenv";

config();

export const resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ 
                success: false,
                error: "Please enter email" 
            });
        }
        
        const user = await Doctor.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `This email ${email} is not registered with us`
            });
        }

        const token = crypto.randomBytes(20).toString("hex");

        const updatedDetails = await Doctor.findOneAndUpdate(
            { email },
            {
                token,
                resetPasswordExpires: Date.now() + 3600000, // 1 hour expiry
            },
            { new: true }
        );

        const url = `${process.env.FRONTEND_URL}/update-password/${token}`;

        await resetmailsender(
            email,
            "Password Reset",
            `Your password reset link: ${url}. This link will expire in 1 hour.`
        );

        res.status(200).json({
            success: true,
            message: "Password reset email sent successfully"
        });

    } catch (error) {
        console.error("Reset password token error:", error);
        res.status(500).json({
            success: false,
            message: "Error sending reset email",
            error: error.message
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        if (!password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                error: "Both password fields are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const user = await Doctor.findOne({ token });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        if (user.resetPasswordExpires < Date.now()) {
            return res.status(403).json({
                success: false,
                message: "Token has expired. Please request a new one."
            });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        await Doctor.findOneAndUpdate(
            { token },
            { 
                password: encryptedPassword,
                token: null,
                resetPasswordExpires: null 
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Error resetting password",
            error: error.message
        });
    }
};