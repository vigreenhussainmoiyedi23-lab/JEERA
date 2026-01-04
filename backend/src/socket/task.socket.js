const TaskModel = require("../models/task.model");

function taskSocket(io, socket) {
  // ✅ Create a new task
  socket.on("createTask", async ({ projectId, title, description, assignedTo }) => {
    const createdBy = socket.user.id;

    const newTask = await TaskModel.create({
      project: projectId,
      title,
      description,
      assignedTo,
      createdBy,
      status: "inProgress",
    });

    io.to(projectId).emit("newTask", newTask);
  });

  // ✅ Update task status
  socket.on("updateTask", async ({ projectId, taskId, status }) => {
    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    io.to(projectId).emit("taskUpdated", updatedTask);
  });
}

module.exports = taskSocket;
