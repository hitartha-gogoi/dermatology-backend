import sharp from "sharp";
import fs from "fs/promises";  // Using promises version for async/await
import path from "path";
import { Buffer } from "buffer";  // Explicit import for Buffer
import { fileURLToPath } from "url";  // Needed for __dirname equivalent

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Edits an image by adding text annotations
 * @param {string} imageUrl - URL of the source image
 * @param {string} text - Text to add to the image
 * @param {string} outputFilename - Name for the output file
 * @returns {Promise<string>} Path to the edited image
 */
const editImage = async (imageUrl, text, outputFilename) => {
    const localPath = path.join(__dirname, `../uploads/${outputFilename}`);
    
    try {
        // Download the image
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        
        const buffer = await response.arrayBuffer();
        
        // Process the image
        await sharp(Buffer.from(buffer))
            .resize(500) // Resize if needed
            .composite([{
                input: Buffer.from(
                    `<svg width="500" height="500">
                        <text x="50" y="50" font-size="30" fill="red">${text}</text>
                    </svg>`
                ),
                gravity: "northwest"
            }])
            .toFormat("png")
            .toFile(localPath);

        return localPath;
    } catch (error) {
        console.error("Image processing error:", error);
        throw new Error(`Image processing failed: ${error.message}`);
    }
};

export default editImage;