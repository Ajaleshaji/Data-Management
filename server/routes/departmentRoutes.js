import express from "express";
import Department from "../models/Department.js";

const router = express.Router();

/* ================= GET ALL DEPARTMENTS (ADMIN) ================= */
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json({ departments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ================= CREATE / ADD SECTION ================= */
router.post("/create", async (req, res) => {
  try {
    const { departmentName, sections } = req.body;

    let department = await Department.findOne({ departmentName });

    if (department) {
      sections.forEach((sec) => {
        if (!department.sections.includes(sec)) {
          department.sections.push(sec);
        }
      });
    } else {
      department = new Department({ departmentName, sections });
    }

    await department.save();
    res.json({
      msg: "Department & Sections saved successfully",
      department,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ================= GET SINGLE DEPARTMENT ================= */
router.get("/:departmentName", async (req, res) => {
  try {
    const department = await Department.findOne({
      departmentName: req.params.departmentName,
    });

    if (!department) {
      return res.status(404).json({ msg: "Department not found" });
    }

    res.json({ department });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
