const router = require('express').Router();
const User = require('../models/User'); // Your user model
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// 1. FORGOT PASSWORD: Generate reset token and send email
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate a 20-character random token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Configure Email Transporter (Use Gmail or a service like SendGrid)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'YOUR_EMAIL@gmail.com', // Replace with your email
                pass: 'YOUR_EMAIL_PASSWORD'   // Use an "App Password" from Google, not your real login password!
            }
        });

        const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

        const mailOptions = {
            from: 'no-reply@skillExchange.com',
            to: user.email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click this link: ${resetURL}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Reset email sent!" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. RESET PASSWORD: Update the password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() } // Check if token hasn't expired
        });

        if (!user) return res.status(400).json({ message: "Token invalid or expired" });

        // Hash the new password (assuming you use bcrypt)
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        // Clear the reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully!" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;