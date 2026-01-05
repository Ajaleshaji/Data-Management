import express from "express";
import Department from "../models/Department.js";

const router = express.Router();

// ---------------- CREATE OR ADD SECTION ----------------
router.post("/create", async (req, res) => {
  try {
    const { departmentName, sections } = req.body;

    // Find existing department
    let department = await Department.findOne({ departmentName });
    if (department) {
      // Add new sections without duplicates
      sections.forEach(sec => {
        if (!department.sections.includes(sec)) {
          department.sections.push(sec);
        }
      });
    } else {
      // Create new department
      department = new Department({ departmentName, sections });
    }

    await department.save();
    res.json({ msg: "Department & Sections saved successfully", department });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err });
  }
});

// ---------------- GET SPECIFIC DEPARTMENT ----------------
router.get("/:departmentName", async (req, res) => {
  try {
    const { departmentName } = req.params;
    const department = await Department.findOne({ departmentName });

    if (!department) {
      return res.status(404).json({ msg: "Department not found" });
    }

    res.json({ department });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err });
  }
});

export default router;
