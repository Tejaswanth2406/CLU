import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import analyzeRoute from "./routes/analyze.js";

dotenv.config();

const app = express();

// 🛡️ Security & Middleware
app.use(cors());
app.use(express.json());

// 📊 Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 🛡️ Rate Limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: "Too many requests, please try again later." },
  })
);

// 🛣️ Routes
app.use("/api/analyze", analyzeRoute);

// 🚀 Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ CLU API running on http://localhost:${PORT}`);
});
