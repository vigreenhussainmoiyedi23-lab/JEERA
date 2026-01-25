const projectModel = require("../../models/project.model");
const UserModel = require("../../models/user.model");
const taskModel = require("../../models/task.model");

async function PromoteHandler(req, res) {
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
    const me = project.members.find(
      (m) => m?.member?._id?.toString() === user._id.toString(),
    );
    if (!me || me.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only project admin can promote or demote members" });
    }

    // Find the member in project.members
    const memberEntry = project.members.find(
      (m) => m.member.toString() === member._id.toString()
    );
    if (!memberEntry) {
      return res.status(400).json({
        message: "Member not found in project",
      });
    }

    // Prevent demoting another admin
    if (memberEntry.role === "admin") {
      return res.status(403).json({ message: "Cannot demote an admin" });
    }

    // Update role
    memberEntry.role = to;
    await project.save();

    // Update member's user.projects status
    const projIdx = member.projects.findIndex(
      (p) => p.project.toString() === projectid.toString()
    );
    if (projIdx !== -1) {
      member.projects[projIdx].status = to;
      await member.save();
    }

    return res.status(200).json({ message: `Member promoted to ${to}` });
  } catch (error) {
    return res.status(500).json({ message: "server error", error });
  }
}

async function AdminAnalyticsHandler(req, res) {
  try {
    const { projectid } = req.params;
    const user = req.user;

    const project = await projectModel
      .findById(projectid)
      .populate("members.member", "username email profilePic");

    if (!project)
      return res.status(404).json({ message: "project not found" });

    const me = project.members.find(
      (m) => m?.member?._id?.toString() === user._id.toString(),
    );
    if (!me || !["admin", "coAdmin"].includes(me.role)) {
      return res.status(403).json({ message: "not authorized" });
    }

    const tasks = await taskModel
      .find({ project: projectid })
      .select("taskStatus assignedTo")
      .lean();

    const statusCounts = {
      total: tasks.length,
      toDo: 0,
      Inprogress: 0,
      Inreview: 0,
      done: 0,
      Failed: 0,
    };

    const perMember = new Map();

    tasks.forEach((t) => {
      if (t?.taskStatus && Object.prototype.hasOwnProperty.call(statusCounts, t.taskStatus)) {
        statusCounts[t.taskStatus] += 1;
      }

      const assigned = Array.isArray(t?.assignedTo) ? t.assignedTo : [];
      assigned.forEach((uid) => {
        const key = uid.toString();
        if (!perMember.has(key)) {
          perMember.set(key, {
            userId: key,
            counts: {
              total: 0,
              toDo: 0,
              Inprogress: 0,
              Inreview: 0,
              done: 0,
              Failed: 0,
            },
          });
        }

        const entry = perMember.get(key);
        entry.counts.total += 1;
        if (t?.taskStatus && Object.prototype.hasOwnProperty.call(entry.counts, t.taskStatus)) {
          entry.counts[t.taskStatus] += 1;
        }
      });
    });

    const memberIds = Array.from(perMember.keys());
    const memberDocs = await UserModel.find({ _id: { $in: memberIds } })
      .select("username email profilePic")
      .lean();

    const memberInfoMap = new Map(
      memberDocs.map((u) => [u._id.toString(), u]),
    );

    const perMemberAnalytics = Array.from(perMember.values()).map((m) => {
      const info = memberInfoMap.get(m.userId);
      return {
        ...m,
        user: info || null,
      };
    });

    return res.status(200).json({
      message: "admin analytics",
      project: {
        _id: project._id,
        title: project.title,
      },
      statusCounts,
      perMember: perMemberAnalytics,
    });
  } catch (error) {
    return res.status(500).json({ message: "server error", error });
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
    const me = project.members.find(
      (m) => m?.member?._id?.toString() === user._id.toString(),
    );
    if (!me || !["admin", "coAdmin"].includes(me.role)) {
      return res
        .status(403)
        .json({ message: "Only project admin or coAdmin can add members" });
    }

    if (
      project.members.some((m) => m.member.toString() === member._id.toString()) ||
      project.invited.some((id) => id.toString() === member._id.toString())
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
    const { projectid, userid } = req.params;
    const project = await projectModel.findById(projectid);
    const member = await UserModel.findById(userid);
    if (!project || !member)
      return res
        .status(400)
        .json({ message: "both userid and projectid must be correct" });

    const user = req.user;
    const me = project.members.find(
      (m) => m?.member?._id?.toString() === user._id.toString(),
    );
    if (!me || me.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only project admin can remove members" });
    }

    // Find member entry
    const memberIdx = project.members.findIndex(
      (m) => m.member.toString() === userid.toString()
    );
    if (memberIdx === -1) {
      return res.status(400).json({ message: "User not found in project members" });
    }

    // Prevent removing an admin
    if (project.members[memberIdx].role === "admin") {
      return res.status(403).json({ message: "Cannot remove an admin" });
    }

    // Remove from members and add to Banned
    project.members.splice(memberIdx, 1);
    project.Banned.push(member._id);

    // Update user.projects status to "banned"
    const projIdx = member.projects.findIndex(
      (p) => p.project.toString() === projectid.toString()
    );
    if (projIdx !== -1) {
      member.projects[projIdx].status = "banned";
      await member.save();
    }

    await project.save();

    return res.status(200).json({ message: "member removed and banned successfully" });
  } catch (error) {
    return res.status(500).json({ message: "server error", error });
  }
}
async function BanMemberHandler(req, res) {
  try {
    const { projectid, userid } = req.params;
    const project = await projectModel.findById(projectid);
    const member = await UserModel.findById(userid);
    if (!project || !member)
      return res
        .status(400)
        .json({ message: "both userid and projectid must be correct" });

    const user = req.user;
    const me = project.members.find(
      (m) => m?.member?._id?.toString() === user._id.toString(),
    );
    if (!me || me.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only project admin can ban members" });
    }

    // Cannot ban another admin
    const memberEntry = project.members.find(
      (m) => m.member.toString() === member._id.toString()
    );
    if (!memberEntry) {
      return res.status(400).json({
        message: "Member not found in project",
      });
    }

    if (memberEntry.role === "admin") {
      return res.status(403).json({ message: "Cannot ban an admin" });
    }

    // Remove from members and add to Banned
    project.members = project.members.filter(
      (m) => m.member.toString() !== member._id.toString()
    );
    project.Banned.push(member._id);

    // Update user.projects status to "banned"
    const projIdx = member.projects.findIndex(
      (p) => p.project.toString() === projectid.toString()
    );
    if (projIdx !== -1) {
      member.projects[projIdx].status = "banned";
      await member.save();
    }

    await project.save();

    return res.status(200).json({ message: "member banned successfully" });
  } catch (error) {
    return res.status(500).json({ message: "server error", error });
  }
}

async function UnbanMemberHandler(req, res) {
  try {
    const { projectid, userid } = req.params;
    const project = await projectModel.findById(projectid);
    const member = await UserModel.findById(userid);
    if (!project || !member)
      return res
        .status(400)
        .json({ message: "both userid and projectid must be correct" });

    const user = req.user;
    const me = project.members.find(
      (m) => m?.member?._id?.toString() === user._id.toString(),
    );
    if (!me || me.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only project admin can unban members" });
    }

    // Remove from Banned and add back as member
    const bannedIdx = project.Banned.findIndex(
      (id) => id.toString() === userid.toString()
    );
    if (bannedIdx === -1) {
      return res.status(400).json({ message: "User not found in banned list" });
    }

    project.Banned.splice(bannedIdx, 1);
    project.members.push({ member: member._id, role: "member" });

    // Update user.projects status to "member"
    const projIdx = member.projects.findIndex(
      (p) => p.project.toString() === projectid.toString()
    );
    if (projIdx !== -1) {
      member.projects[projIdx].status = "member";
      await member.save();
    }

    await project.save();

    return res.status(200).json({ message: "member unbanned successfully" });
  } catch (error) {
    return res.status(500).json({ message: "server error", error });
  }
}

async function EditProjectHandler(req, res) {
  try {
    const { title, description } = req.body;
    const user = req.user;
    const project = await projectModel.findOne({ _id: req.params.projectid });
    const me = project.members.find(
      (m) => m?.member?._id?.toString() === user._id.toString(),
    );
    if (!me || me.role !== "admin") {
      return res.status(403).json({
        message: "Only project admin can Edit title and description",
      });
    }
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
  BanMemberHandler,
  UnbanMemberHandler,
  AdminAnalyticsHandler,
};
