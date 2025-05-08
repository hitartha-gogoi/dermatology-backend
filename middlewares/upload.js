import multer from "multer";
import path from "path";

// Multer storage config
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter (Only accept images)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    return cb(new Error("Only images are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;