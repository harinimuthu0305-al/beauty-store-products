import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dns from "node:dns/promises";

import User from "./models/User.js";

// ✅ Same DNS fix used in server.js — this is why server.js works but this didn't
dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose.connect("mongodb+srv://harinimuthu0305_db_user:nhfpdNCiA0w1JPyJ@cluster0.fmyjwu4.mongodb.net/beauty?retryWrites=true&w=majority&appName=Cluster0").then(async () => {
  console.log("✅ Connected to MongoDB");

  const email = "johnupdated@gmail.com";
  const newPassword = "admin123";

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const user = await User.findOneAndUpdate(
    { email },
    { password: hashedPassword, isAdmin: true },
    { new: true }
  );

  if (user) {
    console.log(`✅ Password reset successful!`);
    console.log(`✅ Email: ${user.email}`);
    console.log(`✅ isAdmin: ${user.isAdmin}`);
    console.log(`✅ New Password: ${newPassword}`);
  } else {
    console.log("❌ User not found! Check email.");
  }

  process.exit();
});