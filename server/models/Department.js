import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true, unique: true },
  sections: [{ type: String }]
});

const Department = mongoose.model("Department", departmentSchema);
export default Department;
