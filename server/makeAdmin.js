import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "./models/User.js";

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("✅ Connected to MongoDB");

  // ✅ Change this to YOUR admin email
  const email = "johnupdated@gmail.com";

  const user = await User.findOneAndUpdate(
    { email },
    { isAdmin: true },
    { new: true }
  );

  if (user) {
    console.log(`✅ Success! ${user.email} isAdmin = ${user.isAdmin}`);
  } else {
    console.log("❌ User not found! Check email.");
  }

  process.exit();
});