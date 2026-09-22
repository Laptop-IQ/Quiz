import jwt from "jsonwebtoken";

const generateToken = (adminId) => {
  return jwt.sign({ id: adminId, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default generateToken;
