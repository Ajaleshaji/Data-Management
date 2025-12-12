import express from "express";
import Department from "../models/Department.js";

const router = express.Router();

// Create a new department or add section to existing
router.post("/create", async (req, res) => {
  try {
    const { departmentName, sections } = req.body;

    // Check if department exists
    let department = await Department.findOne({ departmentName });
    if (department) {
      // Add new sections to existing department without duplicates
      sections.forEach(sec => {
        if (!department.sections.includes(sec)) {
          department.sections.push(sec);
        }
      });
    } else {
      department = new Department({ departmentName, sections });
    }

    await department.save();
    res.json({ msg: "Department & Sections saved successfully", department });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err });
  }
});

// Get all departments
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json({ departments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err });
  }
});

export default router;
