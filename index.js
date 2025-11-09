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
const allowedOrigins = (process.env.CLIENT_ORIGIN?.split(",") || [
  "http://localhost:5173",
  "http://localhost:5174",
]).map(s => s.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser tools
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

connectDB();

app.use("/auth", authRoutes);
app.use("/jobs", jobRoutes);
app.use("/user", userRoutes);

app.get("/", (_req, res) => {
  res.send("API is alive");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server connected on ${PORT}`));
