import jwt from "jsonwebtoken";
import Doctor from "../models/doctor.js";

// ✅ 1️⃣ Authentication Middleware: Verify JWT Token
export const auth = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

    req.userId = decoded.doctorId;
    req.role = decoded.role;

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

// ✅ 2️⃣ Authorization Middleware: Check if User is a Doctor
export const isDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.userId);
    
    if (!doctor || doctor.role !== "doctor") {
      return res.status(403).json({ error: "Access denied. Doctors only." });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Server error checking doctor role." });
  }
};

// ✅ 3️⃣ Authorization Middleware: Check if User is an Admin
export const isAdmin = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.userId);

    if (!doctor || doctor.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Server error checking admin role." });
  }
};