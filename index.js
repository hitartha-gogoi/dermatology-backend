import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/connect-db.js';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patient.js';
//import paymentRoutes from './routes/payment.js';
import adminRoutes from './routes/admin.js';
import qualificationPicRoutes from './routes/qualification-upload.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true // Always use HTTPS
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ 
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}));

// Database connection
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
//app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/qualifications', qualificationPicRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Default route
app.get('/', (req, res) => {
  res.send('🚀 Server is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Server initialization
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});