import express from 'express';
import { uploadQualificationPic } from '../controller/qualificationPic.js';
import { auth } from '../middlewares/authenticate.js';
import  upload  from '../middlewares/upload.js'; // Separate upload config
import { validateFile } from '../middlewares/fileValidation.js'; // New validation

const router = express.Router();

// Secure qualification upload route
router.post(
  '/upload',
  auth,
  upload.single('qualification'), // 'qualification' is the field name
  validateFile, // Validate file type/size
  uploadQualificationPic
);

const qualificationPicRoutes = router;

export default qualificationPicRoutes;