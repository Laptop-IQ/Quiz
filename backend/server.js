import express from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import compression from "compression";
import hpp from "hpp";
import fs from "fs";
import path from "path";

import userRouter from "./routes/userRoute.js";
import connectDB from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import resultRoutes from "./routes/result.js";
import adminRoutes from "./routes/admin.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";


const app = express();
const port = process.env.PORT || 4000;

// 📁 Create logs folder
const __dirname = path.resolve();
const logDir = path.join(__dirname, "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 📄 Log stream
const accessLogStream = fs.createWriteStream(path.join(logDir, "access.log"), {
  flags: "a",
});

// ✅ Trust proxy
app.set("trust proxy", 1);

// ✅ Allowed origins
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5174",].filter(
  Boolean,
);

// 🌐 CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// 🔐 Security middlewares
app.use(helmet());
app.use(hpp());
app.use(compression());

// 🌐 CORS
app.use(cors(corsOptions));

// 🚫 Global rate limit
// const isDevelopment = process.env.NODE_ENV === "development";

// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: isDevelopment ? 1000 : 100,
//     message: "Too many requests, please try again later.",
//     standardHeaders: true,
//     legacyHeaders: false,
//   }),
// );


// 🔐 Strict limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: "Too many attempts, please try again later.",
});

app.use("/api/user/login", authLimiter);
app.use("/api/user/register", authLimiter);
app.use("/api/user/forgot-password", authLimiter);
app.use("/api/user/reset-password", authLimiter);

// 📦 Body parsing
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// 📁 Static files
app.use("/uploads", express.static("uploads"));

// 📊 Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined", { stream: accessLogStream }));
}

// 🚏 Routes
app.use("/api/contact", contactRoutes);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/admin-auth", adminAuthRoutes);


// 🏠 Health check
app.get("/", (req, res) => {
  res.send("API WORKING 🚀");
});

// ❌ 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// 🔥 Global error handler
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});

// 🛑 Graceful shutdown
process.on("SIGINT", () => {
  console.log("🛑 Gracefully shutting down...");
  process.exit(0);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// 🚀 Start server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log("✅ Allowed origins:", allowedOrigins);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Failed:", err.message);
    process.exit(1);
  });
