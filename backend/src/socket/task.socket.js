const projectModel = require("../models/project.model");
const TaskModel = require("../models/task.model");
const UserModel = require("../models/user.model");

function taskSocket(io, socket, socketIdMap) {
  // ✅ Create Task
  socket.on("createTask", async ({ projectId, title, description, assignedTo }) => {
    try {
      const createdBy = socket.user;
      const project = await projectModel.findById(projectId);
      if (!project) return socket.emit("errorMessage", { message: "Project not found." });

      const isAdmin = project.admin.toString() === createdBy._id.toString();
      const isCoAdmin = project.coAdmins.some(
        (co) => co.toString() === createdBy._id.toString()
      );

      if (!isAdmin && !isCoAdmin) {
        return socket.emit("errorMessage", {
          message: "You are not authorized to create tasks in this project.",
        });
      }

      const newTask = await TaskModel.create({
        title,
        description,
        assignedTo,
        createdBy,
        project: projectId,
        taskStatus: "toDo",
      });

      // Update users
      await UserModel.updateMany(
        { _id: { $in: assignedTo } },
        { $push: { tasks: newTask._id } }
      );

      project.allTasks.push(newTask._id);
      await project.save();

      // Notify assigned users
      assignedTo.forEach((userId) => {
        const targetSocketId = socketIdMap.get(userId);
        if (targetSocketId) {
          io.to(targetSocketId).emit("newTask", newTask);
        }
      });

      socket.emit("taskCreated", newTask);
    } catch (err) {
      console.error("❌ Error creating task:", err);
      socket.emit("errorMessage", { message: "Task creation failed." });
    }
  });

  // ✅ Update Task
  socket.on("updateTask", async ({ taskId, status }) => {
    try {
      const updatedTask = await TaskModel.findByIdAndUpdate(
        taskId,
        { taskStatus: status },
        { new: true }
      ).populate("assignedTo", "username email");

      if (!updatedTask) return;

      updatedTask.assignedTo.forEach((user) => {
        const targetSocketId = socketIdMap.get(user._id.toString());
        if (targetSocketId) {
          io.to(targetSocketId).emit("taskUpdated", updatedTask);
        }
      });

      socket.emit("taskUpdated", updatedTask);
    } catch (err) {
      console.error("❌ Error updating task:", err);
    }
  });

  // ✅ Get all tasks — only for this user
  socket.on("get-all-tasks", async (projectId) => {
    try {
      const user = socket.user;
      if (!user) throw new Error("No User Found");

      // Get only tasks assigned to this user for this project
      const tasks = await TaskModel.find({
        project: projectId,
        assignedTo: user._id,
      })
        .populate("createdBy", "username email")
        .populate("assignedTo", "username email");

      console.log(`📦 Sending ${tasks.length} tasks to ${user.username}`);

      // Send only to the requesting user
      socket.emit("all-tasks", { tasks });
    } catch (err) {
      console.error("❌ Error fetching tasks:", err);
      socket.emit("errorMessage", { message: "Failed to fetch tasks." });
    }
  });
}

module.exports = taskSocket;
