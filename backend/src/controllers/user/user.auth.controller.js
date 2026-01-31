const UserModel = require("../../models/user.model");
const testUserModel = require("../../models/testUser.model");
const { HashPassword, comparePassword } = require("../../utils/bcrypt");
const { GenerateToken, VerifyToken } = require("../../utils/jwt");
const sendMail = require("../../config/sendMail");
const createOTPEmailTemplate = require("../../config/otpEmailTemplate");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
async function RegisterHandler(req, res) {
  try {
    const { email, password, username } = req.body;
    const NODE_ENV = process.env.NODE_ENV
    const userAlreadyExists = await UserModel.findOne({ email });
    if (userAlreadyExists)
      return res.status(400).json({ message: "User Already Exists" });

    const hashedPassword = await HashPassword(password);
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Create or update a temp user
    const testUser = await testUserModel.create({
      email,
      password: hashedPassword,
      username,
      otp,
    });

    // Send OTP email
    const emailSent = await sendMail(
      email, 
      "Your OTP for JEERA Verification", 
      createOTPEmailTemplate(otp, username)
    );
    
    if (!emailSent) {
      console.error("Failed to send OTP email");
      // Continue with authentication even if email fails, but log the error
    }

    // Generate temporary token
    const token = await GenerateToken(testUser._id);
    console.log(token);
    if (!token) {
      await testUserModel.findOneAndDelete({ email: testUser.email });
      return res
        .status(500)
        .json(400)
        .json({ message: "token creation failed" });
    }
    // Reset old cookies
    res.clearCookie("token");
    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 1000 * 60 * 15,
    });
    if (NODE_ENV == "developement") {
      res.status(200).json({ message: "Otp Verification Left", otp });
    }
    res.status(200).json({ message: "Otp Verification Left" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}
async function LoginHandler(req, res) {
  try {
    const { email, password } = req.body;
    const NODE_ENV = process.env.NODE_ENV
    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid Email or password" });
    const result = await comparePassword(password, user.password);
    if (!result)
      return res.status(401).json({ message: "Invalid Email or password" });
    const otp = Math.floor(100000 + Math.random() * 900000);
    // Create or update a temp user
    await testUserModel.findOneAndDelete({ email });
    const testUser = await testUserModel.create({
      email,
      password: user.password,
      username: user.username,
      otp,
    });
    if (!testUser) {
      return res.status(500).json({ message: "error creating testUser" });
    }
    // Send OTP email
    const emailSent = await sendMail(
      email, 
      "Your OTP for JEERA Verification", 
      createOTPEmailTemplate(otp, username)
    );
    
    if (!emailSent) {
      console.error("Failed to send OTP email");
      // Continue with authentication even if email fails, but log the error
    }

    // Generate temporary token
    const token = await GenerateToken(testUser._id);

    // Reset old cookies
    res.clearCookie("token");
    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 1000 * 60 * 15,
    });
    if (NODE_ENV == "developement") {
      res.status(200).json({ message: "Otp Verification Left", otp });
    }
    res.status(200).json({ message: "Otp Verification Left" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}
async function VerifyOTP(req, res) {
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
    if (!testUser) {
      return res
        .status(401)
        .json({ message: "Login or register first", redirectTo: "/login" });
    }
    if (testUser?.otpExpires < Date.now())
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

    const mainToken = await GenerateToken(user._id);

    res.clearCookie("token");
    res.cookie("token", mainToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    res
      .status(200)
      .json({ message: "User Authenticated Successfully", redirectTo: "/" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}
async function LogoutHandler(req, res) {
  try {
    res.clearCookie("token");
    res
      .status(200)
      .json({ message: "User logged Out Successfully", redirectTo: "/login" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error occured While logging out", error });
  }
}

async function GoogleHandler(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    // Log environment variables for debugging (remove in production)
    if (process.env.NODE_ENV === "development") {
      console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID ? "Set" : "NOT SET");
    }

    // Check if Google Client ID is configured
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("GOOGLE_CLIENT_ID is not configured");
      return res.status(500).json({ 
        message: "Google OAuth not configured properly" 
      });
    }

    // 1️⃣ Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // 2️⃣ Check if user exists
    let user = await UserModel.findOne({ email });

    if (!user) {
      // 3️⃣ Create new user if doesn't exist
      user = await UserModel.create({
        email,
        username: name,
        googleId,
        avatar: picture,
        authProvider: "google",
        isVerified: true, // Google verified email
      });
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = googleId;
      user.authProvider = user.authProvider === "local" ? "hybrid" : "google";
      await user.save();
    }

    // 4️⃣ Generate your own JWT for session management
    const jwtToken = await GenerateToken(user._id);

    // Set HTTP-only cookie
    res.cookie("token", jwtToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Google login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        isVerified: user.isVerified
      },
      token: jwtToken
    });

  } catch (error) {
    console.error("Google login failed:", error.message);
    
    // Provide more specific error messages
    if (error.message.includes("Wrong number of segments in token")) {
      return res.status(400).json({ 
        message: "Invalid Google token format" 
      });
    }
    
    if (error.message.includes("Token used too early")) {
      return res.status(400).json({ 
        message: "Token is not yet valid" 
      });
    }
    
    if (error.message.includes("Token used too late")) {
      return res.status(400).json({ 
        message: "Token has expired" 
      });
    }

    if (error.message.includes("Invalid token signature")) {
      return res.status(400).json({ 
        message: "Invalid token signature" 
      });
    }

    res.status(401).json({ 
      message: "Invalid Google token",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}

module.exports = {
  LogoutHandler,
  LoginHandler,
  RegisterHandler,
  VerifyOTP,
  GoogleHandler
};
