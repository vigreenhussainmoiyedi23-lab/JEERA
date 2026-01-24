const express = require("express");
const UserModel = require("../../models/user.model");
const projectModel = require("../../models/project.model");
const Router = express.Router();

Router.get("/projects", async (req, res) => {
    const user = await UserModel.findById(req.user._id).populate(
        {
            path: "projects.project",
            populate: {
                path: "members.member",
                select: "username email"
            }
        })
    if (!user) return res.status(401).json({ message: "try logging in first" })
    return res.status(200).json({ message: "all user related projects", projects: user.projects })
})
Router.patch("/accept/:projectId", async (req, res) => {
    try {
        const { projectId } = req.params
        const user = req.user
        if (!user.invites.some(invite => invite.toString() === projectId.toString())) {
            return res.status(400).json({ message: "project not found in invites" })
        }
        // TODO: Implement accept project logic
        const project = await projectModel.findById(projectId)
        if (!project) return res.status(404).json({ message: "project not found" })
        if (!project.invited.some(invite => invite.toString() === user._id.toString())) {
            return res.status(400).json({ message: "user not found in invites" })
        }
        project.members.push({ member: user._id, role: "member" });
        await project.save();
        user.invites = user.invites.filter(invite => invite.toString() !== projectId.toString());
        await user.save();

        // Remove from project.invited
        project.invited = project.invited.filter(invite => invite.toString() !== user._id.toString());
        await project.save();

        // Add to user.projects with member status
        user.projects.push({ project: projectId, status: "member" });
        await user.save();
        return res.status(200).json({ message: "project invite accepted" });
    } catch (error) {
        return res.status(500).json({ message: "internal server error" });
    }
})

Router.get("/invites", async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id)
            .populate({
                path: "invites",
                populate: {
                    path: "members.member",
                    select: "username email profilePic"
                }
            });
        if (!user) return res.status(401).json({ message: "try logging in first" })
        return res.status(200).json({ message: "all invites", invites: user.invites || [] })
    } catch (error) {
        return res.status(500).json({ message: "internal server error" })
    }
})

Router.get("/users", async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page || "1", 10), 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 50);
        const skip = (page - 1) * limit;

        const query = { _id: { $ne: req.user._id } };
        const [users, total] = await Promise.all([
            UserModel.find(query)
                .select("username email profilePic")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            UserModel.countDocuments(query),
        ]);

        return res.status(200).json({
            message: "all users",
            users,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        return res.status(500).json({ message: "internal server error" })
    }
})

module.exports = Router;
