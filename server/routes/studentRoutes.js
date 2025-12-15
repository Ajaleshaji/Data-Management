import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// Single student create (optional)
router.post("/create", async (req, res) => {
  try {
    const { rollNumber, password, department, section } = req.body;
    const student = new Student({ rollNumber, password, department, section });
    await student.save();
    res.json({ msg: "Student created successfully", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err });
  }
});

// Multiple students create
router.post("/create-many", async (req, res) => {
  try {
    const { students } = req.body; // expect array of students
    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ msg: "No students to insert" });
    }

    await Student.insertMany(students);
    res.json({ msg: `${students.length} students created successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error saving students", error: err });
  }
});

// GET /api/students?department=CSE&section=A
router.get("/", async (req, res) => {
  try {
    const { department, section } = req.query;
    const students = await Student.find({ department, section });
    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    const student = await Student.findOne({ rollNumber, password });
    if (!student) {
      return res.status(400).json({ msg: "Invalid Roll Number or Password" });
    }

    res.json({ msg: "Login successful", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


export default router;
