import express from "express";
import {
  adminSignup,
  adminLogin,
  forgotAdminPassword,
  verifyAdminOtp,
  resetAdminPassword,
  getAdminProfile,
} from "../controllers/adminAuthController.js";
import adminAuth from "../middleware/adminProtect.js";

const router = express.Router();

router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.post("/forgot-password", forgotAdminPassword);
router.post("/verify-otp", verifyAdminOtp);
router.post("/reset-password", resetAdminPassword);
router.get("/me", adminAuth, getAdminProfile);

export default router;
