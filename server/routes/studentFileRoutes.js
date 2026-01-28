import express from "express";
import upload from "../middleware/multer.js";
import StudentFile from "../models/StudentFile.js";
import cloudinary from "../config/cloudinary.js";
import { convertPdfBufferToImage } from "../utils/pdfToImage.js";

const router = express.Router();

// ✅ Upload file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { rollNumber } = req.body;
    const file = req.file;

    if (!file || !rollNumber) {
      return res.status(400).json({ msg: "File or roll number missing" });
    }

    let uploadBuffer = file.buffer;
    let uploadMime = file.mimetype;
    let fileType = file.mimetype;
    let wasConverted = false;

    // 🔥 Convert PDF to Image
    if (file.mimetype === "application/pdf") {
      uploadBuffer = await convertPdfBufferToImage(file.buffer);
      uploadMime = "image/png";
      fileType = "image/png";
      wasConverted = true;
    }

    const result = await cloudinary.uploader.upload(
      `data:${uploadMime};base64,${uploadBuffer.toString("base64")}`,
      {
        folder: `students/${rollNumber}`,
        resource_type: "image",
        use_filename: true,
        unique_filename: false,
      }
    );

    const newFile = new StudentFile({
      rollNumber,
      fileName: wasConverted
        ? file.originalname.replace(/\.pdf$/i, ".png")
        : file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType,
      resourceType: "image",
    });

    await newFile.save();
    res.status(201).json(newFile);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
});

// ✅ Fetch files
router.get("/:rollNumber", async (req, res) => {
  try {
    const files = await StudentFile.find({
      rollNumber: req.params.rollNumber,
    })
      .sort({ uploadedAt: -1 })
      .lean();

    const filesWithPreview = files.map((file) => ({
      ...file,
      previewUrl: file.fileUrl,
    }));

    res.json(filesWithPreview);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ msg: "Fetch failed" });
  }
});

// ✅ Delete file
router.delete("/delete/:id", async (req, res) => {
  try {
    const file = await StudentFile.findById(req.params.id);
    if (!file) return res.status(404).json({ msg: "File not found" });

    await cloudinary.uploader.destroy(file.publicId, {
      resource_type: "image",
    });

    await StudentFile.findByIdAndDelete(req.params.id);
    res.json({ msg: "File deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ msg: "Delete failed", error: err.message });
  }
});

export default router;
