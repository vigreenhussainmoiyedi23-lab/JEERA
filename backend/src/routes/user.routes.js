const express = require("express");
const UserModel = require("../models/user.model");
const testUserModel = require("../models/testUser.model");
const { HashPassword, comparePassword } = require("../utils/bcrypt");
const { GenerateToken, VerifyToken } = require("../utils/jwt");
const {
  RegisterValidator,
  validate,
  LoginValidator,
} = require("../utils/express-validator");
const sendMail = require("../config/sendMail");
const { authLimiter } = require("../config/limiters");//a limiter for 5 requests per minute


const Router = express.Router();

Router.post("/register",authLimiter, RegisterValidator, validate, async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const userAlreadyExists = await UserModel.findOne({ email });
    if (userAlreadyExists)
      return res.status(400).json({ message: "User Already Exists" });

    const hashedPassword = await HashPassword(password);
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Create or update a temp user
    const testUser = await testUserModel.create({ email, password:hashedPassword,username,otp });

    // Send OTP email
    await sendMail(email, "Your OTP Of JEERA", `Your OTP is ${otp}`);

    // Generate temporary token
    const token =await GenerateToken(testUser._id);
    console.log(token)
if (!token) {
  await testUserModel.findOneAndDelete({email:testUser.email})
  return res.status(500).json(400).json({message:"token creation failed"})
}
    // Reset old cookies
    res.clearCookie("token");
    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 1000 * 60 * 15,
    });

    res.status(200).json({ message: "Otp Verification Left" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
Router.post("/login",authLimiter, LoginValidator, validate, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid Email or password" });
    const result =await comparePassword(password, user.password);
    if (!result)
      return res.status(401).json({ message: "Invalid Email or password" });
    const otp = Math.floor(100000 + Math.random() * 900000);
    // Create or update a temp user
    const testUser = await testUserModel.create({
      email,
      password: user.password,
      username: user.username,
      otp
    });
    // Send OTP email
    await sendMail(email, "Your OTP Of JEERA", `Your OTP is ${otp}`);

    // Generate temporary token
    const token =await GenerateToken(testUser._id);

    // Reset old cookies
    res.clearCookie("token");
    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 1000 * 60 * 15,
    });

    res.status(200).json({ message: "Otp Verification Left" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});



Router.post("/verifyOTP",authLimiter, async (req, res) => {
  try {
    const { otp } = req.body;
    const token = req.cookies?.token || null;

    if (!token)
      return res
        .status(401)
        .json({ message: "No token found", redirectTo: "/login" });

    const { id } = VerifyToken(token);
    if (!id)
      return res
        .status(401)
        .json({ message: "Invalid Token", redirectTo: "/login" });

    const testUser = await testUserModel.findById(id);
    if (!testUser)
      return res
        .status(401)
        .json({ message: "Time Expired", redirectTo: "/login" });

    if (Number(testUser.otp) !== Number(otp))
      return res.status(400).json({ message: "Invalid OTP! Try again" });

    const { email, password, username } = testUser;

    let user = await UserModel.findOne({ email });
    if (!user) user = UserModel.create({ email, password, username });
    // Clean up test user
    await testUserModel.findByIdAndDelete(id);

    const mainToken = GenerateToken(user._id);

    res.clearCookie("token");
    res.cookie("token", mainToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    res
      .status(200)
      .json({ message: "User Authenticated Successfully", redirectTo: "/" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = Router;
