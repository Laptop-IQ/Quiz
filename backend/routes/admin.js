import express from "express";
import {
  uploadQuiz,
  deleteQuiz,
  getAdminQuizzes,
  getQuizById,
  updateQuiz,
  getOverview,
  getUsers,
  deleteUser,
} from "../controllers/adminController.js";
import adminProtect from "../middleware/adminProtect.js";

const router = express.Router();

// Every admin route requires a valid admin token
router.use(adminProtect);

router.get("/overview", getOverview);

router.get("/quizzes", getAdminQuizzes);
router.post("/upload-quiz", uploadQuiz);
router.get("/quiz/:id", getQuizById);
router.put("/quiz/:id", updateQuiz);
router.delete("/quiz/:id", deleteQuiz);

router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

export default router;
