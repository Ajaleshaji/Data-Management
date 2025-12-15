import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
dotenv.config();
const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",  // default Vite port
  "http://localhost:5174",  // SuperAdmin frontend
  "http://localhost:5175",  // Admin frontend
  "http://localhost:5176",  // Student frontend (optional)
];

// Enable CORS for multiple origins
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // allow request
    } else {
      callback(new Error("Not allowed by CORS")); // block request
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/students", studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
