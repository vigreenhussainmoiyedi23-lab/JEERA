const projectModel = require("../models/project.model");
const taskModel = require("../models/task.model");
const TaskModel = require("../models/task.model");
const UserModel = require("../models/user.model");
const runSocketValidator = require("../services/runSocketvalidator");
const { TaskValidator } = require("../utils/express-validator");

function taskSocket(io, socket, socketIdMap) {
  async function isProjectMember(projectId, userId) {
    const project = await projectModel.findById(projectId);
    if (!project) return false;

    return (
      project.members.some(m => m.member._id.toString() === userId.toString())
    );
  }

  // Join project & send members
  socket.on("joinProject", async (projectId) => {
    try {
      const user = socket.user;
      if (!(await isProjectMember(projectId, user._id))) {
        return socket.emit("errorMessage", { message: "Access denied" });
      }

      socket.join(projectId);

      const project = await projectModel
        .findById(projectId)
        .populate("members", "username email profilePic")
        .populate("coAdmins", "username email profilePic")
        .populate("admin", "username email profilePic");

      const members = [
        project.admin,
        ...project.coAdmins,
        ...project.members,
      ].filter(Boolean);

      socket.emit("projectMembers", members);
    } catch (err) {
      socket.emit("errorMessage", { message: "Failed to join project" });
    }
  });

  // CREATE TASK - now accepts taskStatus from client
  socket.on("createTask", async ({ taskDets, projectId }, ack) => {
    try {
      // Validate status
      const validStatuses = ["toDo", "Inprogress", "Inreview", "done", "Failed"];
      const finalStatus = validStatuses.includes(taskDets?.taskStatus) ? taskDets?.taskStatus : "toDo";
      taskDets.taskStatus = finalStatus
      const errors = await runSocketValidator(TaskValidator, taskDets);

      if (errors) {
        return ack({
          success: false,
          errors
        });
      }
      const createdBy = socket.user;
      const project = await projectModel.findById(projectId);
      if (!project) {
        return socket.emit("errorMessage", { message: "Project not found" });
      }

      if (!(await isProjectMember(projectId, createdBy._id))) {
        return socket.emit("errorMessage", { message: "Not authorized" });
      }
      const newTask = await TaskModel.create({
        ...taskDets,
        createdBy: createdBy._id,
        project:projectId
      });
      await UserModel.updateMany(
        { _id: { $in: newTask.assignedTo } },
        { $push: { tasks: newTask._id } }
      );
      project.allTasks.push(newTask._id);
      await project.save();
      const populatedTask = await TaskModel.findById(newTask._id)
        .populate("createdBy", "username email profilePic")
        .populate("assignedTo", "username email profilePic");

      io.to(projectId).emit("newTask", populatedTask);
      socket.broadcast.emit("taskCreated", populatedTask);
      // 🔁 respond ONLY via ack
      ack({
        success: true,
        newTask
      });

    } catch (err) {
      return ack({
        success: false,
        errors: err
      });
    }
  });

  // UPDATE TASK (status + other fields)
  socket.on("updateTask", async ({ taskId, status, assignedTo }) => {
    try {
      const task = await TaskModel.findById(taskId);
      if (!task) return socket.emit("errorMessage", { message: "Task not found" });

      if (!(await isProjectMember(task.project, socket.user._id))) {
        return socket.emit("errorMessage", { message: "Not authorized" });
      }

      let changed = false;

      if (status && ["toDo", "inProgress", "review", "done"].includes(status)) {
        task.taskStatus = status;
        changed = true;
      }

      if (assignedTo && Array.isArray(assignedTo)) {
        task.assignedTo = assignedTo;
        changed = true;
      }

      if (changed) {
        await task.save();

        const updatedTask = await TaskModel.findById(taskId)
          .populate("createdBy", "username email profilePic")
          .populate("assignedTo", "username email profilePic");

        io.to(task.project.toString()).emit("taskUpdated", updatedTask);
      }
    } catch (err) {
      console.error("Update task error:", err);
      socket.emit("errorMessage", { message: "Failed to update task" });
    }
  });

  // GET ALL TASKS
  socket.on("getAllTasks", async (projectId) => {
    try {
      if (!(await isProjectMember(projectId, socket.user._id))) {
        return socket.emit("errorMessage", { message: "Not authorized" });
      }

      const tasks = await TaskModel.find({ project: projectId })
        .populate("createdBy", "username email profilePic")
        .populate("assignedTo", "username email profilePic")
        .sort({ createdAt: -1 });

      socket.emit("allTasks", tasks);
    } catch (err) {
      socket.emit("errorMessage", { message: "Failed to load tasks" });
    }
  });
  socket.on("getAllEnums", async (projectId) => {
    try {
      const schema = taskModel.schema;
      const enumFields = ["priority", "category", "taskStatus", "issueType"]; // fields you care about
      const enumValues = {};
      for (const field of enumFields) {
        const path = schema.path(field); // ✅ use dynamic field name
        if (path && path.enumValues && path.enumValues.length > 0) {
          enumValues[field] = path.enumValues;
        }
      }
      const project = await projectModel.findById(projectId)
        .populate("members.member", "username email profilePic")

      const assignedToEnum = [...project.members]

      enumValues.assignedTo = assignedToEnum
      socket.emit("allEnums", enumValues);
    } catch (err) {
      console.error(err);
      socket.emit("errorMessage", { message: "Failed to load enums" });
    }
  });

}

module.exports = taskSocket;