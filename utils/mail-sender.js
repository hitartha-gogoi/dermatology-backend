import nodemailer from 'nodemailer';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * Sends OTP email to the specified address
 * @param {string} email - Recipient email address
 * @param {string} otp - One-Time Password
 * @returns {Promise<Object>} Nodemailer response info
 */
export const sendOtpEmail = async (email, otp) => {
  // Input validation
  if (!email || !otp) {
    throw new Error('Email and OTP are required');
  }

  try {
    // Create transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: `"Health Service" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">Verification Code</h2>
          <p>Your one-time verification code is:</p>
          <div style="font-size: 24px; font-weight: bold; margin: 15px 0;">
            ${otp}
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p style="color: #6b7280; font-size: 12px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
    return info;
  } catch (error) {
    console.error('Error sending OTP email:', error.message);
    throw new Error('Failed to send verification email');
  }
};