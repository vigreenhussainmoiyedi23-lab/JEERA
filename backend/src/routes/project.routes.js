const express = require("express");
const projectModel = require("../models/project.model");
const UserModel = require("../models/user.model");
const Router = express.Router();

// admin only feature
Router.post("/create", async (req, res) => {
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
Router.post("/edit/:projectid", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (title.trim().length < 3)
      return res
        .status(400)
        .json({ message: "Title must be at least 3 characters long" });
    const user = req.user;
    const project = await projectModel.findOne({ _id: req.params.projectid });
    if (project.admin.toString() !== user._id.toString())
      return res
        .status(403)
        .json({ message: "Only project admin can Edit title and description" });
    project.title = title;
    project.description = description || "";
    await project.save()
    return res.status(200).json({
      message: "project Edited successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "project Editing failed",
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
        .json({ message: "Only project admin can add members" });

    if (
      project.members.some((id) => id.toString() === member._id.toString()) ||
      project.admin.toString() === member._id.toString() ||
      project.coAdmins.some((id) => id.toString() === member._id.toString())
    )
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
Router.post("/promote/:projectid/:userid/:to", async (req, res) => {
  try {
    const { projectid, userid, to } = req.params;

    // Validate the target role
    if (!["member", "coAdmin"].includes(to))
      return res.status(400).json({ message: "Invalid promotion target" });

    // Fetch project and member
    const project = await projectModel.findById(projectid);
    const member = await UserModel.findById(userid);

    if (!project || !member)
      return res
        .status(400)
        .json({ message: "Both userid and projectid must be valid" });

    // Only admin can promote or demote
    const user = req.user;
    if (project.admin.toString() !== user._id.toString())
      return res
        .status(403)
        .json({ message: "Only admin can promote or demote members" });

    // Define move mapping: from → to
    // this collection is an object of two cases one is to coadmin and other is to member and the array stores [from where the data should be spliced,to where the data should be pushed]
    const collections = {
      coAdmin: ["members", "coAdmins"], // promote member → coAdmin
      member: ["coAdmins", "members"], // demote coAdmin → member
    };

    const [from, toField] = collections[to];

    // Find member index in the "from" group
    const fromIdx = project[from].findIndex(
      (id) => id.toString() === member._id.toString()
    );

    if (fromIdx === -1)
      return res.status(400).json({
        message:
          "Member not found in the specified role or cannot be promoted/demoted.",
      });

    // Move member between groups
    project[from].splice(fromIdx, 1);
    project[toField].push(member._id);

    await project.save();

    return res.status(200).json({
      message:
        to === "coAdmin"
          ? "Member promoted to coAdmin successfully."
          : "Member demoted to member successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});



module.exports = Router;
