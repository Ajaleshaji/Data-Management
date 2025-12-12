import mongoose from "mongoose";

// Schema for Admins inside SuperAdmin
const adminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
});

// Schema for SuperAdmin
const superAdminSchema = new mongoose.Schema({
  superAdminId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admins: [adminSchema], // Array of admin objects
  createdAt: { type: Date, default: Date.now },
});

const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

export default SuperAdmin;
