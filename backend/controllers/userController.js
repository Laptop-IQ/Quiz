import cloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateOTP } from "../utils/generateOTP.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import { sendOtpMail } from "../emailVerify/sendOtpMail.js";
import { verifyOtpMail } from "../emailVerify/verifyOtpMail.js";

const JWT_SECRET = process.env.JWT_SECRET;

const TOKEN_EXPIRES = "30d";

const createToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

// GET CURRENT USER
export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select(
      "name email profilePic",
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

// UPDATE PROFILE
export async function updateProfile(req, res) {
  const { name, email, profilePic } = req.body; // include profilePic
  if (!name || !email || !validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Valid email and name are required." });
  }

  try {
    const exists = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use." });
    }

    const updateData = { name, email };
    if (profilePic) updateData.profilePic = profilePic; // ✅ add profilePic

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
      select: "name email profilePic", // include profilePic in response
    });

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
// UPDATE PASSWORD
export async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res
      .status(400)
      .json({ success: false, message: "Password invalid or too short." });
  }

  try {
    const user = await User.findById(req.user.id).select("password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Current Password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password changed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

/**
 * @desc Register new user & send OTP for email verification
 */
export const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpire: Date.now() + 10 * 60 * 1000, // 10 min
    });

    await verifyOtpMail(otp, email, "Signup Verification");

    res.status(201).json({
      success: true,
      message:
        "OTP sent to your email. Please verify to activate your account.",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("RegisterUser Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Verify Signup OTP
 */
export const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Resend OTP
 */
export const resendSignupOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    await verifyOtpMail(otp, email, "Signup Verification");

    res.status(200).json({ success: true, message: "OTP resent successfully" });
  } catch (err) {
    console.error("Resend OTP Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Login user
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Verify your account via OTP first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("LoginUser Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Request Password Reset (Send OTP)
// ---------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    await sendOtpMail(email, otp, "Password Reset");

    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error("ForgotPassword Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------------
// Verify OTP + Reset Password
// ---------------------
export const verifyForgotOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpire < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("VerifyForgotOTP Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpire < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("ResetPassword Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfileWithImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Only update profile pic if file exists
    if (req.file) {
      if (user.cloudinaryId) {
        await cloudinary.uploader.destroy(user.cloudinaryId);
      }

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "profiles" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(req.file.buffer);
      });

      user.profilePic = result.secure_url;
      user.cloudinaryId = result.public_id;
    }

    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const removeProfilePhoto = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.cloudinaryId) {
    await cloudinary.uploader.destroy(user.cloudinaryId);
  }

  user.profilePic = "";
  user.cloudinaryId = "";

  await user.save();

  res.json({ message: "Profile photo removed" });
};

// GET ADMIN STATS
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
      },
    });
  } catch (error) {
    console.error("GetStats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; // auth middleware se aata hai

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting account",
      error: error.message,
    });
  }
};

export const getUserQuizzes = async (req, res) => {
  try {
    // Example: DB se quizzes lao
    const quizzes = [];
    res.json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
    });
  }
};