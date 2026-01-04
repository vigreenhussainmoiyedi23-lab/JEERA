const projectModel = require("../models/project.model");
const TaskModel = require("../models/task.model");
const UserModel = require("../models/user.model");

function taskSocket(io, socket) {
  // ✅ Create a new task
  socket.on(
    "createTask",
    async ({ projectId, title, description, assignedTo }) => {
      const createdBy = socket.user.id;
      const project = await projectModel.findById(projectId);
      // --- Authorization check ---
      const isAdmin = project.admin.toString() === createdBy.toString();
      const isCoAdmin = project.coAdmins.some(
        (co) => co.toString() === createdBy.toString()
      );

      if (!isAdmin && !isCoAdmin) {
        // User is not authorized to create a task
        return socket.emit("errorMessage", {
          message: "You are not authorized to create tasks in this project.",
        });
      }
      if (
        isCoAdmin &&
        project.coAdmins.some((co) => co.toString() == assignedTo.toString())
      ) {
        return socket.emit("errorMessage", {
          message:
            "You are not authorized to give tasks to coadmins in this project.",
        });
      }
      const newTask = await TaskModel.create({
        title,
        description,
        assignedTo,
        createdBy,
        status: "inProgress",
      });
      project.allTasks.push(newTask._id);
      user.tasks.push(newTask._id);
      await project.save();
      await user.save();
      io.to(newTask._id).emit("newTask", newTask);
    }
  );

  // ✅ Update task status
  socket.on("updateTask", async ({ projectId, taskId, status }) => {
    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );
    io.to(taskId).emit("taskUpdated", updatedTask);
  });
}

module.exports = taskSocket;
