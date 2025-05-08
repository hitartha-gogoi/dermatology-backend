import express from 'express';
import {
  sendOtp,
  verifyOtp,
  login,
  changePassword
} from '../controller/auth.js';
import { auth, isDoctor, isAdmin } from '../middlewares/authenticate.js';
import {
  resetPasswordToken,
  resetPassword
} from '../controller/reset-password.js';

const router = express.Router();

// Public authentication routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

// Authenticated password change route
router.post("/change-password", auth, changePassword);  // Added auth middleware

// Password reset routes
router.post("/reset-password-token", resetPasswordToken);  // Consistent naming
router.post("/reset-password", resetPassword);

const authRoutes = router; // Export the router for use in other files

export default authRoutes;