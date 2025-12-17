import mongoose from "mongoose";

const studentFileSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("StudentFile", studentFileSchema);
