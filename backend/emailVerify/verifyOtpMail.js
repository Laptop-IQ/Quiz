import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyOtpMail = async (otp, email) => {
  try {
    // Load signup OTP template
    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, "otp-template.hbs"),
      "utf-8",
    );

    const template = handlebars.compile(emailTemplateSource);

    // Pass OTP + purpose into template
    const htmlToSend = template({
      otp,
      purpose: "Signup Verification",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    const mailConfigurations = {
      from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - Signup OTP",
      html: htmlToSend,
    };

    const info = await transporter.sendMail(mailConfigurations);
    console.log("✅ Signup OTP Email sent:", info.messageId);

    return true;
  } catch (error) {
    console.error("❌ OTP Email send failed:", error.message);
    return false;
  }
};
