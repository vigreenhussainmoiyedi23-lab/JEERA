const projectModel = require("../models/project.model");
const userModel = require("../models/user.model");

const getInviteableProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    // Check if user exists
    const targetUser = await userModel.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get projects where current user is admin or coAdmin
    const projects = await projectModel.find({
      $or: [
        { admin: currentUser._id },
        { coAdmins: currentUser._id }
      ]
    }).select('name description admin coAdmins members').lean();

    // Filter out projects where target user is already a member
    const inviteableProjects = projects.filter(project => 
      !project.members.includes(userId) &&
      !project.admin.equals(userId) &&
      !project.coAdmins.includes(userId)
    );

    return res.status(200).json({
      message: "Inviteable projects fetched successfully",
      projects: inviteableProjects
    });
  } catch (error) {
    console.error("Error fetching inviteable projects:", error);
    return res.status(500).json({ message: "Error fetching projects", error });
  }
};

const inviteToProject = async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    const currentUser = req.user;

    // Check if target user exists
    const targetUser = await userModel.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if project exists and user has permission
    const project = await projectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if current user is admin or coAdmin
    const hasPermission = project.admin.equals(currentUser._id) || 
                         project.coAdmins.some(id => id.equals(currentUser._id));

    if (!hasPermission) {
      return res.status(403).json({ message: "You don't have permission to invite to this project" });
    }

    // Check if target user is already a member
    const isAlreadyMember = project.members.includes(userId) ||
                           project.admin.equals(userId) ||
                           project.coAdmins.some(id => id.equals(userId));

    if (isAlreadyMember) {
      return res.status(400).json({ message: "User is already a member of this project" });
    }

    // Add project invite to user's profile
    if (!targetUser.projectInvites) {
      targetUser.projectInvites = [];
    }

    // Check if already invited
    const alreadyInvited = targetUser.projectInvites.some(invite => 
      invite.projectId.equals(projectId)
    );

    if (alreadyInvited) {
      return res.status(400).json({ message: "User has already been invited to this project" });
    }

    targetUser.projectInvites.push({
      projectId: projectId,
      invitedBy: currentUser._id,
      message: req.body.message || `You've been invited to join ${project.name}`,
      createdAt: new Date()
    });

    await targetUser.save();

    return res.status(200).json({
      message: "Project invitation sent successfully",
      project: {
        id: project._id,
        name: project.name
      }
    });
  } catch (error) {
    console.error("Error inviting to project:", error);
    return res.status(500).json({ message: "Error sending project invitation", error });
  }
};

module.exports = {
  getInviteableProjects,
  inviteToProject
};
