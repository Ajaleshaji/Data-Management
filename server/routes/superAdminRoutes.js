import express from "express";
import SuperAdmin from "../models/SuperAdmin.js";
import bcrypt from "bcryptjs"; // for password hashing

const router = express.Router();

// Create initial Super Admin (call once)
router.post("/create-superadmin", async (req, res) => {
  try {
    const { superAdminId, password } = req.body;

    const exists = await SuperAdmin.findOne({ superAdminId });
    if (exists) return res.status(400).json({ msg: "Super Admin already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = new SuperAdmin({
      superAdminId,
      password: hashedPassword,
      admins: [],
    });
    await superAdmin.save();
    res.json({ msg: "Super Admin created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Super Admin login
router.post("/login", async (req, res) => {
  try {
    const { superAdminId, password } = req.body;

    const superAdmin = await SuperAdmin.findOne({ superAdminId });
    if (!superAdmin) return res.status(400).json({ msg: "Super Admin not found" });

    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    res.json({ msg: "Login successful", superAdminId: superAdmin.superAdminId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.post("/create-admin", async (req, res) => {
  try {
    const { superAdminId, adminId, password, department } = req.body;

    // Find super admin
    const superAdmin = await SuperAdmin.findOne({ superAdminId });
    if (!superAdmin) {
      return res.status(404).json({ message: "Super Admin not found" });
    }

    // Check if adminId already exists inside admins[]
    const existingAdmin = superAdmin.admins.find(a => a.adminId === adminId);
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin ID already exists" });
    }

    // Push new admin to admins array
    superAdmin.admins.push({
      adminId,
      password,
      department,
    });

    await superAdmin.save();

    res.json({ message: "Admin created successfully", admins: superAdmin.admins });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/get-admins", async (req, res) => {
  try {
    const { superAdminId } = req.query;

    const superAdmin = await SuperAdmin.findOne({ superAdminId });

    if (!superAdmin) {
      return res.status(404).json({ message: "Super Admin not found" });
    }

    res.json({ admins: superAdmin.admins });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.post("/admin-login", async (req, res) => {
  try {
    const { adminId, password } = req.body;

    // Find if admin exists inside ANY superadmin
    const superAdmin = await SuperAdmin.findOne({ "admins.adminId": adminId });

    if (!superAdmin)
      return res.status(404).json({ msg: "Admin not found" });

    // Extract admin object
    const admin = superAdmin.admins.find(a => a.adminId === adminId);

    // Compare password (plain because you stored plain — if you want hashed, tell me)
    if (admin.password !== password)
      return res.status(400).json({ msg: "Invalid password" });

    res.json({
      msg: "Admin login successful",
      adminId: admin.adminId,
      department: admin.department
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
