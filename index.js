import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());

// ✅ Allow FE on Vercel + Local
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://jobportal-frontend-delta.vercel.app",   // ✅ Add front-end here
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// ✅ FIX ROUTES — prefix with /api
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/user", userRoutes);

connectDB();

// ✅ API root
app.get("/", (_, res) => {
  res.send("✅ Backend is running");
});

const PORT = process.env.PORT || 5000;

// ✅ Export for Vercel (important)
export default app;

app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
