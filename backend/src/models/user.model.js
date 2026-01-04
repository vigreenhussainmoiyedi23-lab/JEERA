const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    profilePic: String,
    fileId: String,
    skills: [],
    projects: [{project:{ type: mongoose.Schema.Types.ObjectId, ref: "project" },status:{type:String,default:"member"}}],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "task" }],
    invites:[{ type: mongoose.Schema.Types.ObjectId, ref: "project" }]
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
