import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
/**
 * Uploads an image to Cloudinary with optional transformations
 * @param {Object} file - File object containing tempFilePath
 * @param {string} folder - Destination folder in Cloudinary
 * @param {number} [height] - Optional height for resizing
 * @param {number} [quality] - Optional quality setting (1-100)
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadImageToCloudinary = async (file, folder, height, quality) => {
    const options = {
        folder,
        resource_type: "auto"
    };

    if (height) {
        options.height = height;
    }
    if (quality) {
        options.quality = quality;
    }

    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        return result;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
    }
};