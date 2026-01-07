const express = require("express");
const UserModel = require("../../models/user.model");
const Router = express.Router();

Router.get("/projects", async (req, res) => {
    const user = await UserModel.findById(req.user._id).populate(
        {
            path: "projects.project",
            populate: {
                path: "members",
                select: "username"
            }, populate: {
                path: "coAdmins",
                select: "username"
            }, populate: { path: "admin", select: "username email" }
        })
    if (!user) return res.status(401).json({ message: "try logging in first" })
    return res.status(200).json({ message: "all user related projects", projects: user.projects })
})

module.exports = Router;
