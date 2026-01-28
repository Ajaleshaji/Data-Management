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

    // 👇 IMPORTANT: use auto
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: `students/${rollNumber}`,
        resource_type: "auto", // 👈 VERY IMPORTANT
        use_filename: true,
        unique_filename: false,
      }
    );

    const newFile = new StudentFile({
      rollNumber,
      fileName: file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType: file.mimetype,
      resourceType: result.resource_type, // raw or image
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

    const filesWithPreview = files.map((file) => {
      let previewUrl = file.fileUrl;

      // 🔥 Cloudinary PDF → IMAGE preview
      if (file.fileType === "application/pdf") {
        previewUrl = cloudinary.url(file.publicId, {
          resource_type: "image",
          format: "png",
          page: 1,
          width: 800,
          crop: "scale",
          secure: true,
        });
      }

      return { ...file, previewUrl };
    });

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
