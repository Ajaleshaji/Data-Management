import mongoose from 'mongoose';


const studentFileSchema = new mongoose.Schema({
rollNumber: { type: String, required: true },
fileName: { type: String, required: true },
fileUrl: { type: String, required: true }, // Cloudinary URL
publicId: { type: String, required: true }, // Cloudinary ID
fileType: String,
uploadedAt: { type: Date, default: Date.now },
});


export default mongoose.model('StudentFile', studentFileSchema);