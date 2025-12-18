import multer from "multer";

// Memory storage (suitable for Cloudinary)
const storage = multer.memoryStorage();

// Multer instance with larger file size limit
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100 MB
});

export default upload;
