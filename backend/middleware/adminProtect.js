// middleware/adminProtect.js
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const adminProtect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Admin token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Admin not found" });
    }

    req.admin = admin; // attach admin
    next();
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Admin token invalid" });
  }
};

export default adminProtect;
