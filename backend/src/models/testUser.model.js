const mongoose = require("mongoose");

const testUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: String,
  password: { type: String, required: true },
  otp: { type: Number, required: true },
  otpExpires: { type: Date, default: Date.now() + 5 * 60 * 1000 },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Auto-delete after 5 mins
});
const testUserModel = mongoose.model("TestUser", testUserSchema);

module.exports = testUserModel;
