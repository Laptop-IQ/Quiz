import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function authMiddleware(req, res, next) {
  // Token grab karo
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized or token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Token verify karo
    const payload = jwt.verify(token, JWT_SECRET);

    // User fetch karo DB se
    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // User ko req object me attach karo
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
}

export const isAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      return next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access Denied. Admins Only.",
      });
    }
  } catch (error) {
    console.error("Admin Check Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const protect = async (req, res, next) => {
  try {
    let token;

    // 🔹 Token extract (Bearer)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    // 🔹 Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 🔹 Attach user to request
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};

// ==============================
// ✅ ROLE BASED ACCESS (FLEXIBLE)
// ==============================

