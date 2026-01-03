const express = require("express");
const { UserIsLoggedIn } = require("../middlewares/UserAuth.middleware");
const projectModel = require("../models/project.model");
const UserModel = require("../models/user.model");
const Router = express.Router();

Router.post("/create", UserIsLoggedIn, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (title.trim().length < 3)
      return res
        .status(400)
        .json({ message: "Title must be at least 3 characters long" });

    const user = req.user;

    await projectModel.create({
      title,
      description: description || "",
      admin: user._id,
    });
    return res.status(200).json({
      message: "project created successfully! add members and give tasks",
    });
  } catch (error) {
    return res.status(500).json({
      message: "project creation failed",
      error,
    });
  }
});
Router.post("/add/:projectid/:userid", async (req, res) => {
  try {
    const { projectid, userid } = req.params;
    const project = await projectModel.findById(projectid);
    const member = await UserModel.findById(userid);
    if (!member || !project)
      return res
        .status(400)
        .json({ message: "both userid and projectid must be correct" });
    const user = req.user;
    if (project.admin.toString() !== user._id.toString())
      return res
        .status(403)
        .json({ message: "you can't add members only admin can" });

    if (project.members.includes(member._id))
      return res
        .status(400)
        .json({ message: "Member already exists in project" });

    project.members.push(member._id);
    await project.save();
    return res.status(200).json({ message: "member added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "server error", error });
  }
});

module.exports = Router;
