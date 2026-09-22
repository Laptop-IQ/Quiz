import express from "express";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ msg: "All fields required" });
  }

  try {
    // Read templates
    const userTemplatePath = path.join(
      process.cwd(),
      "email-templates",
      "Autoreply.html",
    );
    const adminTemplatePath = path.join(
      process.cwd(),
      "email-templates",
      "Enquiry.html",
    );

    let userHtml = fs.readFileSync(userTemplatePath, "utf-8");
    let adminHtml = fs.readFileSync(adminTemplatePath, "utf-8");

    // Replace placeholders
    userHtml = userHtml
      .replace(/{{name}}/g, name)
      .replace(/{{message}}/g, message)
      .replace(
        /{{website_url}}/g,
        process.env.WEBSITE_URL,
      );

    adminHtml = adminHtml
      .replace(/{{name}}/g, name)
      .replace(/{{email}}/g, email)
      .replace(/{{message}}/g, message);

    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email to user
    await transporter.sendMail({
      from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We’ve Received Your Message",
      html: userHtml,
    });

    // Send email to admin/internal team
    await transporter.sendMail({
      from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${name}`,
      html: adminHtml,
    });

    res.json({ success: true, msg: "Emails sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to send emails" });
  }
});

export default router;
