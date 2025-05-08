import { uploadImageToCloudinary } from '../utils/image-uploader.js';
import Doctor from '../models/doctor.js';
import { validateFile } from '../middlewares/fileValidation.js';

/**
 * Uploads qualification picture to Cloudinary and updates doctor's profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object with operation status
 */
export const uploadQualificationPic = async (req, res) => {
    try {
        const { userId } = req; // Destructure from auth token
        const qualificationPic = req.files?.qualificationPic;

        // Validate file existence and type
        if (!qualificationPic) {
            return res.status(400).json({
                success: false,
                message: "Qualification picture is required",
                errorCode: "QUALIFICATION_MISSING"
            });
        }

        // Additional file validation
        const validationError = validateFile(qualificationPic);
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError,
                errorCode: "INVALID_FILE"
            });
        }

        // Upload to Cloudinary with folder and transformations
        const uploadedImage = await uploadImageToCloudinary(
            qualificationPic, 
            "doctor_qualifications",
            { 
                quality: "auto:good",
                format: "webp"
            }
        );

        // Update doctor profile with atomic operation
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            userId,
            { 
                $set: { 
                    qualificationPic: uploadedImage.secure_url,
                    qualificationPicMeta: {
                        publicId: uploadedImage.public_id,
                        lastUpdated: new Date()
                    }
                } 
            },
            { new: true, runValidators: true }
        ).select('-password -tokens'); // Exclude sensitive fields

        if (!updatedDoctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found",
                errorCode: "DOCTOR_NOT_FOUND"
            });
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: "Qualification uploaded successfully",
            data: {
                imageUrl: uploadedImage.secure_url,
                doctorId: updatedDoctor._id,
                lastUpdated: updatedDoctor.qualificationPicMeta?.lastUpdated
            }
        });

    } catch (error) {
        console.error("[QUALIFICATION_UPLOAD_ERROR]", error);
        
        // Handle specific Cloudinary errors
        if (error.name === 'CloudinaryError') {
            return res.status(502).json({
                success: false,
                message: "Image processing service unavailable",
                errorCode: "CLOUDINARY_ERROR"
            });
        }

        // Generic error response
        return res.status(500).json({
            success: false,
            message: "Failed to process qualification upload",
            errorCode: "SERVER_ERROR",
            systemError: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};