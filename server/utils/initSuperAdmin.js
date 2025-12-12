import SuperAdmin from "../models/SuperAdmin.js";
import bcrypt from "bcryptjs"; // optional: for password hashing

export const createInitialSuperAdmin = async () => {
  try {
    const exists = await SuperAdmin.findOne({ superAdminId: "superadmin" });
    if (!exists) {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash("superpass123", 10);

      const superAdmin = new SuperAdmin({
        superAdminId: "superadmin",
        password: hashedPassword,
        admins: [], // empty at start
      });

      await superAdmin.save();
      console.log("Super Admin created in MongoDB!");
    } else {
      console.log("Super Admin already exists in MongoDB!");
    }
  } catch (err) {
    console.error("Error creating Super Admin:", err);
  }
};
