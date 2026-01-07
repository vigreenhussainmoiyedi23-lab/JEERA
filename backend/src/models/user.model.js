const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    profilePic: {
      url:String,
      fileId:String
    },
    bio: String,
    skills: [],
    posts:[{type:mongoose.Schema.Types.ObjectId,ref:"post"}],
    projects: [{ project: { type: mongoose.Schema.Types.ObjectId, ref: "project" }, status: { type: String, default: "member" } }],
    tasks: [{ task: { type: mongoose.Schema.Types.ObjectId, ref: "task" }, project: { type: mongoose.Schema.Types.ObjectId, ref: "project" } }],
    invites: [{ type: mongoose.Schema.Types.ObjectId, ref: "project" }],
    googleId: String, // filled only if signed in with Google
    authProvider: {
      type: String,
      enum: ["custom", "google"],
      default: "custom",
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
