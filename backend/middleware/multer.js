// middleware/multer.js
import multer from "multer";

// Memory storage for Cloudinary
const storage = multer.memoryStorage();
export const upload = multer({ storage });
