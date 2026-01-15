import dotenv from "dotenv";
dotenv.config();  
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import superAdminRoutes from "./routes/superAdminRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import studentFileRoutes from "./routes/studentFileRoutes.js";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/api/superadmin", superAdminRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/student-files", studentFileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
