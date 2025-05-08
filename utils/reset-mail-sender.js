import nodemailer from 'nodemailer';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * Sends a password reset email
 * @param {string} email - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} message - Email content
 * @returns {Promise<Object>} Nodemailer response info
 * @throws {Error} If email sending fails
 */
export const resetmailsender = async (email, subject, message) => {
  // Validate inputs
  if (!email || !subject || !message) {
    throw new Error('Email, subject and message are required');
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD, // Using app-specific password
      },
    });

    const mailOptions = {
      from: `"Password Recovery" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
            ${message}
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
            If you didn't request this password reset, please ignore this email.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
    return info;
  } catch (error) {
    console.error('Password reset email failed:', error.message);
    throw new Error('Failed to send password reset email');
  }
};