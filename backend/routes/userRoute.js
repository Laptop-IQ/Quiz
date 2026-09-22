import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  updatePassword,
  verifySignupOTP,
  resendSignupOTP,
  forgotPassword,
  verifyForgotOTP,
  resetPassword,
  removeProfilePhoto,
  updateProfileWithImage,
  deleteAccount,
} from "../controllers/userController.js";
import { getAllQuizzes } from "../controllers/adminController.js";

import authMiddleware from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-signup-otp", verifySignupOTP);
router.post("/resend-signup-otp", resendSignupOTP);
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-otp", verifyForgotOTP);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/me", authMiddleware, getCurrentUser);
router.put("/profile", authMiddleware, updateProfile);
router.put("/password", authMiddleware, updatePassword);
router.delete("/profile/photo", authMiddleware, removeProfilePhoto);

router.get("/quizzes", authMiddleware, getAllQuizzes);

router.post(
  "/profile/photo",
  authMiddleware,
  upload.single("profilePic"), // 'profilePic' must match the key in your FormData
  updateProfileWithImage,
);

// DELETE ACCOUNT
router.delete("/delete-account", authMiddleware, deleteAccount);

export default router;
