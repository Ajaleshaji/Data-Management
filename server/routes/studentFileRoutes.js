import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import StudentFile from "../models/StudentFile.js";

const router = express.Router();

/* ---------- ENSURE UPLOADS FOLDER EXISTS ---------- */
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ---------- MULTER CONFIG ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ---------- UPLOAD FILE ---------- */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { rollNumber } = req.body;

    if (!rollNumber) {
      return res.status(400).json({ msg: "Roll number required" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "File not received" });
    }

    const newFile = new StudentFile({
      rollNumber,
      fileName: req.file.originalname,
      filePath: req.file.filename, // ONLY filename
      fileType: req.file.mimetype,
    });

    await newFile.save();

    res.status(201).json({ msg: "File uploaded successfully" });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ msg: "Upload failed" });
  }
});

/* ---------- GET FILES BY ROLL NUMBER ---------- */
router.get("/:rollNumber", async (req, res) => {
  try {
    const files = await StudentFile.find({
      rollNumber: req.params.rollNumber,
    }).sort({ uploadedAt: -1 });

    res.json(files);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const file = await StudentFile.findById(req.params.id);
    if (!file) return res.status(404).json({ msg: "File not found" });

    // Delete physical file
    const filePath = path.join(uploadDir, file.filePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Delete from DB
    await StudentFile.findByIdAndDelete(req.params.id);

    res.json({ msg: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
