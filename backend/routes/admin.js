import express from "express";
import {
  uploadQuiz,
  deleteQuiz,
  getAllQuizzes,
} from "../controllers/adminController.js";
import adminProtect from "../middleware/adminProtect.js";

const router = express.Router();

// Only admins can access these
router.post("/upload-quiz", adminProtect, uploadQuiz);
router.delete("/quiz/:id", adminProtect, deleteQuiz);
router.get("/quizzes", adminProtect, getAllQuizzes);
router.get("/stats", (req, res) => {
  res.json({ success: true });
});

export default router;
