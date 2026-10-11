import express from "express";
import multer from "multer";
import {
  uploadQuiz,
  deleteQuiz,
  getAdminQuizzes,
  getQuizById,
  updateQuiz,
  getOverview,
  getUsers,
  deleteUser,
  uploadImage,
} from "../controllers/adminController.js";
import adminProtect from "../middleware/adminProtect.js";

const router = express.Router();

// figures for questions: images only, kept in memory, 3 MB max
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) =>
    /^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype) ? cb(null, true) : cb(new Error("Only PNG, JPG, WEBP or GIF images are allowed")),
}).single("image");

// Every admin route requires a valid admin token
router.use(adminProtect);

router.get("/overview", getOverview);

router.get("/quizzes", getAdminQuizzes);
router.post("/upload-quiz", uploadQuiz);
router.get("/quiz/:id", getQuizById);
router.put("/quiz/:id", updateQuiz);
router.delete("/quiz/:id", deleteQuiz);

router.post("/upload-image", (req, res, next) =>
  imageUpload(req, res, (err) =>
    err
      ? res.status(400).json({ success: false, message: err.code === "LIMIT_FILE_SIZE" ? "Image must be under 3 MB" : err.message })
      : next(),
  ), uploadImage);

router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

export default router;
