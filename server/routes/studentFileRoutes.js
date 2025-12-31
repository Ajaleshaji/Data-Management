import express from "express";
import multer from "multer";
import StudentFile from "../models/StudentFile.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { rollNumber } = req.body;

    if (!req.file || !rollNumber) {
      return res.status(400).json({ msg: "File or roll number missing" });
    }

    console.log("File received:", req.file.originalname); // debug

    // Cloudinary upload
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      { folder: `students/${rollNumber}`, resource_type: "auto" }
    );

    console.log("Cloudinary upload result:", result); // debug

    const newFile = new StudentFile({
      rollNumber,
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType: req.file.mimetype,
    });

    await newFile.save();

    res.status(201).json(newFile);
  } catch (err) {
    console.error("UPLOAD ERROR:", err); // <--- this will show why 500 occurs
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
});


// Fetch files
router.get("/:rollNumber", async (req, res) => {
  const files = await StudentFile.find({ rollNumber: req.params.rollNumber }).sort({ uploadedAt: -1 });
  res.json(files);
});

// Delete file
router.delete("/delete/:id", async (req, res) => {
  try {
    const file = await StudentFile.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ msg: "File not found" });
    }

    // Old records safety
    if (file.publicId) {
      await cloudinary.uploader.destroy(file.publicId, {
        resource_type: "raw", // IMPORTANT for pdf, docx
      });
    }

    await StudentFile.findByIdAndDelete(req.params.id);

    res.json({ msg: "File deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ msg: "Delete failed", error: err.message });
  }
});


export default router;
