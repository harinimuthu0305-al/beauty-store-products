import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // ✅ No duplicate emails
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,  // ✅ No duplicate phone numbers
      sparse: true,  // ✅ allows null/missing phone
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Prevents OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;