import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendOtpMail = async (email, otp, purpose = "Password Reset") => {
  try {
    // Load forgot-password template
  const templatePath = path.join(__dirname, "forgot-otp.hbs");


    const source = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(source);

    // Inject dynamic values
    const htmlToSend = template({
      otp,
      purpose,
      year: new Date().getFullYear(),
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    const mailOptions = {
      from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${purpose} - Skill-Hub`,
      html: htmlToSend,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent successfully");
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw error;
  }
};
