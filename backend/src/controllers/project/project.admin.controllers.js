const projectModel = require("../../models/project.model");
const UserModel = require("../../models/user.model");

async function PromoteHandler(req, res) {
  try {
    const { projectid, userid, to } = req.params;

    // Validate the target role
    if (!["member", "coAdmin"].includes(to))
      return res.status(400).json({ message: "Invalid promotion target" });

    // Fetch project and member
    const project = await projectModel.findById(projectid);
    const member = await UserModel.findById(userid);
    const projectidx = member.projects.findIndex(
      (p) => p.project.toString() == projectid.toString()
    );
    if (projectidx === -1) {
      return res.status(400).json({
        message: "member must be in the project first",
      });
    }
    if (!project || !member)
      return res
        .status(400)
        .json({ message: "Both userid and projectid must be valid" });

    // Only admin can promote or demote
    const user = req.user;
    if (project.members.findIndex(m => m.member.toString() === userid.toString && m.role == "admin") !== -1)
      return res
        .status(403)
        .json({ message: "Only admin can promote or demote members" });

    // Define move mapping: from → to
    // this collection is an object of two cases one is to coadmin and other is to member and the array stores [from where the data should be spliced,to where the data should be pushed]
    const collections = {
      coAdmin: ["member", "coAdmin"], // promote member → coAdmin
      member: ["coAdmin", "member"], // demote coAdmin → member
    };

    const [from, toField] = collections[to];

    // Find member index in the "from" group
    const memberExists = project.members.findIndex(
      (m) => m.member.toString() === member._id.toString()
    );

    if (memberExists === -1)
      return res.status(400).json({
        message:
          "Member not found in the specified role or cannot be promoted/demoted.",
      });
    project.member.splice({
      member:member._id,
      role:to
    })
    member.projects.splice(projectidx, 1, {
      project: projectid,
      status: to,
    });
    await project.save();
    await member.save();

    return res.status(200).json({
      message:
        to === "coAdmin"
          ? "Member promoted to coAdmin successfully."
          : "Member demoted to member successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}
async function InviteMemberHandler(req, res) {
  try {
    const { projectid, userid } = req.params;
    const project = await projectModel.findById(projectid);
    const member = await UserModel.findById(userid);
    if (!member || !project)
      return res
        .status(400)
        .json({ message: "both userid and projectid must be correct" });
    const user = req.user;
    if (
      project.admin.toString() !== user._id.toString() ||
      !project.coAdmins.some((id) => id.toString() === user._id.toString())
    )
      return res
        .status(403)
        .json({ message: "Only project admin or coAdmin can add members" });

    if (
      project.members.some((id) => id.toString() === member._id.toString()) ||
      project.admin.toString() === member._id.toString() ||
      project.invited.some((id) => id.toString() === member._id.toString()) ||
      project.excluded.some((id) => id.toString() === member._id.toString()) ||
      project.coAdmins.some((id) => id.toString() === member._id.toString())
    )
      return res
        .status(400)
        .json({ message: "Member already exists in project" });

    project.invited.push(member._id);
    member.invites.push(project._id);
    await project.save();
    await member.save();
    return res.status(200).json({ message: "member added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "server error", error });
  }
}
async function RemoveMemberHandler(req, res) {
  try {
    const { projectid, userid, from } = req.params;
    // avoiding all mismatches or wrong data input
    if (!["members", "coAdmins"].includes(from))
      return res.status(400).json({ message: "Invalid from input" });
    const project = await projectModel.findById(projectid);
    const member = await UserModel.findById(userid);
    if (!project || !member)
      return res
        .status(400)
        .json({ message: "both userid and projectid must be correct" });
    const user = req.user;
    // checking if an user is an admin
    if (project.admin.toString() !== user._id.toString())
      return res
        .status(403)
        .json({ message: "Only project admin can remove members" });
    const idx = project[from].findIndex(
      (p) => p.toString() === userid.toString()
    );
    if (idx == -1) {
      return res.status(400).json({ message: `No user Found from : ${from}` });
    }
    // finally the removing part
    project[from].splice(idx, 1);
    project.excluded.push(member._id);
    const projectidx = member.projects.findIndex(
      (p) => p.project.toString() == project._id.toString()
    );
    member.projects.splice(projectidx, 1, {
      project: project._id,
      status: "excluded",
    });
    await member.save();
    await project.save();
    return res.status(200).json({ message: "member removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "server error", error });
  }
}
async function EditProjectHandler(req, res) {
  try {
    const { title, description } = req.body;
    const user = req.user;
    const project = await projectModel.findOne({ _id: req.params.projectid });
    if (project.admin.toString() !== user._id.toString())
      return res.status(403).json({
        message: "Only project admin can Edit title and description",
      });
    project.title = title;
    project.description = description || "";
    await project.save();
    return res.status(200).json({
      message: "project Edited successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "project Editing failed",
      error,
    });
  }
}

module.exports = {
  PromoteHandler,
  EditProjectHandler,
  InviteMemberHandler,
  RemoveMemberHandler,
};
